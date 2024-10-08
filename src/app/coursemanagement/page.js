"use client"
import React, { useState, useEffect } from "react";
import { courseService, userService } from "../utils/api";

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const timeSlots = ["AM_9", "AM_11"];

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
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
  const [startDateFrom, setStartDateFrom] = useState("");
  const [startDateTo, setStartDateTo] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

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

  const fetchTeachers = async () => {
    try {
      const data = await userService.getUsers({ role: 'TEACHER' });
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, [searchQuery, startDateFrom, startDateTo]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.search.value.trim());
  };

  const handleAddCourse = async () => {
    try {
      await courseService.addCourse(newCourse);
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
      await courseService.assignTeacher(selectedCourseId, { teacherId: selectedTeacher });
      fetchCourses();
      if (selectedCourse && selectedCourse.id === selectedCourseId) {
        await handleViewDetails(selectedCourseId);
      }
      document.getElementById('assign_teacher_modal').checked = false;
      setSelectedTeacher("");
      setSelectedCourseId(null);
    } catch (error) {
      console.error("Error assigning teacher:", error);
    }
  };

  const handleScheduleCourse = async () => {
    try {
      const scheduleRequest = {
        courseId: selectedCourseId,
        schedules: [
          {
            id: 0,
            days: selectedDay,
            timeSlot: selectedTime
          }
        ]
      };
      await courseService.scheduleCourse(selectedCourseId, scheduleRequest);
      fetchCourses();
      if (selectedCourse && selectedCourse.id === selectedCourseId) {
        await handleViewDetails(selectedCourseId);
      }
      document.getElementById('schedule_course_modal').checked = false;
      setSelectedDay("");
      setSelectedTime("");
      setSelectedCourseId(null);
    } catch (error) {
      console.error("Error scheduling course:", error.response?.data || error.message);
      alert(`Failed to schedule course: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteModule = async (courseId, moduleId) => {
    try {
      await courseService.deleteModule(courseId, moduleId);
      fetchCourses();
      if (selectedCourse && selectedCourse.id === courseId) {
        await handleViewDetails(courseId);
      }
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  const handleViewDetails = async (courseId) => {
    try {
      const courseDetails = await courseService.getCourseById(courseId);
      setSelectedCourse(courseDetails);
      document.getElementById('view_details_modal').checked = true;
    } catch (error) {
      console.error("Error fetching course details:", error);
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
          <label htmlFor="add_course_modal" className="btn btn-primary">Add New Course</label>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full bg-slate-200">
            <thead className="text-zinc-950">
              <tr>
                <th>Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.startDate}</td>
                  <td>{course.endDate}</td>
                  <td>
                    <button 
                      onClick={() => handleViewDetails(course.id)} 
                      className="btn btn-outline btn-info btn-xs mr-2"
                    >
                      View Details
                    </button>
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
                    <button 
                      onClick={() => handleDeleteModule(course.id, course.modules[0]?.id)} 
                      className="btn btn-outline btn-error btn-xs mr-2"
                    >
                      Delete Module
                    </button>
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
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
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

      {/* View Details Modal */}
      <input type="checkbox" id="view_details_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box bg-white text-gray-800">
          <h3 className="font-bold text-lg text-gray-900">Course Details</h3>
          {selectedCourse && (
            <div>
              <p><strong>Title:</strong> {selectedCourse.title}</p>
              <p><strong>Description:</strong> {selectedCourse.description}</p>
              <p><strong>Start Date:</strong> {selectedCourse.startDate}</p>
              <p><strong>End Date:</strong> {selectedCourse.endDate}</p>
              <p><strong>Class Meeting Link:</strong> {selectedCourse.classMeetingLink}</p>
              <h4 className="font-bold mt-4">Assigned Teacher</h4>
              <p>{selectedCourse.assignedTeacher ? selectedCourse.assignedTeacher.name : 'No teacher assigned'}</p>
              <h4 className="font-bold mt-4">Schedule</h4>
              {selectedCourse.schedules && selectedCourse.schedules.length > 0 ? (
                selectedCourse.schedules.map((schedule, index) => (
                  <p key={index}>{schedule.days} at {schedule.timeSlot}</p>
                ))
              ) : (
                <p>No schedule set</p>
              )}
              <h4 className="font-bold mt-4">Modules</h4>
              {selectedCourse.modules && selectedCourse.modules.length > 0 ? (
                <ul>
                  {selectedCourse.modules.map((module, index) => (
                    <li key={index}>{module.title}</li>
                  ))}
                </ul>
              ) : (
                <p>No modules added</p>
              )}
            </div>
          )}
          <div className="modal-action">
            <label htmlFor="view_details_modal" className="btn btn-ghost">Close</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;