import { getApiBaseUrl } from "@/lib/apiConfig";

export const ACCESS_REQUEST_ENDPOINT = "/admin/access_requests";

export interface AccessRequestFormInput {
  name: string;
  email: string;
  role: string;
  message?: string;
}

export interface AccessRequestPayload {
  name: string;
  email: string;
  role: string;
  reason: string;
}

function accessRequestUrl(): string {
  const base = getApiBaseUrl().replace(/\/+$/, "");
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
    // keep raw
  }

  console.info("[RequestAccess] response status", response.status);
  console.info("[RequestAccess] response body", responseBody);

  if (!response.ok) {
    console.error("[RequestAccess] Submission failed", {
      url,
      status: response.status,
      payload,
      responseBody,
    });
    throw new Error(`Request Access HTTP ${response.status}`);
  }

  console.info("[RequestAccess] Submission succeeded", { url, payload, status: response.status });

  return {
    endpoint: ACCESS_REQUEST_ENDPOINT,
    url,
    payload,
    responseBody,
    status: response.status,
  };
}
