namespace OTMS.Entities.Models
{
    public class Employee
    {
        public Guid Id { get; set; }
        public string EmployeeNumber { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Status { get; set; } = "Active";
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
    }
}
