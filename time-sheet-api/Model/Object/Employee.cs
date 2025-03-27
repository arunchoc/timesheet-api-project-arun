namespace TimeSheetAPI.Model.Object
{
    public class Employee
    {
        public int EmployeeId { get; set; }
        public string? Name { get; set; }
        public int TotalWFH { get; set; }
        public int TotalLeaves { get; set; }

        public string? Specialization { get; set; }
        public string? Gender { get; set; }
    }
}