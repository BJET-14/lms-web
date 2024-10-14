'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthToken, userService } from "../utils/api";

// Text Posting Component
const TextPosting = ({ onTextPost }) => {
  const [text, setText] = useState("");

  const handlePost = () => {
    if (text.trim()) {
      onTextPost(text); // Call the onTextPost handler with the text
      setText(""); // Clear the text after posting
    }
  };

  return (
    <div className="mt-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Announce something to your class"
        className="border p-2 w-full rounded-md bg-slate-300"
      />
      <button
        onClick={handlePost}
        className="mt-2 bg-blue-500 text-white p-2 rounded-md"
      >
        Post
      </button>
    </div>
  );
};

// Main teachercourseview Component
const teachercourseview = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFrom, setStartDateFrom] = useState("");
  const [startDateTo, setStartDateTo] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null); // State to track selected course
  const [userId, setUserId] = useState(null);
  const [postsByCourse, setPostsByCourse] = useState({}); // State to hold posts for each course
  const [assignedTeachers, setAssignedTeachers] = useState({}); // State to store teacher info by course

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchCourses(storedUserId);
    } else {
      console.error("User ID not found, redirecting...");
      window.location.href = '/authorization'; // Redirect to authorization if no user ID
    }
  }, []);

  const fetchCourses = async (userId) => {
    try {
      const authToken = getAuthToken(); // Fetch the auth token

      const response = await axios.get(
        `http://localhost:8055/operations/courses?asPage=false&page=0&size=20&title=${searchQuery}&startDateFrom=${startDateFrom}&startDateTo=${startDateTo}`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Set courses and fetch the assigned teacher for each course
      const filteredCourses = response.data.filter(
        (course) => String(course.teacherId) === String(userId)
      );

      setCourses(filteredCourses);

      filteredCourses.forEach(course => {
        if (course.teacherId) {
          fetchAssignedTeacherDetails(course.id, course.teacherId);
        }
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchAssignedTeacherDetails = async (courseId, teacherId) => {
    try {
      const teacherData = await userService.getUserById(teacherId);
      setAssignedTeachers((prev) => ({
        ...prev,
        [courseId]: teacherData,
      }));
    } catch (error) {
      console.error(`Error fetching assigned teacher details for course ${courseId}:`, error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses(userId); // Re-fetch the courses based on the search filters
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course); // Show details of the selected course
  };

  const handleTextPost = (courseId, text) => {
    const newPost = {
      id: (postsByCourse[courseId]?.length || 0) + 1, // Generate a new id for each post in the course
      text,
      timestamp: new Date().toLocaleString(),
    };

    // Update the posts for the specific course
    setPostsByCourse((prevPosts) => ({
      ...prevPosts,
      [courseId]: [...(prevPosts[courseId] || []), newPost],
    }));
  };

  const renderAssignedTeacher = (courseId) => {
    const teacher = assignedTeachers[courseId];
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Not assigned';
  };

  return (
    <div className="flex h-fit py-6 text-zinc-950 bg-slate-200">
      <div className="flex flex-col w-full p-6 rounded-md shadow-md">
        {!selectedCourse ? (
          <>
            <div className="flex flex-wrap items-center justify-between">
              <h2 className="text-2xl ml-16 font-bold mb-4">
                Courses with Assigned Teachers
              </h2>
              <form
                onSubmit={handleSearch}
                className="mb-4 mr-16 flex flex-wrap items-center"
              >
                <input
                  type="search"
                  name="search"
                  placeholder="Search courses"
                  className="input input-bordered max-w-lg bg-slate-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.trim())}
                />
                <input
                  type="date"
                  placeholder="Start Date From"
                  className="input input-bordered max-w-xs bg-slate-300 ml-2"
                  value={startDateFrom}
                  onChange={(e) => setStartDateFrom(e.target.value)}
                />
                <input
                  type="date"
                  placeholder="Start Date To"
                  className="input input-bordered max-w-xs bg-slate-300 ml-2"
                  value={startDateTo}
                  onChange={(e) => setStartDateTo(e.target.value)}
                />
                <button type="submit" className="btn btn-success ml-4">
                  Search
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full ml-12 mr-12">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="card border-stone-950 bg-slate-100 shadow-xl flex flex-col p-4 transition-all duration-300 ease-in-out border-solid border-2 border-sky-500"
                >
                  <div className="card-body flex flex-col justify-between h-full">
                    <h3 className="card-title text-lg font-semibold">
                      {course.title}
                    </h3>
                    <p>Description: {course.description}</p>
                    <p>Faculty: {renderAssignedTeacher(course.id)}</p>
                    <p>Start Date: {course.startDate}</p>
                    <div className="flex flex-nowrap mt-auto items-center">
                      <div className="card-actions justify-end ml-16">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(course)} // On click, view details
                          className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="details-view bg-white p-6 rounded-md shadow-md">
            <h1 className="text-3xl font-bold mb-4">{selectedCourse.title}</h1>
            <p className="text-lg mb-4">{selectedCourse.description}</p>
            <p className="text-sm">Faculty: {renderAssignedTeacher(selectedCourse.id)}</p>
            <p className="text-sm">Start Date: {selectedCourse.startDate}</p>
            <p className="text-sm">End Date: {selectedCourse.endDate}</p>

            <h2 className="text-xl font-bold mt-4">Modules</h2>
            <table className="min-w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Title
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedCourse.modules && selectedCourse.modules.length > 0 ? (
                  selectedCourse.modules.map((module, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        {module.title}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {module.description}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="border border-gray-300 px-4 py-2"
                      colSpan="2"
                    >
                      No modules available for this course.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Class Post Section */}
            <div className="mt-6">
              <h2 className="text-xl font-bold">Post an Announcement</h2>
              <TextPosting onTextPost={(text) => handleTextPost(selectedCourse.id, text)} />
              <div className="mt-6">
                <h2 className="text-xl font-bold">Class Posts</h2>
                {postsByCourse[selectedCourse.id]?.length > 0 ? (
                  postsByCourse[selectedCourse.id].map((post) => (
                    <div
                      key={post.id}
                      className="border p-4 rounded-md bg-white shadow-md mt-4"
                    >
                      <p>
                        <strong>Posted on:</strong> {post.timestamp}
                      </p>
                      <p>{post.text}</p>
                    </div>
                  ))
                ) : (
                  <p>No posts yet.</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedCourse(null)}
              className="mt-6 btn btn-primary"
            >
              Back to Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default teachercourseview;