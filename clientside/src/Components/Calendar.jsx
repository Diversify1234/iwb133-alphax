import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import '../index.css';

export default function BasicDateCalendar() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <DateCalendar
          sx={{
            '& .MuiPickerStaticWrapper-root': {
              maxWidth: '700px',  // Max width to fit the calendar in one view
              maxHeight: 'auto',   // Automatically adjust height based on content
            },
            '& .MuiDayCalendar-weekDayLabel': {
              fontSize: '1rem',    // Slightly larger weekday labels
            },
            '& .MuiTypography-root': {
              fontSize: '1rem',    // Standard font size for dates
            },
            '& .MuiPickersDay-root': {
              width: '35px',       // Date box width reduced to fit all dates
              height: '35px',      // Date box height reduced
              backgroundColor: 'var(--background-color)', // Box background for each date
              borderRadius: '8px', // Rounded corners for the boxes
              margin: '4px',       // Small margin for spacing between boxes
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
            '& .MuiPickersDay-root.Mui-selected': {
              backgroundColor: 'var(--orange)', // Selected date background color
              color: '#fff',
            },
            '& .MuiPickersDay-root:hover': {
              backgroundColor: 'var(--orange)', // Hover effect background color
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}
