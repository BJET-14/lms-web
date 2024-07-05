'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    const userRole = Cookies.get('userRole');
    setNavItems(getNavigationByRole(userRole));
  }, []);

  const getNavigationByRole = (role) => {
    switch (role) {
      case 'STUDENT':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Profile', path: '/profile' }
        ];
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Profile', path: '/profile' },
          { name: 'Create User', path: '/signup' },
          { name: 'Course Management', path: '/coursemanagement' }
        ];
      case 'TEACHER':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Profile', path: '/profile' },
          { name: 'Course Management', path: '/coursemanagement' }
        ];
      default:
        return [];
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div data-theme="light" className="navbar bg-base-100">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          <b>LMS</b>
        </Link>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost lg:hidden" onClick={toggleMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          {isOpen && (
            <div className="fixed inset-0 bg-base-100 z-50 lg:hidden">
              <div className="navbar-end absolute top-0 right-0 p-4 w-full pl-[85%]">
                <button className="btn btn-ghost" onClick={toggleMenu}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ul className="menu menu-compact flex flex-col items-center justify-center h-full text-3xl gap-y-5">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link href={item.path} onClick={toggleMenu}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal p-0 text-lg gap-x-5">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navigation;