import "./Scanner.css";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
import httpClient from "../../helperServices/httpClient";
//https://www.the-qrcode-generator.com/
function Scanner() {
  useEffect(() => {
    let cameraId = "";
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          cameraId = devices[0].id;
        }
      })
      .then(function renderScanner() {
        const html5QRCode = new Html5Qrcode("reader");
        html5QRCode.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          function handleDecodedText(decodedText) {
            html5QRCode.pause(true);
            setTimeout(() => {
              html5QRCode.resume();
            }, 2000);
            fillAttendance(decodedText, html5QRCode.resume);
          },
          function handleError(err) {
            console.log("Scanner failed to scan", err);
          }
        );
      })
      .catch((err) => {
        console.log("Scanner failed to get camera:", err);
      });
  }, []);
  const scanStates = ["Ready To Scan!", "Present", "Scan failed"];
  let [scanState, updateScanState] = useState(scanStates[0]);
  const fillAttendance = function (employeeId: string, resume: () => void) {
    if (employeeId) {
      let request = {
        employeeId,
        StatusId: "1",
        date: new Date(),
      };
      httpClient.post(httpClient.postAttendance, request).then((result) => {
        if (result.errormessage || typeof result == typeof String) {
          updateScanState(scanStates[1]);
          setTimeout(() => {
            updateScanState(scanStates[0]);
          }, 2500);
        } else {
          updateScanState(scanStates[2]);
          setTimeout(() => {
            updateScanState(scanStates[0]);
          }, 2500);
        }
      });
    }
    //resume();
  };
  return (
    <>
      <div className="flex center">
        <div className="big textshadow-grey">Scanner</div>
      </div>
      <div className="glow-button">
        <div
          className={
            scanState == scanStates[1] ? "bgcolor-green" : "bgcolor-red"
          }
        ></div>
        <div className="scantext textshadow-grey font-20">{scanState}</div>
      </div>
      <div className="scanner">
        <div id="reader"></div>
      </div>
    </>
  );
}
export default Scanner;
