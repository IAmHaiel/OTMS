using OTMS.Models;

namespace OTMS.DTOs;

public class User_RegisterDTO
{
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string ContactNo { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public EmployeeRole Role { get; set; }
}