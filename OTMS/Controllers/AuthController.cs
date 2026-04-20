using Microsoft.AspNetCore.Mvc;
using OTMS.DTOs;
using OTMS.Interfaces;
using OTMS.Models;

namespace OTMS.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // POST api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User_LoginDTO request)
    {
        if (request is null || request.UserId <= 0 || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { success = false, message = "User ID and password are required." });

        var result = await _authService.LoginAsync(request);

        if (result is null)
            return Unauthorized(new { success = false, message = "Invalid user ID or password." });

        return Ok(new { success = true, message = "Login successful.", data = result });
    }

    // POST api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User_RegisterDTO request)
    {
        if (request is null)
            return BadRequest(new { success = false, message = "Invalid request." });

        var result = await _authService.RegisterAsync(request);

        if (result is null)
            return BadRequest(new { success = false, message = "Employee with this contact number already exists." });

        return Ok(new { success = true, message = "Employee registered successfully.", data = result });
    }

    // POST api/auth/refresh-token
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDTO request)
    {
        if (request is null)
            return BadRequest(new { success = false, message = "Invalid request." });

        var result = await _authService.RefreshTokensAsync(request);

        if (result is null)
            return Unauthorized(new { success = false, message = "Invalid or expired refresh token." });

        return Ok(new { success = true, data = result });
    }
}