import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const supabase = await createClient();

  if (code) {
    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error(
        "Supabase callback error:",
        error
      );

      return NextResponse.redirect(
        new URL("/login?error=auth_callback", request.url)
      );
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

  if (profileError) {
    console.error(
      "Profile lookup error:",
      profileError
    );

    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  if (profile?.role === "admin") {
    return NextResponse.redirect(
      new URL("/admin", request.url)
    );
  }

  return NextResponse.redirect(
    new URL("/dashboard", request.url)
  );
}