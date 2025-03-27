class httpClient {
  private static baseUrl = "http://localhost:5000";

  //Endpoints
  //Attendance
  static getAttendance = "/api/attendance?";
  static postAttendance = "/api/attendance";
  //Auth
  static getAuthorisation = "/api/auth?employeeId=";
  //Employee
  static employeeLogin = "/api/employee/login";
  static updateAttendance = "/api/employee/updateattendance";
  static getEmployee = "/api/employee/getEmployee/"; // +employeeId

  static async get<T>(
    url: string,
    handleError = false
  ): Promise<null | string | T> {
    let response = await fetch(this.baseUrl + url, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });
    return this.handleStatusError(response, handleError);
  }

  static async post(url: string, requestBody: any, handleError = false) {
    let response = await fetch(this.baseUrl + url, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    return this.handleStatusError(response, handleError);
  }
  private static async handleStatusError(
    response: Response,
    handleError = false
  ) {
    if (handleError && !response.ok) {
      switch (response.status) {
        case 400:
          var body = await response.json();
          alert(
            body.errorMessage ||
              body.error?.errorMessage ||
              body.message ||
              "Failed due to bad request"
          );
          break;
        case 500:
          var text = await response.text();
          alert("Server Error :(");
          console.log(`Failed with exception: ${text}`);
          break;
        default:
          var body = await response.json();
          alert(body.message || "Unknown error occured");
      }
      return null;
    } else if (!response.ok) {
      return await response.text();
    } else {
      return await response.json();
    }
  }
}

export default httpClient;
