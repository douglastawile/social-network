import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DarkModeToggle from "./components/DarkMode";
import UsersPage from "./users/UsersPage";
import NavBar from "./components/Navigation";
import SignupPage from "./auths/SignupPage";
import SigninPage from "./auths/SigninPage";
import ProfilePage from "./users/ProfilePage";
import PrivateRoute from "./auths/PrivateRoute";
import EditProfilePage from "./users/EditProfilePage";
import FindPeople from "./users/FindPeople";
import PostsPage from "./posts/PostsPage";

export default function App() {
  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen transition-all duration-300">
      <div className="container mx-auto p-4">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <DarkModeToggle />
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route
              path="/"
              element={
                <div className="grid grid-cols-3 gap-4">
                  <PostsPage />
                  <FindPeople />
                </div>
              }
            />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/signin" element={<SigninPage />} />
            <Route path="/user/:userId" element={<ProfilePage />} />
            <Route
              path="/user/edit/:userId"
              element={
                <PrivateRoute>
                  <EditProfilePage />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
