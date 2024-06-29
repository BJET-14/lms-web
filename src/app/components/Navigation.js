'use client'
import Link from 'next/link';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFloatingOpen, setIsFloatingOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const toggleFloating = () => {
    setIsFloatingOpen(!isFloatingOpen);
  };

  return (
    <div data-theme="light" className="navbar bg-base-100">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          <b>RestoBotics</b>
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
            <div className="fixed inset-0 bg-base-100 z-50">
              <div className="navbar-end absolute top-0 right-0 p-4 w-full pl-[85%]">
                <button className="btn btn-ghost" onClick={toggleMenu}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ul className="menu menu-compact flex flex-col items-center justify-center h-full text-3xl gap-y-5">
                <li>
                  <Link href="/" onClick={toggleMenu}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/product" onClick={toggleMenu}>
                    Product
                  </Link>
                </li>
                <li>
                  <Link href="/innovation" onClick={toggleMenu}>
                    Innovation
                  </Link>
                </li>
                <li>
                  <Link href="/about" onClick={toggleMenu}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/news" onClick={toggleMenu}>
                    News
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal p-0 text-lg gap-x-5">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/product">Product</Link>
            </li>
            <li>
              <Link href="/innovation">Innovation</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/news">News</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="btn btn-circle bg-white text-black hover:bg-gray-200"
          onClick={toggleFloating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        {isFloatingOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col space-y-2">
            <a href="mailto:your@email.com" className="btn bg-white text-black hover:bg-gray-200 flex items-center">
              <span className="mr-2">Email</span>
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
            <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className="btn bg-white text-black hover:bg-gray-200 flex flex-row items-center w-[150px]">
              <span className="mr-2">Facebook</span>
              <FontAwesomeIcon icon={faBook} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;