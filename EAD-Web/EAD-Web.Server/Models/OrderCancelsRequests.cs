using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace EAD_Web.Server.Models
{
    public class OrderCancelsRequests
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }  // Unique identifier for the order cancellation request

        [BsonElement("orderId")]
        public string OrderId { get; set; }  // Unique identifier for the order

        [BsonElement("comment")]
        public string Comment { get; set; }  // Comment for the order cancellation]

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; }  // Date the order cancellation request was created
        [BsonElement("isClosed")]
        public bool IsClosed { get; set; }  // Whether the order cancellation request has been closed

        [BsonElement("updatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; }  // Date the order cancellation request was last updated
    }
}
