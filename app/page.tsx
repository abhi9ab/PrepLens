'use client'
import { ModeToggle } from "@/components/ModeToggle";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();
  const words = [
    { text: "Build" },
    { text: "confidence" },
    { text: "with" },
    {
      text: "PrepLens.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900">
      <main className="w-full">
        <div className="h-[50rem] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-grid-black/[0.1] dark:bg-grid-white/[0.1]"></div>
          <div className="absolute top-4 right-4">
            <ModeToggle />
          </div>

          <div className="z-10 flex flex-col items-center text-center space-y-6">
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg">
              The road to excellence starts here
            </p>

            <TypewriterEffectSmooth words={words} />

            {!isSignedIn ? (
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4">
                <Link href="/dashboard">
                  <Button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
                    Join now
                  </Button>
                </Link>

                <Link href="/sign-up">
                  <Button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-6">
                <Link href="/dashboard">
                  <Button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="flex flex-wrap items-center justify-between border shadow-xl gap-6 py-4 px-8 bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
        <p>
          Contact:
          <a
            href="https://github.com/abhi9ab"
            target="_blank"
            className="ml-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
          >
            @github
          </a>
        </p>
        <p>&copy; {new Date().getFullYear()} All rights reserved</p>
      </footer>
    </div>
  );
}
