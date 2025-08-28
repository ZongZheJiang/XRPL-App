"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

function OrganisationList() {
  return (
    <div className="flex items-center justify-center w-screen gap-x-8">
      <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
          <Image
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
            className="w-[100%] h-auto"
            width={50}
            height={50}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Organisation #1 Name</h2>
          <p>Organisation Description</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">
              <Link
                href={`/create-smart-contract?address=${encodeURIComponent("jiangzongzhe")}`}
              >
                Donate Now
              </Link>
            </button>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
          <Image
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
            className="w-[100%] h-auto"
            width={50}
            height={50}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Organisation #2 Name</h2>
          <p>Organisation Description</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">
              <Link
                href={`/create-smart-contract?address=${encodeURIComponent("chewjincheng")}`}
              >
                Donate Now
              </Link>
            </button>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
          <Image
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
            className="w-[100%] h-auto"
            width={50}
            height={50}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Organisation #3 Name</h2>
          <p>Organisation Description</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">
              <Link
                href={`/create-smart-contract?address=${encodeURIComponent("hengxinyufelicia")}`}
              >
                Donate Now
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OrganisationList;
