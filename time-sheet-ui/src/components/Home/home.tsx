import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  // Get employee details from sessionStorage
  const employeeData = sessionStorage.getItem("employee");
  const employeeDetails = employeeData ? JSON.parse(employeeData) : null;

  // Redirect to login if no employee data is found
  if (!employeeDetails) {
    navigate("/");
    return null; // Prevent rendering further
  }



  return (
    <div className="home-container">
      <h2>{employeeDetails.name}</h2>
      <p>Employee ID : {employeeDetails.employeeId}</p>
      <p>Gender : {employeeDetails.gender}</p>
      <p>Role : {employeeDetails.specialization}</p>
      <p>WFH Balance: {employeeDetails.totalWFH}</p>
      <p>Leave Balance : {employeeDetails.totalLeaves}</p>
    </div>
  );
}

export default Home;
