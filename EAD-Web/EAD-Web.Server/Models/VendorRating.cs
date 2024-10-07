using MongoDB.Bson;

namespace EAD_Web.Server.Models
{
    public class VendorRating
    {
        public ObjectId Id { get; set; }
        public string VendorId { get; set; }
        public string CustomerId { get; set; }
        public decimal Rating { get; set; }
        public string Comment { get; set; }
        public string? CreatedAt { get; set; }
    }
}
