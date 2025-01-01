import React, { useState } from 'react';
import Calendar from 'react-calendar';  // Import the Calendar component
import 'react-calendar/dist/Calendar.css';  // Import the CSS for styling
import Dashboard from './Dashboard';
import Header from './Header';


const Home = () => {
  const [date, setDate] = useState(new Date()); // Initialize date state with current date

  return (
    <div>
      <Header/>
      <Calendar onChange={setDate} value={date} />
      <Dashboard />
      
    </div>
  );
};

export default Home;
