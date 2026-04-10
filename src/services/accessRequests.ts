const ACCESS_REQUEST_URL =
  "http://Admin-backend-env.eba-9pw38gcy.us-west-2.elasticbeanstalk.com/admin/access-requests";
const ACCESS_REQUEST_ENDPOINT = "/admin/access-requests";
const ADMIN_BACKEND_BASE_URL =
  "http://Admin-backend-env.eba-9pw38gcy.us-west-2.elasticbeanstalk.com";

export interface AccessRequestFormInput {
  name: string;
  email: string;
  role: string;
  message?: string;
}

export interface AccessRequestPayload {
  full_name: string;
  email: string;
  role: string;
  reason: string;
}

function normalizeInput(input: AccessRequestFormInput): AccessRequestPayload {
  return {
    full_name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role.trim(),
    reason: (input.message || "").trim(),
  };
}

export async function createAccessRequest(input: AccessRequestFormInput) {
  const payload = normalizeInput(input);
  console.info("[RequestAccess] Sending access request", {
    url: ACCESS_REQUEST_URL,
    payload,
  });

  const response = await fetch(ACCESS_REQUEST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = `${response.status} ${response.statusText}`;
    let errorBody: unknown = null;
    try {
      const data = await response.json();
      errorBody = data;
      errorMessage = data.error || data.message || errorMessage;
    } catch {
      try {
        const text = await response.text();
        errorBody = text;
      } catch {
        // Keep fallback status text if backend did not return parsable body.
      }
    }

    console.error("[RequestAccess] Submission failed", {
      url: ACCESS_REQUEST_URL,
      status: response.status,
      statusText: response.statusText,
      payload,
      responseBody: errorBody,
    });

    throw new Error(
      `Request Access submit failed (${response.status} ${response.statusText}) at ${ACCESS_REQUEST_URL}: ${errorMessage}`,
    );
  }

  console.info("[RequestAccess] Submission succeeded", {
    url: ACCESS_REQUEST_URL,
    payload,
    status: response.status,
  });

  return {
    endpoint: ACCESS_REQUEST_ENDPOINT,
    url: ACCESS_REQUEST_URL,
    payload,
  };
}

export {
  ACCESS_REQUEST_ENDPOINT,
  ACCESS_REQUEST_URL,
  ADMIN_BACKEND_BASE_URL,
};
