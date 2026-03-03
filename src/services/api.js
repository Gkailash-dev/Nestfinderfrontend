export const API_BASE =
  import.meta.env.VITE_API_BASE || "https://nestfinder-2.onrender.com";

export async function apiFetch(
  path,
  { method = "GET", body, headers = {}, ...rest } = {}
) {
  const options = {
    method,
    credentials: "include", // 🔥 ALWAYS send JSESSIONID cookie
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  };

  // Handle body correctly
  if (body instanceof URLSearchParams || typeof body === "string") {
    options.body = body;

    if (body instanceof URLSearchParams) {
      options.headers["Content-Type"] =
        "application/x-www-form-urlencoded";
    }
  } else if (body) {
    options.body = JSON.stringify(body);
  }

  console.log(`🔗 ${method} ${API_BASE}${path}`); // Debug log

  const response = await fetch(API_BASE + path, options);

  // Handle 401 properly
  if (response.status === 401) {
    throw new Error("Unauthorized. Please login again.");
  }

  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (contentType.includes("application/json")) {
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || "Request failed";
      const fullError = new Error(errorMsg);
      fullError.status = response.status;
      fullError.data = data;
      console.error(`❌ ${method} ${path} - Status: ${response.status} - ${errorMsg}`);
      throw fullError;
    }

    console.log(`✓ ${method} ${path} - Success`);
    return data;
  }

  // If server returns HTML (redirect to login page)
  if (contentType.includes("text/html")) {
    throw new Error("Authentication required. Session may have expired.");
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return text;
}