// import { Outlet } from "react-router-dom";
import { Outlet } from "react-router-dom";
import banner from "../assets/banner.jpg";
import logo from "../assets/logo.svg";

export default function AuthLayout() {
  return (
    <div className="md:w-[1440px] h-screen flex flex-col md:flex-row mx-auto rounded-2xl overflow-hidden">
      {/* Left Column */}
      <div className="justify-center items-center md:w-[591px] h-full p-10 gap-4 flex flex-col">
        <div className="md:w-[527px] h-8">
          <img src={logo} className="h-full object-contain" alt="Logo" />
        </div>
        <Outlet />
      </div>

      {/* Right Column */}
      <div className="hidden md:flex md:w-[849px] h-screen p-3 items-center justify-center">
        <div className="w-[825px] h-full rounded-3xl overflow-hidden">
          <img
            src={banner}
            alt="Banner"
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
}
