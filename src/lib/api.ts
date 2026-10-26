export interface User {
  id: number;
  name: string;
  email: string;
  joined: string;
}
export interface Cafe {
  id: number;
  name: string;
  description: string;
  suburb: string;
  style: string;
  origin: string;
  roast: string;
  notes: string;
  coffeeDescription: string;
  priceFrom: number;
  priceTo: number;
  image: string;
  rating: number | null;
  atmosphereRating: number | null;
  serviceRating: number | null;
  reviewCount: number;
}
export interface Review {
  id: number;
  cafeId: number;
  cafeName: string;
  userId: number;
  author: string;
  title: string;
  body: string;
  coffee: number;
  atmosphere: number;
  service: number;
  created: string;
}
export interface Session {
  user: User | null;
  csrf: string;
}
let csrf = "";
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
export async function api<T>(
  path: string,
  method = "GET",
  data?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  if (method !== "GET" && !csrf) await api<Session>("/auth/me");
  const response = await fetch("/api" + path, {
    method,
    credentials: "same-origin",
    signal,
    headers: {
      Accept: "application/json",
      ...(method !== "GET"
        ? { "Content-Type": "application/json", "X-CSRF-Token": csrf }
        : {}),
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  });
  let result;
  try {
    result = await response.json();
  } catch {
    throw new ApiError(
      "The service is unavailable. Please try again.",
      response.status,
    );
  }
  if (!response.ok)
    throw new ApiError(
      result.error || "Something went wrong. Please try again.",
      response.status,
    );
  if (result.csrf) csrf = result.csrf;
  return result as T;
}
export const errorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
export const money = (value: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(value);
