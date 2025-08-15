import React from 'react';

const CalendarGrid = ({ calendarData, viewType }) => {
  if (!calendarData) return <div>Loading...</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getWeekHighlightClass = (highlightType) => {
    switch (highlightType) {
      case 'lite': return 'week-light-highlight';
      case 'dark': return 'week-dark-highlight';
      default: return '';
    }
  };

  const isHoliday = (date, holidays) => {
    return holidays.some(holiday => holiday.date === date);
  };

  const getHolidayForDate = (date, holidays) => {
    return holidays.find(holiday => holiday.date === date);
  };

  const renderWeekView = () => {
    return (
      <div className="calendar-weeks">
        {calendarData.weeks.map((week, index) => (
          <div key={index} className={`week ${getWeekHighlightClass(week.highlightType)}`}>
            <div className="week-header">
              <h3>Week {index + 1}</h3>
              <span>{formatDate(week.startDate)} - {formatDate(week.endDate)}</span>
            </div>
            <div className="week-days">
              {getDaysInWeek(week.startDate, week.endDate).map(date => {
                const holiday = getHolidayForDate(date, calendarData.holidays);
                return (
                  <div 
                    key={date} 
                    className={`day ${holiday ? 'holiday' : ''}`}
                    title={holiday ? holiday.name : ''}
                  >
                    <span className="date">{new Date(date).getDate()}</span>
                    {holiday && <span className="holiday-name">{holiday.name}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMonthlyView = () => {
    return (
      <div className="calendar-grid">
        <div className="calendar-header">
          <div className="day-names">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="day-name">{day}</div>
            ))}
          </div>
        </div>
        {calendarData.weeks.map((week, index) => (
          <div key={index} className={`week-row ${getWeekHighlightClass(week.highlightType)}`}>
            {getDaysInWeek(week.startDate, week.endDate).map(date => {
              const holiday = getHolidayForDate(date, calendarData.holidays);
              return (
                <div 
                  key={date} 
                  className={`day-cell ${holiday ? 'holiday' : ''}`}
                  title={holiday ? holiday.name : ''}
                >
                  <span className="date-number">{new Date(date).getDate()}</span>
                  {holiday && <div className="holiday-indicator">•</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const getDaysInWeek = (startDate, endDate) => {
    const days = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      days.push(date.toISOString().split('T')[0]);
    }
    
    return days;
  };

  const renderQuarterlyView = () => {
    const monthsInQuarter = getMonthsInDateRange(calendarData.startDate, calendarData.endDate);
    
    return (
      <div className="quarterly-view">
        {monthsInQuarter.map((month, monthIndex) => (
          <div key={monthIndex} className="month-section">
            <h3 className="month-title">{month.name}</h3>
            <div className="month-weeks">
              {month.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className={`week-summary ${getWeekHighlightClass(week.highlightType)}`}>
                  <span className="week-dates">{formatDate(week.startDate)} - {formatDate(week.endDate)}</span>
                  {week.holidays.length > 0 && (
                    <div className="week-holidays">
                      {week.holidays.map((holiday, holidayIndex) => (
                        <span key={holidayIndex} className="holiday-tag">
                          {holiday.name} ({formatDate(holiday.date)})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getMonthsInDateRange = (startDate, endDate) => {
    const months = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let currentMonth = new Date(start.getFullYear(), start.getMonth(), 1);
    
    while (currentMonth <= end) {
      const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      const monthWeeks = calendarData.weeks.filter(week => {
        const weekStart = new Date(week.startDate);
        return weekStart.getMonth() === currentMonth.getMonth() && 
               weekStart.getFullYear() === currentMonth.getFullYear();
      });
      
      months.push({
        name: currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        weeks: monthWeeks
      });
      
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    
    return months;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-info">
        <h2>Calendar - {calendarData.country} ({calendarData.timeZone})</h2>
        <p>{formatDate(calendarData.startDate)} to {formatDate(calendarData.endDate)}</p>
      </div>
      
      <div className="legend">
        <div className="legend-item">
          <span className="legend-color normal"></span>
          <span>Regular Week</span>
        </div>
        <div className="legend-item">
          <span className="legend-color light"></span>
          <span>1 Holiday Week</span>
        </div>
        <div className="legend-item">
          <span className="legend-color dark"></span>
          <span>2+ Holiday Week</span>
        </div>
        <div className="legend-item">
          <span className="legend-color holiday"></span>
          <span>Holiday Date</span>
        </div>
      </div>

      {viewType === 'weekly' && renderWeekView()}
      {viewType === 'monthly' && renderMonthlyView()}
      {viewType === 'quarterly' && renderQuarterlyView()}
    </div>
  );
};

export default CalendarGrid;