import { TextField, Select, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

function WFHException() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker />
      </LocalizationProvider>
      <TextField id="reason" label="Reason" variant="outlined" />
      <TextField
        id="ApprovalManagerId"
        label="Approval Manager Id"
        variant="outlined"
      />
      <Button>Submit</Button>
    </>
  );
}

export default WFHException;
