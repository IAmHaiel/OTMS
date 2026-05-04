using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OTMS.Data;
using OTMS.Entities.DTOs;

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

    // PUT: api/employees/{employeeNumber}

    [HttpPut("{employeeNumber}")]
    public async Task<IActionResult> UpdateEmployee(string employeeNumber, [FromBody] UpdateEmployeeDto dto)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.EmployeeNumber == employeeNumber);

        if (employee == null) return NotFound();

        employee.EmployeeName = dto.EmployeeName;
        employee.ContactNumber = dto.ContactNumber;
        employee.Role = dto.Role;
        employee.Status = dto.Status;

        await _context.SaveChangesAsync();
        return Ok(employee);
    }
}