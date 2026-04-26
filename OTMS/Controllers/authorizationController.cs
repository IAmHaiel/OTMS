using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OTMS.Entities.DTOs;
using OTMS.Entities.Models;
using OTMS.Service.Interfaces;
using OTMS.Service.Services;

namespace OTMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class authorizationController(IAuthService authService) : ControllerBase
    {
        // Secured APIs
        [Authorize]
        [HttpGet]
        public IActionResult AuthenticatedOnlyEndpoint()
        {
            return Ok("You are authenticated");
        }

        // Role-Based Access
        // Changing the Roles to a string array to allow multiple roles
        [Authorize(Roles = "Admin")]
        [HttpGet("admin-only")]
        public IActionResult AdminOnlyEndpoint()
        {
            return Ok("You are admin!");
        }

        // Regsiter Account only accessible and used by SuperAdmin
        [Authorize(Roles = "SuperAdmin")]
        [HttpPost("superadmin/register")]
        public async Task<ActionResult<Employee>> Register(EmployeeRegisterDTO request)
        {
            var user = await authService.RegisterAsync(request);
            if (user is null)
            {
                return BadRequest("Employee Number already exists.");
            }

            return Ok(user);
        }
    }
}