'use client';
import React, { useState, useEffect } from "react";
import { courseService, userService } from "../utils/api";
import Link from 'next/link';

const StudentCourseView = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFrom, setStartDateFrom] = useState("");
  const [startDateTo, setStartDateTo] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [assignedTeachers, setAssignedTeachers] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    // Retrieve student ID from local storage
    const storedStudentId = localStorage.getItem('userId');
    if (storedStudentId) {
      setStudentId(storedStudentId);
    } else {
      console.error("Student ID not found in local storage");
      // Handle the case where student ID is not available
      // You might want to redirect to login page or show an error message
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await courseService.getCourses({
        title: searchQuery,
        asPage: false,
        page: 0,
        size: 20,
        startDateFrom,
        startDateTo,
      });
      setCourses(data);
      data.forEach(course => {
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
      setAssignedTeachers(prev => ({...prev, [courseId]: teacherData}));
    } catch (error) {
      console.error(`Error fetching assigned teacher details for course ${courseId}:`, error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchQuery, startDateFrom, startDateTo]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleEnroll = async (courseId) => {
    if (!studentId) {
      alert("Unable to enroll. Student ID not found.");
      return;
    }

    setIsEnrolling(true);
    try {
      await courseService.enrollStudent(courseId, { studentId: studentId });
      setEnrolledCourses((prevEnrolledCourses) => [...prevEnrolledCourses, courseId]);
      alert("Course Enrollment Successful!");
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert("Failed to enroll in the course. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
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
              {courses.map((course) => {
                const isEnrolled = enrolledCourses.includes(course.id);

                return (
                  <div
                    key={course.id}
                    className="card border-stone-950 bg-slate-100 shadow-xl flex flex-col p-4 transition-all duration-300 ease-in-out border-solid border-2 border-sky-500"
                  >
                    <div className="card-body flex flex-col justify-between h-full">
                      <h3 className="card-title text-lg font-semibold">{course.title}</h3>
                      <p>Description: {course.description.length > 150 
                        ? course.description.substring(0, 150) + "...[See more]" 
                        : course.description}</p>
                      <p>Faculty: {renderAssignedTeacher(course.id)}</p>
                      <p>Start Date: {course.startDate}</p>
                      <p>End Date: {course.endDate}</p>
                      <div className="card-actions justify-end mt-4">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(course)}
                          className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEnroll(course.id)}
                          className={`text-white ${
                            isEnrolled
                              ? "bg-green-500"
                              : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl"
                          } focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`}
                          disabled={isEnrolled || isEnrolling || !studentId}
                        >
                          {isEnrolled ? "Enrolled" : (isEnrolling ? "Enrolling..." : "Enroll")}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                  <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {selectedCourse.modules && selectedCourse.modules.length > 0 ? (
                  selectedCourse.modules.map((module, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{module.title}</td>
                      <td className="border border-gray-300 px-4 py-2">{module.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border border-gray-300 px-4 py-2" colSpan="2">No modules available for this course.</td>
                  </tr>
                )}
              </tbody>
            </table>

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

export default StudentCourseView;