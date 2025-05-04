"use client";

import React from "react";
import useStore from "../store/zustandStore";
import { useTheme } from "../provider/ThemeProvider";

const Page: React.FC = () => {
  const { count, increase, decrease } = useStore();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <h1>{isDarkMode ? "Dark Mode" : "Light Mode"}</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <h1>Count: {count}</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
    </div>
  );
};

export default Page;
