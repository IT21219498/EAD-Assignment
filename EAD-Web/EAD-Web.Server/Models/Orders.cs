using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace EAD_Web.Server.Models
{
    public class Orders
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId OrderId { get; set; }  // Unique identifier for the order

        [BsonElement("invoiceNo")]
        public int InvoiceNo { get;set; }

        [BsonElement("customerId")]
        public Guid CustomerId { get; set; }  // Unique ID for the associated Order Item

        [BsonElement("status")]
        public string Status { get; set; }  // Order status, e.g., "Processing", "Delivered", "Cancelled"

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; }  // Date the order was created

        [BsonElement("updatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; }  // Date the order was last updated
    }
}
