using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace EAD_Web.Server.Models
{
    public class OrderItems
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string OrderItemId { get; set; }  // Unique identifier for each order item

        [BsonElement("orderId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string OrderId { get; set; }  // Foreign key linking to Orders collection, changed to string

        [BsonElement("productId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? ProductId { get; set; }  // Foreign key linking to the Products collection

        [BsonElement("quantity")]
        public int Quantity { get; set; }  // Number of items ordered

        [BsonElement("price")]
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Price { get; set; }  // Price of a single unit of the product

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; }  // Date when the order item was created

        [BsonElement("updatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; }  // Date when the order item was last updated
    }
}
