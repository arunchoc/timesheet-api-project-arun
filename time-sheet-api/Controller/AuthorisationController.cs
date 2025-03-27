using Microsoft.AspNetCore.Mvc;
using TimeSheetAPI.DataLayer;

namespace TimeSheetAPI.Controller;
[ApiController]
[Route("api/auth")]
public class AuthorisationController() : ControllerBase
{

    private readonly AuthorisationDL authorisationDL = new();


    [HttpGet]
    public IActionResult GetActions(string employeeId)
    {
        if (string.IsNullOrEmpty(employeeId))
        {
            return BadRequest("EmployeeId is not present");
        }
        var result = authorisationDL.GetAction(employeeId);
        return Ok(result);
    }

}


