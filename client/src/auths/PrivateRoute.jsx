import { Navigate, useLocation } from "react-router-dom";

import { isAuthenticated } from "./authHelpers";

// eslint-disable-next-line react/prop-types
export default function PrivateRoute({ children }) {
  const location = useLocation();

  try {
    if (isAuthenticated()) {
      return children;
    } else {
      throw new Error("User not authenticated.");
    }
  } catch (error) {
    console.error(`Authentication Error: ${error}`);
  }

  return (
    <Navigate to={`/signin`} replace state={{ from: location.pathname }} />
  );
}
