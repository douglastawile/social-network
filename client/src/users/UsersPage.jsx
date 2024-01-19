import { useState, useEffect } from "react";

import { getUsers } from "./userApi";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        if (response.error) {
          throw new Error(response.error);
        } else {
          setUsers(response);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (error) throw error;
  if (loading) return <Loading />;

  return (
    <section className="bg-white p-6 mx-4 rounded-xl shadow-lg max-w-lg my-4 sm:mx-auto dark:bg-slate-950">
      <h3 className="text-center text-lg font-semibold text-slate-800 dark:text-white">
        Users
      </h3>
      <ul role="list" className="p-6 divide-y divide-slate-200">
        {users.map((user) => {
          return (
            <li key={user._id} className="flex py-4 first:pt-0 last:pb-0">
              <img
                className="h-10 w-10 rounded-full"
                src={`http://localhost:3000/img/users/${user?.photo}`}
                alt={user.name}
              />
              <Link to={`/user/${user._id}`} className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  {user.name}
                </p>
                <p className="text-sm text-slate-500 truncate dark:text-slate-300">
                  {user.email}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
