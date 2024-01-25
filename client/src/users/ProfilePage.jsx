import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";

import { getUser, deleteUser } from "./userApi";
import Loading from "../components/Loading";
import { isAuthenticated, clearJWT } from "../auths/authHelpers";

export default function ProfilePage() {
  const [user, setUser] = useState({});
  //const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);

  const { userId } = useParams();
  const jwt = isAuthenticated();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser({ userId }, { token: jwt.token });
        setUser(response);
      } catch (error) {
        console.error("Error fetching user:", error);
        setRedirectToSignin(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //     const confirmDelete = window.confirm(
  //       "Are you sure to delete your profile?"
  //     );
  //     if (confirmDelete) {
  //       deleteUser({ userId }, { token: jwt.token }).then((response) => {
  //         if (response.error) {
  //           alert("Something went wrong.");
  //         } else {
  //           clearJWT(() => console.log("Deleted"));
  //           setRedirectToHome(true);
  //         }
  //       });
  //     }
  //   };

  const deleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure to delete your profile?"
    );
    if (confirmDelete) {
      deleteUser({ userId }, { token: jwt.token })
        .then((response) => {
          if (response.error) {
            console.error("Error deleting account:", response.error);
            alert("Something went wrong.");
          } else {
            clearJWT(() => console.log("Deleted"));
            setRedirectToHome(true);
          }
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
          alert("Something went wrong.");
        });
    }
  };

  if (redirectToSignin) return <Navigate to={`/auth/signin`} />;
  if (loading) return <Loading />;
  if (redirectToHome) return <Navigate to={`/`} />;

  return (
    <>
      <div className="flex flex-col max-w-md p-6 dark:bg-gray-900 dark:text-gray-100 mx-4 my-4 sm:mx-auto ">
        <img
          src={`http://localhost:3000/img/users/${user?.photo}`}
          alt=""
          className="flex-shrink-0 object-cover h-64 rounded-sm sm:h-96 dark:bg-gray-500 aspect-square"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <span className="block pb-2 text-sm dark:text-gray-400">
            {user.email}
          </span>
          <span className="block pb-2 text-sm dark:text-gray-400">
            CTO of Company Inc.
          </span>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit, eligendi dolorum sequi illum qui unde aspernatur non
            deserunt
          </p>
          {isAuthenticated().user &&
            isAuthenticated().user._id === user._id && (
              <p className="my-3">
                <Link
                  to={`/user/edit/${user._id}`}
                  className="py-1 px-3 rounded-full shadow-sm bg-sky-600 hover:bg-sky-800 text-sm mr-2"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={deleteAccount}
                  className="py-1 px-3 rounded-full shadow-sm bg-red-600 hover:bg-red-800 text-sm"
                >
                  Delete Profile
                </button>
              </p>
            )}
        </div>
      </div>
    </>
  );
}
