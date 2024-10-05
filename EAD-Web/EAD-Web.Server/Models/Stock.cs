using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace EAD_Web.Server.Models
{
    public class Stock
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [Required]
        [BsonElement("productId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ProductId { get; set; }

        [Required]
        [BsonElement("quantity")]
        public int Quantity { get; set; }

        // [BsonElement("warehouseLocation")]
        // public string WarehouseLocation { get; set; }

        [BsonElement("lastUpdated")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime LastUpdated { get; set; } = DateTime.Now;

        [BsonElement("isActive")]
        [BsonDefaultValue(true)]
        public bool IsActive { get; set; } = true;
    }
}