"use client";
import LiquidEther from "@/components/LiquidEther";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div style={{ width: "100%", height: "100vh", position: "fixed" }}>
        <LiquidEther
          colors={["#0F0A0A", "#E6200A", "#F0E6A3"]}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      {/* Header */}
      <header className="border-b border-gray-800 z-10">
        <div className="max-w-5xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Community</h1>
          <nav className="flex gap-8 text-sm">
            <a href="#about" className="hover:text-red-600 transition-colors">
              About
            </a>
            <a href="#join" className="hover:text-red-600 transition-colors">
              Join
            </a>
            <a href="#contact" className="hover:text-red-600 transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-8 py-32">
        <h2 className="text-6xl font-bold mb-6 leading-tight">
          Welcome to
          <br />
          <span className="text-red-600">Ypsilon</span>
        </h2>
        <p className="text-lg text-gray-400 mb-10 max-w-xl">
          A place for like-minded people to connect, share ideas, and grow
          together.
        </p>
        <button className="bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-medium transition-colors">
          Join Now
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-5xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-3 gap-16">
          <div>
            <h3 className="text-lg font-semibold mb-3">Connect</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Meet people who share your interests and passions.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Learn</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Share knowledge and grow through discussions.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Engage</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Participate in events and community activities.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="join" className="max-w-5xl mx-auto px-8 py-20">
        <div className="border-t border-gray-800 pt-20">
          <h3 className="text-4xl font-bold mb-4">Ready to join?</h3>
          <p className="text-gray-400 mb-8 max-w-lg">
            Become part of our growing community today.
          </p>
          <div className="flex gap-4">
            <button className="bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-medium transition-colors">
              Get Started
            </button>
            <button className="border border-gray-800 hover:border-red-600 px-6 py-3 text-sm font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <p className="text-gray-600 text-sm">
            &copy; 2026 Community. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
