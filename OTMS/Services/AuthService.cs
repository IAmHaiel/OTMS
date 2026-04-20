using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OTMS.Data;
using OTMS.DTOs;
using OTMS.Interfaces;
using OTMS.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace OTMS.Services;

public class AuthService : IAuthService
{
    private readonly IConfiguration _config;
    private readonly ApplicationDbContext _context;

    public AuthService(IConfiguration config, ApplicationDbContext context)
    {
        _config = config;
        _context = context;
    }

    // ── LOGIN ────────────────────────────────────────────────────────────────
    public async Task<TokenResponseDTO?> LoginAsync(User_LoginDTO request)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.UserId == request.UserId);

        if (employee is null)
            return null;

        if (new PasswordHasher<Employee>()
            .VerifyHashedPassword(employee, employee.PasswordHash, request.Password)
            == PasswordVerificationResult.Failed)
            return null;

        return await CreateTokenResponse(employee);
    }

    // ── REGISTER ─────────────────────────────────────────────────────────────
    public async Task<Employee?> RegisterAsync(User_RegisterDTO request)
    {
        if (await _context.Employees.AnyAsync(e => e.ContactNo == request.ContactNo))
            return null;

        var employee = new Employee();
        employee.Firstname = request.Firstname;
        employee.Lastname = request.Lastname;
        employee.ContactNo = request.ContactNo;
        employee.Role = request.Role;
        employee.PasswordHash = new PasswordHasher<Employee>()
            .HashPassword(employee, request.Password);

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return employee;
    }

    // ── REFRESH TOKEN ─────────────────────────────────────────────────────────
    public async Task<TokenResponseDTO?> RefreshTokensAsync(RefreshTokenRequestDTO request)
    {
        var employee = await ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);

        if (employee is null)
            return null;

        return await CreateTokenResponse(employee);
    }

    // ── PRIVATE HELPERS ───────────────────────────────────────────────────────
    private async Task<TokenResponseDTO> CreateTokenResponse(Employee employee)
    {
        return new TokenResponseDTO
        {
            AccessToken = CreateToken(employee),
            RefreshToken = await GenerateAndSaveRefreshTokenAsync(employee)
        };
    }

    private async Task<Employee?> ValidateRefreshTokenAsync(int userId, string refreshToken)
    {
        var employee = await _context.Employees.FindAsync(userId);

        if (employee is null ||
            employee.RefreshToken != refreshToken ||
            employee.RefreshTokenExpiryDate <= DateTime.UtcNow)
            return null;

        return employee;
    }

    private async Task<string> GenerateAndSaveRefreshTokenAsync(Employee employee)
    {
        var refreshToken = GenerateRefreshToken();
        employee.RefreshToken = refreshToken;
        employee.RefreshTokenExpiryDate = DateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync();
        return refreshToken;
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private string CreateToken(Employee employee)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, employee.UserId.ToString()),
            new Claim(ClaimTypes.Name, $"{employee.Firstname} {employee.Lastname}"),
            new Claim(ClaimTypes.Role, employee.Role.ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config.GetValue<string>("AppSettings:Token")!));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var token = new JwtSecurityToken(
            issuer: _config.GetValue<string>("AppSettings:Issuer"),
            audience: _config.GetValue<string>("AppSettings:Audience"),
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}