import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { signin } from "./authApi";
import { authenticate } from "./authHelpers";

const STATUS = {
  IDLE: "IDLE",
  SUBMITTED: "SUBMITTED",
  SUBMITTING: "SUBMITTING",
  COMPLETED: "COMPLETED",
};

const initialValues = {
  email: "",
  password: "",
  redirectToHome: false,
};

export default function SigninPage() {
  const [formData, setFormData] = useState(initialValues);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [saveError, setSaveError] = useState(null);
  const [touched, setTouched] = useState({});

  const errors = getErrors(formData);
  const isValid = Object.keys(errors).length === 0;

  const location = useLocation();

  const handleChanged = (event) => {
    setFormData((previousValue) => {
      return {
        ...previousValue,
        [event.target.id]: event.target.value,
      };
    });
  };

  const handleBlur = (event) => {
    setTouched((curValue) => {
      return {
        ...curValue,
        [event.target.id]: true,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(STATUS.SUBMITTING);

    const userData = {
      email: formData.email || undefined,
      password: formData.password || undefined,
    };

    if (isValid) {
      try {
        const response = await signin(userData);
        if (response.error) {
          toast.error("Something went wrong");
        } else {
          setTimeout(() => {
            authenticate(response, () => {
              setFormData({ ...formData, redirectToHome: true });
              setStatus(STATUS.COMPLETED);
              toast.success("Sign in success");
            });
          }, 3000);
        }
      } catch (error) {
        console.error(error);
        setSaveError(error);
      }
    } else {
      setStatus(STATUS.SUBMITTED);
    }
  };

  function getErrors(formData) {
    const result = {};
    if (!formData.email) result.email = "Email is required";
    if (!formData.password) result.password = "Password is required";

    if (formData.password && formData.password.length < 8) {
      result.password = "Password must be at least 8 characters long.";
    }
    return result;
  }

  const { from } = location.state || {
    from: {
      pathname: "/",
    },
  };

  if (saveError) throw saveError;
  if (formData.redirectToHome) return <Navigate to={from} />;

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-lg p-6 my-4 mx-4 rounded-md shadow-md dark:bg-slate-950 sm:mx-auto"
      >
        <h2 className="text-center text-3xl font-bold text-slate-700 dark:text-white my-2">
          Sign in
        </h2>

        <div className="mb-3">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email:
          </label>
          <input
            type="email"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            id="email"
            name="email"
            placeholder="Please enter your email..."
            value={formData.email}
            onChange={handleChanged}
            onBlur={handleBlur}
          />
          <p role="alert" className="text-red-600">
            {(touched.email || status === STATUS.SUBMITTED) && errors.email}
          </p>
        </div>

        <div className="mb-3">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Password:
          </label>
          <input
            type="password"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            id="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChanged}
            onBlur={handleBlur}
          />
          <p role="alert" className="text-red-600">
            {(touched.password || status === STATUS.SUBMITTED) &&
              errors.password}
          </p>
        </div>

        <button
          type="submit"
          disabled={status === STATUS.SUBMITTING}
          className="bg-sky-500 py-2 px-4 my-2 rounded-full shadow-md text-white hover:bg-sky-700 disabled:bg-sky-300"
        >
          {status === STATUS.SUBMITTING ? "Submitting..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
