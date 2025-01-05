"use client"
import React, { useState } from "react";

function Teacher() {
  const [results, setResults] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [trainings, setTrainings] = useState([]);

  const [formData, setFormData] = useState({
    examName: "",
    passingYear: "",
    result: "",
    instituteName: "",
    jobTitle: "",
    companyName: "",
    fromDate: "",
    toDate: "",
    currentlyWorking: false,
    trainingTitle: "",
    providerName: "",
    completionDate: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [editSection, setEditSection] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addOrEditItem = (section) => {
    const stateMap = {
      results: [results, setResults],
      experiences: [experiences, setExperiences],
      trainings: [trainings, setTrainings],
    };

    const [state, setState] = stateMap[section];

    if (isEditing) {
      const updatedItems = state.map((item, index) =>
        index === currentEditIndex ? formData : item
      );
      setState(updatedItems);
      setIsEditing(false);
      setCurrentEditIndex(null);
    } else {
      setState([...state, formData]);
    }

    setFormData({
      examName: "",
      passingYear: "",
      result: "",
      instituteName: "",
      jobTitle: "",
      companyName: "",
      fromDate: "",
      toDate: "",
      currentlyWorking: false,
      trainingTitle: "",
      providerName: "",
      completionDate: "",
    });

    setEditSection("");
  };

  const editItem = (section, index) => {
    const stateMap = {
      results: results,
      experiences: experiences,
      trainings: trainings,
    };

    setFormData(stateMap[section][index]);
    setIsEditing(true);
    setCurrentEditIndex(index);
    setEditSection(section);
  };

  const calculateExperienceTime = (fromDate, toDate, currentlyWorking) => {
    const from = new Date(fromDate);
    const to = currentlyWorking ? new Date() : new Date(toDate);
    const timeDiff = Math.abs(to - from);
    const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
    );
    return `${years} years, ${months} months`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-black">Update Teacher Profile</h2>

        {/* Academic Results */}
        <div className="mb-12 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-black">Academic Result</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="examName"
              value={formData.examName}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-gray-50"
              placeholder="Exam Name"
            />
            <input
              type="text"
              name="passingYear"
              value={formData.passingYear}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-gray-50"
              placeholder="Passing Year"
            />
            <input
              type="text"
              name="result"
              value={formData.result}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-gray-50"
              placeholder="Result"
            />
            <input
              type="text"
              name="instituteName"
              value={formData.instituteName}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-gray-50"
              placeholder="Institute Name"
            />
          </div>
          <button
            onClick={() => addOrEditItem("results")}
            className="btn btn-primary w-full md:w-auto"
          >
            {isEditing && editSection === "results" ? "Update" : "Add"} Result
          </button>
          {results.length > 0 && (
            <div className="overflow-x-auto mt-6">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th>Exam Name</th>
                    <th>Passing Year</th>
                    <th>Result</th>
                    <th>Institute Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td>{result.examName}</td>
                      <td>{result.passingYear}</td>
                      <td>{result.result}</td>
                      <td>{result.instituteName}</td>
                      <td>
                        <button
                          onClick={() => editItem("results", index)}
                          className="btn btn-xs btn-warning"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Experiences */}
        <div className="mb-12 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-black">Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-gray-50"
              placeholder="Job Title"
            />
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-gray-50"
              placeholder="Company Name"
            />
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-gray-50"
            />
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-gray-50"
              disabled={formData.currentlyWorking}
            />
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                name="currentlyWorking"
                checked={formData.currentlyWorking}
                onChange={handleInputChange}
                className="checkbox checkbox-primary mr-2"
              />
              <span>Currently Working</span>
            </label>
          </div>
          <button
            onClick={() => addOrEditItem("experiences")}
            className="btn btn-primary w-full md:w-auto"
          >
            {isEditing && editSection === "experiences" ? "Update" : "Add"} Experience
          </button>
          {experiences.length > 0 && (
            <div className="overflow-x-auto mt-6">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th>Job Title</th>
                    <th>Company Name</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Experience Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.map((experience, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td>{experience.jobTitle}</td>
                      <td>{experience.companyName}</td>
                      <td>{experience.fromDate}</td>
                      <td>{experience.currentlyWorking ? "Present" : experience.toDate}</td>
                      <td>
                        {calculateExperienceTime(
                          experience.fromDate,
                          experience.toDate,
                          experience.currentlyWorking
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => editItem("experiences", index)}
                          className="btn btn-xs btn-warning"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Trainings */}
        <div className="mb-12 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-black">Training</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="trainingTitle"
              value={formData.trainingTitle}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-gray-50"
              placeholder="Training Title"
            />
            <input
              type="text"
              name="providerName"
              value={formData.providerName}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-gray-50"
              placeholder="Provider Name"
            />
            <input
              type="date"
              name="completionDate"
              value={formData.completionDate}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-gray-50"
            />
          </div>
          <button
            onClick={() => addOrEditItem("trainings")}
            className="btn btn-primary w-full md:w-auto"
          >
            {isEditing && editSection === "trainings" ? "Update" : "Add"} Training
          </button>
          {trainings.length > 0 && (
            <div className="overflow-x-auto mt-6">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th>Training Title</th>
                    <th>Provider Name</th>
                    <th>Completion Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainings.map((training, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td>{training.trainingTitle}</td>
                      <td>{training.providerName}</td>
                      <td>{training.completionDate}</td>
                      <td>
                        <button
                          onClick={() => editItem("trainings", index)}
                          className="btn btn-xs btn-warning"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button onClick={addOrEditItem} className="btn btn-lg btn-success">
            Update My Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Teacher;