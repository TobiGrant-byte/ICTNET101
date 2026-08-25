"use client";

import {
  Menu,
  X,
  BookOpen,
  FlaskConical,
  Brain,
  Trophy,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import ThemeToggle from "@/components/navigation/ThemeToggle";
import ThemeSelector from "@/components/navigation/ThemeSelector";
import { createClient } from "@/lib/supabase/client";

type UserRole =
  | "student"
  | "admin"
  | null;

export default function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [loadingUser, setLoadingUser] =
    useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [userRole, setUserRole] =
    useState<UserRole>(null);

  const [loggingOut, setLoggingOut] =
    useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    const supabase = createClient();

    let active = true;

    async function loadRole(
      userId: string
    ) {
      try {
        const {
          data: profile,
          error,
        } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .maybeSingle();

        if (!active) {
          return;
        }

        if (error) {
          console.error(
            "Navbar profile error:",
            error
          );

          setUserRole(null);
          return;
        }

        if (profile?.role === "admin") {
          setUserRole("admin");
        } else if (
          profile?.role === "student"
        ) {
          setUserRole("student");
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error(
          "Navbar role error:",
          error
        );

        if (active) {
          setUserRole(null);
        }
      }
    }

    async function initializeUser() {
      try {
        /*
         * Read the browser session once when the
         * Navbar mounts.
         */
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!active) {
          return;
        }

        if (error) {
          console.error(
            "Navbar session error:",
            error
          );

          setIsAuthenticated(false);
          setUserRole(null);
          return;
        }

        if (!session?.user) {
          setIsAuthenticated(false);
          setUserRole(null);
          return;
        }

        setIsAuthenticated(true);

        await loadRole(
          session.user.id
        );
      } catch (error) {
        console.error(
          "Navbar initialization error:",
          error
        );

        if (active) {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } finally {
        if (active) {
          setLoadingUser(false);
        }
      }
    }

    void initializeUser();

    /*
     * Listen for later auth changes.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!active) {
          return;
        }

        if (
          event === "SIGNED_OUT"
        ) {
          setIsAuthenticated(false);
          setUserRole(null);
          setLoadingUser(false);
          return;
        }

        if (
          event === "SIGNED_IN" &&
          session?.user
        ) {
          setIsAuthenticated(true);

          /*
           * Don't make another Supabase Auth
           * request directly inside the callback.
           */
          window.setTimeout(() => {
            if (!active) {
              return;
            }

            void loadRole(
              session.user.id
            );
          }, 0);

          return;
        }

        /*
         * INITIAL_SESSION can arrive here too.
         */
        if (
          event === "INITIAL_SESSION"
        ) {
          if (session?.user) {
            setIsAuthenticated(true);

            window.setTimeout(() => {
              if (!active) {
                return;
              }

              void loadRole(
                session.user.id
              );
            }, 0);
          } else {
            setIsAuthenticated(false);
            setUserRole(null);
          }

          setLoadingUser(false);
        }
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);
    closeMenu();

    try {
      const supabase =
        createClient();

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        console.error(
          "Logout error:",
          error
        );

        setLoggingOut(false);
        return;
      }

      window.location.assign(
        "/login"
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      setLoggingOut(false);
    }
  }

  const dashboardHref =
    userRole === "admin"
      ? "/admin"
      : "/dashboard";

  const dashboardLabel =
    userRole === "admin"
      ? "Admin Dashboard"
      : "Dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-black text-[var(--primary-foreground)]">
            N
          </div>

          <span className="text-lg font-bold tracking-tight">
            ICT
            <span className="text-[var(--primary)]">
              NET
            </span>
            101
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/modules"
            className="text-sm font-medium text-[var(--muted-foreground)] transition hover:text-[var(--primary)]"
          >
            Learn
          </Link>

          <Link
            href="/labs"
            className="text-sm font-medium text-[var(--muted-foreground)] transition hover:text-[var(--primary)]"
          >
            Labs
          </Link>

          <Link
            href="/quiz"
            className="text-sm font-medium text-[var(--muted-foreground)] transition hover:text-[var(--primary)]"
          >
            Quizzes
          </Link>

          <Link
            href="/leaderboard"
            className="text-sm font-medium text-[var(--muted-foreground)] transition hover:text-[var(--primary)]"
          >
            Leaderboard
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeSelector />
          <ThemeToggle />

          {loadingUser ? (
            <div className="h-10 w-28 animate-pulse rounded-xl bg-[var(--muted)]" />
          ) : !isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold transition hover:bg-[var(--muted)]"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition hover:bg-[var(--muted)]"
              >
                {userRole === "admin" ? (
                  <ShieldCheck size={17} />
                ) : (
                  <LayoutDashboard
                    size={17}
                  />
                )}

                {dashboardLabel}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut size={17} />

                {loggingOut
                  ? "Logging out..."
                  : "Logout"}
              </button>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeSelector />
          <ThemeToggle />

          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (previous) =>
                  !previous
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)]"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-2">

            <Link
              href="/modules"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 transition hover:bg-[var(--muted)]"
            >
              <span className="flex items-center gap-3">
                <BookOpen size={19} />
                Learn
              </span>
            </Link>

            <Link
              href="/labs"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 transition hover:bg-[var(--muted)]"
            >
              <span className="flex items-center gap-3">
                <FlaskConical
                  size={19}
                />
                Labs
              </span>
            </Link>

            <Link
              href="/quiz"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 transition hover:bg-[var(--muted)]"
            >
              <span className="flex items-center gap-3">
                <Brain size={19} />
                Quizzes
              </span>
            </Link>

            <Link
              href="/leaderboard"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 transition hover:bg-[var(--muted)]"
            >
              <span className="flex items-center gap-3">
                <Trophy size={19} />
                Leaderboard
              </span>
            </Link>

            <div className="my-2 h-px bg-[var(--border)]" />

            {loadingUser ? (
              <div className="h-12 animate-pulse rounded-xl bg-[var(--muted)]" />
            ) : !isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 transition hover:bg-[var(--muted)]"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="rounded-xl bg-[var(--primary)] px-4 py-3 text-center font-semibold text-[var(--primary-foreground)]"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={dashboardHref}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 transition hover:bg-[var(--muted)]"
                >
                  <span className="flex items-center gap-3">
                    {userRole === "admin" ? (
                      <ShieldCheck
                        size={19}
                      />
                    ) : (
                      <LayoutDashboard
                        size={19}
                      />
                    )}

                    {dashboardLabel}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-[var(--muted)] disabled:opacity-50"
                >
                  <LogOut size={19} />

                  {loggingOut
                    ? "Logging out..."
                    : "Logout"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}