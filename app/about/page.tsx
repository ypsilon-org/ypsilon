"use client";

import localFont from "next/font/local";
import { Rethink_Sans } from "next/font/google";
import Link from "next/link";

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const modernSociety = localFont({
  src: "../../public/fonts/ModernSociety-Regular.otf",
});

// Unit color configuration matching dashboard
const UNIT_COLORS = {
  Einherjar: {
    primary: "#6FF3FF",
    accent: "#29848e",
  },
  "Legio X Equestris": {
    primary: "#8A3FFC",
    accent: "#5A23B0",
  },
  Myrmidons: {
    primary: "#A6FF00",
    accent: "#5FAE00",
  },
  "Narayani Sena": {
    primary: "#FFC83D",
    accent: "#C99700",
  },
  Spartans: {
    primary: "#FF6A00",
    accent: "#C94F00",
  },
};

const units = [
  {
    name: "Einherjar",
    description: "Warriors chosen for valor and honor",
    fullDescription:
      "Named after the legendary Norse warriors who dwell in Valhalla, the Einherjar embody courage, loyalty, and the warrior spirit. Members of this unit value honor above all else.",
  },
  {
    name: "Legio X Equestris",
    description: "Strategic minds and tactical excellence",
    fullDescription:
      "Following in the footsteps of Caesar's most trusted legion, this unit represents discipline, strategy, and tactical mastery. Members excel in planning and execution.",
  },
  {
    name: "Myrmidons",
    description: "Elite fighters and skilled warriors",
    fullDescription:
      "Drawing inspiration from Achilles' legendary warriors, the Myrmidons are known for their exceptional combat prowess and unwavering dedication to excellence in every endeavor.",
  },
  {
    name: "Narayani Sena",
    description: "Divine warriors with unbreakable resolve",
    fullDescription:
      "Named after the celestial army of Hindu mythology, this unit represents spiritual strength, wisdom, and an indomitable will to overcome any challenge.",
  },
  {
    name: "Spartans",
    description: "Disciplined, resilient, and relentless",
    fullDescription:
      "Embodying the spirit of ancient Sparta, these warriors are known for their discipline, physical prowess, and the famous Spartan resolve to never surrender.",
  },
];

export default function AboutPage() {
  return (
    <div
      className={`${rethinkSans.className} min-h-screen bg-black text-white`}
    >
      {/* Hero Section */}
      <section className="px-8 md:px-20 lg:px-60 mx-auto pt-32 pb-20">
        <h1 className="text-6xl md:text-7xl font-medium mb-6 leading-tight">
          About
          <br />
          <span
            className={`${modernSociety.className} text-red-600 text-7xl md:text-8xl`}
          >
            the name.
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl">
          We are a community of like-minded individuals united by shared values,
          organized into legendary units, each with its own unique identity and
          purpose.
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We believe in the power of community to transform individuals and
              create lasting impact. Our mission is to provide a space where
              people can connect with others who share their passions, learn
              from each other, and grow together.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Through our unique unit system, members find their tribe and
              contribute to something greater than themselves.
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h3 className="text-2xl font-semibold mb-6 text-red-600">
              Core Values
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">▸</span>
                <div>
                  <strong className="text-white">Excellence</strong>
                  <p className="text-gray-400 text-sm mt-1">
                    Striving for the highest standards in everything we do
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">▸</span>
                <div>
                  <strong className="text-white">Community</strong>
                  <p className="text-gray-400 text-sm mt-1">
                    Supporting each other and growing together
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">▸</span>
                <div>
                  <strong className="text-white">Integrity</strong>
                  <p className="text-gray-400 text-sm mt-1">
                    Acting with honor and staying true to our principles
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">▸</span>
                <div>
                  <strong className="text-white">Growth</strong>
                  <p className="text-gray-400 text-sm mt-1">
                    Continuously learning and evolving as individuals
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Units Section */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Units</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Each unit represents a different set of values and characteristics.
            When you join, you'll choose the unit that resonates most with your
            personal philosophy and goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit) => {
            const colors = UNIT_COLORS[unit.name as keyof typeof UNIT_COLORS];
            return (
              <div
                key={unit.name}
                className="bg-gray-900 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  borderColor: colors.primary,
                }}
              >
                <div
                  className="h-2"
                  style={{
                    background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                  }}
                ></div>
                <div className="p-6">
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: colors.primary }}
                  >
                    {unit.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 italic">
                    {unit.description}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {unit.fullDescription}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-900 border-y border-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Sign Up</h3>
              <p className="text-gray-400 text-sm">
                Create your account and choose the unit that best represents
                your values and aspirations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect</h3>
              <p className="text-gray-400 text-sm">
                Join your unit's community, meet fellow members, and participate
                in discussions and events.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Grow</h3>
              <p className="text-gray-400 text-sm">
                Earn achievements, rise through the ranks, and contribute to
                your unit's legacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Unit?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join our community today and become part of something greater.
            Choose your unit, connect with like-minded individuals, and start
            your journey.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <button className="bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-medium transition-colors rounded-md">
                Join Now
              </button>
            </Link>
            <Link href="/">
              <button className="border-2 border-gray-800 hover:border-red-600 px-8 py-3 text-sm font-medium transition-colors rounded-md">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <p className="text-gray-600 text-sm text-center">
            &copy; 2026 Community. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
