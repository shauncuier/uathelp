// src/lib/server/api-response.ts
// Consistent API response helpers
import { NextResponse } from "next/server";

export function successResponse<T>(
  data: T,
  message = "Success",
  status = 200
): NextResponse {
  return NextResponse.json(
    { success: true, data, message },
    { status }
  );
}

export function errorResponse(
  message: string,
  code = "UNKNOWN_ERROR",
  status = 500
): NextResponse {
  return NextResponse.json(
    { success: false, error: { message, code } },
    { status }
  );
}
