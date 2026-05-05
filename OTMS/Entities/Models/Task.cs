namespace OTMS.Entities.Models
{
    public class Task
    {

        public Guid TaskId { get; set; }

        public Guid CreatedBy { get; set; }
        public Guid AssignedTo { get; set; }
        public Guid? EvaluatedBy { get; set; }

        public string TaskTitle { get; set; } = string.Empty;
        public string? TaskDescription { get; set; }
        public string Priority { get; set; } = "Normal";
        public DateTime? DueAt { get; set; }

        public string? TaskRemarks { get; set; }
        public string TaskStatus { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

    }
}
