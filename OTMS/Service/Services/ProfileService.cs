using Microsoft.EntityFrameworkCore;
using OTMS.Data;
using OTMS.Entities.DTOs.Profile;
using OTMS.Entities.DTOs.Profile.Responses;
using OTMS.Service.Interfaces;
using System.Security.Claims;

namespace OTMS.Service.Services
{
    public class ProfileService(
        OTMSDbContext context,
        IHttpContextAccessor httpContextAccessor
        ) : IProfileService
    {
        public Task<ChangePasswordResponseDTO?> ChangePassword(ChangePasswordDTO request)
        {
            throw new NotImplementedException();
        }

        public Task<UpdateInformationResponseDTO?> UpdateBasicInformation(UpdateInformationDTO request)
        {
            throw new NotImplementedException();
        }


        public async Task<ViewProfileResponseDTO?> ViewProfile()
        {
            var claimProfile = httpContextAccessor
                .HttpContext?
                .User
                .FindFirst(ClaimTypes.NameIdentifier)?
                .Value;

            if (string.IsNullOrEmpty(claimProfile))
                return null;

            var profile = await context.Employees
                .Include(e => e.Account)
                .FirstOrDefaultAsync(e => e.Account.AccountId.ToString() == claimProfile);

            if (profile is null && profile.Account is null)
                return null;

            return new ViewProfileResponseDTO
            {
                EmployeeNumber = profile.EmployeeNumber,
                EmployeeName = profile.EmployeeName,
                ContactNumber = profile.ContactNumber,
                AccountStatus = profile.Account.AccountStatus,
                Role = profile.Account.Role,
                CreatedAt = profile.CreatedAt,
                UpdatedAt = profile.UpdatedAt ?? profile.CreatedAt
            };
        }
    }
}
