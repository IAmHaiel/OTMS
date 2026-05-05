namespace OTMS.Entities.Models
{
    public class ActivityLog
    {
        public Guid LogId { get; set; }
        public Guid AccountId { get; set; }

        public string ActivityType { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        // Navigation properties
    }
}
