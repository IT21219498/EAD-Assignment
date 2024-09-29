using MongoDB.Bson;

namespace EAD_Web.Server.Models
{
    public class Category
    {
        public ObjectId Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
    }
}