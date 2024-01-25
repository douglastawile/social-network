import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/doug.jpeg";
import { isAuthenticated, clearJWT } from "../auths/authHelpers";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate();
  //const jwt = isAuthenticated();

  return (
    <nav className="relative bg-white shadow dark:bg-slate-800">
      <div className="container px-6 py-4 mx-auto">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <Link to="/">
              <img className="w-auto h-6 sm:h-7" src={logo} alt="LOGO" />
            </Link>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="text-slate-500 dark:text-gray-200 hover:text-slate-600 dark:hover:text-slate-400 focus:outline-none focus:text-slate-600 dark:focus:text-slate-400"
                aria-label="toggle menu"
              >
                {!isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu open: "block", Menu closed: "hidden" */}
          <div
            className={`absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-slate-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center ${
              isOpen
                ? "translate-x-0 opacity-100"
                : "opacity-0 -translate-x-full"
            }`}
          >
            <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
              <Link
                to="/"
                className="px-3 py-2 mx-3 mt-2 text-slate-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Home
              </Link>
              <Link
                to="/users"
                className="px-3 py-2 mx-3 mt-2 text-slate-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Users
              </Link>

              {!isAuthenticated() && (
                <>
                  <Link
                    to="/auth/signup"
                    className="px-3 py-2 mx-3 mt-2 text-slate-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Sign up
                  </Link>
                  <Link
                    to="/auth/signin"
                    className="px-3 py-2 mx-3 mt-2 text-slate-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Sign in
                  </Link>
                </>
              )}

              {isAuthenticated() && (
                <>
                  <Link
                    to={`/user/${isAuthenticated().user._id}`}
                    className="px-3 py-2 mx-3 mt-2 text-slate-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      clearJWT(() => navigate("/"));
                    }}
                    className="px-3 py-2 mx-3 mt-2 text-slate-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center mt-4 lg:mt-0">
              <button
                className="hidden mx-4 text-slate-600 transition-colors duration-300 transform lg:block dark:text-slate-200 hover:text-slate-700 dark:hover:text-slate-400 focus:text-slate-700 dark:focus:text-slate-400 focus:outline-none"
                aria-label="show notifications"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isAuthenticated() && isAuthenticated().user && (
                <button
                  type="button"
                  className="flex items-center focus:outline-none"
                  aria-label="toggle profile dropdown"
                >
                  <div className="w-8 h-8 overflow-hidden border-2 border-slate-400 rounded-full">
                    <img
                      src={`http://localhost:3000/img/users/${
                        isAuthenticated()?.user?.photo
                      }`}
                      className="object-cover w-full h-full"
                      alt="avatar"
                    />
                  </div>

                  <h3 className="mx-2 text-slate-700 dark:text-slate-200 lg:hidden">
                    {isAuthenticated()?.user?.name}
                  </h3>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
