using System.ComponentModel.DataAnnotations;

namespace OTMS.Entities.DTOs
{
    public class EmployeeRegisterDTO
    {
        public string EmployeeNumber { get; set; } = string.Empty;

        public string EmployeeName { get; set; }

        [RegularExpression(
            @"^09\d{9}$",
            ErrorMessage = "Contact Number must be exactly 11 digits and start with 09.")]
        public string ContactNumber { get; set; }

        public string Role { get; set; }
    }
}
