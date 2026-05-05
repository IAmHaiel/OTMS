using Microsoft.EntityFrameworkCore;
using OTMS.Data;
using OTMS.Entities.DTOs.AccountManagement;
using OTMS.Entities.DTOs.AccountManagement.Responses;
using OTMS.Entities.Models;
using OTMS.Service.Interfaces;

namespace OTMS.Service.Services
{
    public class AccountManagementService(
        OTMSDbContext context
        ) : IAccountManagementService
    {
        public async Task<DeactivateUserResponseDTO?> DeactivateUser(DeactivateUserDTO request)
        {
            // Get the employee by employee number
            var exist = await context.Employees
                .FirstOrDefaultAsync(e => e.EmployeeNumber == request.EmployeeNumber);

            // Check if the employee exists
            if(exist is null)
            {
                return null;
            }

            // Deactivate the employee's account
            await context.Employees
                .Where(e => e.EmployeeId == exist.EmployeeId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(e => e.UpdatedAt, DateTime.UtcNow));

            await context.Accounts
                .Where(e => e.EmployeeId == exist.EmployeeId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(e => e.AccountStatus, "Deactivated")
                    .SetProperty(e => e.UpdatedAt, DateTime.UtcNow));

            return new DeactivateUserResponseDTO
            {
                EmployeeNumber = exist.EmployeeNumber,
                Success = true,
                DeactivatedAt = DateTime.UtcNow
            };
        }
    }
}
