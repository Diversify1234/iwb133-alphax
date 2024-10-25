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
              maxWidth: '700px',  
              maxHeight: 'auto',   
            },
            '& .MuiDayCalendar-weekDayLabel': {
              fontSize: '1rem',    
            },
            '& .MuiTypography-root': {
              fontSize: '1rem',    
            },
            '& .MuiPickersDay-root': {
              width: '35px',     
              height: '35px',     
              backgroundColor: 'var(--background-color)', 
              borderRadius: '8px',
              margin: '4px',       
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
            '& .MuiPickersDay-root.Mui-selected': {
              backgroundColor: 'var(--orange)', 
              color: '#fff',
            },
            '& .MuiPickersDay-root:hover': {
              backgroundColor: 'var(--orange)', 
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}
