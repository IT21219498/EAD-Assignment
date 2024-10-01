using EAD_Web.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace EAD_Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VendorController : ControllerBase
    {
        private readonly MongoDBContext _mongoContext;

        public VendorController(MongoDBContext mongoContext)
        {
            _mongoContext = mongoContext;
        }
    }
}
