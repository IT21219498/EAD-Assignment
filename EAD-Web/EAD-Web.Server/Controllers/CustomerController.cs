/*
 * File: CustomerController.cs
 * Description: Controller for managing customer registration, activation, modification, deactivation, login, and related operations.
 * Author: Jayasinghe P.T. - IT21234484
 */


using Microsoft.AspNetCore.Mvc;
using EAD_Web.Server.Models;
using EAD_Web.Server.DTOs;
using MongoDB.Driver;
using System;
using System.Threading.Tasks;
using MongoDB.Bson;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EAD_Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly IMongoCollection<Customer> _customers;
        private readonly IConfiguration _configuration;

        
        // Summary-Initializes a new instance of the CustomerController with the specified MongoDB database and configuration.
        // <param name="database">The MongoDB database instance.</param>
        // <param name="configuration">The application configuration settings.</param>
        public CustomerController(IMongoDatabase database, IConfiguration configuration)
        {
            _customers = database.GetCollection<Customer>("Customers");
            _configuration = configuration;
        }

        // Registers a new customer with the provided details.
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CustomerRegisterDTO model)
        {
            // Hash the password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

            var customer = new Customer
            {
                FullName = model.FullName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                Address = model.Address,
                PasswordHash = passwordHash,
                IsActive = false, // Start as inactive
                HasBeenActivated = false,  // Set to false for new registration
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _customers.InsertOneAsync(customer);
            return Ok("Customer registered successfully, pending activation.");
        }
        // Activates a customer account based on the provided customer ID.
        [HttpPost("activate/{customerId}")]
        public async Task<IActionResult> ActivateCustomer(string customerId)
        {
            // Convert the string customerId to an ObjectId
            if (!ObjectId.TryParse(customerId, out var objectId))
            {
                return BadRequest("Invalid customer ID format.");
            }

            var filter = Builders<Customer>.Filter.Eq(c => c.CustomerId, objectId);
            var update = Builders<Customer>.Update
                .Set(c => c.IsActive, true)
                 .Set(c => c.HasBeenActivated, true)  // Mark customer as activated
                .Set(c => c.UpdatedAt, DateTime.UtcNow);

            var result = await _customers.UpdateOneAsync(filter, update);

            if (result.MatchedCount == 0)
            {
                return NotFound("Customer not found");
            }

            return Ok("Customer activated successfully.");
        }

        // Modifies the details of an existing customer based on the provided customer ID and update data.
        [HttpPut("modify/{customerId}")]
        public async Task<IActionResult> ModifyCustomer(string customerId, [FromBody] CustomerUpdateDTO model)
        {
            // Convert the string customerId to an ObjectId
            if (!ObjectId.TryParse(customerId, out var objectId))
            {
                return BadRequest("Invalid customer ID format.");
            }

            var filter = Builders<Customer>.Filter.Eq(c => c.CustomerId, objectId);

            var updateDefinitionBuilder = Builders<Customer>.Update;
            var updateDefinition = new List<UpdateDefinition<Customer>>();

            // Add only the fields that are provided in the request body
            if (!string.IsNullOrEmpty(model.FullName))
            {
                updateDefinition.Add(updateDefinitionBuilder.Set(c => c.FullName, model.FullName));
            }

            if (!string.IsNullOrEmpty(model.PhoneNumber))
            {
                updateDefinition.Add(updateDefinitionBuilder.Set(c => c.PhoneNumber, model.PhoneNumber));
            }

            if (!string.IsNullOrEmpty(model.Address))
            {
                updateDefinition.Add(updateDefinitionBuilder.Set(c => c.Address, model.Address));
            }

            // Always update the UpdatedAt field
            updateDefinition.Add(updateDefinitionBuilder.Set(c => c.UpdatedAt, DateTime.UtcNow));

            // If no fields were provided, return a BadRequest
            if (updateDefinition.Count == 0)
            {
                return BadRequest("No fields to update.");
            }

            var update = updateDefinitionBuilder.Combine(updateDefinition);

            var result = await _customers.UpdateOneAsync(filter, update);

            if (result.MatchedCount == 0)
            {
                return NotFound("Customer not found");
            }

            return Ok("Customer account updated successfully.");
        }

        // Deactivates a customer account based on the provided customer ID.
        [HttpPost("deactivate/{customerId}")]
        public async Task<IActionResult> DeactivateCustomer(string customerId)
        {
            // Convert the string customerId to an ObjectId
            if (!ObjectId.TryParse(customerId, out var objectId))
            {
                return BadRequest("Invalid customer ID format.");
            }

            var filter = Builders<Customer>.Filter.Eq(c => c.CustomerId, objectId);
            var update = Builders<Customer>.Update
                .Set(c => c.IsActive, false)
                .Set(c => c.UpdatedAt, DateTime.UtcNow);

           var result = await _customers.UpdateOneAsync(filter, update);

            if (result.MatchedCount == 0)
            {
                return NotFound("Customer not found");
            }

            return Ok("Customer account deactivated successfully.");
        }

        // Authenticates a customer and generates a JWT token upon successful login.
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO model)
        {
            // Find the customer by email
            var customer = await _customers.Find(c => c.Email == model.Email).FirstOrDefaultAsync();

            // Check if the customer exists, is active, and the password is correct
            if (customer == null || !customer.IsActive || !BCrypt.Net.BCrypt.Verify(model.Password, customer.PasswordHash))
            {
                return Unauthorized("Invalid login attempt.");
            }

            // Generate JWT token
            var token = GenerateJwtToken(customer);

            // Return the token and customerId in the response
            return Ok(new
            {
                token,
                customerId = customer.CustomerId.ToString()  // Convert ObjectId to string
            });
        }


        // Generates a JWT token for the authenticated customer.
        private string GenerateJwtToken(Customer customer)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:SecretKey"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.NameIdentifier, customer.CustomerId.ToString()),
            new Claim(ClaimTypes.Email, customer.Email)
        }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // Retrieves a list of customers pending activation.
        [HttpGet("pending-activation")]
        public async Task<IActionResult> GetPendingActivationCustomers()
        {
            var filter = Builders<Customer>.Filter.And(
                Builders<Customer>.Filter.Eq(c => c.IsActive, false),
                Builders<Customer>.Filter.Eq(c => c.HasBeenActivated, false)
            );

            var pendingCustomers = await _customers.Find(filter).ToListAsync();

            if (pendingCustomers.Count == 0)
            {
             
                return NotFound("No customers pending activation.");
            }

            var pendingCustomerDtos = pendingCustomers.Select(c => new PendingCustomerDTO
            {
                CustomerId = c.CustomerId.ToString(),
                FullName = c.FullName,
                Email = c.Email
            }).ToList();

        

            return Ok(pendingCustomerDtos); // Return the DTO with CustomerId included
        }

        // Retrieves a list of all deactivated customers.
        [HttpGet("deactivated")]
        public async Task<IActionResult> GetAllDeactivatedCustomers()
        {
            var filter = Builders<Customer>.Filter.And(
                Builders<Customer>.Filter.Eq(c => c.IsActive, false),
                Builders<Customer>.Filter.Eq(c => c.HasBeenActivated, true)
            );

            var deactivatedCustomers = await _customers.Find(filter).ToListAsync();

            if (deactivatedCustomers.Count == 0)
            {
                return NotFound("No deactivated customers found.");
            }
            var deactivatedCustomersDTOs = deactivatedCustomers.Select(c => new PendingCustomerDTO
            {
                CustomerId = c.CustomerId.ToString(),
                FullName = c.FullName,
                Email = c.Email
            }).ToList();

            return Ok(deactivatedCustomersDTOs);
        }

        // Reactivates a deactivated customer account based on the provided customer ID.
        [HttpPost("reactivate/{customerId}")]
        public async Task<IActionResult> ReactivateCustomer(string customerId)
        {
            if (!ObjectId.TryParse(customerId, out var objectId))
            {
                return BadRequest("Invalid customer ID format.");
            }

            var filter = Builders<Customer>.Filter.And(
                Builders<Customer>.Filter.Eq(c => c.CustomerId, objectId),
                Builders<Customer>.Filter.Eq(c => c.IsActive, false),
                Builders<Customer>.Filter.Eq(c => c.HasBeenActivated, true)
            );

            var update = Builders<Customer>.Update
                .Set(c => c.IsActive, true)
                .Set(c => c.UpdatedAt, DateTime.UtcNow);

            var result = await _customers.UpdateOneAsync(filter, update);

            if (result.MatchedCount == 0)
            {
                return NotFound("Customer not found or already active.");
            }

            return Ok("Customer reactivated successfully.");
        }









    }
}
