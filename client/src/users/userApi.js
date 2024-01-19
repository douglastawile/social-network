const BASE_URL = "http://localhost:3000/api/users";

const handleResponse = async (response) => {
  if (response.ok) {
    return await response.json();
  } else {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message);
  }
};

export const getUsers = async () => {
  try {
    const response = await fetch(BASE_URL);
    return handleResponse(response);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch users from the server.");
  }
};

export const getUser = async (params, credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/${params.userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch user from the server.");
  }
};

export const updateUser = async (params, credentials, user) => {
  try {
    const response = await fetch(`${BASE_URL}/${params.userId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${credentials.token}`,
      },
      body: user,
    });
    return handleResponse(response);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update user information in the server.");
  }
};

export const deleteUser = async (params, credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/${params.userId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete user account from the server.");
  }
};
