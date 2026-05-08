namespace OTMS.Entities.DTOs.AccountManagement
{
    public class SearchUserDTO
    {
        // The system shall allow Systems Admin to search employee accounts by employee Number, name, or role.

        public string? EmployeeNumber { get; set; }
        public string? EmployeeName { get; set; }
        public string? Role { get; set; }

    }
}
