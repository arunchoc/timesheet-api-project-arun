using System.ComponentModel.DataAnnotations;

namespace TimeSheetAPI.Model.Request
{
    public class LoginRequest
    {
        [Required]
        public string? EmployeeId { get; set; }
        [Required]
        public string? Password { get; set; }
    }
}