namespace OTMS.Entities.Models
{
    public class Notification
    {
        public Guid NotificationId { get; set; }
        public Guid EmployeeId { get; set; }

        public Guid? TaskId { get; set; }
        public Guid? AnnouncementId { get; set; }

        public string NotificationType { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }

        // Navigation properties
    }
}
