using MongoDB.Driver;
using Microsoft.Extensions.Options;

namespace EAD_Web.Server.Models
{
    public class MongoDBContext
    {
        private readonly IMongoDatabase _database;

        public MongoDBContext(IOptions<MongoDBSettings> settings, IMongoClient client)
        {
            _database = client.GetDatabase(settings.Value.DatabaseName);
        }

        // Create a collection for each type of entity you are working with.
        public IMongoCollection<Product> Products => _database.GetCollection<Product>("Products");
        public IMongoCollection<Measuringunit> Measuringunits => _database.GetCollection<Measuringunit>("Measuringunits");
        public IMongoCollection<Category> Categories => _database.GetCollection<Category>("Categories");
        public IMongoCollection<Orders> Orders => _database.GetCollection<Orders>("Orders");
        public IMongoCollection<OrderItems> OrderItems => _database.GetCollection<OrderItems>("OrderItems");
        public IMongoCollection<Users> Users => _database.GetCollection<Users>("Users");
        public IMongoCollection<Vendor> Vendors => _database.GetCollection<Vendor>("Vendors");
    }
}
