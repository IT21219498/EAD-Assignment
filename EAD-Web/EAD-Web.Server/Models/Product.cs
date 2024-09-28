using MongoDB.Bson;

namespace EAD_Web.Server.Models
{
    public class Product
    {
        public ObjectId Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Code { get; set; }
        public bool IsActive { get; set; }
        public int CategoryId { get; set; }
        public int MeasurementUnitId { get; set; }
        public int ItemPerCase { get; set; }
        public int SupplierId { get; set; }
        public string ImageUrl { get; set; }
        public double Price { get; set; }
        public double Cost { get; set; }
        public int ReorderLevel { get; set; }

    }
}