using EAD_Web.Server.Models;
using MongoDB.Driver;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using System;

namespace EAD_Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly MongoDBContext _mongoContext;

        public OrderController(MongoDBContext mongoContext)
        {
            _mongoContext = mongoContext;
        }

        //Get all orders(Customer Order Management)
        [HttpGet("orders")]
        public async Task<ActionResult<IEnumerable<Orders>>> GetAllOrders()
        {
            try
            {
                var orders = await _mongoContext.Orders.Find(_ => true).ToListAsync();
                var orderResponse = new List<Object>();

                foreach (var order in orders)
                {
                    var orderItems = await _mongoContext.OrderItems.Find(oi => oi.OrderId == order.OrderId).ToListAsync();
                    var orderItemResponse = new List<Object>();
                    var user = await _mongoContext.Users.Find(u => u.UserId == order.CustomerId).FirstOrDefaultAsync();
                    foreach (var orderItem in orderItems)
                    {
                        var product = await _mongoContext.Products.Find(p => p.Id == orderItem.ProductId).FirstOrDefaultAsync();
                       
                        orderItemResponse.Add(new
                        {          
                            productName = product.Name,
                            quantity = orderItem.Quantity,
                            price = orderItem.Price
                        });
                    }

                    orderResponse.Add(new
                    {
                        invoiceNo = order.InvoiceNo,
                        email = user.Email,
                        orderDate = order.CreatedAt.Date.ToString("yyyy-MM-dd"),
                        status = order.Status,
                        OrderItems = orderItemResponse
                    });
                }

                return Ok(orderResponse);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //// Get a specific order by ID (Order Tracking)
        //[HttpGet("orders/{id}")]
        //public async Task<ActionResult<Orders>> GetOrderById(string id)
        //{
        //    try
        //    {
        //        var order = await _mongoContext.Orders.Find(o => o.OrderId == new ObjectId(id)).FirstOrDefaultAsync();
        //        if (order == null)
        //            return NotFound();
        //        return Ok(order);
        //    }
        //    catch (System.Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        //// Get order items by OrderId (Order Tracking)
        //[HttpGet("orders/{id}/items")]
        //public async Task<ActionResult<IEnumerable<OrderItems>>> GetOrderItemsByOrderId(string id)
        //{
        //    try
        //    {
        //        var orderItems = await _mongoContext.OrderItems.Find(oi => oi.OrderId == new ObjectId(id)).ToListAsync();
        //        if (orderItems == null || orderItems.Count == 0)
        //            return NotFound("No order items found for this order.");
        //        return Ok(orderItems);
        //    }
        //    catch (System.Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        //// Create a new order and associated order items (Order Management)
        //[HttpPost("orders")]
        //public async Task<ActionResult> CreateOrder([FromBody] Orders order, [FromBody] List<OrderItems> orderItems)
        //{
        //    try
        //    {
        //        // Insert the order
        //        await _mongoContext.Orders.InsertOneAsync(order);

        //        // Insert the associated order items
        //        foreach (var item in orderItems)
        //        {
        //            item.OrderId = order.OrderId;
        //            await _mongoContext.OrderItems.InsertOneAsync(item);
        //        }

        //        return Ok("Order and items created successfully");
        //    }
        //    catch (System.Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        //// Update an order's status (Order Management & Customer Order Management)
        //[HttpPut("orders/{id}")]
        //public async Task<ActionResult> UpdateOrderStatus(string id, [FromBody] string status)
        //{
        //    try
        //    {
        //        var updateDefinition = Builders<Orders>.Update
        //            .Set(o => o.Status, status)
        //            .Set(o => o.UpdatedAt, DateTime.UtcNow);

        //        var result = await _mongoContext.Orders.UpdateOneAsync(
        //            o => o.OrderId == new ObjectId(id),
        //            updateDefinition);

        //        if (result.ModifiedCount == 0)
        //            return NotFound("Order not found or status not updated");

        //        return Ok("Order status updated successfully");
        //    }
        //    catch (System.Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        //// Cancel an order (Order Management & Customer Order Management)
        //[HttpPut("orders/{id}/cancel")]
        //public async Task<ActionResult> CancelOrder(string id)
        //{
        //    try
        //    {
        //        var updateDefinition = Builders<Orders>.Update
        //            .Set(o => o.Status, "Cancelled")
        //            .Set(o => o.UpdatedAt, DateTime.UtcNow);

        //        var result = await _mongoContext.Orders.UpdateOneAsync(
        //            o => o.OrderId == new ObjectId(id),
        //            updateDefinition);

        //        if (result.ModifiedCount == 0)
        //            return NotFound("Order not found or already cancelled");

        //        return Ok("Order cancelled successfully");
        //    }
        //    catch (System.Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        //// Mark order as delivered (Order Management)
        //[HttpPut("orders/{id}/deliver")]
        //public async Task<ActionResult> MarkOrderAsDelivered(string id)
        //{
        //    try
        //    {
        //        var updateDefinition = Builders<Orders>.Update
        //            .Set(o => o.Status, "Delivered")
        //            .Set(o => o.UpdatedAt, DateTime.UtcNow);

        //        var result = await _mongoContext.Orders.UpdateOneAsync(
        //            o => o.OrderId == new ObjectId(id),
        //            updateDefinition);

        //        if (result.ModifiedCount == 0)
        //            return NotFound("Order not found or already delivered");

        //        return Ok("Order marked as delivered");
        //    }
        //    catch (System.Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        // Temporary API to add dummy orders and order items (For Testing)
        //[HttpPost("orders/dummy")]
        //public async Task<ActionResult> AddDummyOrder()
        //{
        //    var product = await _mongoContext.Products.Find(p => p.Code == "OJ123").FirstOrDefaultAsync();
        //    var product2 = await _mongoContext.Products.Find(p => p.Code == "MLK001").FirstOrDefaultAsync();

        //    // Dummy order creation
        //    var dummyOrder = new Orders
        //    {
        //        OrderId = ObjectId.GenerateNewId().ToString(), // Generate a new ObjectId and convert it to string
        //        Status = "Processing",
        //        CreatedAt = DateTime.UtcNow,
        //        UpdatedAt = DateTime.UtcNow
        //    };

        //    try
        //    {
        //        // Insert dummy order
        //        await _mongoContext.Orders.InsertOneAsync(dummyOrder);

        //        // Dummy order items creation
        //        var dummyOrderItems = new List<OrderItems>
        //{
        //    new OrderItems
        //    {
        //        OrderId = new ObjectId(dummyOrder.OrderId), // Convert string to ObjectId
        //        ProductId = product.Id,
        //        Quantity = 1,
        //        Price = 300,
        //        CreatedAt = DateTime.UtcNow,
        //        UpdatedAt = DateTime.UtcNow
        //    },
        //    new OrderItems
        //    {
        //        OrderId = new ObjectId(dummyOrder.OrderId), // Convert string to ObjectId
        //        ProductId = product2.Id,
        //        Quantity = 3,
        //        Price = 300,
        //        CreatedAt = DateTime.UtcNow,
        //        UpdatedAt = DateTime.UtcNow
        //    }
        //};

        //        // Insert dummy order items
        //        await _mongoContext.OrderItems.InsertManyAsync(dummyOrderItems);

        //        return Ok("Dummy order and order items added successfully");
        //    }
        //    catch (System.Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}
    }
}
