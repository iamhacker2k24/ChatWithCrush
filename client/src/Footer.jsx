import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-2.5 text-center bg-transparent">
      <p className="text-xs text-gray-400 font-medium tracking-wide flex items-center justify-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
        <span>Crafted with</span>
        <span className="text-rose-500 heart-beat">❤️</span>
        <span>by</span>
        <span className="text-emerald-400 font-semibold hover:underline cursor-pointer">
          Debabrata
        </span>
      </p>
    </footer>
  );
};

export default Footer;