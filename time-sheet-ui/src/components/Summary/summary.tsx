import { useEffect, useState } from "react";
import "./summary.css";
import httpClient from "../../helperServices/httpClient";
import { Employee } from "../../model/employee";

function Summary() {
  //1.Get current Date
  //2.Get days of week in a list for calendar heading
  //3.Get last 4 month dates for showing months in dropdown
  //4.Make api call when page load that will get data for 4 months by default and attendance status
  //5. Format the api call for each month then split list by 7 for each week - add a weekoffset for where calendar will be empty at start
  //6. Show the formatted data in react code by using map
  //7. Show only for selected month by using conditions

  //1. Get current Date
  const currentDate = new Date();

  //2.Get days of week in a list for calendar
  let weeks = [];
  for (let i = 0; i < 7; i++) {
    weeks.push(Week[i]);
  }

  //3.Get last 4 month dates for calendar
  let dates = [];
  for (let i = 0; i < 4; i++) {
    let date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1,
      5,
      30
    );
    dates.push(date);
  }

  let [selectedDate, updateSelectedDate] = useState<Date>(dates[0]);

  let [monthStatus, updateMonthStatus] = useState<MonthlyStatus[]>();

  // 4. api call to get dates
  useEffect(() => {
    const employee: Employee = JSON.parse(sessionStorage.getItem("employee")!);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const fromDate = new Date(currentYear, currentMonth - 3, 1, 5, 30); //start of before 4 months
    const toDate = new Date(currentYear, currentMonth + 1, 0, 5, 30); //end of current month

    const getAttendance = async (
      employeeId: string,
      fromDate: Date,
      toDate: Date
    ) => {
      let apiResponse: any = await httpClient.get(
        httpClient.getAttendance +
          new URLSearchParams(
            `employeeId=${employeeId}&fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`
          ).toString(),
        true
      );
      if (!apiResponse) {
        return;
      }
      let response: Attendance[] = apiResponse;

      updateMonthStatus(formatStatusPerMonth(response));
    };

    getAttendance(employee.employeeId, fromDate, toDate);

    //Format the api call for each month then split list by 7 for each week - add a weekoffset for where calendar will be empty at start
    const formatStatusPerMonth = (statusList: Attendance[]) => {
      let monthlyStatus: MonthlyStatus[] = [];

      for (let i = 3; i > -1; i--) {
        // let DaysinMonth = new Date(currentYear, currentMonth - i, 0).getDate();
        let startingDay = new Date(currentYear, currentMonth - i, 1).getDay();
        let weekOffset = (startingDay + 6) % 7;
        let tempStatusList: Status[][] = [];
        let tempStatus: Status[] = [];

        tempStatus = Array(weekOffset).fill(5);
        let monthStatusList = statusList
          .filter(
            (ele) =>
              new Date(ele.date).getMonth() == (12 + currentMonth - i) % 12
          )
          .sort((a, b) => (new Date(a.date) < new Date(b.date) ? -1 : 1))
          .map((ele) => {
            return ele.statusId;
          });
        tempStatus = tempStatus.concat(monthStatusList);

        tempStatusList = tempStatus.reduce((acc: Status[][], _, index) => {
          if (index % 7 == 0) {
            acc.push(tempStatus.slice(index, index + 7));
          }
          return acc;
        }, []);
        monthlyStatus.push({
          month: (12 + currentMonth - i) % 12,
          statusList: tempStatusList,
        });
      }
      return monthlyStatus;
    };
  }, []);

  const OnMonthUpdate = (date: Date) => {
    updateSelectedDate(date);
  };

  //6. Show the formatted data in react code by using map
  return (
    <>
      <div>
        <div className="flex center font-24 margin-top-5">
          <label>
            Month :
            <select
              className="margin-left padding color-darkblue bgcolor-lightblue"
              onChange={(e) => OnMonthUpdate(new Date(e.target.value))}
            >
              {dates.map((date, id) => {
                return (
                  <option key={id} value={date.toString()}>
                    {date.toLocaleDateString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
        <div className="flex center margin-top-10 font-18">
          <table>
            <thead>
              <tr>
                {weeks.map((week, id) => {
                  return <th key={id}>{week}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {/* 7. Show only for selected month by using conditions */}
              {monthStatus != null &&
                monthStatus
                  .filter((ele) => {
                    return ele.month == selectedDate?.getMonth();
                  })
                  .map((ele) => {
                    return ele.statusList;
                  })
                  .map((ele, id) => {
                    return (
                      <>
                        {ele.map((ele, idx) => {
                          return (
                            <>
                              <tr key={idx}>
                                {ele.map((ele, id) => {
                                  return (
                                    <>
                                      <td
                                        className={`status${ele} color`}
                                        key={id}
                                      >
                                        {ele != 5
                                          ? idx * 7 +
                                            id -
                                            ((selectedDate.getDay() + 5) % 7)
                                          : " "}
                                      </td>
                                    </>
                                  );
                                })}
                              </tr>
                            </>
                          );
                        })}
                      </>
                    );
                  })}
            </tbody>
          </table>
          <div className="margin-left">
            <div className="flex margin-left">
              <label>Legend :</label>
            </div>
            <div className="flex flex-direction">
              <div className="flex">
                <div className="status0-leg leg">ab</div>Unknown
              </div>
              <div className="flex">
                <div className="status1-leg leg">ab</div>Present
              </div>
              <div className="flex">
                <div className="status2-leg leg">ab</div>WFH
              </div>
              <div className="flex">
                <div className="status3-leg leg">ab</div>Leave
              </div>
              <div className="flex">
                <div className="status4-leg leg">ab</div>Holiday
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Summary;

export enum Month {
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
}

export enum Week {
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
}

export enum Status {
  "Unknown",
  "Present",
  "WFH",
  "Leave",
  "Holiday",
  "NotaDay",
}
export enum StatusClass {
  "status0",
  "status1",
  "status2",
  "status3",
  "status4",
  "status5",
}
export interface MonthlyStatus {
  month: Month;
  statusList: Status[][];
}

export interface Attendance {
  date: Date;
  statusId: Status;
}
//Need to convert status in months to selected mon to weeks
