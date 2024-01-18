import DarkModeToggle from "./components/DarkMode";

export default function App() {
  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen transition-all duration-300">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Dark Mode Toggle
        </h1>
        <DarkModeToggle />
      </div>
    </div>
  );
}
