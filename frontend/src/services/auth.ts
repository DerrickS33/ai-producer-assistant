type AuthCredentials = {
  email: string;
  password: string;
};

type AuthResponse = {
  access_token: string;
  token_type: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function getErrorMessage(response: Response, fallbackMessage: string) {
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