using Microsoft.Data.SqlClient;
using TimeSheetAPI.Helper;
using Query = TimeSheetAPI.Helper.Query;
using Dapper;
using TimeSheetAPI.Model.Object;
using TimeSheetAPI.Model.Response;
namespace TimeSheetAPI.DataLayer;

public class AttendanceDL
{
    private readonly DatabaseHelper _databaseHelper = new();
    private readonly string connectionString;

    //string connectionString = _databaseHelper.GetConnectionString();
    public AttendanceDL()
    {
        connectionString = _databaseHelper.GetConnectionString();
    }

    public bool AddAttendance(EmployeeAttendance employeeAttendance)
    {
        using (var connection = new SqlConnection(connectionString))
        {
            // Start transaction
            using (var transaction = connection.BeginTransaction())
            {
                try
                {
                    // Update WFH balance if status is WFH (2)
                    if (employeeAttendance.StatusId == 2)
                    {
                        int rowsAffected = connection.Execute(Query.Employee.UpdateWfhBalance, employeeAttendance, transaction);
                        if (rowsAffected == 0)
                        {
                            transaction.Rollback();
                            return false; // No WFH balance left to reduce
                        }
                    }
                    // Update Leave balance if status is Leave (3)
                    else if (employeeAttendance.StatusId == 3)
                    {
                        int rowsAffected = connection.Execute(Query.Employee.UpdateLeaveBalance, employeeAttendance, transaction);
                        if (rowsAffected == 0)
                        {
                            transaction.Rollback();
                            return false; // No leave balance left to reduce
                        }
                    }
                    var result = connection.Execute(Query.Attendance.AddEmployeeAttendance, employeeAttendance);
                    if(result > 0)
                    {
                        // Commit transaction
                        transaction.Commit();
                    }
                    else{
                        transaction.Rollback();
                    }                    
                     return result > 0;             
                }
                catch (Exception)
                {
                    // Rollback transaction in case of error
                    transaction.Rollback();
                    throw;
                }
            }
        }
    }

    public IEnumerable<AttendanceStatus> GetAttendance(string employeeId, DateTime? fromDate, DateTime? toDate)
    {
        fromDate = fromDate is null ? DateTime.Today.AddMonths(-4) : fromDate?.Date;
        toDate = toDate is null ? DateTime.Today : toDate?.Date;

        using (var connection = new SqlConnection(connectionString))
        {
            connection.Open();
            var result = connection.Query<AttendanceStatus>(Query.Attendance.GetAttendance, new { employeeId, fromDate, toDate });
            return result;
        }
    }
}

