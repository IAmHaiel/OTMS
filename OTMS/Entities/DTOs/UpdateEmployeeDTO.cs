namespace OTMS.Entities.DTOs
{
    public class UpdateEmployeeDto
    {
        public string EmployeeName { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
