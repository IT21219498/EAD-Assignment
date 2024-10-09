/*
 * File: Customer.cs
 * Description: Model representing a customer in the system, with fields for customer information such as Full Name, Email, Phone Number, Address, and activation status.
 * Author: Jayasinghe P.T. - IT21234484
 */

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace EAD_Web.Server.Models
{
    // The Customer class represents a customer with various properties for personal and account details

    public class Customer
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId CustomerId { get; set; }

        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string PasswordHash { get; set; }
        public bool HasBeenActivated { get; set; }

        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
