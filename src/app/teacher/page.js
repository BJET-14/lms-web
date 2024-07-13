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
    <div>
      <h2 className="text-xl font-semibold mb-2">Teacher</h2>

      {/* Academic Results */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Academic Result</h3>
        <div className="flex flex-col gap-4 mb-4">
          <input
            type="text"
            name="examName"
            value={formData.examName}
            onChange={handleInputChange}
            className="border p-2 w-full"
            placeholder="Exam Name"
          />
          <input
            type="text"
            name="passingYear"
            value={formData.passingYear}
            onChange={handleInputChange}
            className="border p-2 w-full"
            placeholder="Passing Year"
          />
          <input
            type="text"
            name="result"
            value={formData.result}
            onChange={handleInputChange}
            className="border p-2 w-full"
            placeholder="Result"
          />
          <input
            type="text"
            name="instituteName"
            value={formData.instituteName}
            onChange={handleInputChange}
            className="border p-2 w-full"
            placeholder="Institute Name"
          />
          <button
            onClick={() => addOrEditItem("results")}
            className="bg-blue-500 text-white px-4 py-2 self-end"
          >
            {isEditing && editSection === "results" ? "Update" : "Add"}
          </button>
        </div>
        {results.length > 0 && (
          <table className="min-w-full bg-white mt-4 border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Exam Name</th>
                <th className="py-2 px-4 border">Passing Year</th>
                <th className="py-2 px-4 border">Result</th>
                <th className="py-2 px-4 border">Institute Name</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border text-center">
                    {result.examName}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    {result.passingYear}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    {result.result}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    {result.instituteName}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      onClick={() => editItem("results", index)}
                      className="bg-yellow-500 text-white px-2 py-1"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Experiences */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Experience</h3>
        <div className="flex flex-col gap-4 mb-4">
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            className="border p-2 w-full"
            placeholder="Job Title"
          />
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className="border p-2 w-full"
            placeholder="Company Name"
          />
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleInputChange}
            className="border p-2 w-full"
            disabled={formData.currentlyWorking}
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              name="currentlyWorking"
              checked={formData.currentlyWorking}
              onChange={handleInputChange}
              className="mr-2"
            />
            Currently Working
          </label>
          <button
            onClick={() => addOrEditItem("experiences")}
            className="bg-blue-500 text-white px-4 py-2 self-end"
          >
            {isEditing && editSection === "experiences" ? "Update" : "Add"}
          </button>
        </div>
        {experiences.length > 0 && (
          <table className="min-w-full bg-white mt-4 border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Job Title</th>
                <th className="py-2 px-4 border">Company Name</th>
                <th className="py-2 px-4 border">From Date</th>
                <th className="py-2 px-4 border">To Date</th>
                <th className="py-2 px-4 border">Experience Time</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((experience, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border text-center">
                    {experience.jobTitle}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    {experience.companyName}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    {experience.fromDate}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    {experience.currentlyWorking
                      ? "Present"
                      : experience.toDate}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    {calculateExperienceTime(
                      experience.fromDate,
                      experience.toDate,
                      experience.currentlyWorking
                    )}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      onClick={() => editItem("experiences", index)}
                      className="bg-yellow-500 text-white px-2 py-1"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Trainings */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Training</h3>
        <div className="flex flex-col gap-4 mb-4">
          <input
            type="text"
            name="trainingTitle"
            value={formData.trainingTitle}
            onChange={handleInputChange}
            className="border p-2 w-full"
            placeholder="Training Title"
          />
          <input
            type="text"
            name="providerName"
            value={formData.providerName}
            onChange={handleInputChange}
            className="border p-2 w-full"
            placeholder="Provider Name"
          />
          <input
            type="date"
            name="completionDate"
            value={formData.completionDate}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
          <button
            onClick={() => addOrEditItem("trainings")}
            className="bg-blue-500 text-white px-4 py-2 self-end"
          >
            {isEditing && editSection === "trainings" ? "Update" : "Add"}
          </button>
        </div>
        {trainings.length > 0 && (
          <table className="min-w-full bg-white mt-4 border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Training Title</th>
                <th className="py-2 px-4 border">Provider Name</th>
                <th className="py-2 px-4 border">Completion Date</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainings.map((training, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border text-center">
                    {training.trainingTitle}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    {training.providerName}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    {training.completionDate}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      onClick={() => editItem("trainings", index)}
                      className="bg-yellow-500 text-white px-2 py-1"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-center mt-4">
          <button
            onClick={addOrEditItem}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
//helloooooo
export default Teacher;
