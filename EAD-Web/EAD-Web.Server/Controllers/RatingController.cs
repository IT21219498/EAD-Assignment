/*
 * File: RatingController.cs
 * Description: Controller for managing Add a review, update review comment, get all reviews and get review By id.
 * Author: Illesinghe A. T. - IT21286278
 */
using EAD_Web.Server.Models;
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

        // Create a new vendor rating
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
                //    string.IsNullOrEmpty(vendorRating.CustomerId) ||
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

        // Update the comment of a vendor rating
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
                var vendorRating = await _mongoContext.VendorRatings.Find(r => r.Id == id).FirstOrDefaultAsync();
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

        // Get a vendor rating by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReviewById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Rating ID cannot be empty.");
            }

            try
            {
                // Parse the string ID to ObjectId
                if (!ObjectId.TryParse(id, out var objectId))
                {
                    return BadRequest("Invalid Rating ID format.");
                }

                // Find the vendor rating by ID
                var vendorRating = await _mongoContext.VendorRatings.Find(r => r.Id == id).FirstOrDefaultAsync();

                if (vendorRating == null)
                {
                    return NotFound("Review not found.");
                }

                return Ok(vendorRating);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in getting review by ID");
                return BadRequest(ex.Message);
            }
        }

        // Get all vendor ratings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VendorRating>>> GetAllReviews()
        {
            try
            {
                // Fetch all vendor ratings from the collection
                var vendorRatings = await _mongoContext.VendorRatings.Find(_ => true).ToListAsync();

                // Check if there are any ratings
                if (vendorRatings.Count == 0)
                {
                    return NoContent();  // Return 204 No Content if there are no reviews
                }

                return Ok(vendorRatings);  // Return all ratings with 200 OK
            }
            catch (System.Exception ex)
            {
                // Log the error
                _logger.LogError(ex, "Error in getting all reviews");
                return BadRequest(ex.Message);  // Return 400 Bad Request for errors
            }
        }
    }
}
