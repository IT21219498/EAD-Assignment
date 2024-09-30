using MongoDB.Bson;

namespace EAD_Web.Server.Models
{
    public class Vendor
    {
        public ObjectId Id { get; set; }
        public string vendorName { get; set; }
        public string address { get; set; }
        public string contactName { get; set; }
        public string contactNo { get; set; }
        public string email { get; set; }
        public string category { get; set; }

    }
}
