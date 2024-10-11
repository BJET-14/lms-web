"use client"
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { courseService, getUserRole, userService, teacherService, studentService } from '../utils/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [resultData, setResultData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = getUserRole();
        const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage after login
        let userResponse;
        
        if (role === 'TEACHER') {
          userResponse = await teacherService.getTeacherById(userId);
        } else if (role === 'STUDENT') {
          userResponse = await studentService.getStudentById(userId);
        } else {
          userResponse = await userService.getUserById(userId);
        }
        
        const { firstName, lastName } = userResponse;
        setUserData({ name: `${firstName} ${lastName}`, role });

        if (role === 'TEACHER') {
          const coursesResponse = await courseService.getCourses();

          // First, filter out courses without a teacherId
          const coursesWithTeacher = coursesResponse.filter(course => course.teacherId != null);
          
          // Then, filter courses based on the userId
          const filteredCourses = coursesWithTeacher.filter(course => String(course.teacherId) === String(userId));
          
          setCourseData(filteredCourses);
        } else if (role === 'STUDENT') {
          const enrollmentsResponse = await courseService.getEnrollments(userId);
          setCourseData(enrollmentsResponse);
        }

        // Mock data for attendance and results (unchanged)
        setAttendanceData([
          { name: 'Present', value: 80 },
          { name: 'Absent', value: 20 },
        ]);

        setResultData([
          { day: 'Mon', score: 15 },
          { day: 'Tue', score: 18 },
          { day: 'Wed', score: 14 },
          { day: 'Thu', score: 16 },
          { day: 'Fri', score: 19 },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  if (!userData) {
    return <div className="text-center p-4 text-black">Loading...</div>;
  }

  return (
    <div className="p-6 bg-slate-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Welcome, {userData.name}!</h1>
      
      {userData.role !== 'ADMIN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Courses Section */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-black">
              {userData.role === 'TEACHER' ? 'Assigned Courses' : 'Enrolled Courses'}
            </h2>
            <div className="overflow-y-auto max-h-60">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="text-left text-black">Course</th>
                    {userData.role === 'TEACHER' && <th className="text-left text-black">Students</th>}
                  </tr>
                </thead>
                <tbody>
                  {courseData.map((course) => (
                    <tr key={course.id}>
                      <td className="text-black">{course.title}</td>
                      {userData.role === 'TEACHER' && (
                        <td className="text-black">{course.enrolledStudents || 0}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance/Enrollment Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-black">
              {userData.role === 'TEACHER' ? 'Total Enrolled Students' : 'Attendance'}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              {userData.role === 'TEACHER' ? (
                <BarChart data={courseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" tick={{fill: 'black'}} />
                  <YAxis tick={{fill: 'black'}} />
                  <Tooltip contentStyle={{backgroundColor: 'white', color: 'black'}} />
                  <Legend wrapperStyle={{color: 'black'}} />
                  <Bar dataKey="enrolledStudents" fill="#8884d8" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: 'white', color: 'black'}} />
                  <Legend wrapperStyle={{color: 'black'}} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Results Graph */}
          <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-black">Performance Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resultData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{fill: 'black'}} />
                <YAxis domain={[0, 20]} tick={{fill: 'black'}} />
                <Tooltip contentStyle={{backgroundColor: 'white', color: 'black'}} />
                <Legend wrapperStyle={{color: 'black'}} />
                <Bar dataKey="score" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;