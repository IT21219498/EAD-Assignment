using EAD_Web.Server.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace EAD_Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VendorController : ControllerBase
    {
        private readonly MongoDBContext _mongoContext;
        private readonly ILogger<VendorController> _logger;

        public VendorController(MongoDBContext mongoContext, ILogger<VendorController> logger)
        {
            _mongoContext = mongoContext;
            _logger = logger;
        }

        // Create a new vendor
        [HttpPost("create")]
        public async Task<ActionResult> CreateVendor([FromBody] Vendor vendor)
        {
            try
            {
                // Validate the input
                if (vendor == null)
                {
                    return BadRequest("Vendor object is null");
                }

                if (string.IsNullOrEmpty(vendor.vendorName) || string.IsNullOrEmpty(vendor.contactName) ||
                    string.IsNullOrEmpty(vendor.contactNo) || string.IsNullOrEmpty(vendor.email) ||
                    string.IsNullOrEmpty(vendor.category))
                {
                    return BadRequest("All required fields must be provided.");
                }

                // Insert the new vendor into MongoDB
                await _mongoContext.Vendors.InsertOneAsync(vendor);
                return Ok("Vendor created successfully.");
            }
            catch (System.Exception ex)
            {
                // Log the error
                _logger.LogError(ex, "Error in creating product");
                return BadRequest(ex.Message);
            }
        }

        // Get all vendors
        [HttpGet("allVendors")]
        public async Task<ActionResult<IEnumerable<Vendor>>> GetAllVendors()
        {
            try
            {
                // Get all vendors from MongoDB
                var vendors = await _mongoContext.Vendors.Find(_ => true).ToListAsync();

                // If no vendors are found, return NoContent
                if (vendors.Count == 0)
                {
                    return NoContent();
                }
                //  Return the list of vendors
                return Ok(vendors);
            }
            catch (System.Exception ex)
            {
                // Log the error
                _logger.LogError(ex, "Error in getting all vendors");
                return BadRequest(ex.Message);
            }
        }

        // Get a vendor by name
        [HttpGet("{vendorName}")]
        public async Task<IActionResult> GetVendorByName(string vendorName)
        {
            if (string.IsNullOrEmpty(vendorName))
            {
                return BadRequest("Vendor name cannot be empty.");
            }

            try
            {
                // Find the vendor by name
                var vendor = await _mongoContext.Vendors.Find(v => v.vendorName.ToLower() == vendorName.ToLower()).FirstOrDefaultAsync();
                if (vendor == null)
                {
                    return NotFound("Vendor not found.");
                }
                //  Return the vendor
                return Ok(vendor);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in getting vendor by name");
                return BadRequest(ex.Message);
            }
        }

        // Delete a vendor by name
        [HttpDelete("{vendorName}")]
        public async Task<IActionResult> DeleteVendorByName(string vendorName)
        {
            if (string.IsNullOrEmpty(vendorName))
            {
                return BadRequest("Vendor name cannot be empty.");
            }

            try
            {
                // Find the vendor by name
                var vendor = await _mongoContext.Vendors.Find(v => v.vendorName.ToLower() == vendorName.ToLower()).FirstOrDefaultAsync();
                if (vendor == null)
                {
                    return NotFound("Vendor not found.");
                }

                // Delete the vendor from MongoDB
                await _mongoContext.Vendors.DeleteOneAsync(v => v.Id == vendor.Id);

                return Ok("Vendor deleted successfully.");
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in deleting vendor");
                return BadRequest(ex.Message);
            }
        }

        // Update a vendor by name
        [HttpPut("{vendorName}")]
        public async Task<IActionResult> UpdateVendorByName(string vendorName, [FromBody] Vendor updatedVendor)
        {
            if (string.IsNullOrEmpty(vendorName))
            {
                return BadRequest("Vendor name cannot be empty.");
            }

            try
            {
                // Find the existing vendor by name
                var existingVendor = await _mongoContext.Vendors.Find(v => v.vendorName.ToLower() == vendorName.ToLower()).FirstOrDefaultAsync();
                if (existingVendor == null)
                {
                    return NotFound("Vendor not found.");
                }

                // Update the vendor details directly with the updated vendor object
                existingVendor.vendorName = updatedVendor.vendorName;
                existingVendor.address = updatedVendor.address;
                existingVendor.contactName = updatedVendor.contactName;
                existingVendor.contactNo = updatedVendor.contactNo;
                existingVendor.email = updatedVendor.email;
                existingVendor.category = updatedVendor.category;

                // Replace the existing document in the database
                await _mongoContext.Vendors.ReplaceOneAsync(v => v.Id == existingVendor.Id, existingVendor);

                // Return the updated vendor
                return Ok(existingVendor);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in updating vendor");
                return BadRequest(ex.Message);
            }
        }

    }
}
