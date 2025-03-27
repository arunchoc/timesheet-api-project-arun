namespace TimeSheetAPI.Model.Object
{
    public class ApiError
    {
        public string? ErrorMessage { get; set; }
        public string? Field { get; set; }
        public string? Exception { get; set; }

        public ApiError(string errorMessage)
        {
            ErrorMessage = errorMessage;
        }
        public ApiError(string errorMessage, string field)
        {
            ErrorMessage = errorMessage;
            Field = field;
        }
    }
}