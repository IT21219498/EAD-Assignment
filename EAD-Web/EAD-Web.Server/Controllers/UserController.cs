/*
 * File: UserController.cs
 * Description: Controller for managing user authentication, registration, approval, and token validation.
 * Author: Jayasinghe P.T. - IT21234484
 */


using EAD_Web.Server.Models;
using MongoDB.Driver;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Identity;
using EAD_Web.Server.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MongoDB.Driver.Linq;



namespace EAD_Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<Users> _userManager;
        private readonly SignInManager<Users> _signInManager;
        private readonly IConfiguration _configuration;


        public UserController(UserManager<Users> userManager, SignInManager<Users> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }


        
        // Summary - Handles user login by validating credentials and issuing a JWT token.
        // <param name="model">User login data transfer object containing email and password.
        // Returns user ID, role, and JWT token if successful; otherwise, an unauthorized response.
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized("Invalid login attempt.");
            }

            var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, false, false);

            if (!result.Succeeded)
            {
                return Unauthorized("Invalid login attempt.");
            }

            var token = GenerateJwtToken(user);

            // Return userId, role, and the generated JWT token
            return Ok(new
            {
                userId = user.Id.ToString(),  // Convert ObjectId or Guid to string
                role = user.Role,
                token
            });
        }


        
        // Summary-Generates a JWT token for the authenticated user.
        // <param name="user">The authenticated user.</param>
        // Returns A JWT token as a string.
        private string GenerateJwtToken(Users user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:SecretKey"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),  // Convert ObjectId to string
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }



        // Summary-Registers a new user with the provided details.
        // <param name="model">User registration data transfer object containing user details and password.</param>
        // Returns a success message or error details based on the registration outcome.
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
                IsActive = model.Role == "CSR",  // Automatically active for CSR, inactive for Vendor
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Role = model.Role
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Custom message based on the role, returned as a JSON object
            if (model.Role == "Vendor")
            {
                return Ok(new { message = "Account is pending approval." });
            }

            return Ok(new { message = "User registered successfully." });
        }

         
        // Summary-Retrieves a list of users pending approval.
        // Returns a list of inactive users awaiting approval.
        [HttpGet("pending-approvals")]
        public async Task<IActionResult> GetPendingApprovals()
        {
            // Cast to IMongoQueryable to use MongoDB-specific async methods
            var pendingUsers = await ((IMongoQueryable<Users>)_userManager.Users)
                                     .Where(u => !u.IsActive)
                                     .ToListAsync();

            return Ok(pendingUsers);
        }

        
        // Summary-Approves a user by activating their account.
        // <param name="userId">The ID of the user to approve.</param>
        // Returns a success message if approval is successful; otherwise, an error response.
        [HttpPost("approve/{userId}")]
        public async Task<IActionResult> ApproveUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if(user == null)
            {
                return NotFound("User not found");
            }

            user.IsActive = true;
            user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("User approved successfully.");
        }

        
        // Summary-Checks the validity of the JWT token and retrieves user details.
        // Returns user details if the token is valid; otherwise, an error response.
        [HttpGet("chk")]
        public IActionResult CheckToken()
        {
            try
            {
                // Get the user ID from the claims (JWT token is already validated via middleware)
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("Invalid token or user ID not found.");
                }

                // Fetch the user details (optional: you could also return limited user data)
                var user = _userManager.FindByIdAsync(userId).Result;

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Return the user's details
                return Ok(new
                {
                    userId = user.Id.ToString(),
                    user.Email,
                    user.FullName,
                    user.Role,
                    user.IsActive,
                    user.CreatedAt,
                    user.UpdatedAt
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        //function to logout the user
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // Sign out the user and clear the authentication cookie
            await _signInManager.SignOutAsync();

            // Optionally return a success message
            return Ok(new { message = "Logout successful" });
        }




    }


}