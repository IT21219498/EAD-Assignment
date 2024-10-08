/*
 * File: VendorRating.cs
 * Description: Model for vendor ratings.
 * Author: Illesinghe A. T. - IT21286278
 */
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
    }
}
