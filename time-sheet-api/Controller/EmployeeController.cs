using Microsoft.AspNetCore.Mvc;
using TimeSheetAPI.DataLayer;
using TimeSheetAPI.Model.Object;
using TimeSheetAPI.Model.Request;

namespace TimeSheetAPI.Controller;
[Route("api/employee")]
[ApiController]
public class EmployeeController : ControllerBase
{
    private readonly EmployeeDL _employeeDL;

    // Constructor injection
    public EmployeeController()
    {
        _employeeDL = new();
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest loginRequest)
    {
        try
        {
            var employee = _employeeDL.ValidateEmployee(loginRequest.EmployeeId!, loginRequest.Password!);
            if (employee != null)
            {
                return Ok(new
                {
                    name = employee.Name,
                    employeeId = employee.EmployeeId,
                    totalWFH = employee.TotalWFH,
                    totalLeaves = employee.TotalLeaves,
                    specialization = employee.Specialization,
                    gender = employee.Gender
                });
            }
            return Unauthorized(new { message = "Invalid credentials" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
        }
    }

    // New endpoint to update employee WFH and Leave balances
    [HttpPost("updateattendance")]
    public IActionResult UpdateAttendance([FromBody] AttendanceUpdateRequest attendanceUpdateRequest)
    {
        try
        {
            if (attendanceUpdateRequest == null || string.IsNullOrEmpty(attendanceUpdateRequest.EmployeeId))
            {
                return BadRequest(new { message = "Invalid data provided." });
            }

            var success = _employeeDL.UpdateEmployeeBalance(attendanceUpdateRequest.EmployeeId, attendanceUpdateRequest.StatusId);
            if (success)
            {
                return Ok("Success");
            }
            return BadRequest(new { message = "Failed to update attendance. Check if balances are available." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
        }
    }
}
