import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useEffect, useState } from "react";

function Login({
  onLogin,
  onLogOut,
}: {
  onLogin: () => void;
  onLogOut: () => void;
}) {
  useEffect(() => {
    onLogOut();
  }, []);

  let [employeeId, UpdateEmployeeId] = useState("");
  let [password, UpdatePassword] = useState("");

  const navigate = useNavigate();
  const handleLogin = async () => {
    if (!employeeId || !password) {
      alert("Please enter Employee ID and Password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("employee", JSON.stringify(data));
        onLogin();
        navigate("/home");
      } else {
        alert(
          data.errormessage ||
            data.error?.errorMessage ||
            data.message ||
            "Invalid credentials"
        );
      }
    } catch (err) {
      alert("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div>
        <label>
          Employee ID:
          <input
            type="text"
            onChange={(e) => UpdateEmployeeId(e.target.value)}
            placeholder="Enter Employee ID"
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            onChange={(e) => UpdatePassword(e.target.value)}
            placeholder="Enter Password"
          />
        </label>
      </div>
      <div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
