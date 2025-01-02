import React, { useState } from 'react';
import Calendar from 'react-calendar';  // Import the Calendar component
import 'react-calendar/dist/Calendar.css';  // Import the CSS for styling
import Dashboard from './Dashboard';
import Header from './Header';
import Footer from './Footer';


const Home = () => {
  const [date, setDate] = useState(new Date()); // Initialize date state with current date

  return (
    <div>
      <Header/>
      <Dashboard />
      <Calendar onChange={setDate} value={date} />
      <Footer/>
      
    </div>
  );
};

export default Home;
