namespace OTMS.Entities.Models
{
    public class Account
    {
        public Guid AccountId { get; set; }
        public Guid EmployeeId { get; set; }

        public string Role { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string AccountStatus { get; set; } = "Active";

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
    }
}
