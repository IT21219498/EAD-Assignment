/* 
  This controller is responsible for handling all the requests related to the inventory.
  It provides the following functionalities:
  1. Get all available stock
  2. Get stocks that are below the minimum quantity
  3. Update stock quantity
  4. Delete stock by id
*/

using EAD_Web.Server.Models;
using MongoDB.Driver;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using EAD_Web.Server.DTOs;

namespace EAD_Web.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly MongoDBContext _context;
        private readonly ILogger<ProductsController> _logger;

        public InventoryController(MongoDBContext mongoContext, ILogger<ProductsController> logger)
        {
            _context = mongoContext;
            _logger = logger;
            
        }

        //get all available stock
        [HttpGet("getallstock")]
        public async Task<ActionResult<List<StockDTO>>> GetAllStock()
        {
            try
            {
                var stocks = await _context.Stock.Find(stock => stock.IsActive == true).ToListAsync();
                var stockDTOs = new List<StockDTO>();
                foreach (var stock in stocks)
                {
                    stockDTOs.Add(new StockDTO
                    {
                        Id = stock.Id,
                        ProductId = stock.ProductId,
                        ProductName = _context.Products.Find(product => product.Id == stock.ProductId).FirstOrDefault().Name,
                        SellingPrice = _context.Products.Find(product => product.Id == stock.ProductId).FirstOrDefault().Price,
                        Quantity = stock.Quantity
                    });
                }
                return Ok(stockDTOs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in getting all stock");
                return StatusCode(500, "Internal server error");
            }
        }

        //get stocks that are below the minimum quantity, minimu is set to 10
        [HttpGet("getlowstock")]
        public async Task<ActionResult<List<StockDTO>>> GetLowStock()
        {
            try
            {
                var stocks = await _context.Stock.Find(stock => stock.Quantity < 10 
                    && stock.IsActive == true
                ).ToListAsync();

                var stockDTOs = new List<StockDTO>();

                foreach (var stock in stocks)
                {
                    stockDTOs.Add(new StockDTO
                    {
                        Id = stock.Id,
                        ProductId = stock.ProductId,
                        ProductName = _context.Products.Find(product => product.Id == stock.ProductId).FirstOrDefault().Name,
                        SellingPrice = _context.Products.Find(product => product.Id == stock.ProductId).FirstOrDefault().Price,
                        Quantity = stock.Quantity
                    });
                }


                return Ok(stockDTOs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in getting low stock");
                return StatusCode(500, "Internal server error");
            }
        }

        //update stock quantity
        [HttpPut("updatestock")]
        public async Task<ActionResult> UpdateStock([FromBody] StockDTO stockDTO)
        {
            try
            {
                var stock = await _context.Stock.Find(stock => stock.Id == stockDTO.Id).FirstOrDefaultAsync();
                if (stock == null)
                {
                    return NotFound("Stock not found");
                }
                stock.Quantity = stockDTO.Quantity;
                stock.LastUpdated = DateTime.Now;
                await _context.Stock.ReplaceOneAsync(stock => stock.Id == stockDTO.Id, stock);
                return Ok("Stock updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in updating stock");
                return StatusCode(500, "Internal server error");
            }
        }

        //delete stock by id
        [HttpDelete("deletestock/{id}")]
        public async Task<ActionResult> DeleteStock(string id)
        {
            try
            {
                var stock = await _context.Stock.Find(stock => stock.Id == id).FirstOrDefaultAsync();
                if (stock == null)
                {
                    return NotFound("Stock not found");
                }
                stock.IsActive = false;
                await _context.Stock.ReplaceOneAsync(stock => stock.Id == id, stock);
                return Ok("Stock deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in deleting stock");
                return StatusCode(500, "Internal server error");
            }
        }


     
    }
}