"use client";
import localFont from "next/font/local";
import { Rethink_Sans } from "next/font/google";
// import FaultyTerminal from "@/components/FaultyTerminal";
// import Dither from "@/components/Dither";

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const modernSociety = localFont({
  src: "../public/fonts/ModernSociety-Regular.otf",
});

export default function HomePage() {
  return (
    <div className={`${rethinkSans.className} min-h-screen text-white`}>
      {/* <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: -1,
        }}
      >
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.5}
          pause={false}
          scanlineIntensity={0.5}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.1}
          tint="#dc2626"
          mouseReact
          mouseStrength={0.5}
          pageLoadAnimation
          brightness={0.6}
        />
      </div> */}

      {/* <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: -1,
        }}
      >
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div> */}

      <section className="px-60 mx-auto py-56 min-h-screen z-10 -pt-[600px] backdrop-blur-xs">
        <h2 className="text-7xl font-medium mb-6 leading-tight">
          Welcome to
          <br />
          <span className={`${modernSociety.className} text-red-600 text-8xl`}>
            the name.
          </span>
        </h2>
        <p className="text-lg text-gray-400 mb-10 max-w-xl">
          A place for like-minded people to connect, share ideas, and grow
          together.
        </p>
        <button className=" rounded-md border-2 border-red-600 hover:bg-red-600 px-8 py-3 text-sm font-medium transition-colors">
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
