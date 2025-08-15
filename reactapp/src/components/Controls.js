import React from 'react';

const Controls = ({ 
  viewType, 
  setViewType, 
  startDate, 
  setStartDate, 
  country, 
  setCountry, 
  timeZone, 
  setTimeZone,
  countries,
  onRefresh 
}) => {
  const timeZones = [
    'UTC',
    'America/New_York',
    'America/Toronto',
    'Europe/London',
    'Asia/Kolkata',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  const viewTypes = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  return (
    <div className="controls">
      <div className="control-group">
        <label>View Type:</label>
        <select value={viewType} onChange={(e) => setViewType(e.target.value)}>
          {viewTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate.toISOString().split('T')[0]}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label>Country:</label>
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          {countries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label>Time Zone:</label>
        <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
          {timeZones.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      <button className="refresh-btn" onClick={onRefresh}>
        Refresh Calendar
      </button>
    </div>
  );
};

export default Controls;