import { NextResponse, type NextRequest } from "next/server";

/** Temporary no-op middleware while we are developing without auth. */
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
