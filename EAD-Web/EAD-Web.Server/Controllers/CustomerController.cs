using Microsoft.AspNetCore.Mvc;
using EAD_Web.Server.Models;
using EAD_Web.Server.DTOs;
using MongoDB.Driver;
using System;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace EAD_Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly IMongoCollection<Customer> _customers;

        public CustomerController(IMongoDatabase database)
        {
            _customers = database.GetCollection<Customer>("Customers");
        }

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
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _customers.InsertOneAsync(customer);
            return Ok("Customer registered successfully, pending activation.");
        }

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
                .Set(c => c.UpdatedAt, DateTime.UtcNow);

            var result = await _customers.UpdateOneAsync(filter, update);

            if (result.MatchedCount == 0)
            {
                return NotFound("Customer not found");
            }

            return Ok("Customer activated successfully.");
        }

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

        [HttpPost("deactivate/{customerId}")]
        public async Task<IActionResult> DeactivateCustomer(string customerId)
        {
            var filter = Builders<Customer>.Filter.Eq(c => c.CustomerId, customerId);
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





    }
}
