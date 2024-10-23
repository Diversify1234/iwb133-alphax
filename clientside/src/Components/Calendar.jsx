import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function BasicDateCalendar() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{
        maxWidth: '600px', 
        margin: '0 20px', 
      }}>
        <DateCalendar 
          sx={{
            '& .MuiPickerStaticWrapper-root': {
              maxWidth: '550px',
              maxHeight: '550px', 
            },
            '& .MuiDayCalendar-weekDayLabel': {
              fontSize: '0.75rem', 
            },
            '& .MuiTypography-root': {
              fontSize: '0.875rem',
            },
            '& .MuiPickersDay-root': {
              width: '36px',
              height: '36px', 
            },
            '& .MuiPickersDay-root.Mui-selected': {
              backgroundColor: '#007bff',
            },
            '& .MuiPickersDay-root:hover': {
              backgroundColor: '#a0c4ff', 
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}
