using Dapper;
using Microsoft.Data.SqlClient;
using TimeSheetAPI.Helper;
using Action = TimeSheetAPI.Model.Object.Action;
using Query = TimeSheetAPI.Helper.Query;


namespace TimeSheetAPI.DataLayer
{
    public class AuthorisationDL
    {
        private readonly string connectionString;
        public AuthorisationDL()
        {
            connectionString = new DatabaseHelper().GetConnectionString();
        }
        public IEnumerable<Action> GetAction(string employeeId)
        {
            using SqlConnection connection = new(connectionString);
            connection.Open();
            return connection.Query<Action>(Query.Authorisation.GetAction, new { employeeId });
        }
    }
}