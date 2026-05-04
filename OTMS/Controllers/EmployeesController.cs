using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OTMS.Data;

namespace OTMS.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController(OTMSDbContext context) : ControllerBase
{
    private readonly OTMSDbContext _context = context;

    // GET: api/employees/recent
    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentEmployees()
    {
        var employees = await _context.Employees
            .OrderByDescending(e => e.Id)
            .Take(5)
            .Select(e => new
            {
                employeeNumber = e.EmployeeNumber,
                employeeName = e.EmployeeName,
                role = e.Role,
                contactNumber = e.ContactNumber,
                status = "Active"
            })
            .ToListAsync();

        return Ok(employees);
    }
}