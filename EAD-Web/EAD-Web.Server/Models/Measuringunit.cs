using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace EAD_Web.Server.Models
{
    public class Measuringunit
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [Required]
        [BsonElement("unit")]
        public string Unit { get; set; }

        [BsonElement("conversionFactor")]
        public double ConversionFactor { get; set; }

        [BsonElement("isActive")]
        [BsonDefaultValue(true)]
        public bool IsActive { get; set; } = true;
    }
}