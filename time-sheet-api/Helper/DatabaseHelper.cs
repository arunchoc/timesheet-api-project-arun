namespace TimeSheetAPI.Helper
{
    public class DatabaseHelper
    {
        private readonly string _connectionString;

        public DatabaseHelper()
        {
            _connectionString = "Server=tcp:time-sheet.database.windows.net,1433;Initial Catalog=main;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;Authentication=\"Active Directory Default\";";

        }
        public string GetConnectionString()
        {
            return _connectionString;
        }
    }
}