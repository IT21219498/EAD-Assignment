﻿using EAD_Web.Server.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EAD_Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingController : ControllerBase
    {
        private readonly MongoDBContext _mongoContext;
        private readonly ILogger<RatingController> _logger;

        public RatingController(MongoDBContext mongoContext, ILogger<RatingController> logger)
        {
            _mongoContext = mongoContext;
            _logger = logger;
        }

        [HttpPost("newRating")]
        public async Task<IActionResult> CreateVendorRating([FromBody] VendorRating vendorRating)
        {
            try
            {
                // Validate the input
                if (vendorRating == null)
                {
                    return BadRequest("Rating details are required.");
                }

                if (string.IsNullOrEmpty(vendorRating.VendorId) ||
                    string.IsNullOrEmpty(vendorRating.CustomerId) ||
                    (vendorRating.Rating <= 0 && vendorRating.Rating >= 5))
                {
                    return BadRequest("VendorId, CustomerId, and valid Rating are required.");
                }

                // Insert the new rating into MongoDB
                await _mongoContext.VendorRatings.InsertOneAsync(vendorRating);

                // Return the newly created rating
                return Ok(vendorRating);
            }
            catch (System.Exception ex)
            {
                // Log the error (use logging mechanism)
                _logger.LogError(ex, "Error in creating vendor rating");
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/comment")]
        public async Task<IActionResult> UpdateComment(string id, [FromBody] string newComment)
        {
            // Validate the input
            if (string.IsNullOrEmpty(newComment))
            {
                return BadRequest("Comment cannot be empty.");
            }

            try
            {
                // Find the existing vendor rating by ID
                var vendorRating = await _mongoContext.VendorRatings.Find(r => r.Id == ObjectId.Parse(id)).FirstOrDefaultAsync();
                if (vendorRating == null)
                {
                    return NotFound("Vendor rating not found.");
                }

                // Update the comment
                vendorRating.Comment = newComment;

                // Replace the existing document in the database
                await _mongoContext.VendorRatings.ReplaceOneAsync(r => r.Id == vendorRating.Id, vendorRating);

                return Ok(vendorRating);  // Return the updated vendor rating
            }
            catch (System.Exception ex)
            {
                // Log the error
                _logger.LogError(ex, "Error in creating vendor rating");
                return BadRequest(ex.Message);
            }
        }
    }
}
