/*
 * File: VendorRating.cs
 * Description: Model for vendor ratings.
 * Author: Illesinghe A. T. - IT21286278
 */
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EAD_Web.Server.Models
{
    public class VendorRating
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string VendorId { get; set; }
        //public string CustomerId { get; set; }
        public decimal Rating { get; set; }
        public string Comment { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime CreatedAt { get; set; } = DateTime.Now;  // Automatically set to current date-time
    }
}
