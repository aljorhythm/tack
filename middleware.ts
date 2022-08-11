import { NextMiddleware, NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware: NextMiddleware = async (request: NextRequest) => {
    return NextResponse.next();
};
