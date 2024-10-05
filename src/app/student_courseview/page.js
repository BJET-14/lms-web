"use client"
import React, { useState, useEffect } from "react";
import axios from "axios"; // Assuming you use axios for HTTP requests
import { getAuthToken } from "../utils/api";

const teachers = [
  "Ms. Johnson",
  "Mr. Thompson",
  "Dr. Lee",
  "Prof. Patel",
  "Ms. Rodriguez",
  "Dr. Brown",
];

const ratings = [
  { id: 1, rating: 4.5, reviews: 73 },
  { id: 2, rating: 4.2, reviews: 42 },
  { id: 3, rating: 4.3, reviews: 48 },
  { id: 4, rating: 4.6, reviews: 88 },
  { id: 5, rating: 4.6, reviews: 78 },
  { id: 6, rating: 4.7, reviews: 28 },
];

const StudentCourseView = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const authToken = getAuthToken();
        if (!authToken) {
          console.error("No authentication token found");
          return;
        }

        const response = await axios.get(
          `http://localhost:8055/operations/courses?asPage=false&page=0&size=20&title=${searchQuery}`,
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
  }, [searchQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value.trim();
    setSearchQuery(searchValue);
  };

  return (
    <div className="flex h-fit py-6 text-zinc-950 bg-slate-200">
      <div className="flex flex-col w-full p-6 rounded-md shadow-md">
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="text-2xl ml-16 font-bold mb-4">Courses Available</h2>
          <form onSubmit={handleSearch} className="mb-4 mr-16 flex flex-wrap items-center">
            <input
              type="search"
              name="search"
              placeholder="Search courses"
              className="input input-bordered max-w-lg bg-slate-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.trim())}
            />
            <button type="submit" className="btn btn-success ml-4">
              Search
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full ml-12 mr-12">
          {courses.map((course, index) => {
            // Limit description to 150 characters
            const truncatedDescription =
              course.description.length > 150
                ? course.description.substring(0, 150) + "...[See more]"
                : course.description;

            return (
              <div
                key={course.id}
                className="card border-stone-950 bg-slate-100  shadow-xl flex flex-col p-4 transition-all duration-300 ease-in-out"
              >
                <div className="card-body flex flex-col justify-between h-full">
                  <h3 className="card-title text-lg font-semibold">{course.title}</h3>
                  <p>Description: {truncatedDescription}</p>
                  <p>Faculty: {teachers[index % teachers.length]}</p>
                  <p>Start Date: {course.startDate}</p>
                  <div className="flex flex-nowrap mt-auto items-center">
                    <div className="flex items-center justify-start">
                      <svg
                        className="w-4 h-4 text-yellow-300 me-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <p className="ms-2 text-sm font-bold text-gray-900">
                        {ratings[index % ratings.length].rating}
                      </p>
                      <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full"></span>
                      <a
                        href="#"
                        className="text-sm font-medium text-gray-900 underline hover:no-underline"
                      >
                        {ratings[index % ratings.length].reviews} reviews
                      </a>
                    </div>
                    <div className="card-actions justify-end ml-16">
                    <button
                        type="button"
                        className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentCourseView;
