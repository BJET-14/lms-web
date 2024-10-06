"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthToken } from "../utils/api";

const teachers = [
  "Ms. Johnson",
  "Mr. Thompson",
  "Dr. Lee",
  "Prof. Patel",
  "Ms. Rodriguez",
  "Dr. Brown",
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = ["AM_9", "AM_11"];

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
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const fetchCourses = async (query = "") => {
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        console.error("No authentication token found");
        return;
      }

      const response = await axios.get(
        `http://localhost:8055/operations/courses?asPage=false&page=0&size=20&title=${query}`,
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

  useEffect(() => {
    fetchCourses(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.search.value.trim());
  };

  const handleAddCourse = async () => {
    try {
      const authToken = getAuthToken();
      await axios.post(
        "http://localhost:8055/operations/courses",
        newCourse,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      fetchCourses();
      document.getElementById('add_course_modal').checked = false;
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

  const handleAssignTeacher = async () => {
    try {
      const authToken = getAuthToken();
      await axios.post(
        `http://localhost:8055/operations/courses/${selectedCourseId}/assign-teacher`,
        { teacherId: teachers.indexOf(selectedTeacher) + 1 },
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      fetchCourses();
      document.getElementById('assign_teacher_modal').checked = false;
      setSelectedTeacher("");
      setSelectedCourseId(null);
    } catch (error) {
      console.error("Error assigning teacher:", error);
    }
  };

  const handleScheduleCourse = async () => {
    try {
      const authToken = getAuthToken();
      await axios.post(
        `http://localhost:8055/operations/courses/${selectedCourseId}/schedule`,
        { 
          courseId: selectedCourseId, 
          schedules: [{ days: [selectedDay], timeSlot: selectedTime }] 
        },
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      fetchCourses();
      document.getElementById('schedule_course_modal').checked = false;
      setSelectedDay("");
      setSelectedTime("");
      setSelectedCourseId(null);
    } catch (error) {
      console.error("Error scheduling course:", error);
    }
  };

  const handleDeleteModule = async (courseId, moduleId) => {
    try {
      const authToken = getAuthToken();
      await axios.delete(
        `http://localhost:8055/operations/courses/${courseId}/modules/${moduleId}`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      fetchCourses();
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const authToken = getAuthToken();
      await axios.delete(
        `http://localhost:8055/operations/courses/${courseId}`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
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
            <button type="submit" className="btn btn-success ml-4">
              Search
            </button>
          </form>
          <label htmlFor="add_course_modal" className="btn btn-primary">Add New Course</label>
        </div>
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
                    <label 
                      htmlFor="assign_teacher_modal" 
                      className="btn btn-outline btn-warning btn-xs mr-2"
                      onClick={() => setSelectedCourseId(course.id)}
                    >
                      Assign Teacher
                    </label>
                    <label 
                      htmlFor="schedule_course_modal" 
                      className="btn btn-outline btn-success btn-xs mr-2"
                      onClick={() => setSelectedCourseId(course.id)}
                    >
                      Schedule
                    </label>
                    <button onClick={() => handleDeleteModule(course.id, course.modules[0]?.id)} className="btn btn-outline btn-error btn-xs mr-2">Delete Module</button>
                    <button onClick={() => handleDeleteCourse(course.id)} className="btn btn-outline btn-error btn-xs">Delete Course</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Course Modal */}
      <input type="checkbox" id="add_course_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box bg-white text-gray-800">
          <h3 className="font-bold text-lg text-gray-900">Add New Course</h3>
          <input
            type="text"
            placeholder="Title"
            className="input input-bordered w-full mt-4 bg-gray-100 text-gray-800"
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
          <div className="modal-action">
            <button onClick={handleAddCourse} className="btn btn-primary">Add Course</button>
            <label htmlFor="add_course_modal" className="btn btn-ghost">Close</label>
          </div>
        </div>
      </div>

      {/* Assign Teacher Modal */}
      <input type="checkbox" id="assign_teacher_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box bg-white text-gray-800">
          <h3 className="font-bold text-lg text-gray-900">Assign Teacher</h3>
          <select 
            className="select select-bordered w-full mt-4 bg-gray-100 text-gray-800"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option disabled value="">Select a teacher</option>
            {teachers.map((teacher, index) => (
              <option key={index} value={teacher}>{teacher}</option>
            ))}
          </select>
          <div className="modal-action">
            <button onClick={handleAssignTeacher} className="btn btn-primary">Assign</button>
            <label htmlFor="assign_teacher_modal" className="btn btn-ghost">Close</label>
          </div>
        </div>
      </div>

      {/* Schedule Course Modal */}
      <input type="checkbox" id="schedule_course_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box bg-white text-gray-800">
          <h3 className="font-bold text-lg text-gray-900">Schedule Course</h3>
          <select 
            className="select select-bordered w-full mt-4 bg-gray-100 text-gray-800"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            <option disabled value="">Select a day</option>
            {days.map((day, index) => (
              <option key={index} value={day}>{day}</option>
            ))}
          </select>
          <select 
            className="select select-bordered w-full mt-2 bg-gray-100 text-gray-800"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option disabled value="">Select a time slot</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>{slot}</option>
            ))}
          </select>
          <div className="modal-action">
            <button onClick={handleScheduleCourse} className="btn btn-primary">Schedule</button>
            <label htmlFor="schedule_course_modal" className="btn btn-ghost">Close</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;