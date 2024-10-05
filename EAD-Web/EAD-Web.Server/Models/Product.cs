using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace EAD_Web.Server.Models
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [Required]
        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }

        [Required]
        [BsonElement("code")]
        public string Code { get; set; }

        [BsonElement("isActive")]
        [BsonDefaultValue(true)]
        public bool IsActive { get; set; } = true;

        [BsonElement("categoryId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string CategoryId { get; set; }

        [BsonElement("measurementUnitId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string MeasurementUnitId { get; set; }

        [BsonElement("itemPerCase")]
        public int ItemPerCase { get; set; }

        [BsonElement("supplierId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string SupplierId { get; set; }

        [BsonElement("imageUrl")]
        public string ImageUrl { get; set; }

        [BsonElement("price")]
        public double Price { get; set; }

        [BsonElement("cost")]
        public double Cost { get; set; }

        [BsonElement("reorderLevel")]
        public int ReorderLevel { get; set; }
    }
}