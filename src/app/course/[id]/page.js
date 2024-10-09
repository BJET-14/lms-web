"use client"

import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { courseService, userService } from "../../utils/api";

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const timeSlots = ["AM_9", "AM_11"];

const CourseDetails = () => {
  const params = useParams();
  const id = params.id;
  const [course, setCourse] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
      fetchTeachers();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const data = await courseService.getCourseById(id);
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course details:", error);
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

  const handleAssignTeacher = async () => {
    try {
      await courseService.assignTeacher(id, { teacherId: selectedTeacher });
      fetchCourseDetails();
      setSelectedTeacher("");
    } catch (error) {
      console.error("Error assigning teacher:", error);
    }
  };

  const handleScheduleCourse = async () => {
    try {
      const scheduleRequest = {
        courseId: id,
        schedules: [
          {
            id: 0,
            days: selectedDay,
            timeSlot: selectedTime
          }
        ]
      };
      await courseService.scheduleCourse(id, scheduleRequest);
      fetchCourseDetails();
      setSelectedDay("");
      setSelectedTime("");
    } catch (error) {
      console.error("Error scheduling course:", error.response?.data || error.message);
      alert(`Failed to schedule course: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      await courseService.deleteModule(id, moduleId);
      fetchCourseDetails();
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  if (!course) {
    return <div className="text-gray-800">Loading...</div>;
  }

  return (
    <div className="p-6 bg-slate-200 min-h-screen text-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Course Details</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{course.title}</h3>
        <p className="text-gray-700"><strong>Description:</strong> {course.description}</p>
        <p className="text-gray-700"><strong>Start Date:</strong> {course.startDate}</p>
        <p className="text-gray-700"><strong>End Date:</strong> {course.endDate}</p>
        <p className="text-gray-700"><strong>Class Meeting Link:</strong> {course.classMeetingLink}</p>

        <div className="mt-6">
          <h4 className="font-bold text-gray-800">Assigned Teacher</h4>
          <p className="text-gray-700">{course.assignedTeacher ? course.assignedTeacher.name : 'No teacher assigned'}</p>
        </div>

        <div className="mt-6">
          <h4 className="font-bold text-gray-800">Schedule</h4>
          {course.schedules && course.schedules.length > 0 ? (
            course.schedules.map((schedule, index) => (
              <p key={index} className="text-gray-700">{schedule.days} at {schedule.timeSlot}</p>
            ))
          ) : (
            <p className="text-gray-700">No schedule set</p>
          )}
        </div>

        <div className="mt-6">
          <h4 className="font-bold text-gray-800">Modules</h4>
          {course.modules && course.modules.length > 0 ? (
            <ul>
              {course.modules.map((module) => (
                <li key={module.id} className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">{module.title}</span>
                  <button 
                    onClick={() => handleDeleteModule(module.id)} 
                    className="btn btn-outline btn-error btn-xs text-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No modules added</p>
          )}
        </div>

        <div className="mt-6">
          <h4 className="font-bold mb-2 text-gray-800">Assign Teacher</h4>
          <select 
            className="select select-bordered w-full max-w-xs bg-gray-100 text-gray-800"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option disabled value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
            ))}
          </select>
          <button onClick={handleAssignTeacher} className="btn btn-primary mt-2 text-white">Assign Teacher</button>
        </div>

        <div className="mt-6">
          <h4 className="font-bold mb-2 text-gray-800">Schedule Course</h4>
          <select 
            className="select select-bordered w-full max-w-xs bg-gray-100 text-gray-800 mb-2"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            <option disabled value="">Select a day</option>
            {days.map((day, index) => (
              <option key={index} value={day}>{day}</option>
            ))}
          </select>
          <select 
            className="select select-bordered w-full max-w-xs bg-gray-100 text-gray-800 mb-2"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option disabled value="">Select a time slot</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>{slot}</option>
            ))}
          </select>
          <button onClick={handleScheduleCourse} className="btn btn-primary text-white">Schedule Course</button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;