export const authenticate = (jwt, cb) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("jwt", JSON.stringify(jwt));
  }
  cb();
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  } else if (sessionStorage.getItem("jwt")) {
    return JSON.parse(sessionStorage.getItem("jwt"));
  } else {
    return false;
  }
};

export const clearJWT = (cb) => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("jwt");
  }
  cb();
};
