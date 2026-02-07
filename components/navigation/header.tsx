"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Users, Mail, UserPlus, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const Header = () => {
  const pathname = usePathname() ?? "";
  const [isLightMode, setIsLightMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const supabase = createClient();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const navLinks = [
    { href: "/", isLogo: true },
    { href: "/about", label: "About", icon: Users },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // On mobile, always keep header shortened
          if (window.innerWidth < 768) {
            setIsScrolled(true);
            setIsAtTop(currentScrollY < -1);
            lastScrollY = currentScrollY;
            ticking = false;
            return;
          }

          // Show icons only when scrolled down more than 100px
          if (currentScrollY > 100 && currentScrollY > lastScrollY) {
            setIsScrolled(true);
          }
          // Show labels when scrolling up or near top
          else if (currentScrollY < lastScrollY || currentScrollY < 50) {
            setIsScrolled(false);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-navbar-theme]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const theme = entry.target.getAttribute("data-navbar-theme");
            setIsLightMode(theme === "light");
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-100px 0px -60% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header
      className={`fixed ${isAtTop ? "top-4" : "bottom-4"} left-1/2 z-50 -translate-x-1/2 md:top-4`}
    >
      <nav
        className={`rounded-full border px-2 py-2 shadow-xl backdrop-blur-xl transition-all duration-500 ${
          isLightMode
            ? "border-gray-200/50 bg-white/90"
            : "border-gray-700/50 bg-gray-900/50"
        }`}
      >
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            const isHome = link.href === "/";

            return (
              <React.Fragment key={link.href}>
                {link.isLogo ? (
                  <Link
                    href="/"
                    className={`flex items-center justify-center rounded-full p-0.75 transition-all duration-300 ${
                      isActive
                        ? "bg-[#f4f3ef]"
                        : isLightMode
                          ? "hover:bg-gray-100"
                          : "hover:bg-gray-800/50"
                    }`}
                  >
                    <Image
                      src="/ypsilon-logo.svg"
                      alt="Logo"
                      width={30}
                      height={30}
                      priority
                    />
                  </Link>
                ) : (
                  <Link
                    href={link.href}
                    className={`group flex items-center overflow-hidden rounded-full text-sm font-medium whitespace-nowrap transition-all duration-500 ease-in-out ${isScrolled ? "gap-0 px-2 py-2" : "gap-2 px-5 py-2"} ${
                      isActive
                        ? "scale-105 bg-red-600 text-black shadow-lg shadow-[#DC2626]/20"
                        : isLightMode
                          ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                    }`}
                  >
                    {link.icon && <link.icon size={18} className="shrink-0" />}
                    <span
                      className={`hidden whitespace-nowrap transition-all duration-500 ease-in-out sm:inline ${
                        isScrolled
                          ? "ml-0 max-w-0 opacity-0 group-hover:ml-1 group-hover:max-w-xs group-hover:opacity-100"
                          : "ml-0 max-w-xs opacity-100"
                      }`}
                      style={{
                        transitionProperty: "max-width, opacity, margin-left",
                      }}
                    >
                      {link.label}
                    </span>
                  </Link>
                )}

                {isHome && (
                  <div
                    className={`mx-1 h-8 w-px transition-colors duration-300 ${
                      isLightMode ? "bg-gray-300" : "bg-gray-600"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}

          <div
            className={`mx-1 h-8 w-px transition-colors duration-300 ${
              isLightMode ? "bg-gray-300" : "bg-gray-600"
            }`}
          />

          {!loading && (
            <>
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className={`group flex items-center overflow-hidden rounded-full text-sm font-medium whitespace-nowrap transition-all duration-500 ease-in-out ${isScrolled ? "gap-0 px-2 py-2" : "gap-2 px-5 py-2"} ${
                    pathname === "/dashboard"
                      ? "scale-105 bg-red-600 text-black shadow-lg shadow-[#DC2626]/20"
                      : isLightMode
                        ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`}
                >
                  <LayoutDashboard size={18} className="shrink-0" />
                  <span
                    className={`hidden whitespace-nowrap transition-all duration-500 ease-in-out sm:inline ${
                      isScrolled
                        ? "ml-0 max-w-0 opacity-0 group-hover:ml-1 group-hover:max-w-xs group-hover:opacity-100"
                        : "ml-0 max-w-xs opacity-100"
                    }`}
                    style={{
                      transitionProperty: "max-width, opacity, margin-left",
                    }}
                  >
                    Dashboard
                  </span>
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className={`group flex items-center overflow-hidden rounded-full text-sm font-medium whitespace-nowrap transition-all duration-500 ease-in-out ${isScrolled ? "gap-0 px-2 py-2" : "gap-2 px-5 py-2"} ${
                    pathname === "/signup"
                      ? "scale-105 bg-red-600 text-black shadow-lg shadow-[#DC2626]/20"
                      : isLightMode
                        ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`}
                >
                  <UserPlus size={18} className="shrink-0" />
                  <span
                    className={`hidden whitespace-nowrap transition-all duration-500 ease-in-out sm:inline ${
                      isScrolled
                        ? "ml-0 max-w-0 opacity-0 group-hover:ml-1 group-hover:max-w-xs group-hover:opacity-100"
                        : "ml-0 max-w-xs opacity-100"
                    }`}
                    style={{
                      transitionProperty: "max-width, opacity, margin-left",
                    }}
                  >
                    Sign Up
                  </span>
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
