/*
    This file contains the controller for handling product related operations.
    It includes the following operations:
    - Get all products with category and measuring unit details
    - Get all categories
    - Get all measuring units
    - Create a new product
    - Get product details by ID
    - Update product details
    - Delete product by ID
    - Update product status
*/

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

        // Get all products with category and measuring unit details
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
                        ImageUrl = product.ImageUrl,
                        IsActive = product.IsActive 
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

        // Get all products with category and measuring unit details
        [HttpGet("activeproducts")]
        public async Task<ActionResult<IEnumerable<Product>>> GetAllActiveProducts()
        {
            try
            {
                var products = new List<Product>();
                products = await _mongoContext.Products.Find(p => p.IsActive == true).ToListAsync();

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
                        ImageUrl = product.ImageUrl,
                        IsActive = product.IsActive 
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

        // Create a new product
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

                //Initialize the stock for the new product
                var newStock = new Stock
                {
                    ProductId = newProduct.Id,
                    Quantity = 0,
                    IsActive = true
                };

                await _mongoContext.Stock.InsertOneAsync(newStock);

                return CreatedAtAction(nameof(GetProductById), new { id = newProduct.Id }, newProduct);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in creating product");
                return BadRequest(ex.Message);
            }
        }

        // Get product details by ID
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
 
        // Update product details
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(string id, [FromBody] ProductDto productDto)
        {
            if (!ObjectId.TryParse(id, out _))
            {
                return BadRequest("Invalid product ID.");
            }

            // Validate if category and measurement unit exist before creation
            var categoryExists = await _mongoContext.Categories.Find(x => x.Id == productDto.CategoryId).AnyAsync();
            if (!categoryExists)
            {
                return BadRequest("Invalid CategoryId.");
            }

            var measurementUnitExists = await _mongoContext.Measuringunits.Find(x => x.Id == productDto.MeasurementUnitId).AnyAsync();
            if (!measurementUnitExists)
            {
                return BadRequest("Invalid MeasurementUnitId.");
            }

            try{
                var product = await _mongoContext.Products.Find(p => p.Id == id).FirstOrDefaultAsync();
                if (product == null)
                {
                    return NotFound("Product not found.");
                }

                product.Name = productDto.Name;
                product.Code = productDto.Code;
                product.Price = productDto.Price;
                product.Cost = productDto.Cost;
                product.ReorderLevel = productDto.ReorderLevel;
                product.CategoryId = productDto.CategoryId;
                product.MeasurementUnitId = productDto.MeasurementUnitId;
                product.Description = productDto.Description;
                product.ItemPerCase = productDto.ItemPerCase ?? 0;
                product.SupplierId = productDto.SupplierId ?? "";
                product.ImageUrl = productDto.ImageUrl ?? "";
                product.IsActive = productDto.IsActive ?? true;

                await _mongoContext.Products.ReplaceOneAsync(p => p.Id == id, product);

                return Ok(product);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in updating product");
                return BadRequest(ex.Message);
            }
        }

        // Delete product by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
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

                await _mongoContext.Products.DeleteOneAsync(p => p.Id == id);

                //Delete the stock for the product
                await _mongoContext.Stock.DeleteOneAsync(s => s.ProductId == id);



                return Ok("Product deleted successfully.");
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in deleting product");
                return BadRequest(ex.Message);
            }
        }

        //update product status
        [HttpPut("updatestatus/{id}/{isActive}")]
        public async Task<IActionResult> UpdateProductStatus(string id,bool isActive)
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

                product.IsActive = isActive;

                await _mongoContext.Products.ReplaceOneAsync(p => p.Id == id, product);

                return Ok(product);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in updating product status");
                return BadRequest(ex.Message);
            }
        }

        //get product by category
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetProductByCategory(string categoryId)
        {
            if (!ObjectId.TryParse(categoryId, out _))
            {
                return BadRequest("Invalid category ID.");
            }

            try{
                var products = await _mongoContext.Products.Find(p => p.CategoryId == categoryId).ToListAsync();
                if (products == null)
                {
                    return NotFound("Products not found.");

                }

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
                        ImageUrl = product.ImageUrl,
                        IsActive = product.IsActive
                    });

                }

                return Ok(productsDto);

            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in getting product by category");
                return BadRequest(ex.Message);
            }
        }

        //search product by name
        [HttpGet("search/{name}")]
        public async Task<IActionResult> SearchProductByName(string name)
        {
            try{
                var products = await _mongoContext.Products.Find(p => p.Name.ToLower().Contains(name.ToLower())).ToListAsync();
                if (products == null)
                {
                    return NotFound("Products not found.");
                }

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
                        ImageUrl = product.ImageUrl,
                        IsActive = product.IsActive
                    });

                }

                return Ok(productsDto);

            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error in searching product by name");
                return BadRequest(ex.Message);
            }
        }


    }
}
