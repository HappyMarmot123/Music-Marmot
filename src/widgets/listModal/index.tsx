import { motion } from "framer-motion";
import { listModalRootClassName } from "@/shared/lib/util";
import ModalPlayer from "./components/modalPlayer";
import ModalTrackList from "./components/modalTrackList";
import { useState } from "react";
import ModalViewToggle from "./components/modalViewToggle";

/*
  TODO:
  tippy.js 툴팁 괜찮은데, react19 에러가 뜨네...
  https://www.npmjs.com/package/tippy.js
*/

export default function ListModal({
  closeToggle,
}: {
  closeToggle: () => void;
}) {
  const [currentView, setCurrentView] = useState<"player" | "list">("player");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={listModalRootClassName()}
    >
      <div className="hidden md:block">
        {currentView === "player" && <ModalPlayer />}
        {currentView === "list" && <ModalTrackList closeToggle={closeToggle} />}
      </div>

      <div className="md:hidden">
        {currentView === "player" && <ModalPlayer />}
        {currentView === "list" && <ModalTrackList closeToggle={closeToggle} />}
      </div>

      <ModalViewToggle
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
    </motion.div>
  );
}
