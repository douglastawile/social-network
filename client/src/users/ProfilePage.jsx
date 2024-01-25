import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";

import { getUser, deleteUser } from "./userApi";
import Loading from "../components/Loading";
import { isAuthenticated, clearJWT } from "../auths/authHelpers";
import FollowProfileButton from "./FollowProfileButton";

export default function ProfilePage() {
  const [user, setUser] = useState({ following: [], followers: [] });
  const [loading, setLoading] = useState(true);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [following, setFollowing] = useState(false);

  const { userId } = useParams();
  const jwt = isAuthenticated();

  const checkFollow = (user) => {
    const match = user.followers.some((follower) => {
      return follower._id === jwt.user._id;
    });
    return match;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser({ userId }, { token: jwt.token });
        const following = checkFollow(response);
        setUser(response);
        setFollowing(following);
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

  //The follow and unfollow button functionality
  const clickFollowButton = (callApi) => {
    callApi({ userId: jwt.user._id }, { token: jwt.token }, user._id).then(
      (response) => {
        if (response.error) {
          console.error(response.error);
        } else {
          setUser(response);
          setFollowing(!following);
        }
      }
    );
  };

  if (redirectToSignin) return <Navigate to={`/auth/signin`} />;
  if (loading) return <Loading />;
  if (redirectToHome) return <Navigate to={`/`} />;

  return (
    <>
      <div className="flex flex-col justify-center max-w-lg my-4 mx-4 p-6 shadow-md rounded-xl sm:px-12 sm:mx-auto dark:bg-slate-900 dark:text-slate-100">
        <img
          src={`http://localhost:3000/img/users/${user?.photo}`}
          alt={user.name}
          className="w-32 h-32 mx-auto rounded-full dark:bg-slate-500 aspect-square"
        />
        <div className="space-y-4 text-center divide-y dark:divide-slate-700">
          <div className="my-2 space-y-1">
            <h2 className="text-xl font-semibold sm:text-2xl">{user.name}</h2>
            {user && user.about && (
              <p className="px-5 text-xs sm:text-base my-2 dark:text-slate-400">
                {user.about}
              </p>
            )}

            <p className="px-5 text-xs sm:text-base text-slate-400 dark:text-slate-600">
              {user.email}
            </p>
          </div>
          <div className="flex justify-center pt-2 space-x-4 align-center">
            {isAuthenticated().user &&
            isAuthenticated().user._id === user._id ? (
              <p className="my-3">
                <Link
                  to={`/user/edit/${user._id}`}
                  className="py-1 px-3 rounded-full shadow-sm text-white bg-sky-600 hover:bg-sky-800 text-sm mr-2"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={deleteAccount}
                  className="py-1 px-3 rounded-full shadow-sm text-white bg-red-600 hover:bg-red-800 text-sm"
                >
                  Delete Profile
                </button>
              </p>
            ) : (
              <FollowProfileButton
                following={following}
                onButtonClick={clickFollowButton}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
