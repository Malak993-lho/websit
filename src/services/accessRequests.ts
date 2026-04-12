/**
 * Public "Request Access" form → Elastic Beanstalk admin API (underscore routes).
 * Wishes/socket still use getApiBaseUrl(); do not mix.
 */
const ACCESS_REQUEST_API_BASE =
  import.meta.env.VITE_ACCESS_REQUEST_API_URL?.trim() ||
  "http://admin-backend-env.eba-9pw38gcy.us-west-2.elasticbeanstalk.com";

export const ACCESS_REQUEST_ENDPOINT = "/admin/access_requests";

export interface AccessRequestFormInput {
  name: string;
  email: string;
  role: string;
  message?: string;
}

/** JSON body expected by Flask POST /admin/access_requests */
export interface AccessRequestPayload {
  name: string;
  email: string;
  role: string;
  reason: string;
}

function accessRequestUrl(): string {
  const base = ACCESS_REQUEST_API_BASE.replace(/\/+$/, "");
  return `${base}${ACCESS_REQUEST_ENDPOINT}`;
}

function normalizeInput(input: AccessRequestFormInput): AccessRequestPayload {
  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role.trim(),
    reason: (input.message || "").trim(),
  };
}

export async function createAccessRequest(input: AccessRequestFormInput) {
  const payload = normalizeInput(input);
  const url = accessRequestUrl();

  console.info("[RequestAccess] request URL", url);
  console.info("[RequestAccess] request body", payload);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  let responseBody: unknown = responseText;
  try {
    responseBody = responseText ? JSON.parse(responseText) : null;
  } catch {
    // leave as raw text
  }

  console.info("[RequestAccess] response status", response.status);
  console.info("[RequestAccess] response body", responseBody);

  if (!response.ok) {
    let errorMessage = `${response.status} ${response.statusText}`;
    if (responseBody && typeof responseBody === "object" && responseBody !== null) {
      const o = responseBody as Record<string, unknown>;
      errorMessage = String(o.error || o.message || errorMessage);
    } else if (typeof responseBody === "string" && responseBody) {
      errorMessage = responseBody;
    }

    console.error("[RequestAccess] Submission failed", {
      url,
      status: response.status,
      payload,
      responseBody,
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
    responseBody,
    status: response.status,
  };
}
