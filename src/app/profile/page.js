'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import userIcon from '/public/assets/user-icon.png';
import { userService } from '../utils/api'; // Assuming api.js is in the same directory

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    addressLine: "",
    education: "",
    email: "",
    country: "",
    region: "",
    experience_des: "",
    experience_org: "",
    experience_year: "",
    additionalDetails: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userData = await userService.getUserById(userId);
          setProfileData(prevState => ({
            ...prevState,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            // Dummy data for other fields
            phoneNumber: "+1234567890",
            addressLine: "123 Main St, City",
            education: "Bachelor's Degree",
            country: "United States",
            region: "California",
            experience_des: "Software Developer",
            experience_org: "Tech Corp",
            experience_year: "3",
            additionalDetails: "Passionate about coding and technology",
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call API to save profile data
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl border-solid border-2 border-sky-500"
      >
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <Image src={userIcon} alt="User Icon" width={96} height={96} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleChange}
              className="w-full border rounded p-2 bg-slate-100"
            />
          </div>
          <div>
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleChange}
              className="w-full border rounded p-2 bg-slate-100"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">Mobile Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleChange}
              className="w-full border rounded p-2 bg-slate-100"
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="w-full border rounded p-2 bg-slate-100"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">Address Line</label>
            <input
              type="text"
              name="addressLine"
              value={profileData.addressLine}
              onChange={handleChange}
              className="w-full border rounded p-2 bg-slate-100"
            />
          </div>
          <div>
            <label className="block mb-1">Highest Education</label>
            <input
              type="text"
              name="education"
              value={profileData.education}
              onChange={handleChange}
              className="w-full border rounded p-2 bg-slate-100"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={profileData.country}
              onChange={handleChange}
              className="w-full border rounded p-2 bg-slate-100"
            />
          </div>
          <div>
            <label className="block mb-1">Region</label>
            <input
              type="text"
              name="region"
              value={profileData.region}
              onChange={handleChange}
              className="w-full border rounded p-2 bg-slate-100"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1">Experience (if Any)</label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1">Designation</label>
              <input
                type="text"
                name="experience_des"
                value={profileData.experience_des}
                onChange={handleChange}
                className="w-full border rounded p-2 bg-slate-100"
              />
            </div>
            <div>
              <label className="block mb-1">Organization</label>
              <input
                type="text"
                name="experience_org"
                value={profileData.experience_org}
                onChange={handleChange}
                className="w-full border rounded p-2 bg-slate-100"
              />
            </div>
            <div>
              <label className="block mb-1">Years of Experience</label>
              <input
                type="text"
                name="experience_year"
                value={profileData.experience_year}
                onChange={handleChange}
                className="w-full border rounded p-2 bg-slate-100"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block mb-1">Additional Details</label>
          <input
            type="text"
            name="additionalDetails"
            value={profileData.additionalDetails}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-slate-100"
          />
        </div>
        <button
          type="submit"
          className="bg-sky-500 hover:bg-sky-700 text-white px-4 py-2 rounded mt-4"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;