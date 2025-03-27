import { useNavigate } from "react-router-dom";
import "./Header.css";
import "../../helperServices/httpClient";
import httpClient from "../../helperServices/httpClient";
import { useEffect, useState } from "react";

function Header({
  onLogout,
  employeeId,
}: {
  onLogout: () => void;
  employeeId: string;
}) {
  let [headerItem, updateHeaderItems] = useState<Action[]>([]);
  useEffect(() => {
    if (employeeId) {
      const getActions = async () => {
        let apiResponse: any = await httpClient.get(
          httpClient.getAuthorisation + employeeId,
          true
        );
        if (!apiResponse) {
          updateHeaderItems([]);
          return;
        }
        updateHeaderItems(apiResponse);
      };
      getActions();
    } else {
      updateHeaderItems([]);
    }
  }, [employeeId]);

  const navigate = useNavigate();
  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <div className="header">
      <ol className="navbar flex mp0">
        {headerItem.map((ele, id) => {
          if (ele.actionName != "Logout") {
            return (
              <li key={id}>
                <a href={ele.url}>{ele.actionName}</a>
              </li>
            );
          } else if (!ele.actionName) {
            return <></>;
          } else {
            return (
              <li key={id} className="logout-button" onClick={handleLogout}>
                <a href="#">Logout</a>
              </li>
            );
          }
        })}
      </ol>
    </div>
  );
}

export default Header;

export interface Action {
  actionName: string;
  url: string;
}
