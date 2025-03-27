using System.ComponentModel.DataAnnotations;

namespace TimeSheetAPI.Model.Object
{
    public class EmployeeAttendance : IValidatableObject
    {
        [Required]
        public DateTime AttendanceDate { get; set; } = DateTime.Now;

        [Range(1, int.MaxValue, ErrorMessage = "EmployeeId is required")]
        public int EmployeeId { get; set; }

        [EnumDataType(typeof(Status))]
        public int StatusId { get; set; } = 1;

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (AttendanceDate.Date.CompareTo(DateTime.Now) > 0)
            {
                yield return new ValidationResult(errorMessage: "Date cannot be a future date", [nameof(AttendanceDate)]);
            }
            if (AttendanceDate.Date.CompareTo(DateTime.Now.AddDays(-8)) < 0)
            {
                yield return new ValidationResult(errorMessage: "Date cannot be older than 7 days", [nameof(AttendanceDate)]);
            }
        }

    }
}