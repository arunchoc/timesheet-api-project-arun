import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FillAttendance.css";
import httpClient from "../../helperServices/httpClient";

function FillAttendance() {
  const navigate = useNavigate();

  const currentDate = new Date();
  const getDateString = (date: Date) => {
    return date.toISOString().slice(0, 10);
  };
  // State variables for employee details and attendance
  const [employeeId, setEmployeeId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(
    getDateString(currentDate)
  );
  const [statusId, setStatusId] = useState("1");
  const [leaveType, setLeaveType] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [wfhBalance, setWfhBalance] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState(0);

  useEffect(() => {
    const storedEmployee = sessionStorage.getItem("employee");
    if (storedEmployee) {
      const employeeData = JSON.parse(storedEmployee);
      setEmployeeId(employeeData.employeeId || "");
      setName(employeeData.name || "");
      setGender(employeeData.gender || "");
      setSpecialization(employeeData.specialization || "");
      setWfhBalance(employeeData.totalWFH || 0);
      setLeaveBalance(employeeData.totalLeaves || 0);
    }
  }, []);

  const handleSubmit = async () => {
    if (!employeeId || !attendanceDate || !statusId) {
      alert("Please fill all fields.");
      return;
    }

    // Check balances before submitting
    if (statusId === "2" && wfhBalance <= 0) {
      alert("Insufficient WFH balance.");
      return;
    } else if (statusId === "3" && leaveBalance <= 0) {
      alert("Insufficient Leave balance.");
      return;
    }

    // Update balances locally before sending
    const newWfhBalance = statusId === "2" ? wfhBalance - 1 : wfhBalance;
    const newLeaveBalance = statusId === "3" ? leaveBalance - 1 : leaveBalance;

    const requestData = {
      employeeId,
      name,
      attendanceDate,
      statusId,
      leaveType,
      gender,
      specialization,
      wfhBalance: newWfhBalance,
      leaveBalance: newLeaveBalance,
    };

    try {
      const response = await httpClient.post(
        httpClient.postAttendance,
        requestData,
        true
      );
      if (!response) {
        return;
      }
      const balanceResponse = await httpClient.post(
        httpClient.updateAttendance,
        { employeeId: employeeId.toString(), statusId: statusId },
        true
      );
      if (!balanceResponse) {
        return;
      }
      alert("Attendance submitted successfully!");
      setWfhBalance(newWfhBalance);
      setLeaveBalance(newLeaveBalance);
      sessionStorage.setItem(
        "employee",
        JSON.stringify({
          employeeId,
          name,
          gender,
          specialization,
          totalWFH: newWfhBalance,
          totalLeaves: newLeaveBalance,
        })
      );
      navigate("/home");
    } catch (err) {
      alert("Something went wrong. Try again later.");
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusId(e.target.value);

    // Show leave options only if 'Leave' is selected
    document
      .getElementById("leaveOptions")
      ?.style.setProperty("display", e.target.value === "3" ? "block" : "none");

    // Reset leave type when changing status
    setLeaveType("");
  };

  const getFilteredLeaveTypes = () => {
    const leaveOptions = [
      { value: "3", label: "Earned" },
      { value: "4", label: "Sick" },
      { value: "5", label: "Annual" },
    ];

    if (gender.toLowerCase() === "male") {
      leaveOptions.push({ value: "7", label: "Parental" });
    } else if (gender.toLowerCase() === "female") {
      leaveOptions.push({ value: "6", label: "Maternity" });
    }

    return leaveOptions;
  };

  return (
    <div className="fill-attendance-container">
      <h2>Fill Attendance</h2>
      <div className="attendance-form">
        <div className="form-group">
          <label htmlFor="attendanceDate">Date</label>
          <input
            type="date"
            id="attendanceDate"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            max={currentDate.toISOString().slice(0, 10)}
            min={getDateString(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() - 6
              )
            )}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Attendance Status</label>
          <select id="status" value={statusId} onChange={handleStatusChange}>
            <option value="1">Present</option>
            <option value="2">WFH</option>
            <option value="3">Leave</option>
          </select>
        </div>

        <div
          className="form-group"
          id="leaveOptions"
          style={{ display: "none" }}
        >
          <label htmlFor="leaveType">Leave Type</label>
          <br></br>
          <select
            id="leaveType"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          >
            {getFilteredLeaveTypes().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default FillAttendance;
