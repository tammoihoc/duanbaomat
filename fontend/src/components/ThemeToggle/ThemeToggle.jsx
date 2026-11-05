// src/components/ThemeToggle/ThemeToggle.jsx
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      <div className={`toggle-track ${darkMode ? "dark" : "light"}`}>
        <div className={`toggle-thumb ${darkMode ? "dark" : "light"}`}>
          {darkMode ? <Moon size={14} /> : <Sun size={14} />}
        </div>
      </div>
    </button>
  );
}
