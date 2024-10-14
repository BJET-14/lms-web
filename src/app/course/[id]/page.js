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
  const [newSchedule, setNewSchedule] = useState({ days: "", timeSlot: "" });
  const [newModule, setNewModule] = useState({ title: "", description: "" });
  const [courseSchedules, setCourseSchedules] = useState({});
  const [assignedTeacher, setAssignedTeacher] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
      fetchTeachers();
      fetchCourseSchedule();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const data = await courseService.getCourseById(id);
      setCourse(data);
      if (data.teacherId) {
        fetchAssignedTeacherDetails(data.teacherId);
      } else {
        setAssignedTeacher(null);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      alert("Failed to fetch course details. Please try again.");
    }
  };

  const fetchAssignedTeacherDetails = async (teacherId) => {
    try {
      const teacherData = await userService.getUserById(teacherId);
      setAssignedTeacher(teacherData);
    } catch (error) {
      console.error("Error fetching assigned teacher details:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const data = await userService.getUsers({ role: 'TEACHER' });
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      alert("Failed to fetch teachers. Please try again.");
    }
  };

  const fetchCourseSchedule = async () => {
    try {
      const scheduleData = await courseService.getCourseSchedule(id);
      setCourseSchedules({ [id]: scheduleData });
    } catch (error) {
      console.error("Error fetching course schedule:", error);
      alert("Failed to fetch course schedule. Please try again.");
    }
  };

  const handleAssignTeacher = async () => {
    try {
      if (!selectedTeacher) {
        alert("Please select a teacher to assign.");
        return;
      }
      await courseService.assignTeacher(id, { teacherId: selectedTeacher });
      fetchCourseDetails();
      setSelectedTeacher("");
    } catch (error) {
      console.error("Error assigning teacher:", error);
      alert(`Failed to assign teacher: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleScheduleCourse = async () => {
    try {
      if (!newSchedule.days || !newSchedule.timeSlot) {
        alert("Please select both day and time slot for scheduling.");
        return;
      }
      const scheduleRequest = {
        schedules: [newSchedule]
      };
      await courseService.scheduleCourse(id, scheduleRequest);
      fetchCourseSchedule();
      setNewSchedule({ days: "", timeSlot: "" });
    } catch (error) {
      console.error("Error scheduling course:", error);
      alert(`Failed to schedule course: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleAddModule = async () => {
    try {
      if (!newModule.title || !newModule.description) {
        alert("Please provide both title and description for the new module.");
        return;
      }
      const updatedModules = [...(course.modules || []), newModule];
      const updatedCourse = {
        ...course,
        modules: updatedModules
      };
      await courseService.updateCourse(id, updatedCourse);
      fetchCourseDetails();
      setNewModule({ title: "", description: "" });
    } catch (error) {
      console.error("Error adding module:", error);
      alert(`Failed to add module: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      await courseService.deleteModule(id, moduleId);
      fetchCourseDetails();
    } catch (error) {
      console.error("Error deleting module:", error);
      alert(`Failed to delete module: ${error.response?.data?.message || error.message}`);
    }
  };

  const renderSchedules = (courseId) => {
    const schedules = courseSchedules[courseId];
    if (!schedules || schedules.length === 0) return 'Not scheduled';
    return (
      <ul className="list-disc list-inside">
        {schedules.map((schedule, index) => (
          <li key={index}>{schedule.days} at {schedule.timeSlot}</li>
        ))}
      </ul>
    );
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
          {assignedTeacher ? (
            <p className="text-gray-700">
              {assignedTeacher.firstName} {assignedTeacher.lastName} (ID: {assignedTeacher.id})
            </p>
          ) : (
            <p className="text-gray-700">No teacher assigned</p>
          )}
        </div>

        <div className="mt-6">
          <h4 className="font-bold text-gray-800">Schedule</h4>
          {renderSchedules(id)}
        </div>

        <div className="mt-6">
          <h4 className="font-bold text-gray-800">Modules</h4>
          {course.modules && course.modules.length > 0 ? (
            <ul>
              {course.modules.map((module) => (
                <li key={module.id} className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">{module.title} - {module.description}</span>
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
          <h4 className="font-bold mb-2 text-gray-800 ">Add Module</h4>
          <input
            type="text"
            placeholder="Module Title"
            className="input input-bordered w-full max-w-xs bg-gray-100 text-gray-800 mb-2"
            value={newModule.title}
            onChange={(e) => setNewModule({...newModule, title: e.target.value})}
          />
          <input
            type="text"
            placeholder="Module Description"
            className="input input-bordered w-full max-w-xs bg-gray-100 text-gray-800 mb-2"
            value={newModule.description}
            onChange={(e) => setNewModule({...newModule, description: e.target.value})}
          />
          <button onClick={handleAddModule} className="btn btn-primary text-white bg-sky-500 hover:bg-sky-700">Add Module</button>
        </div>

        <div className="mt-6">
          <h4 className="font-bold mb-2 text-gray-800">Schedule Course</h4>
          <select 
            className="select select-bordered w-full max-w-xs bg-gray-100 text-gray-800 mb-2"
            value={newSchedule.days}
            onChange={(e) => setNewSchedule({...newSchedule, days: e.target.value})}
          >
            <option disabled value="">Select a day</option>
            {days.map((day, index) => (
              <option key={index} value={day}>{day}</option>
            ))}
          </select>
          <select 
            className="select select-bordered w-full max-w-xs bg-gray-100 text-gray-800 mb-2"
            value={newSchedule.timeSlot}
            onChange={(e) => setNewSchedule({...newSchedule, timeSlot: e.target.value})}
          >
            <option disabled value="">Select a time slot</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>{slot}</option>
            ))}
          </select>
          <button onClick={handleScheduleCourse} className="btn btn-primary text-white bg-sky-500 hover:bg-sky-700">Add Schedule</button>
        </div>

        <div className="mt-6">
          <h4 className="font-bold mb-2 text-gray-800">Assign Teacher</h4>
          <select 
            className="select select-bordered w-full max-w-xs bg-gray-100 text-gray-800 mb-2"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option disabled value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName} (ID: {teacher.id})
              </option>
            ))}
          </select>
          <button onClick={handleAssignTeacher} className="btn btn-primary text-white bg-sky-500 hover:bg-sky-700">Assign Teacher</button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;