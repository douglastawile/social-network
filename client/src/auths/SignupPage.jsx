import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { signup } from "./authApi";

const STATUS = {
  IDLE: "IDLE",
  SUBMITTED: "SUBMITTED",
  SUBMITTING: "SUBMITTING",
  COMPLETED: "COMPLETED",
};

const initialValues = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  photo: "",
};

export default function SignupPage() {
  const [formData, setFormData] = useState(initialValues);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [saveError, setSaveError] = useState(null);
  const [touched, setTouched] = useState({});

  const errors = getErrors(formData);
  const isValid = Object.keys(errors).length === 0;

  const navigate = useNavigate();

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

    const userData = new FormData();
    formData.name && userData.append("name", formData.name);
    formData.email && userData.append("email", formData.email);
    formData.password && userData.append("password", formData.password);
    formData.passwordConfirm &&
      userData.append("passwordConfirm", formData.passwordConfirm);
    formData.photo && userData.append("photo", formData.photo);

    if (isValid) {
      try {
        const response = await signup(userData);
        if (response.error) {
          toast.error("Something went wrong");
        } else {
          setTimeout(() => {
            setFormData({ ...formData });
            setStatus(STATUS.COMPLETED);
            toast.success("Sign uo success. Please login");
            navigate("/auth/signin");
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
    if (!formData.name) result.name = "Name is required";
    if (!formData.email) result.email = "Email is required";
    if (!formData.password) result.password = "Password is required";
    if (!formData.passwordConfirm)
      result.passwordConfirm = "Password must be confirmed.";

    if (formData.password && formData.password.length < 8) {
      result.password = "Password must be at least 8 characters long.";
    }

    if (formData.password !== formData.passwordConfirm) {
      result.passwordConfirm = "Passwords are not the same.";
    }
    return result;
  }

  if (saveError) throw saveError;

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-lg p-6 my-4 mx-4 rounded-md shadow-md dark:bg-slate-950 sm:mx-auto"
      >
        <h2 className="text-center text-3xl font-bold text-slate-700 dark:text-white my-2">
          Sign up to Register
        </h2>
        <div className="my-3 flex items-center space-x-6">
          <div className="shrink-0">
            {formData.photo && (
              <img
                className="w-16 h-16 object-cover rounded-full"
                src={URL.createObjectURL(formData.photo)}
                alt="Current profile Photo"
              />
            )}
          </div>
          <label htmlFor="photo" className="block">
            <span className="sr-only">Choose profile photo(optional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setFormData({ ...formData, photo: event.target.files[0] })
              }
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-sky-700 hover:file:bg-violet-100"
            />
          </label>
        </div>

        <div className="mb-3">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Name:
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            id="name"
            name="name"
            placeholder="Please enter your name..."
            value={formData.name}
            onChange={handleChanged}
            onBlur={handleBlur}
          />
          <p role="alert" className="text-red-600">
            {(touched.name || status === STATUS.SUBMITTED) && errors.name}
          </p>
        </div>

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

        <div className="mb-3">
          <label
            htmlFor="passwordConfirm"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Confirm Password:
          </label>
          <input
            type="password"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            id="passwordConfirm"
            name="passwordConfirm"
            placeholder="********"
            value={formData.passwordConfirm}
            onChange={handleChanged}
            onBlur={handleBlur}
          />
          <p role="alert" className="text-red-600">
            {(touched.passwordConfirm || status === STATUS.SUBMITTED) &&
              errors.passwordConfirm}
          </p>
        </div>

        <button
          type="submit"
          disabled={status === STATUS.SUBMITTING}
          className="bg-sky-500 py-2 px-4 my-2 rounded-full shadow-md text-white hover:bg-sky-700 disabled:bg-sky-300"
        >
          {status === STATUS.SUBMITTING ? "Submitting..." : "Sign Up"}
        </button>
        <p className="my-2">
          Already have an account?{" "}
          <Link
            to={`/auth/signin`}
            className="text-blue-600 hover:text-blue-800"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
