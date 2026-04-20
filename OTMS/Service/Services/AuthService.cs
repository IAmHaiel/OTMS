using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OTMS.Data;
using OTMS.Entities.DTOs;
using OTMS.Entities.Models;
using OTMS.Service.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace OTMS.Service.Services
{
    public class AuthService(OTMSDbContext context, IConfiguration configuration) : IAuthService
    {

        public async Task<TokenResponseDTO?> LoginAsync(EmployeeLoginDTO request)
        {
            var employee = await context.Employees.FirstOrDefaultAsync(u => u.EmployeeNumber == request.EmployeeNumber);

            if (employee is null)
            {
                return null;
            }
            if (new PasswordHasher<Employee>().VerifyHashedPassword(employee, employee.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
            {
                return null;
            }

            return await CreateTokenResponse(employee);
        }

        public async Task<TokenResponseDTO?> RefreshTokensAsync(RefreshTokenRequestDTO request)
        {
            var user = await ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);

            if (user is null)
                return null;

            return await CreateTokenResponse(user);
        }

        public async Task<Employee?> RegisterAsync(EmployeeRegisterDTO request)
        {
            if (await context.Employees.AnyAsync(u => u.EmployeeNumber == request.EmployeeNumber))
            {
                return null;
            }

            var employee = new Employee();
            var hashedPassword = new PasswordHasher<Employee>()
                .HashPassword(employee, request.Password);

            employee.EmployeeNumber = request.EmployeeNumber;
            employee.PasswordHash = hashedPassword;

            context.Employees.Add(employee);
            await context.SaveChangesAsync();

            return employee;
        }


        // Helper Methods
        private async Task<TokenResponseDTO> CreateTokenResponse(Employee employee)
        {
            return new TokenResponseDTO
            {
                AccessToken = CreateToken(employee),
                RefreshToken = await GenerateAndSaveRefreshTokenAsync(employee)
            };
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(Employee employee)
        {
            var refreshToken = GenerateRefreshToken();
            employee.RefreshToken = refreshToken;
            employee.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await context.SaveChangesAsync();
            return refreshToken;
        }

        private string GenerateRefreshToken()
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
                new Claim(ClaimTypes.Name, employee.EmployeeNumber),
                new Claim(ClaimTypes.NameIdentifier, employee.Id.ToString()),
                new Claim(ClaimTypes.Role, employee.Role)
            };

            //Signing Key
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!));

            // Signing Credentials
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            // Descriptor that describes the JSON WEB TOKEN
            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration.GetValue<string>("AppSettings:Issuer"),
                audience: configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
                );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

        private async Task<Employee?> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
        {
            var user = await context.Employees.FindAsync(userId);

            if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return null;
            }

            return user;
        }

    }
}
