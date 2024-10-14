'use client';
import React, { useState, useEffect } from 'react';
import { examService, courseService, userService } from '../utils/api';
import { Plus, Download, Upload, Eye } from 'lucide-react';
import { saveAs } from 'file-saver';

const ExamManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newExam, setNewExam] = useState({
    name: '',
    description: '',
    googleFormLink: '',
    fullMark: 0,
    passMark: 0,
    type: 'Daily'
  });
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [file, setFile] = useState(null);
  const [openExamId, setOpenExamId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserRole(storedUserId);
    } else {
      window.location.href = '/authorization';
    }
  }, []);

  useEffect(() => {
    if (userRole) {
      fetchCourses();
    }
  }, [userRole]);

  const fetchUserRole = async (userId) => {
    try {
      const userDetails = await userService.getUserById(userId);
      setUserRole(userDetails.role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      let coursesData;
      if (userRole === 'ADMIN') {
        coursesData = await courseService.getCourses();
      } else if (userRole === 'TEACHER') {
        const coursesResponse = await courseService.getCourses();

        // First, filter out courses without a teacherId
        const coursesWithTeacher = coursesResponse.filter(course => course.teacherId != null);
        
        // Then, filter courses based on the userId
        const filteredCourses = coursesWithTeacher.filter(course => String(course.teacherId) === String(userId));

        coursesData = filteredCourses;
      } else if (userRole === 'STUDENT') {
        coursesData = await courseService.getEnrollments(userId);
      }
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchExams = async (courseId) => {
    try {
      const examsData = await examService.getCourseExams(courseId);
      setExams(prevExams => ({ ...prevExams, [courseId]: examsData }));
    } catch (error) {
      console.error(`Error fetching exams for course ${courseId}:`, error);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    fetchExams(course.id);
  };

  const handleAddExam = async () => {
    if (!selectedCourse) return;

    try {
      const newExamData = await examService.addCourseExam(selectedCourse.id, newExam);
      setExams(prevExams => ({
        ...prevExams,
        [selectedCourse.id]: [...(prevExams[selectedCourse.id] || []), newExamData]
      }));
      setNewExam({
        name: '',
        description: '',
        googleFormLink: '',
        fullMark: 0,
        passMark: 0,
        type: 'Daily'
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding new exam:", error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUploadResult = async (examId) => {
    if (!selectedCourse || !file) return;
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      await examService.uploadExamResults(selectedCourse.id, examId, formData);
      console.log("Result uploaded successfully");
    } catch (error) {
      console.error("Error uploading result:", error);
    }
  };

  const handleDownloadTemplate = async (examId) => {
    if (!selectedCourse) return;
    try {
      const response = await examService.getExamTemplate(selectedCourse.id, examId);
      
      let blob;
      let filename = 'template.xlsx';
  
      if (response instanceof Blob) {
        blob = response;
      } else if (response.data instanceof Blob) {
        blob = response.data;
      } else {
        // If it's not already a Blob, create one
        blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      }
  
      // Try to get filename from Content-Disposition header if available
      const contentDisposition = response.headers?.['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
  
      saveAs(blob, filename);
      console.log("Template downloaded successfully");
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };
  
  const handleDownloadResult = async (examId) => {
    if (!selectedCourse) return;
    try {
      const response = await examService.getExamResult(selectedCourse.id, examId);
      
      let blob;
      let filename = 'result.xlsx';
  
      if (response instanceof Blob) {
        blob = response;
      } else if (response.data instanceof Blob) {
        blob = response.data;
      } else {
        // If it's not already a Blob, create one
        blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      }
  
      // Try to get filename from Content-Disposition header if available
      const contentDisposition = response.headers?.['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
  
      saveAs(blob, filename);
      console.log("Result downloaded successfully");
    } catch (error) {
      console.error("Error downloading result:", error);
    }
  };

  const toggleExamDetails = (examId) => {
    setOpenExamId(openExamId === examId ? null : examId);
  };

  if (!userRole) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 bg-base-100 min-h-screen" data-theme="light">
      <h1 className="text-3xl font-bold mb-6 text-base-content">Exam Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-base-200 rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 text-base-content">Courses</h2>
          <ul className="menu bg-base-100 w-full rounded-box">
            {courses.map(course => (
              <li key={course.id}>
                <a 
                  className={selectedCourse?.id === course.id ? 'active' : ''}
                  onClick={() => handleCourseSelect(course)}
                >
                  {course.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-base-200 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-base-content">Exams</h2>
            {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
              <label htmlFor="create-exam-modal" className="btn btn-primary btn-sm">
                <Plus size={16} className="mr-2" /> Create Exam
              </label>
            )}
          </div>
          {selectedCourse && (
            <ul className="menu bg-base-100 w-full rounded-box">
              {exams[selectedCourse.id]?.map(exam => (
                <li key={exam.id}>
                  <details>
                    <summary className="flex justify-between items-center">
                      <span>{exam.name}</span>
                      <div className="flex">
                        <button className="btn btn-ghost btn-xs" onClick={(e) => { e.stopPropagation(); handleDownloadTemplate(exam.id); }}>
                          <Download size={16} />
                        </button>
                        <button className="btn btn-ghost btn-xs" onClick={(e) => { e.stopPropagation(); handleUploadResult(exam.id); }}>
                          <Upload size={16} />
                        </button>
                        <button className="btn btn-ghost btn-xs" onClick={(e) => { e.stopPropagation(); handleDownloadResult(exam.id); }}>
                          <Eye size={16} />
                        </button>
                      </div>
                    </summary>
                    <ul>
                      <li><a>Description: {exam.description}</a></li>
                      <li><a>Full Mark: {exam.fullMark}</a></li>
                      <li><a>Pass Mark: {exam.passMark}</a></li>
                      <li><a>Type: {exam.type}</a></li>
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <input type="checkbox" id="create-exam-modal" className="modal-toggle" checked={showModal} onChange={() => setShowModal(!showModal)} />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create New Exam</h3>
          <input 
            type="text" 
            value={newExam.name} 
            onChange={(e) => setNewExam({...newExam, name: e.target.value})}
            placeholder="Exam Name"
            className="input input-bordered w-full mt-2"
          />
          <input 
            type="text" 
            value={newExam.description} 
            onChange={(e) => setNewExam({...newExam, description: e.target.value})}
            placeholder="Description"
            className="input input-bordered w-full mt-2"
          />
          <input 
            type="text" 
            value={newExam.googleFormLink} 
            onChange={(e) => setNewExam({...newExam, googleFormLink: e.target.value})}
            placeholder="Google Form Link"
            className="input input-bordered w-full mt-2"
          />
          <input 
            type="number" 
            value={newExam.fullMark} 
            onChange={(e) => setNewExam({...newExam, fullMark: parseInt(e.target.value)})}
            placeholder="Full Mark"
            className="input input-bordered w-full mt-2"
          />
          <input 
            type="number" 
            value={newExam.passMark} 
            onChange={(e) => setNewExam({...newExam, passMark: parseInt(e.target.value)})}
            placeholder="Pass Mark"
            className="input input-bordered w-full mt-2"
          />
          <select 
            value={newExam.type} 
            onChange={(e) => setNewExam({...newExam, type: e.target.value})}
            className="select select-bordered w-full mt-2"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
          <div className="modal-action">
            <label htmlFor="create-exam-modal" className="btn btn-ghost">Cancel</label>
            <button onClick={handleAddExam} className="btn btn-primary">Create Exam</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamManagementPage;