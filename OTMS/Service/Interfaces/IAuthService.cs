using OTMS.Entities.DTOs;
using OTMS.Entities.Models;

namespace OTMS.Service.Interfaces
{
    public interface IAuthService
    {
        Task<Employee?> RegisterAsync(EmployeeRegisterDTO request);
        Task<TokenResponseDTO?> LoginAsync(EmployeeLoginDTO request);
        Task<TokenResponseDTO?> RefreshTokensAsync(RefreshTokenRequestDTO request);
    }
}
