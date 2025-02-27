﻿/*
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
using System.Linq;

namespace EAD_Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly IMongoCollection<Customer> _customers;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;


        // Summary-Initializes a new instance of the CustomerController with the specified MongoDB database and configuration.
        // <param name="database">The MongoDB database instance.</param>
        // <param name="configuration">The application configuration settings.</param>
        public CustomerController(IMongoDatabase database, IConfiguration configuration, IEmailService emailService)
        {
            _customers = database.GetCollection<Customer>("Customers");
            _configuration = configuration;
            _emailService = emailService;
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
            return Ok(new { message = "Customer registered successfully, pending activation." });
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

            // Retrieve the updated customer to get email
            var updatedCustomer = await _customers.Find(c => c.CustomerId == objectId).FirstOrDefaultAsync();

            if (updatedCustomer != null)
            {
                // Prepare email content
                string subject = "Your Account Has Been Approved";
                string message = $"<p>Dear {updatedCustomer.FullName},</p>" +
                                 $"<p>We are pleased to inform you that your account has been approved and is now active.</p>" +
                                 $"<p>You can now log in using your credentials.</p>" +
                                 $"<p>Thank you for joining us!</p>" +
                                 $"<p>Best regards,<br/>Your Company Name</p>";

                try
                {
                    // Send the email
                    await _emailService.SendEmailAsync(updatedCustomer.Email, subject, message);
                }
                catch (Exception ex)
                {
                    // Log the exception (you might want to use a logging framework)
                    Console.WriteLine($"Failed to send activation email to {updatedCustomer.Email}: {ex.Message}");
                    // Optionally, you can choose to return a different response or proceed
                }
            }

            return Ok("Customer activated successfully.");
        }

        // Modifies the details of an existing customer based on the provided customer ID and update data.
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

            // Check if password is provided, then hash it and add it to the update
            if (!string.IsNullOrEmpty(model.Password))
            {
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
                updateDefinition.Add(updateDefinitionBuilder.Set(c => c.PasswordHash, passwordHash));
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

            return Ok(new { message = "Customer account updated successfully." });
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

           return Ok(new { message = "Customer account deactivated successfully." });

        }

        // Authenticates a customer and generates a JWT token upon successful login.
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO model)
        {
            // Find the customer by email
            var customer = await _customers.Find(c => c.Email == model.Email).FirstOrDefaultAsync();

            // Check if the customer exists
            if (customer == null)
            {
                return Unauthorized("Invalid login attempt.");
            }

            // Check if the account is pending activation
            if (!customer.HasBeenActivated)
            {
                return Unauthorized("Account pending approval.");
            }

            // Check if the account is deactivated
            if (!customer.IsActive)
            {
                return Unauthorized("Account has been deactivated.");
            }

            // Verify the password
            if (!BCrypt.Net.BCrypt.Verify(model.Password, customer.PasswordHash))
            {
                return Unauthorized("Invalid login attempt.");
            }

            var token = GenerateJwtToken(customer);

            // Return token and customer details in the response
            return Ok(new
            {
                token,
                customerId = customer.CustomerId.ToString(),  
                fullName = customer.FullName,
                email = customer.Email,
                phoneNumber = customer.PhoneNumber,
                address = customer.Address
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
