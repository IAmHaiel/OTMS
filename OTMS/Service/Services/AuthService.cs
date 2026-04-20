using OTMS.Data;
using OTMS.Entities.DTOs;
using OTMS.Entities.Models;
using OTMS.Service.Interfaces;

namespace OTMS.Service.Services
{
    public class AuthService(OTMSDbContext context, IConfiguration configuration) : IAuthService
    {
        public Task<TokenResponseDTO?> LoginAsync(EmployeeLoginDTO request)
        {
            throw new NotImplementedException();
        }

        public Task<TokenResponseDTO?> RefreshTokensAsync(RefreshTokenRequestDTO request)
        {
            throw new NotImplementedException();
        }

        public Task<Employee?> RegisterAsync(EmployeeRegisterDTO request)
        {
            throw new NotImplementedException();
        }
    }
}
