import React, { FC } from "react";
import Sidebar from "../sidebar/Sidebar";

const NavBar: FC = () => {
  return (
    <div>
      <nav className="flex h-[139px] items-center justify-start bg-primary px-4 text-3xl capitalize text-white ">
        <span></span>
      </nav>
      <Sidebar />
    </div>
  );
};

export default NavBar;
