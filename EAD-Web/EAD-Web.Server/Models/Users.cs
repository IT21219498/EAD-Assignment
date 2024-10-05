/*
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace EAD_Web.Server.Models
{
    public class Users
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId UserId { get; set; }

        [BsonElement("email")]
        [BsonRepresentation(BsonType.String)]
        public string Email { get; set; }

        [BsonElement("password")]
        [BsonRepresentation(BsonType.String)]
        public string Password { get; set; }

        [BsonElement("role")]
        [BsonRepresentation(BsonType.String)]
        public string Role { get; set; }

        [BsonElement("isActive")]
        [BsonRepresentation(BsonType.Boolean)]
        public bool IsActive { get; set; }

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; }
    }
}

*/

using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson.Serialization.Attributes;
using MongoDbGenericRepository.Attributes;

namespace EAD_Web.Server.Models
{


    public class Users : MongoIdentityUser<Guid>
    {


        public string Role { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

