"use client";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Assuming you use axios for HTTP requests
import Cookies from "js-cookie";
import { getAuthToken } from "../utils/api";

const teachers = [
  "Ms. Johnson",
  "Mr. Thompson",
  "Dr. Lee",
  "Prof. Patel",
  "Ms. Rodriguez",
  "Dr. Brown",
];


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
          `http://localhost:8055/operations/courses?asPage=false&page=0&size=20&title=${searchQuery}`, // Update the API URL to include search query
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
    const searchValue = e.target.search.value.trim();
    setSearchQuery(searchValue);
    fetchCourses(searchValue); // Call fetchCourses with the new search query
    //setSearchQuery(e.target.search.value.trim()); // Update the search query state
  };

  return (
    <div className="flex py-6 h-full w-full text-zinc-950 bg-slate-200">
      <div className="w-70% p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">Course Management</h2>
      </div>
      <div className="p-6 rounded-md shadow-md w-screen">
        <form onSubmit={handleSearch} className="mb-4">
          <input
            type="search"
            name="search"
            placeholder="Search courses"
            className="input input-bordered  max-w-xs bg-slate-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.trim())}
          />
          <button
            type="submit"
            className="btn btn-success ml-4"
          >
            Search
          </button>
        </form>
        <div className="overflow-x-auto">
          <table className="table w-full bg-slate-200">
            <thead className="text-zinc-950">
              <tr>
                <th>Title</th>
                <th>Faculty</th>
                <th>Start Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{teachers[index % teachers.length]}</td>
                  <td>{course.startDate}</td>
                  <td>
                    <button className="btn btn-outline btn-info">Update</button>
                    <button className="btn btn-outline btn-error ml-5">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
// Hello
