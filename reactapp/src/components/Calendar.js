import React, { useState, useEffect } from 'react';
import CalendarGrid from './CalendarGrid';
import Controls from './Controls';
import { calendarApi } from '../services/api';

const Calendar = () => {
  const [viewType, setViewType] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date());
  const [country, setCountry] = useState('USA');
  const [timeZone, setTimeZone] = useState('UTC');
  const [countries, setCountries] = useState([]);
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    loadCalendarData();
  }, [viewType, startDate, country, timeZone]);

  const loadCountries = async () => {
    try {
      const response = await calendarApi.getAvailableCountries();
      setCountries(response.data);
      if (response.data.length > 0 && !response.data.includes(country)) {
        setCountry(response.data[0]);
      }
    } catch (err) {
      console.error('Error loading countries:', err);
      setError('Failed to load countries');
    }
  };

  const loadCalendarData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await calendarApi.getCalendarData(viewType, startDate, country, timeZone);
      setCalendarData(response.data);
    } catch (err) {
      console.error('Error loading calendar data:', err);
      setError('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadCalendarData();
  };

  if (loading) {
    return <div className="loading">Loading calendar data...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={handleRefresh}>Retry</button>
      </div>
    );
  }

  return (
    <div className="calendar-app">
      <header className="app-header">
        <h1>Vacation Calendar</h1>
      </header>
      
      <Controls
        viewType={viewType}
        setViewType={setViewType}
        startDate={startDate}
        setStartDate={setStartDate}
        country={country}
        setCountry={setCountry}
        timeZone={timeZone}
        setTimeZone={setTimeZone}
        countries={countries}
        onRefresh={handleRefresh}
      />
      
      <CalendarGrid calendarData={calendarData} viewType={viewType} />
    </div>
  );
};

export default Calendar;