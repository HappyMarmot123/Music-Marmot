import { List, Music } from "lucide-react";

interface ModalViewToggleProps {
  currentView: "player" | "list";
  setCurrentView: (view: "player" | "list") => void;
}

export default function ModalViewToggle({
  currentView,
  setCurrentView,
}: ModalViewToggleProps) {
  return (
    <div className="md:hidden absolute bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={() => setCurrentView("player")}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          currentView === "player"
            ? "bg-pink-500 text-white"
            : "bg-white/20 text-white/80"
        }`}
        aria-label="Player view"
      >
        <Music size={24} />
      </button>
      <button
        onClick={() => setCurrentView("list")}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          currentView === "list"
            ? "bg-pink-500 text-white"
            : "bg-white/20 text-white/80"
        }`}
        aria-label="List view"
      >
        <List size={24} />
      </button>
    </div>
  );
}
