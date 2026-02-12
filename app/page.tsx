"use client";
import localFont from "next/font/local";
import { Rethink_Sans } from "next/font/google";

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const modernSociety = localFont({
  src: "../public/fonts/ModernSociety-Regular.otf",
});

export default function HomePage() {
  return (
    <div
      className={`${rethinkSans.className} min-h-screen bg-[#0B1120] text-white`}
    >
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-linear-to-b from-[#0B1120] via-[#0F1629] to-[#0B1120]"></div>

      {/* Hero Section */}
      <section className="relative px-8 md:px-20 lg:px-60 mx-auto py-32 md:py-56 min-h-screen flex flex-col justify-center">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
            <span className="block text-gray-400 mb-2">Welcome to</span>
            <span
              className={`${modernSociety.className} text-red-500 text-5xl md:text-8xl lg:text-7xl`}
            >
              the name.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-light">
            A place for like-minded people to connect, share ideas, and grow
            together.
          </p>
          <button className="mt-6 rounded-lg bg-red-600 hover:bg-red-700 px-10 py-4 text-base font-semibold transition-colors">
            Join Now
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative max-w-7xl mx-auto px-8 py-32">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Connect",
              desc: "Meet people who share your interests and passions.",
            },
            {
              title: "Learn",
              desc: "Share knowledge and grow through discussions.",
            },
            {
              title: "Engage",
              desc: "Participate in events and community activities.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#1A2332] rounded-xl p-8 border border-gray-800 hover:border-red-500/50 transition-colors"
            >
              <h3 className="text-2xl font-bold mb-4 text-white">
                {item.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="join" className="relative max-w-5xl mx-auto px-8 py-32">
        <div className="bg-[#1A2332] rounded-2xl p-12 md:p-16 border border-gray-800">
          <h3 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Ready to join?
          </h3>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl">
            Become part of our growing community today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
              Get Started
            </button>
            <button className="px-8 py-4 rounded-lg border border-gray-700 hover:border-red-500 text-white font-semibold transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <p className="text-gray-600 text-sm">
            &copy; 2026 Community. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
