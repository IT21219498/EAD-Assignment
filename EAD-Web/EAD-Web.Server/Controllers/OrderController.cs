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

        // Get all orders (Customer Order Management)
        [HttpGet("orders")]
        public async Task<ActionResult> GetAllOrders()
        {
            try
            {
                var orders = await _mongoContext.Orders.Find(_ => true).ToListAsync();
                var orderResponse = new List<object>();

                foreach (var order in orders)
                {
                    var orderItems = await _mongoContext.OrderItems.Find(oi => oi.OrderId == order.OrderId).ToListAsync();
                    var orderItemResponse = new List<object>();
                    var user = await _mongoContext.Customers.Find(u => u.CustomerId.ToString() == order.CustomerId).FirstOrDefaultAsync();

                    foreach (var orderItem in orderItems)
                    {
                        var product = await _mongoContext.Products.Find(p => p.Id == orderItem.ProductId).FirstOrDefaultAsync();

                        if (product != null)
                        {
                            orderItemResponse.Add(new
                            {
                                productName = product.Name,
                                quantity = orderItem.Quantity,
                                price = orderItem.Price
                            });
                        }
                    }

                    orderResponse.Add(new
                    {
                        id = order.OrderId.ToString(),
                        invoiceNo = order.InvoiceNo,
                        email = user?.Email ?? "N/A",
                        status = order.Status,
                        orderItems = orderItemResponse,
                        orderDate = order.OrderDate.Date.ToString("yyyy-MM-dd"),
                    });
                }

                return Ok(new
                {
                    status = "OK",
                    data = orderResponse
                });
            }
            catch (Exception)
            {
                return BadRequest(new
                {
                    status = "NOK",
                    message = "an error occurred while fetching orders"
                });
            }
        }

        [HttpGet("getMaximumInvoiceNo")]
        public async Task<ActionResult> GetMaximumInvoiceNo()
        {
            try
            {
                var orders = await _mongoContext.Orders.Find(_ => true).ToListAsync();
                int maxInvoiceNo = 0;
                foreach (var order in orders)
                {
                    if (order.InvoiceNo > maxInvoiceNo)
                    {
                        maxInvoiceNo = order.InvoiceNo;
                    }
                }
                return Ok(new
                {
                    status = "OK",
                    data = maxInvoiceNo
                });
            }
            catch (Exception)
            {
                return BadRequest(new
                {
                    status = "NOK",
                    message = "An error occurred while fetching orders"
                });
            }
        }
        [HttpGet("customers")]
        public async Task<ActionResult> GetAllCustomers()
        {
            try
            {
                var customers = await _mongoContext.Customers.Find(_ => true).ToListAsync();
                var customersResponse = new List<object>();

                foreach (var customer in customers)
                {

                   customersResponse.Add(new
                    {
                       name = customer.FullName,
                       Id = customer.CustomerId.ToString(),
                             
                    });
                                                     
                }

                return Ok(new
                {
                    status = "OK",
                    data = customersResponse
                });
            }
            catch (Exception)
            {
               
                return BadRequest(new
                {
                    status = "NOK",
                    message = "An error occurred while fetching customers",
                });
            }
        }
        [HttpGet("products")]
        public async Task<ActionResult> GetAllProducts()
        {
            try
            {
                var products = await _mongoContext.Products.Find(_ => true).ToListAsync();
                var productsResponse = new List<object>();

                foreach (var product in products)
                {

                    productsResponse.Add(new
                    {
                        name = product.Name,
                        Id = product.Id.ToString(),

                    });

                }

                return Ok(new
                {
                    status = "OK",
                    data = productsResponse
                });
            }
            catch (Exception)
            {
               
                return BadRequest(new
                {
                    status = "NOK",
                    message = "An error occurred while fetching products",
                });
            }
        }
        //[HttpPost("addDummyOrders")]
        //public async Task<ActionResult> AddDummyOrders()
        //{
        //    try
        //    {
        //        var dummyOrders = new List<Orders>
        //{
        //    new Orders
        //    {
        //        OrderId = ObjectId.GenerateNewId().ToString(),
        //        InvoiceNo = 1001,
        //        CustomerId = "66ffac55612591d5a1c41fe0",
        //        Status = "Processing",
        //        OrderDate = DateTime.UtcNow,
        //        CreatedAt = DateTime.UtcNow,
        //        UpdatedAt = DateTime.UtcNow
        //    },
        //    new Orders
        //    {
        //        OrderId = ObjectId.GenerateNewId().ToString(),
        //        InvoiceNo = 1002,
        //        CustomerId = "66ffaccf8b1b2653f83abaf9",
        //        Status = "Delivered",
        //        OrderDate = DateTime.UtcNow,
        //        CreatedAt = DateTime.UtcNow,
        //        UpdatedAt = DateTime.UtcNow
        //    },
        //    new Orders
        //    {
        //        OrderId = ObjectId.GenerateNewId().ToString(),
        //        InvoiceNo = 1003,
        //        CustomerId = "66ffaccf8b1b2653f83abaf9",
        //        Status = "Cancelled",
        //        OrderDate = DateTime.UtcNow,
        //        CreatedAt = DateTime.UtcNow,
        //        UpdatedAt = DateTime.UtcNow
        //    },
        //    new Orders
        //    {
        //        OrderId = ObjectId.GenerateNewId().ToString(),
        //        InvoiceNo = 1004,
        //        CustomerId = "66ffac55612591d5a1c41fe0",
        //        Status = "Processing",
        //        OrderDate = DateTime.UtcNow,
        //        CreatedAt = DateTime.UtcNow,
        //        UpdatedAt = DateTime.UtcNow
        //    }
        //};

        //        var dummyOrderItems = new List<OrderItems>
        //{
        //    new OrderItems
        //    {
        //        OrderItemId = ObjectId.GenerateNewId().ToString(),
        //        OrderId = dummyOrders[0].OrderId,
        //        ProductId = "66fc3fc02c116c3d054f1c89",
        //        Quantity = 2,
        //        Price = 10.00m,
        //        CreatedAt = DateTime.UtcNow,
        //        UpdatedAt = DateTime.UtcNow
        //    },
        //    new OrderItems
        //    {
        //        OrderItemId = ObjectId.GenerateNewId().ToString(),
        //        OrderId = dummyOrders[1].OrderId,
        //        ProductId = "670015204e145f341a5a3abc",
        //        Quantity = 1,
        //        Price = 20.00m,
        //        CreatedAt = DateTime.UtcNow,
        //        UpdatedAt = DateTime.UtcNow
        //    },
        //    new OrderItems
        //    {
        //        OrderItemId = ObjectId.GenerateNewId().ToString(),
        //        OrderId = dummyOrders[2].OrderId,
        //        ProductId = "670015204e145f341a5a3abd",
        //        Quantity = 3,
        //        Price = 15.00m,
        //        CreatedAt = DateTime.UtcNow,
        //        UpdatedAt = DateTime.UtcNow
        //    },
        //    new OrderItems
        //    {
        //        OrderItemId = ObjectId.GenerateNewId().ToString(),
        //        OrderId = dummyOrders[3].OrderId,
        //        ProductId = "670015214e145f341a5a3abe",
        //        Quantity = 5,
        //        Price = 5.00m,
        //        CreatedAt = DateTime.UtcNow,
        //        UpdatedAt = DateTime.UtcNow
        //    }
        //};

        //        await _mongoContext.Orders.InsertManyAsync(dummyOrders);
        //        await _mongoContext.OrderItems.InsertManyAsync(dummyOrderItems);

        //        return Ok("Dummy orders and order items added successfully.");
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new
        //        {
        //            status = "NOK",
        //            message = $"An error occurred while adding dummy orders and order items: {ex.Message}"
        //        });
        //    }
        //}



    }
}