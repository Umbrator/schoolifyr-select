import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../css/Accordion.css';

const Accordion = () => {
  const [loadingTab, setLoadingTab] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/courses');
        setCourseData(response.data[0].courses);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleToggle = (tabId) => {
    setLoadingTab(tabId);
    setTimeout(() => {
      setLoadingTab(null);
    }, 1000);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getDealLabel = (discount) => {
    if (discount >= 15) {
      return "BEST DEAL";
    } else if (discount >= 10) {
      return "GOOD DEAL";
    }
    return null;
  };

  return (
    <div className="zx-tabs" id="promo_contents">
      {courseData.length > 0 ? (
        courseData.map((course, index) => (
          <div className="zx-tab" key={index}>
            <input
              type="checkbox"
              id={`course-${course.id}`}
              onClick={() => handleToggle(`tab${index}`)}
            />
            <label
              className={`zx-tab-label ${getDealLabel(course.discount)?.toLowerCase().replace(' ', '-')}`}
              htmlFor={`course-${course.id}`}
            >
              {course.Name}
              {course.discount && (
                <span>
                  {getDealLabel(course.discount)} <small>You're saving {course.discount}%</small>
                </span>
              )}
            </label>
            <div className="zx-tab-content">
              {loadingTab === `tab${index}` ? (
                <p>Loading details...</p>
              ) : (
                <>
                  <p>{course.mastercourse.name.en}</p>
                  <div className="zx-packs">
                    <span className={course.status === 'online' ? 'online' : 'classroom'}>
                      {course.status === 'online' ? 'Online' : 'Classroom'}
                    </span>
                  </div>

                  <div className="zx-slider-nav">
                    <button data-type="standard">Standard course</button>
                    <button data-type="intensive">Intensive course</button>
                  </div>

                  <div>
                    <h4>Course Dates</h4>
                    <Calendar
                      onChange={handleDateChange}
                      value={selectedDate}
                      tileContent={({ date, view }) =>
                        date >= new Date(course.date_start) && date <= new Date(course.date_end) ? (
                          <p className="zx-course-day">Course Day</p>
                        ) : null
                      }
                    />
                  </div>
                  <div className="zx-packs">
                    <p>Duration: {course.hours} hours</p>
                    <p>Price: {course.price} $</p>
                    <p>Schedule: {course.days} {course.time_from} - {course.time_to}</p>
                    <button className="buy-button">Buy</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>Loading courses...</p>
      )}
    </div>
  );
};

export default Accordion;
