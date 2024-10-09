"use client"
import React, { useState, useEffect } from "react";
import { courseService, userService } from "../utils/api";
import Link from 'next/link';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    modules: [],
    classMeetingLink: "",
  });
  const [startDateFrom, setStartDateFrom] = useState("");
  const [startDateTo, setStartDateTo] = useState("");

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
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchQuery, startDateFrom, startDateTo]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.search.value.trim());
  };

  const handleAddCourse = async () => {
    try {
      await courseService.addCourse(newCourse);
      fetchCourses();
      setNewCourse({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        modules: [],
        classMeetingLink: "",
      });
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <div className="flex py-6 h-full w-full text-zinc-950 bg-slate-200">
      <div className="w-full p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">Course Management</h2>
        <div className="flex justify-between mb-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="search"
              name="search"
              placeholder="Search courses"
              className="input input-bordered max-w-xs bg-slate-300"
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
          <button onClick={() => document.getElementById('add_course_form').classList.toggle('hidden')} className="btn btn-primary">Add New Course</button>
        </div>
        
        {/* Add Course Form */}
        <div id="add_course_form" className="hidden mb-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2">Add New Course</h3>
          <input
            type="text"
            placeholder="Title"
            className="input input-bordered w-full mt-2 bg-gray-100 text-gray-800"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="textarea textarea-bordered w-full mt-2 bg-gray-100 text-gray-800"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          ></textarea>
          <input
            type="date"
            className="input input-bordered w-full mt-2 bg-gray-100 text-gray-800"
            value={newCourse.startDate}
            onChange={(e) => setNewCourse({ ...newCourse, startDate: e.target.value })}
          />
          <input
            type="date"
            className="input input-bordered w-full mt-2 bg-gray-100 text-gray-800"
            value={newCourse.endDate}
            onChange={(e) => setNewCourse({ ...newCourse, endDate: e.target.value })}
          />
          <input
            type="text"
            placeholder="Class Meeting Link"
            className="input input-bordered w-full mt-2 bg-gray-100 text-gray-800"
            value={newCourse.classMeetingLink}
            onChange={(e) => setNewCourse({ ...newCourse, classMeetingLink: e.target.value })}
          />
          <button onClick={handleAddCourse} className="btn btn-primary mt-2">Add Course</button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full bg-slate-200">
            <thead className="text-zinc-950">
              <tr>
                <th>Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Assigned Teacher</th>
                <th>Modules</th>
                <th>Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.startDate}</td>
                  <td>{course.endDate}</td>
                  <td>{course.assignedTeacher ? course.assignedTeacher.name : 'Not assigned'}</td>
                  <td>
                    {course.modules && course.modules.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {course.modules.map((module, index) => (
                          <li key={index}>{module.title}</li>
                        ))}
                      </ul>
                    ) : (
                      'No modules'
                    )}
                  </td>
                  <td>
                    {course.schedules && course.schedules.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {course.schedules.map((schedule, index) => (
                          <li key={index}>{schedule.days} at {schedule.timeSlot}</li>
                        ))}
                      </ul>
                    ) : (
                      'Not scheduled'
                    )}
                  </td>
                  <td>
                    <Link href={`/course/${course.id}`} className="btn btn-outline btn-info btn-xs mr-2">
                      View Details
                    </Link>
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