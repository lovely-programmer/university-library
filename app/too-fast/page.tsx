import React from "react";

export default function page() {
  return (
    <main className="root-container flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-bebas-neue text-5xl text-light-100">
        Whoa, Slow Down There, Speedy
      </h1>
      <p className="mt-2 max-w-xl text-light-400 text-center">
        looks like you&apos;ve been a little too eager. We&apos;ll put a
        temporary pause on your excitement. Chill for a bit, and try again
        shortly
      </p>
    </main>
  );
}
