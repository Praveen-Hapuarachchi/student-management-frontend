import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Import the Calendar component
import 'react-calendar/dist/Calendar.css'; // Import the CSS for styling
import Dashboard from './Dashboard';
import Header from './Header';
import Footer from './Footer';
import './Home.css'; // Import the CSS file for additional styles

const Home = () => {
  const [date, setDate] = useState(new Date()); // Initialize date state with current date

  return (
    <div>
      <Header />
      <Dashboard />
      <div className="calendar-container">
        <Calendar onChange={setDate} value={date} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
