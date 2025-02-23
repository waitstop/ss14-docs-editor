import React from "react";
import { Github } from "lucide-react";

export default function Header(): React.ReactNode {
  return (
    <header className="p-4">
      <a
        href="https://github.com/waitstop"
        className="p-2 bg-white text-black flex items-center justify-center w-min rounded-md"
      >
        <Github className="size-6" />
      </a>
    </header>
  );
}
