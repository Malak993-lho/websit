import { getApiBaseUrl } from "@/lib/apiConfig";

const ACCESS_REQUEST_ENDPOINT = "/admin/access-requests";

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

function accessRequestUrl(): string {
  return `${getApiBaseUrl()}${ACCESS_REQUEST_ENDPOINT}`;
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
  const url = accessRequestUrl();
  console.info("[RequestAccess] Sending access request", {
    url,
    payload,
  });

  const response = await fetch(url, {
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
      url,
      status: response.status,
      statusText: response.statusText,
      payload,
      responseBody: errorBody,
    });

    throw new Error(
      `Request Access submit failed (${response.status} ${response.statusText}) at ${url}: ${errorMessage}`,
    );
  }

  console.info("[RequestAccess] Submission succeeded", {
    url,
    payload,
    status: response.status,
  });

  return {
    endpoint: ACCESS_REQUEST_ENDPOINT,
    url,
    payload,
  };
}

export { ACCESS_REQUEST_ENDPOINT };
