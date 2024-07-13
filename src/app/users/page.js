'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { userService } from '../utils/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('email');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { 
        asPage: true, 
        page: currentPage, 
        size: pageSize
      };

      if (searchTerm) {
        params[searchType] = searchTerm;
      }

      const result = await userService.getUsers(params);
      setUsers(result.content);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchUsers();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-4 bg-white text-gray-800 min-h-screen min-w-full">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Users</h1>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder={`Search by ${searchType}`}
            className="input input-bordered flex-grow bg-white text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="select select-bordered bg-white text-gray-800"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="id">ID</option>
            <option value="email">Email</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
          </select>
          <button type="submit" className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white">Search</button>
        </div>
      </form>

      <Link href="/signup" className="btn btn-secondary bg-green-500 hover:bg-green-600 text-white mb-4">
        Create New User
      </Link>

      {loading && <div className="text-center"><span className="loading loading-spinner loading-lg text-blue-500"></span></div>}
      
      {error && <div className="alert alert-error bg-red-100 border-red-400 text-red-700 p-4 rounded">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-gray-600">ID</th>
                <th className="px-4 py-2 text-left text-gray-600">First Name</th>
                <th className="px-4 py-2 text-left text-gray-600">Last Name</th>
                <th className="px-4 py-2 text-left text-gray-600">Email</th>
                <th className="px-4 py-2 text-left text-gray-600">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.firstName}</td>
                  <td className="px-4 py-2">{user.lastName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button 
            className="btn btn-sm bg-gray-200 hover:bg-gray-300 text-gray-800" 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 0}
          >
            Previous
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page}
              className={`btn btn-sm ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-blue-600`}
              onClick={() => handlePageChange(page)}
            >
              {page + 1}
            </button>
          ))}
          <button 
            className="btn btn-sm bg-gray-200 hover:bg-gray-300 text-gray-800" 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}

      <div className="mt-4">
        <select 
          className="select select-bordered bg-white text-gray-800"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(0);
          }}
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>
    </div>
  );
};

export default Users;