using EAD_Web.Server.Models;
using MongoDB.Driver;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Identity;
using EAD_Web.Server.DTOs;

/*

namespace EAD_Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly MongoDBContext _mongoContext;

        public UserController(MongoDBContext mongoContext)
        {
            _mongoContext = mongoContext;
        }

        [HttpPost("users/dummy")]
        public async Task<ActionResult> AddDummyUsers()
        {
            var dummyUsers = new List<Users>
            {
                new Users
                {
                    Email = "user1@example.com",
                    Password = "password1",
                    Role = "Administrator",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Users
                {

                    Email = "user2@example.com",
                    Password = "password2",
                    Role = "Vendor",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Users
                {
              
                    Email = "user3@example.com",
                    Password = "password3",
                    Role = "CSR",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Users
                {
                 
                    Email = "user4@example.com",
                    Password = "password4",
                    Role = "Vendor",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Users
                {
                  
                    Email = "user5@example.com",
                    Password = "password5",
                    Role = "CSR",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            try
            {
                // Insert dummy users
                await _mongoContext.Users.InsertManyAsync(dummyUsers);

                return Ok("Dummy users added successfully");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
*/

namespace EAD_Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<Users> _userManager;

        public UserController(UserManager<Users> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDTO model)
        {
            var user = new Users
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName,
                PhoneNumber = model.PhoneNumber,
                Address = model.Address,
                IsActive = true,  // Default to active until disapproved
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Role = model.Role
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

//            await _userManager.AddToRoleAsync(user, model.Role);  // Assign the role

            return Ok("User registered successfully.");
        }
    }


}