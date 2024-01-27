import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { isAuthenticated } from "../auths/authHelpers";
import Loading from "../components/Loading";
import { findPeople, follow } from "./userApi";

export default function FindPeople() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [followMessage, setFollowMessage] = useState("");

  const jwt = isAuthenticated();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await findPeople(
          { userId: jwt.user._id },
          { token: jwt.token }
        );
        if (response && response.error) {
          console.error(response.error);
        } else {
          setUsers(response);
        }
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (open) {
      toast.success(followMessage);
    }
  }, [open, followMessage]);

  useEffect(() => {
    if (!jwt) {
      // User is not logged in, return null to skip rendering the component
      setLoading(false);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clickFollow = (user, index) => {
    if (!jwt) {
      // User is not logged in, handle accordingly (e.g., redirect to login page)
      return;
    }

    follow({ userId: jwt.user._id }, { token: jwt.token }, user._id).then(
      (response) => {
        if (response && response.error) {
          setError(response.error);
        } else {
          const toFollow = users.slice();
          toFollow.splice(index, 1);
          setUsers([...toFollow]); // Create a new array to trigger a re-render
          setOpen(true);
          setFollowMessage(`Following ${user.name}`);
        }
      }
    );
  };

  if (!jwt) return null;
  if (error) throw error;
  if (loading) return <Loading />;
  if (users.length === 0) return null;

  return (
    <section className="bg-white p-6 mx-4 rounded-xl shadow-lg max-w-lg my-4 sm:mx-auto dark:bg-slate-950">
      <h3 className="text-center text-lg font-semibold text-slate-800 dark:text-white">
        Who to follow
      </h3>
      <ul role="list" className="p-6 divide-y divide-slate-200">
        {users.map((user, index) => {
          return (
            <li key={index} className="flex py-4 first:pt-0 last:pb-0">
              <img
                className="h-10 w-10 rounded-full"
                src={`http://localhost:3000/img/users/${user?.photo}`}
                alt={user.name}
              />
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  {user.name}
                </p>

                <Link
                  to={`/user/${user._id}`}
                  className="py-1 px-3 my-2 mr-2 text-white font-thin rounded-full shadow-md text-sm bg-sky-600 hover:bg-sky-800"
                >
                  View profile
                </Link>

                <button
                  onClick={() => clickFollow(user, index)}
                  className="py-1 px-3 my-2 text-white font-thin rounded-full shadow-md text-sm bg-sky-600 hover:bg-sky-800"
                >
                  Follow
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
