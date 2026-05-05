namespace OTMS.Entities.Models
{
    public class Employee
    {
        public Guid EmployeeId { get; set; }
        public string EmployeeNumber { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        // Navigation properties

    }
}
