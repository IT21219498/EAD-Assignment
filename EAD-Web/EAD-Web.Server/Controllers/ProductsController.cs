using EAD_Web.Server.Models;
using MongoDB.Driver;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using EAD_Web.Server.DTOs;


namespace EAD_Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly MongoDBContext _mongoContext;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(MongoDBContext mongoContext, ILogger<ProductsController> logger)
        {
            _mongoContext = mongoContext;
            _logger = logger;
            
        }

        // Get all products
        [HttpGet("products")]
        public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
        {
            try
            {
                var products = new List<Product>();
                products = await _mongoContext.Products.Find(_ => true).ToListAsync();

                var productsDto = new List<ProductDto>();

                foreach (var product in products)
                {
                    var category = await _mongoContext.Categories.Find(x => x.Id == product.CategoryId).FirstOrDefaultAsync();
                    var measuringUnit = await _mongoContext.Measuringunits.Find(x => x.Id == product.MeasurementUnitId).FirstOrDefaultAsync();

                    productsDto.Add(new ProductDto
                    {
                        Id = product.Id,
                        Name = product.Name,
                        Code = product.Code,
                        Price = product.Price,
                        Cost = product.Cost,
                        ReorderLevel = product.ReorderLevel,
                        CategoryId = product.CategoryId,
                        CategoryName = category.Name,
                        MeasurementUnitName = measuringUnit.Unit,
                        Description = product.Description,
                        ItemPerCase = product.ItemPerCase,
                        ImageUrl = product.ImageUrl
                    });
                }

                return Ok(productsDto);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in getting all products");
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
                _logger.LogError(ex, "Error in getting all categories");
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
                _logger.LogError(ex, "Error in getting all measuring units");
                return BadRequest(ex.Message);
            }
        }

       [HttpPost("create")]
        public async Task<IActionResult> CreateProduct([FromBody] ProductDto productDto)
        {

            // Validate if category and measurement unit exist before creation
            var categoryExists = await _mongoContext.Categories.Find(x => x.Id == productDto.CategoryId).AnyAsync();
            if (!categoryExists)
            {
                return BadRequest("Invalid CategoryId.");
            }

            var measurementUnitExists = await _mongoContext .Measuringunits.Find(x => x.Id == productDto.MeasurementUnitId).AnyAsync();
            if (!measurementUnitExists)
            {
                return BadRequest("Invalid MeasurementUnitId.");
            }

            try{
                var newProduct = new Product
                {
                    Name = productDto.Name,
                    Code = productDto.Code,
                    Price = productDto.Price,
                    Cost = productDto.Cost,
                    ReorderLevel = productDto.ReorderLevel,
                    CategoryId = productDto.CategoryId,
                    MeasurementUnitId = productDto.MeasurementUnitId,
                    Description = productDto.Description,
                    ItemPerCase = productDto.ItemPerCase ?? 0,
                    SupplierId = productDto.SupplierId ?? "",
                    ImageUrl = productDto.ImageUrl ?? "",
                    IsActive = productDto.IsActive ?? true
                };

                await _mongoContext.Products.InsertOneAsync(newProduct);

                return CreatedAtAction(nameof(GetProductById), new { id = newProduct.Id }, newProduct);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in creating product");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(string id)
        {
            if (!ObjectId.TryParse(id, out _))
            {
                return BadRequest("Invalid product ID.");
            }

            try{
                var product = await _mongoContext.Products.Find(p => p.Id == id).FirstOrDefaultAsync();
                if (product == null)
                {
                    return NotFound("Product not found.");
                }

                return Ok(product);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in getting product by ID");
                return BadRequest(ex.Message);
            }
        }
    }
}
