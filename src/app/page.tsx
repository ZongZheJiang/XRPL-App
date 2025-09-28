"use client";

import React from "react";
import "./globals.css";

import Link from "next/link";

function Home() {
  return (
    <div
      className="hero min-h-screen w-screen relative"
      style={{
        backgroundImage:
          "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w">
          <h1 className="mb-5 text-5xl font-bold">SAMPLE NAME</h1>
          <h1 className="mb-5 text-2xl">
            Crowdfunding made seamless and transparent{" "}
          </h1>
          <div className="flex flex-row justify-center items-center gap-4 mt-6">
            <button className="btn btn-primary text-neutral-content text-base md:text-lg px-6 py-2">
              <Link href="/login">Log In</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
