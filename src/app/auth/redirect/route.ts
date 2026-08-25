import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No authenticated user
  if (!user) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Role lookup error:", error);

    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // Admin
  if (profile?.role === "admin") {
    return NextResponse.redirect(
      new URL("/admin", request.url)
    );
  }

  // Student
  if (profile?.role === "student") {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // Unknown/missing role
  return NextResponse.redirect(
    new URL("/dashboard", request.url)
  );
}