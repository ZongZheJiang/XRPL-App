"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const menu = "/menu.svg"; // assuming these files are in public directory
const close = "/close.svg";
const wallet = "/wallet.svg";

const Navbar = () => {
  const [toggle, setToggle] = useState(true);
  const handleClick = () => {
    setToggle(!toggle);
    console.log("Toggle state:", toggle);
  };

  const redirectPage = () => {
    setToggle(true);
    console.log("Toggle state:", toggle);
  };

  return (
    <div className="navbar w-full left-0 right-0 top-0 bg-base-100 shadow-sm fixed z-50">
      <div className="flex-none">
        <div className="dropdown" onClick={handleClick}>
          <Image
            tabIndex={0}
            role="button"
            src={toggle ? menu : close}
            alt="menu"
            width={30}
            height={30}
          />
          <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li onClick={redirectPage}>
              <Link href="/homepage/create-wallet">Create Wallet</Link>
            </li>
            <li onClick={redirectPage}>
              <Link href="/homepage/create-smart-contract">Create Smart Contract</Link>
            </li>
            <li onClick={redirectPage}>
              <Link href="/homepage/transfer-money">Transfer Money</Link>
            </li>
            <li onClick={redirectPage}>
              <Link href="/homepage/organisations">Organisations List</Link>
            </li>
            <li onClick={redirectPage}>
              <Link href="/homepage/create-trustline">Create Trustline</Link>
            </li>
            <li onClick={redirectPage}>
              <Link href="/homepage/fund-wallet">Fund Wallet</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          daisyUI
        </Link>
      </div>
      <div className="flex-none">
        <div>
          <Link href="/check-balance">
            <Image src={wallet} alt="wallet" width={30} height={30} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
