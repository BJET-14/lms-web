"use client"
import React, { useState, useEffect } from "react";
import { courseService, userService } from "../utils/api";
import Link from 'next/link';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [courseSchedules, setCourseSchedules] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    modules: [],
    classMeetingLink: "",
  });
  const [newModule, setNewModule] = useState({ title: "", description: "" });
  const [startDateFrom, setStartDateFrom] = useState("");
  const [startDateTo, setStartDateTo] = useState("");
  const [assignedTeachers, setAssignedTeachers] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        fetchCourseSchedule(course.id);
        if (course.teacherId) {
          fetchAssignedTeacherDetails(course.id, course.teacherId);
        }
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchCourseSchedule = async (courseId) => {
    try {
      const scheduleData = await courseService.getCourseSchedule(courseId);
      setCourseSchedules(prev => ({...prev, [courseId]: scheduleData}));
    } catch (error) {
      console.error(`Error fetching schedule for course ${courseId}:`, error);
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
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleAddModule = () => {
    if (newModule.title && newModule.description) {
      setNewCourse({
        ...newCourse,
        modules: [...newCourse.modules, newModule]
      });
      setNewModule({ title: "", description: "" });
    } else {
      alert("Please provide both title and description for the module.");
    }
  };

  const handleRemoveModule = (index) => {
    const updatedModules = newCourse.modules.filter((_, i) => i !== index);
    setNewCourse({ ...newCourse, modules: updatedModules });
  };

  const renderAssignedTeacher = (courseId) => {
    const teacher = assignedTeachers[courseId];
    if (!teacher) return 'Not assigned';
    return `${teacher.firstName} ${teacher.lastName} (ID: ${teacher.id})`;
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
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">Add New Course</button>
        </div>
        
        {/* Course Table */}
        <div className="overflow-x-auto">
          <table className="table w-full bg-slate-200">
            <thead className="text-zinc-950">
              <tr>
                <th>Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Assigned Teacher</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.startDate}</td>
                  <td>{course.endDate}</td>
                  <td>{renderAssignedTeacher(course.id)}</td>
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

        {/* Modal for Adding New Course */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Course</h3>
                <div className="mt-2 px-7 py-3">
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
                  
                  {/* Module Addition */}
                  <div className="mt-4">
                    <h4 className="font-bold text-gray-800">Add Modules</h4>
                    <input
                      type="text"
                      placeholder="Module Title"
                      className="input input-bordered w-full mt-2 bg-gray-100 text-gray-800"
                      value={newModule.title}
                      onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Module Description"
                      className="input input-bordered w-full mt-2 bg-gray-100 text-gray-800"
                      value={newModule.description}
                      onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                    />
                    <button onClick={handleAddModule} className="btn btn-primary mt-2">Add Module</button>
                  </div>

                  {/* Display added modules */}
                  {newCourse.modules.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-bold text-gray-800">Added Modules:</h4>
                      <ul>
                        {newCourse.modules.map((module, index) => (
                          <li key={index} className="flex justify-between items-center mt-2">
                            <span>{module.title} - {module.description}</span>
                            <button onClick={() => handleRemoveModule(index)} className="btn btn-error btn-xs">Remove</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="items-center px-4">
                  <button
                    id="ok-btn"
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={handleAddCourse}
                  >
                    Add Course
                  </button>
                  <button
                    id="cancel-btn"
                    className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;