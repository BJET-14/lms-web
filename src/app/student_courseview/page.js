'use client';
import React, { useState, useEffect } from "react";
import { courseService, userService } from "../utils/api";

const StudentCourseView = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
        try {
          const userData = await userService.getUserById(storedUserId);
          setUserName(`${userData.firstName} ${userData.lastName}`);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
    fetchCoursesAndEnrollments();
  }, [searchQuery]);

  const fetchCoursesAndEnrollments = async () => {
    setIsLoading(true);
    try {
      const coursesResponse = await courseService.getCourses({
        title: searchQuery,
        asPage: false,
        page: 0,
        size: 20,
      });

      const enrollmentStatus = {};
      for (const course of coursesResponse) {
        try {
          const enrollmentResponse = await courseService.getEnrollments(course.id);
          studentId = Number(localStorage.getItem("userId"));

          enrollmentStatus[course.id] = enrollmentResponse.some(
            enrollment => parseIntenrollment.studentId == studentId
          );
          console.log("Enrollment Status:", enrollmentStatus);

        } catch (error) {
          console.error(`Error fetching enrollment for course ${course.id}:`, error);
          enrollmentStatus[course.id] = false;
        }
      }

      setEnrolledCourses(enrollmentStatus);
      setCourses(coursesResponse);
    } catch (error) {
      console.error("Error fetching courses and enrollments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.search.value.trim());
  };

  const handleEnroll = async (courseId) => {
    try {
      await courseService.enrollStudent(courseId, { studentId: parseInt(userId) });
      setEnrolledCourses(prev => ({ ...prev, [courseId]: true }));
      alert("Course Enrollment Successful!");
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert("Failed to enroll in the course. Please try again.");
    }
  };

  const handleViewDetails = async (course) => {
    setSelectedCourse(course);
    if (enrolledCourses[course.id]) {
      await fetchPosts(course.id);
    }
  };

  const fetchPosts = async (courseId) => {
    try {
      const response = await courseService.getCoursePost(courseId);
      setPosts(response);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;

    try {
      const postData = {
        message: newPost,
        postedBy: userId,
        postedOn: new Date().toISOString(),
      };
      await courseService.createCoursePost(selectedCourse.id, postData);
      await fetchPosts(selectedCourse.id);
      setNewPost("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
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
                <button type="submit" className="btn btn-success ml-4">Search</button>
              </form>
            </div>

            {isLoading ? (
              <div className="text-center">Loading courses...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full ml-12 mr-12">
                {courses.map((course) => (
                  <div key={course.id} className="card border-stone-950 bg-slate-100 shadow-xl flex flex-col p-4 transition-all duration-300 ease-in-out border-solid border-2 border-sky-500">
                    <div className="card-body flex flex-col justify-between h-full">
                      <h3 className="card-title text-lg font-semibold">{course.title}</h3>
                      <p>Description: {course.description.length > 150 ? `${course.description.substring(0, 150)}...[See more]` : course.description}</p>
                      <p>Start Date: {course.startDate}</p>
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
                            enrolledCourses[course.id]
                              ? "bg-slate-300"
                              : "bg-gradient-to-r from-cyan-500 to-blue-500"
                          } hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`}
                          disabled={enrolledCourses[course.id]}
                        >
                          {enrolledCourses[course.id] ? "Enrolled" : "Enroll"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="details-view bg-white p-6 rounded-md shadow-md">
            <h1 className="text-3xl font-bold mb-4">{selectedCourse.title}</h1>
            <p className="text-lg mb-4">{selectedCourse.description}</p>
            <p className="text-sm">Start Date: {selectedCourse.startDate}</p>

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
                    <td className="border border-gray-300 px-4 py-2" colSpan="2">
                      No modules available for this course.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {enrolledCourses[selectedCourse.id] && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Class Posts</h2>
                <div className="mb-4">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Write a new post..."
                    className="w-full p-2 border rounded bg-slate-300"
                  />
                  <button
                    onClick={handlePostSubmit}
                    className="mt-2 bg-sky-400 text-white p-2 rounded"
                  >
                    Post
                  </button>
                </div>
                {posts.map((post) => (
                  <div key={post.id} className="border p-4 rounded-md bg-white shadow-md mt-4">
                    <p><strong>{post.postedBy === userId ? 'You' : post.postedBy}</strong></p>
                    <p>{post.message}</p>
                    <p className="text-sm text-gray-500">Posted on: {new Date(post.postedOn).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setSelectedCourse(null)}
              className="mt-6 btn btn-primary bg-sky-400"
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