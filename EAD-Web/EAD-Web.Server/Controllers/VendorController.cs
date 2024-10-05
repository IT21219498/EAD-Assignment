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
    }
}
