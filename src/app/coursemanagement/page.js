"use client";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Assuming you use axios for HTTP requests
import Cookies from "js-cookie";
import { getAuthToken } from "../utils/api";
const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Add a state for search query
  useEffect(() => {
    // Function to fetch course data
    const fetchCourses = async () => {
      try {
        const authToken = getAuthToken();
        if (!authToken) {
          console.error("No authentication token found");
          return;
        }

        const response = await axios.get(
          "http://localhost:8055/operations/courses?asPage=false&page=0&size=20",
          {
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses(); // Call the fetch function
  }, [searchQuery]); // Empty dependency array ensures this effect runs once

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchQuery(e.target.search.value.trim()); // Update the search query state
  };

  return (
    <div className="py-6 ">
      <h2 className="text-2xl font-bold mb-4 ml-6">Course Management</h2>
      <form onSubmit={handleSearch} className="mb-4 ml-6 ">
        <input
          type="search"
          name="search"
          placeholder="Search courses"
          className="input input-bordered w-full max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.trim())}
        />
        <button
          type="submit"
          className="btn btn-primary ml-2 dark:md:hover:bg-fuchsia-600"
        >
          Search
        </button>
      </form>
      <div className="grid grid-cols-3 gap-4 flex items-center space-x-3 mb-4 ml-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="card bg-base-100 w-96 shadow-xl ml-4 content-start "
          >
            <div className="card-body ">
              <h3 className="card-title">{course.title}</h3>
              <p>Description: {course.description}</p>
              <p>Start Date: {course.startDate}</p>

              <div class="card-actions justify-end">
                <button class="btn btn-primary">Update</button>
                <button class="btn btn-primary">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement;
// Hello
