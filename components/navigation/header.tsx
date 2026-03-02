"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Users, Mail, UserPlus, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const Header = () => {
  const pathname = usePathname() ?? "";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  // Auth check — untouched
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setLoading(false);
    };
    checkAuth();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Scroll state for backdrop intensification
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/about", label: "About", icon: Users },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Playfair+Display:ital,wght@0,700;0,900;1,400&display=swap');

        :root {
          --h-bone: #EDE3D0;
          --h-parchment: #C9B49A;
          --h-crimson: #8B0A0A;
          --h-gold: #C8A84B;
          --h-gold-dim: #7D6328;
          --h-ink: #080604;
          --h-height: 72px;
        }

        .gf-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: var(--h-height);
          display: flex;
          align-items: center;
          transition: background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease;
        }

        .gf-header.scrolled {
          background: rgba(8, 6, 4, 0.92);
          border-bottom: 1px solid rgba(200, 168, 75, 0.12);
          box-shadow: 0 4px 40px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .gf-header.top {
          background: linear-gradient(to bottom, rgba(8,6,4,0.75) 0%, transparent 100%);
          border-bottom: 1px solid transparent;
          box-shadow: none;
          backdrop-filter: none;
        }

        .gf-header-inner {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 6vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        /* ── LOGO ── */
        .gf-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
          flex-shrink: 0;
        }

        .gf-logo-img {
          width: 32px;
          height: 32px;
          opacity: 0.9;
          transition: opacity 0.3s ease;
          filter: brightness(0) invert(1) sepia(1) saturate(0.3) hue-rotate(5deg);
        }

        .gf-logo:hover .gf-logo-img { opacity: 1; }

        .gf-logo-divider {
          width: 1px;
          height: 22px;
          background: linear-gradient(to bottom, transparent, rgba(200,168,75,0.4), transparent);
          flex-shrink: 0;
        }

        .gf-logo-wordmark {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-style: italic;
          font-weight: 700;
          color: var(--h-bone);
          letter-spacing: 0.05em;
          opacity: 0.85;
          transition: opacity 0.3s;
          white-space: nowrap;
        }

        .gf-logo:hover .gf-logo-wordmark { opacity: 1; }

        /* ── NAV ── */
        .gf-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .gf-nav-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.78rem;
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(237, 227, 208, 0.55);
          text-decoration: none;
          padding: 0.55rem 1.2rem;
          position: relative;
          transition: color 0.3s ease;
          white-space: nowrap;
        }

        /* Animated underline */
        .gf-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 1.2rem;
          right: 1.2rem;
          height: 1px;
          background: var(--h-gold);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.77,0,0.175,1);
        }

        .gf-nav-link:hover { color: var(--h-bone); }
        .gf-nav-link:hover::after { transform: scaleX(1); }

        .gf-nav-link.active {
          color: var(--h-bone);
        }
        .gf-nav-link.active::after {
          transform: scaleX(1);
          background: var(--h-crimson);
        }

        .gf-nav-link svg {
          opacity: 0.5;
          flex-shrink: 0;
          transition: opacity 0.3s;
        }
        .gf-nav-link:hover svg,
        .gf-nav-link.active svg { opacity: 0.8; }

        /* Separator */
        .gf-sep {
          width: 1px;
          height: 20px;
          background: linear-gradient(to bottom, transparent, rgba(200,168,75,0.25), transparent);
          margin: 0 0.5rem;
          flex-shrink: 0;
        }

        /* ── CTA BUTTON ── */
        .gf-cta {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--h-bone);
          text-decoration: none;
          padding: 0.65rem 1.6rem;
          border: 1px solid rgba(139,10,10,0.55);
          position: relative;
          overflow: hidden;
          transition: border-color 0.4s ease;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .gf-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--h-crimson);
          transform: translateX(-101%);
          transition: transform 0.45s cubic-bezier(0.77,0,0.175,1);
        }

        .gf-cta:hover::before { transform: translateX(0); }
        .gf-cta:hover { border-color: var(--h-crimson); }

        .gf-cta span,
        .gf-cta svg { position: relative; z-index: 1; }

        .gf-cta.active {
          background: var(--h-crimson);
          border-color: var(--h-crimson);
        }
        .gf-cta.active::before { transform: translateX(0); }

        .gf-cta svg { opacity: 0.8; flex-shrink: 0; }

        /* ── MOBILE ── */
        @media (max-width: 640px) {
          .gf-nav-link span { display: none; }
          .gf-logo-wordmark { display: none; }
          .gf-logo-divider { display: none; }
          .gf-cta span { display: none; }
          .gf-cta { padding: 0.65rem 0.9rem; }
          .gf-nav-link { padding: 0.55rem 0.8rem; }
          .gf-nav-link::after { left: 0.8rem; right: 0.8rem; }
        }
      `}</style>

      <header className={`gf-header ${scrolled ? "scrolled" : "top"}`}>
        <div className="gf-header-inner">
          {/* Logo */}
          <Link href="/" className="gf-logo">
            <Image
              src="/ypsilon-logo.svg"
              alt="Logo"
              width={32}
              height={32}
              priority
              className="gf-logo-img"
            />
            <span className="gf-logo-divider" />
            <span className="gf-logo-wordmark">the name.</span>
          </Link>

          {/* Nav links */}
          <nav className="gf-nav">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`gf-nav-link${isActive ? " active" : ""}`}
                >
                  <link.icon size={14} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <span className="gf-sep" />

            {/* Auth CTA */}
            {!loading &&
              (isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className={`gf-cta${pathname === "/dashboard" ? " active" : ""}`}
                >
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className={`gf-cta${pathname === "/signup" ? " active" : ""}`}
                >
                  <UserPlus size={14} />
                  <span>Sign Up</span>
                </Link>
              ))}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
