import React from "react";
import { formatTime } from "@/shared/lib/util";
import Waveform from "@/shared/components/waveform";

interface ModalPlayerTrackDetailsProps {
  currentTime: number;
  duration: number;
}

const ModalPlayerTrackDetails: React.FC<ModalPlayerTrackDetailsProps> = ({
  currentTime,
  duration,
}) => {
  return (
    <section aria-label="재생 진행 막대" className="w-full mt-6 mb-2">
      <Waveform />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </section>
  );
};

export default ModalPlayerTrackDetails;
