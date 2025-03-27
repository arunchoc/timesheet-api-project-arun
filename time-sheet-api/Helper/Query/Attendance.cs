namespace TimeSheetAPI.Helper.Query
{
    public static class Attendance
    {
        // Query to add attendance
        public static readonly string AddEmployeeAttendance = @"
            INSERT INTO EmployeeAttendance (AttendanceDate, EmployeeID, StatusId)
            VALUES (@AttendanceDate, @EmployeeID, @StatusId);";

        public static readonly string GetAttendance = @"
        with datesCTE(dates) as 
        (
        	Select @FromDate  as startingDate
        	union all
        	select DATEADD(DAY, 1, dates) from datesCTE where dates < @ToDate
        )
        select dates as date, CASE
        When DATENAME(WEEKDAY, dates) in ('Saturday', 'Sunday') Then 4
        When H.HolidayName is not NULL Then  4
        Else ISNULL(StatusId, 0) 
        End as StatusId
        from datesCTE d 
        left outer join EmployeeAttendance EA on d.dates = EA.AttendanceDate and EA.EmployeeID = @EmployeeId
        left outer join Holiday H on d.dates = H.HolidayDate        
        order by dates
        OPTION (MAXRECURSION 500)
        ";

    }
}
