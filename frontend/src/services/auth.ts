/**
 * Authentication API service.
 *
 * This module handles user registration, login, and retrieval of the
 * currently authenticated user.
 */

type AuthCredentials = {
  email: string;
  password: string;
};

type AuthResponse = {
  access_token: string;
  token_type: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Extract a user-friendly error message from an API response.
 *
 * FastAPI validation errors may be returned as either a string or an
 * array of validation messages, so this helper normalizes them into
 * a single message for display in the UI.
 */
async function getErrorMessage(
  response: Response,
  fallbackMessage: string
) {
  try {
    const errorData = await response.json();

    if (typeof errorData.detail === "string") {
      return errorData.detail;
    }

    if (Array.isArray(errorData.detail)) {
      return errorData.detail[0]?.msg || fallbackMessage;
    }

    return fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

/**
 * Register a new user account.
 */
export async function registerUser(
  credentials: AuthCredentials
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      "Failed to register user"
    );

    throw new Error(message);
  }

  return response.json();
}

/**
 * Authenticate an existing user and return a JWT access token.
 */
export async function loginUser(
  credentials: AuthCredentials
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      "Invalid email or password"
    );

    throw new Error(message);
  }

  return response.json();
}

/**
 * Retrieve information about the currently authenticated user.
 *
 * The JWT stored in localStorage is included as a bearer token
 * in the request authorization header.
 */
export async function getCurrentUser() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
}