/*
 * File: OredrController.cs
 * Description: Controller for managing create, update and manage customer orders. 
 * Author: Mallawaarachchi D. E. H. - IT21209420
 */
using EAD_Web.Server.Models;
using MongoDB.Driver;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using System;
using EAD_Web.Server.DTOs;

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
                                product = new { 
                                name = product.Name,
                                id = product.Id,
                                price = product.Price
                                },
                                
                                quantity = orderItem.Quantity,
                                price = orderItem.Price,
                                orderItemId = orderItem.OrderItemId
                            });
                        }
                    }

                    orderResponse.Add(new
                    {
                        id = order.OrderId.ToString(),
                        invoiceNo = order.InvoiceNo,
                        customer = new
                        {
                            email = user?.Email ?? "N/A",
                            id = user?.CustomerId.ToString(),
                            name = user?.FullName
                        },
                        status = order.Status,
                        address = order.Address,
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
        // Get maximum invoice number
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
                    data = (int)maxInvoiceNo + 1
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
        // Get all customers
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
                       id = customer.CustomerId.ToString(),
                       email = customer?.Email ?? "N/A",

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
        // Get all products
        [HttpGet("products")]
        public async Task<ActionResult> GetAllProducts()
        {
            try
            {
                var products = await _mongoContext.Products.Find(_ => true).ToListAsync();
                var productsResponse = new List<object>();

                foreach (var product in products)
                {
                    var stock = await _mongoContext.Stock.Find((s) => s.ProductId == product.Id).FirstOrDefaultAsync();

                    if (stock == null)
                        continue;

                    productsResponse.Add(new
                    {
                        name = product.Name,
                        id = product.Id.ToString(),
                        price = product?.Price,
                        stock = stock.Quantity,


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
        //Save customer order
        [HttpPost("saveOrder")]
        public async Task<ActionResult> SaveOrder([FromBody] SaveOrderDTO orderRequest)
        {
            try
            {
                // Create a new order
                var newOrder = new Orders
                {
                    OrderId = ObjectId.GenerateNewId().ToString(),
                    InvoiceNo = orderRequest.InvoiceNo,
                    CustomerId = orderRequest.Customer.Id,
                    Status = orderRequest.Status,
                    OrderDate = orderRequest.OrderDate,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Address = orderRequest.Address
                };

                // Insert the new order into the Orders collection
                await _mongoContext.Orders.InsertOneAsync(newOrder);

                // Create and insert order items
                foreach (var item in orderRequest.OrderItems)
                {
                    var newOrderItem = new OrderItems
                    {
                        OrderItemId = ObjectId.GenerateNewId().ToString(),
                        OrderId = newOrder.OrderId,
                        ProductId = item.Product.Id,
                        Quantity = item.Quantity,
                        Price = item.Product.Price * item.Quantity,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    await _mongoContext.OrderItems.InsertOneAsync(newOrderItem);
                }

                return Ok(new
                {
                    status = "OK",
                    message = "Order saved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = "NOK",
                    message = "An error occurred while saving the order"
                });
            }
        }
        //Delete a customer order
        [HttpDelete("deleteOrder/{orderId}")]
        public async Task<ActionResult> DeleteOrder(string orderId)
        {
            try
            {
                var deleteOrderResult = await _mongoContext.Orders.DeleteOneAsync(o => o.OrderId == orderId);

                if (deleteOrderResult.DeletedCount == 0)
                {
                    return NotFound(new
                    {
                        status = "NOK",
                        message = "Order not found"
                    });
                }

                // Delete the associated order items
                await _mongoContext.OrderItems.DeleteManyAsync(oi => oi.OrderId == orderId);

                return Ok(new
                {
                    status = "OK",
                    message = "Order and associated order items deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = "NOK",
                    message = "An error occurred while deleting the order"
                });
            }

            
        }
        //Update a customer order
        [HttpPut("updateOrder/{orderId}")]
        public async Task<ActionResult> UpdateOrder(string orderId, [FromBody] SaveOrderDTO orderRequest)
        {
            try
            {
                var filter = Builders<Orders>.Filter.Eq(o => o.OrderId, orderId);
            var update = Builders<Orders>.Update
                .Set(o => o.InvoiceNo, orderRequest.InvoiceNo)
                .Set(o => o.CustomerId, orderRequest.Customer.Id)
                .Set(o => o.Status, orderRequest.Status)
                .Set(o => o.OrderDate, orderRequest.OrderDate)
                .Set(o => o.Address, orderRequest.Address)
                .Set(o => o.UpdatedAt, DateTime.UtcNow);

            var result = await _mongoContext.Orders.UpdateOneAsync(filter, update);

            if (result.ModifiedCount == 0)
            {
                return NotFound(new { Message = "Order not found or no changes detected." });
            }

            // Update order items
            foreach (var item in orderRequest.OrderItems)
            {
                var orderItemFilter = Builders<OrderItems>.Filter.Eq(oi => oi.OrderItemId, item.OrderItemId);

                    if (item.OrderItemId == null)
                    {
                        var newOrderItem = new OrderItems
                        {
                            OrderItemId = ObjectId.GenerateNewId().ToString(),
                            OrderId = orderId,
                            ProductId = item.Product.Id,
                            Quantity = item.Quantity,
                            Price = item.Product.Price,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };

                        await _mongoContext.OrderItems.InsertOneAsync(newOrderItem);
                        continue;
                    }

                    var orderItemUpdate = Builders<OrderItems>.Update
                    .Set(oi => oi.Quantity, item.Quantity)
                    .Set(oi => oi.Price, item.Product.Price * item.Quantity)
                    .Set(oi => oi.ProductId, item.Product.Id)
                    .Set(oi => oi.UpdatedAt, DateTime.UtcNow);

                await _mongoContext.OrderItems.UpdateOneAsync(orderItemFilter, orderItemUpdate);
            }

                return Ok(new
                {
                    status = "OK",
                    message = "Order updated successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = "NOK",
                    message = $"An error occurred while updating order"
                });
            }
        }
        //Get all order items by order id
        [HttpGet("vendor/{vendorId}/new")]
        public async Task<IActionResult> GetNewOrderItemsByVendorId(string vendorId)
        {
            try
            {
                var orderItems = await _mongoContext.OrderItems
                    .Find(oi => oi.VendorId == vendorId && oi.Status == "Paid" )
                    .ToListAsync();
           
                var response = new List<object>();

                foreach (var orderItem in orderItems)
                {
                    var order = await _mongoContext.Orders.Find(o => o.OrderId == orderItem.OrderId).FirstOrDefaultAsync();
                    if (order == null || order.Status == "Cancelled")
                    {
                        continue;
                    }
                 
                    var product = await _mongoContext.Products.Find(p => p.Id == orderItem.ProductId).FirstOrDefaultAsync();
                    if (product == null)
                        continue;
                    var stock = await _mongoContext.Stock.Find(s => s.ProductId == product.Id).FirstOrDefaultAsync();
                    
                    if (stock == null )
                    {
                        continue;
                    }
                    var customer = await _mongoContext.Customers.Find(c => c.CustomerId.ToString() == order.CustomerId).FirstOrDefaultAsync();
                    if (customer == null)
                        continue;
                    if (order != null && product != null)
                    {
                        response.Add(new
                        {
                            Id = orderItem.OrderItemId,
                            InvoiceNo = order.InvoiceNo,
                            CusEmail = customer?.Email,
                            CusAddress = order.Address,
                            OrderDate = order.OrderDate.Date.ToString("yyyy-MM-dd"),
                            ProductName = product.Name,
                            Quantity = orderItem.Quantity,
                            StockAvailable = stock?.Quantity ?? 0,
                            Status = orderItem.Status
                        });
                    }
                }

                return Ok(new
                {
                    status = "OK",
                    data = response
                });
            }

            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = "NOK",
                    message = "An error occurred while fetching order items"
                });
            }
        }

        [HttpPut("setOrderItemStatus/{orderItemId}/{status}")]
        public async Task<IActionResult> SetOrderItemStatus(string orderItemId, string status)
        {
            using var session = _mongoContext.StartSession();
            session.StartTransaction();

            try
            {
                // Update the status of the order item
                var filter = Builders<OrderItems>.Filter.Eq(oi => oi.OrderItemId, orderItemId);
                var update = Builders<OrderItems>.Update
                    .Set(oi => oi.Status, status)
                    .Set(oi => oi.UpdatedAt, DateTime.UtcNow);

                var updateResult = await _mongoContext.OrderItems.UpdateOneAsync(filter, update);

                if (updateResult.ModifiedCount == 0)
                {
                    await session.AbortTransactionAsync();
                    return NotFound(new { status = "NOK", message = "Order item not found" });
                }

                // Get the order item to find the associated order
                var orderItem = await _mongoContext.OrderItems.Find(filter).FirstOrDefaultAsync();
                if (orderItem == null)
                {
                    await session.AbortTransactionAsync();
                    return NotFound(new { status = "NOK", message = "Order item not found" });
                }

                // Check if all order items for the order are "Ready"
                var orderItems = await _mongoContext.OrderItems.Find(oi => oi.OrderId == orderItem.OrderId).ToListAsync();
                var allReady = orderItems.All(oi => oi.Status == "Ready");

                // Update the order status based on the order items status
                var orderStatus = allReady ? "Delivered" : "Partially Delivered";
                var orderFilter = Builders<Orders>.Filter.Eq(o => o.OrderId, orderItem.OrderId);
                var orderUpdate = Builders<Orders>.Update
                    .Set(o => o.Status, orderStatus)
                    .Set(o => o.UpdatedAt, DateTime.UtcNow);

                await _mongoContext.Orders.UpdateOneAsync(orderFilter, orderUpdate);

                // Update the stock if the order item is delivered

                var productFilter = Builders<Stock>.Filter.Eq(s => s.ProductId, orderItem.ProductId);
                var productUpdate = Builders<Stock>.Update.Inc(s => s.Quantity, -orderItem.Quantity);
                await _mongoContext.Stock.UpdateOneAsync(productFilter, productUpdate);


                await session.CommitTransactionAsync();

                return Ok(new { status = "OK", message = "Order item status updated successfully" });
            }
            catch (Exception ex)
            {
                await session.AbortTransactionAsync();
                return BadRequest(new { status = "NOK", message = $"An error occurred: {ex.Message}" });
            }
        }

        //Get all order cancel requests

        [HttpGet("orderCancelRequests")]
        public async Task<ActionResult> GetAllOrderCancelRequests()
        {
            try
            {
                var orderCancelRequests = await _mongoContext.OrderCancelsRequests.Find((o) => o.IsClosed == false).ToListAsync();
                var orderCancelRequestsResponse = new List<object>();

                foreach (var orderCancelRequest in orderCancelRequests)
                {
                    var order = await _mongoContext.Orders.Find(o => o.OrderId == orderCancelRequest.OrderId).FirstOrDefaultAsync();
                    if (order == null || order.Status != "Processing")
                    {
                        continue;
                    }

                    var customer = await _mongoContext.Customers.Find(c => c.CustomerId.ToString() == order.CustomerId).FirstOrDefaultAsync();
                    if (customer == null)
                    {
                      
                        continue;
                    }

                    orderCancelRequestsResponse.Add(new
                    {
                        id = orderCancelRequest.Id,
                        orderId = order.OrderId,
                        invoiceNo = order.InvoiceNo,
                        cusEmail = customer.Email,
                        cusName = customer.FullName,
                        comment = orderCancelRequest.Comment,
                        createdAt = orderCancelRequest.CreatedAt.Date.ToString("yyyy-MM-dd"),
                    });
                }

                return Ok(new
                {
                    status = "OK",
                    data = orderCancelRequestsResponse
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = "NOK",
                    message = $"An error occurred while fetching order cancel requests: {ex.Message}"
                });
            }
        }
        //Update a cancel request
        [HttpPut("updateCancelRequests/{requestId}")]
        public async Task<ActionResult> UpdateCancelRequests(string requestId, [FromBody] bool isApproved)
        {
            using var session = _mongoContext.StartSession();
            session.StartTransaction();
        
            try
            {
                // Find the cancel request by requestId
                var cancelRequest = await _mongoContext.OrderCancelsRequests
                    .Find(cr => cr.Id == requestId)
                    .FirstOrDefaultAsync();
        
                if (cancelRequest == null)
                {
                    await session.AbortTransactionAsync();
                    return NotFound(new { status = "NOK", message = "Cancel request not found" });
                }
        
                // Update the cancel request status to isClosed: true
                var cancelRequestFilter = Builders<OrderCancelsRequests>.Filter.Eq(cr => cr.Id, requestId);
                var cancelRequestUpdate = Builders<OrderCancelsRequests>.Update
                    .Set(cr => cr.IsClosed, true)
                    .Set(cr => cr.UpdatedAt, DateTime.UtcNow);
        
                var cancelRequestResult = await _mongoContext.OrderCancelsRequests.UpdateOneAsync(cancelRequestFilter, cancelRequestUpdate);
        
                if (cancelRequestResult.ModifiedCount == 0)
                {
                    await session.AbortTransactionAsync();
                    return NotFound(new { status = "NOK", message = "Cancel request not found or no changes detected" });
                }
        
                // If isApproved is true, update the order status to Cancelled
                if (isApproved)
                {
                    var orderFilter = Builders<Orders>.Filter.Eq(o => o.OrderId, cancelRequest.OrderId);
                    var orderUpdate = Builders<Orders>.Update
                        .Set(o => o.Status, "Cancelled")
                        .Set(o => o.UpdatedAt, DateTime.UtcNow);
        
                    var orderResult = await _mongoContext.Orders.UpdateOneAsync(orderFilter, orderUpdate);
        
                    if (orderResult.ModifiedCount == 0)
                    {
                        await session.AbortTransactionAsync();
                        return NotFound(new { status = "NOK", message = "Order not found or no changes detected" });
                    }
                }
        
                await session.CommitTransactionAsync();
        
                return Ok(new { status = "OK", message = "Cancel request updated successfully" });
            }
            catch (Exception ex)
            {
                await session.AbortTransactionAsync();
                return BadRequest(new { status = "NOK", message = $"An error occurred: {ex.Message}" });
            }
        }

        // [HttpPost("addDummyOrders")]
        // public async Task<ActionResult> AddDummyOrders()
        // {
        //     try
        //     {
        //         var dummyOrders = new List<Orders>
        // {
        //     new Orders
        //     {
        //         OrderId = ObjectId.GenerateNewId().ToString(),
        //         InvoiceNo = 1001,
        //         CustomerId = "670181d28c096894a6fbf5b5",
        //         Status = "Processing",
        //         OrderDate = DateTime.UtcNow,
        //         Address = "123 Main St, New York, NY 10001",
        //         IsPaid = false,
        //         CreatedAt = DateTime.UtcNow,
        //         UpdatedAt = DateTime.UtcNow
        //     },
        //     new Orders
        //     {
        //         OrderId = ObjectId.GenerateNewId().ToString(),
        //         InvoiceNo = 1002,
        //         CustomerId = "6701826d8c096894a6fbf5b6",
        //         Status = "Dispatched",
        //         OrderDate = DateTime.UtcNow,
        //         Address = "456 Elm St, New York, NY 10002",
        //         IsPaid = true,
        //         CreatedAt = DateTime.UtcNow,
        //         UpdatedAt = DateTime.UtcNow
        //     },
        //     new Orders
        //     {
        //         OrderId = ObjectId.GenerateNewId().ToString(),
        //         InvoiceNo = 1003,
        //         CustomerId = "67019d664866a73d2cad6813",
        //         Status = "Delivered",
        //         OrderDate = DateTime.UtcNow,
        //         Address = "123 Main St, New York, NY 10003",
        //         IsPaid = true,
        //         CreatedAt = DateTime.UtcNow,
        //         UpdatedAt = DateTime.UtcNow
        //     },
        //     new Orders
        //     {
        //         OrderId = ObjectId.GenerateNewId().ToString(),
        //         InvoiceNo = 1004,
        //         CustomerId = "67021fabc55fc721fc3ee20e",
        //         Status = "Cancelled",
        //         OrderDate = DateTime.UtcNow,
        //         Address = "456 Elm St, New York, NY 10004",
        //         IsPaid = false,
        //         CreatedAt = DateTime.UtcNow,
        //         UpdatedAt = DateTime.UtcNow
        //     }
        // };

        //         var dummyOrderItems = new List<OrderItems>
        // {
        //     new OrderItems
        //     {
        //         OrderItemId = ObjectId.GenerateNewId().ToString(),
        //         OrderId = dummyOrders[0].OrderId,
        //         ProductId = "66fc3fc02c116c3d054f1c89",
        //         VendorId = "66fc3606342696db9557e652",
        //         Status =  "New",
        //         Quantity = 2,
        //         Price = 10.00m,
        //         CreatedAt = DateTime.UtcNow,
        //         UpdatedAt = DateTime.UtcNow
        //     },
        //     new OrderItems
        //     {
        //         OrderItemId = ObjectId.GenerateNewId().ToString(),
        //         OrderId = dummyOrders[1].OrderId,
        //         ProductId = "670015204e145f341a5a3abc",
        //         VendorId = "66fc3613342696db9557e654",
        //         Status =  "New",
        //         Quantity = 1,
        //         Price = 20.00m,
        //         CreatedAt = DateTime.UtcNow,
        //         UpdatedAt = DateTime.UtcNow
        //     },
        //     new OrderItems
        //     {
        //         OrderItemId = ObjectId.GenerateNewId().ToString(),
        //         OrderId = dummyOrders[2].OrderId,
        //         ProductId = "670015204e145f341a5a3abd",
        //         VendorId = "670178ecdc5a517b902aeb85",
        //         Status =  "Ready",
        //         Quantity = 3,
        //         Price = 15.00m,
        //         CreatedAt = DateTime.UtcNow,
        //         UpdatedAt = DateTime.UtcNow
        //     },
        //     new OrderItems
        //     {
        //         OrderItemId = ObjectId.GenerateNewId().ToString(),
        //         OrderId = dummyOrders[3].OrderId,
        //         ProductId = "670015214e145f341a5a3abe",
        //         VendorId = "6701928dd7649408388be35d",
        //         Status = "Cancelled",
        //         Quantity = 5,
        //         Price = 5.00m,
        //         CreatedAt = DateTime.UtcNow,
        //         UpdatedAt = DateTime.UtcNow
        //     }
        // };

        //         await _mongoContext.Orders.InsertManyAsync(dummyOrders);
        //         await _mongoContext.OrderItems.InsertManyAsync(dummyOrderItems);

        //         return Ok("Dummy orders and order items added successfully.");
        //     }
        //     catch (Exception ex)
        //     {
        //         return BadRequest(new
        //         {
        //             status = "NOK",
        //             message = $"An error occurred while adding dummy orders and order items: {ex.Message}"
        //         });
        //     }
        // }
        // namespace EAD_Web.Server.Models
        // {
        //     public class OrderCancelsRequests
        //     {
        //         [BsonId]
        //         [BsonRepresentation(BsonType.ObjectId)]
        //         public string OrderId { get; set; }  // Unique identifier for the order

        //         [BsonElement("comment")]
        //         public string Comment { get; set; }  // Comment for the order cancellation]

        //         [BsonElement("createdAt")]
        //         [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        //         public DateTime CreatedAt { get; set; }  // Date the order was created

        //         [BsonElement("updatedAt")]
        //         [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        //         public DateTime UpdatedAt { get; set; }  // Date the order was last updated
        //     }
        // }
        //Add dummy cancel requests
        [HttpPost("dummyCancelRequests")]
        public async Task<ActionResult> AddDummyCancelRequests()
        {
            try
            {
                var dummyCancelRequests = new List<OrderCancelsRequests>
        {
            new OrderCancelsRequests
            {
                Id = ObjectId.GenerateNewId().ToString(),
                OrderId = "6704414ef279714bc49bdc9f",
                Comment = "Customer changed their mind",
                IsClosed = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new OrderCancelsRequests
            {
                 Id = ObjectId.GenerateNewId().ToString(),
                OrderId = "670447d6366fea5faa3b7767",
                Comment = "Customer found a better deal",
                IsClosed = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
         
        };

                await _mongoContext.OrderCancelsRequests.InsertManyAsync(dummyCancelRequests);

                return Ok("Dummy order cancel requests added successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = "NOK",
                    message = $"An error occurred while adding dummy order cancel requests: {ex.Message}"
                });
            }
        }




    }
}