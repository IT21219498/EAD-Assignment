/*
 * File: Users.cs
 * Description: Model for Users that extends MongoIdentityUser, including additional fields for user details such as Role, FullName, Address, IsActive status, and timestamps.
 * Author: Jayasinghe P.T. - IT21234484
 */

using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDbGenericRepository.Attributes;

namespace EAD_Web.Server.Models
{

    // The Users class extends MongoIdentityUser and uses ObjectId as the identifier type

    public class Users : MongoIdentityUser<ObjectId>
    {

        [BsonRepresentation(BsonType.ObjectId)]
        public override ObjectId Id { get; set; }  // Override Id to use ObjectId

        public string Role { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

