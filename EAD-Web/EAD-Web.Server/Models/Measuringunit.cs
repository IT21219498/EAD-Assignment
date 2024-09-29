using MongoDB.Bson;

namespace EAD_Web.Server.Models
{
    public class Measuringunit
    {
        public ObjectId Id { get; set; }
        public string Unit { get; set; }
        public double ConversionFactor { get; set; }
        public bool IsActive { get; set; }
    }
}