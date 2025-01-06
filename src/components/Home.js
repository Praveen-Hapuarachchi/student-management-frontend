import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Import the Calendar component
import 'react-calendar/dist/Calendar.css'; // Import the CSS for styling
import Header from './Header';
import Footer from './Footer';
import Dashboard from './Dashboard';
import Carousel from './Carousel'; // Import the Carousel component
import './Home.css'; // Import the CSS file for additional styles

const Home = () => {
  const [date, setDate] = useState(new Date()); // Initialize date state with current date

  return (
    <div>
      <Header />
      <Dashboard />
      <div className="home-container">
        {/* Left Side: Carousel */}
        <div className="carousel-container">
          <Carousel />
        </div>
        {/* Right Side: Calendar */}
        <div className="calendar-container">
          <Calendar onChange={setDate} value={date} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
