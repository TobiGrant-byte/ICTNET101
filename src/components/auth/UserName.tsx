"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type UserNameProps = {
  fallback?: string;
};

export default function UserName({
  fallback = "there",
}: UserNameProps) {
  const [name, setName] = useState(fallback);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadName() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active || !session?.user) {
        return;
      }

      const user = session.user;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;

      const profileName =
        typeof profile?.full_name === "string"
          ? profile.full_name.trim()
          : "";

      const metadataName =
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name.trim()
          : typeof user.user_metadata?.name === "string"
            ? user.user_metadata.name.trim()
            : "";

      const fullName =
        profileName || metadataName;

      if (fullName) {
        setName(fullName.split(/\s+/)[0]);
        return;
      }

      if (user.email) {
        setName(user.email.split("@")[0]);
      }
    }

    loadName();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!active) return;

        if (
          event === "SIGNED_IN" &&
          session?.user
        ) {
          loadName();
        }

        if (event === "SIGNED_OUT") {
          setName(fallback);
        }
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [fallback]);

  return <>{name}</>;
}