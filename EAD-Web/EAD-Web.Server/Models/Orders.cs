﻿/*
 * File: Orders.cs
 * Description: Model for Orders.
 * Author: Mallawaarachchi D. E. H. - IT21209420
 */
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace EAD_Web.Server.Models
{
    public class Orders
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string OrderId { get; set; }  // Unique identifier for the order

        [BsonElement("invoiceNo")]
        public int InvoiceNo { get;set; }

        [BsonElement("customerId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? CustomerId { get; set; }  // Unique ID for the associated Order Item

        [BsonElement("status")]
        public string? Status { get; set; }  // Order status, e.g., "Processing", "Delivered", "Cancelled"

        [BsonElement("orderDate")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime OrderDate { get; set; }  // Date the order was created

        [BsonElement("address")]
        public string? Address { get; set; }  

        [BsonElement("isPaid")]
        public bool IsPaid { get; set; } 

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; }  // Date the order was created

        [BsonElement("updatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; }  // Date the order was last updated
    }
}
