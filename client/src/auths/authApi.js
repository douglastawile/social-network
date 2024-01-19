const BASE_URL = "http://localhost:3000/api/auth";

const handleResponse = async (response) => {
  if (response.ok) {
    return await response.json();
  } else {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message);
  }
};

export const signup = async (user) => {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: user,
    });
    return handleResponse(response);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to register user.");
  }
};

export const signin = async (user) => {
  try {
    const response = await fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to register user.");
  }
};
