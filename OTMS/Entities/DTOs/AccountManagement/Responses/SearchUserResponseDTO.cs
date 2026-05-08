namespace OTMS.Entities.DTOs.AccountManagement.Responses
{
    public class SearchUserResponseDTO
    {
        public string EmployeeNumber { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string AccountStatus { get; set; } = string.Empty;
        public bool Success { get; set; }
    }
}
