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
        private readonly ILogger<ProductsController> _logger;

        public VendorController(MongoDBContext mongoContext, ILogger<ProductsController> logger)
        {
            _mongoContext = mongoContext;
            _logger = logger;
        }

        [HttpPost("create")]
        public async Task<ActionResult> CreateVendor([FromBody] Vendor vendor)
        {
            try
            {
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

                await _mongoContext.Vendors.InsertOneAsync(vendor);
                return Ok("Vendor created successfully.");
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in creating product");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("allVendors")]
        public async Task<ActionResult<IEnumerable<Vendor>>> GetAllVendors()
        {
            try
            {
                var vendors = await _mongoContext.Vendors.Find(_ => true).ToListAsync();

                if (vendors.Count == 0)
                {
                    return NoContent();
                }

                return Ok(vendors);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in getting all vendors");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{vendorName}")]
        public async Task<IActionResult> GetVendorByName(string vendorName)
        {
            if (string.IsNullOrEmpty(vendorName))
            {
                return BadRequest("Vendor name cannot be empty.");
            }

            try
            {
                var vendor = await _mongoContext.Vendors.Find(v => v.vendorName.ToLower() == vendorName.ToLower()).FirstOrDefaultAsync();
                if (vendor == null)
                {
                    return NotFound("Vendor not found.");
                }

                return Ok(vendor);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in getting vendor by name");
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{vendorName}")]
        public async Task<IActionResult> DeleteVendorByName(string vendorName)
        {
            if (string.IsNullOrEmpty(vendorName))
            {
                return BadRequest("Vendor name cannot be empty.");
            }

            try
            {
                var vendor = await _mongoContext.Vendors.Find(v => v.vendorName.ToLower() == vendorName.ToLower()).FirstOrDefaultAsync();
                if (vendor == null)
                {
                    return NotFound("Vendor not found.");
                }

                await _mongoContext.Vendors.DeleteOneAsync(v => v.Id == vendor.Id);

                return Ok("Vendor deleted successfully.");
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in deleting vendor");
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{vendorName}")]
        public async Task<IActionResult> UpdateVendorByName(string vendorName, [FromBody] Vendor updatedVendor)
        {
            if (string.IsNullOrEmpty(vendorName))
            {
                return BadRequest("Vendor name cannot be empty.");
            }

            try
            {
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

                await _mongoContext.Vendors.ReplaceOneAsync(v => v.Id == existingVendor.Id, existingVendor);

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
