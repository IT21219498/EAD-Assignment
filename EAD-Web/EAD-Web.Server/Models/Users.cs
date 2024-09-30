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

