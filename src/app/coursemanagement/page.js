"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you use axios for HTTP requests
import Cookies from 'js-cookie'
import { getAuthToken } from '../utils/api';
const CourseManagement = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Function to fetch course data
    const fetchCourses = async () => {
      try {
        const authToken = getAuthToken();
        if (!authToken) {
          console.error('No authentication token found');
          return;
        }
        
        const response = await axios.get(
          'http://localhost:8055/operations/courses?asPage=false&page=0&size=20',
          {
            headers: {
              'accept': '*/*',
              'Authorization': `Bearer ${authToken}`
            }
          }
        );
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses(); // Call the fetch function
  }, []); // Empty dependency array ensures this effect runs once

  return (
    <div>
      <h2>Course Management</h2>
      <div>
        {courses.map(course => (
          <div key={course.id}>
            <h3>{course.title}</h3>
            <p>Description: {course.description}</p>
            <p>Start Date: {course.startDate}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseManagement;
