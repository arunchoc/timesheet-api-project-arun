using Microsoft.Data.SqlClient;
using Dapper;
using TimeSheetAPI.Model.Object;
using TimeSheetAPI.Helper;
using Query = TimeSheetAPI.Helper.Query;
namespace TimeSheetAPI.DataLayer
{
    public class EmployeeDL
    {
        private readonly DatabaseHelper _databaseHelper;
        private readonly string connectionString;

        public EmployeeDL()
        {
            _databaseHelper = new();
            connectionString = _databaseHelper.GetConnectionString();
        }

        public Employee? ValidateEmployee(string employeeId, string password)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var result = connection.QueryFirstOrDefault<Employee>(Query.Employee.ValidateEmployeeQuery, new { EmployeeId = employeeId, Password = password });
                return result;
            }
        }

        // Method to update employee WFH or leave balance based on attendance status
        public bool UpdateEmployeeBalance(string employeeId, int statusId)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                // Start transaction
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // Update WFH balance if status is WFH (2)
                        if (statusId == 2)
                        {
                            int rowsAffected = connection.Execute(Query.Employee.UpdateWfhBalance, new { EmployeeId = employeeId }, transaction);
                            if (rowsAffected == 0) return false; // No WFH balance left to reduce
                        }
                        // Update Leave balance if status is Leave (3)
                        else if (statusId == 3)
                        {
                            int rowsAffected = connection.Execute(Query.Employee.UpdateLeaveBalance, new { EmployeeId = employeeId }, transaction);
                            if (rowsAffected == 0) return false; // No leave balance left to reduce
                        }

                        // Commit transaction
                        transaction.Commit();
                        return true;
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

        public Employee? GetEmployeeById(string employeeId)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                return connection.QueryFirstOrDefault<Employee>(Query.Employee.GetEmployeeById, new { EmployeeId = employeeId });
            }

        }
    }
}
