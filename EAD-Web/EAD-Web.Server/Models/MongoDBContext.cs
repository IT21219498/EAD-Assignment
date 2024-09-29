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
        
        
    }
}
