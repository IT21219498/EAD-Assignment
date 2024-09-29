using EAD_Web.Server.Models;
using MongoDB.Driver;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EAD_Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly MongoDBContext _mongoContext;

        public ProductsController(MongoDBContext mongoContext)
        {
            _mongoContext = mongoContext;
        }

        // Get all products
        [HttpGet("products")]
        public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
        {
            try
            {
                var products = await _mongoContext.Products.Find(_ => true).ToListAsync();
                return Ok(products);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Get all categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetAllCategories()
        {
            try
            {
                var categories = await _mongoContext.Categories.Find(_ => true).ToListAsync();
                return Ok(categories);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Get all measuring units
        [HttpGet("measuringunits")]
        public async Task<ActionResult<IEnumerable<Measuringunit>>> GetAllMeasuringUnits()
        {
            try
            {
                var measuringunits = await _mongoContext.Measuringunits.Find(_ => true).ToListAsync();
                return Ok(measuringunits);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
