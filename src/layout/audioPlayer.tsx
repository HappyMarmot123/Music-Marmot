"use client";

import { useState, useRef, MouseEvent, useEffect } from "react";
import { useAudioPlayer } from "@/lib/useAudioPlayer";
import PlayerTrackDetails from "@/component/playerTrackDetails";
import PlayerControlsSection from "@/component/playerControlsSection";
import AlbumArtwork from "@/component/albumArtwork";
import Draggable, {
  DraggableEvent,
  type DraggableBounds,
} from "react-draggable";
import "@/lib/util";
import { handleSeekInteraction } from "@/lib/util";
import { useToggle } from "@/store/toggleStore";

/* 
  TODO: 
  Audio PlayerOpen Source = https://codepen.io/singhimalaya/pen/QZKqOX
  react-draggable Docs = https://www.npmjs.com/package/react-draggable#technical-documentation
 
  Next.js는 기본적으로 React Strict Mode를 사용합니다.

  React Strict 모드에서 실행하는 경우 ReactDOM.findDOMNode()는 더 이상 사용되지 않습니다.
  안타깝게도 <Draggable>이 제대로 작동하려면 기본 DOM 노드에 대한 원시 접근이 필요합니다.
  경고를 피하려면 다음 예제와 같이 `nodeRef`를 전달하세요.

  const nodeRef = React.useRef(null);
  return (
  <Draggable nodeRef={nodeRef}>
  <div ref={nodeRef}>예제 대상</div>
  </Draggable>
*/

// Root here
export default function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    setVolume,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
    isMuted,
    toggleMute,
    isLoadingCloudinary,
  } = useAudioPlayer();

  // PlayerTrackDetails에 필요한 로컬 UI 상태 (seek hover 관련)
  const [seekHoverTime, setSeekHoverTime] = useState<number | null>(null);
  const [seekHoverPosition, setSeekHoverPosition] = useState(0);
  const seekBarContainerRef = useRef<HTMLDivElement>(null);

  const draggableRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<DraggableBounds | undefined>(undefined);
  const defaultPositionRef = useRef({ x: 700, y: 640 });
  // const defaultPositionRef = useRef({ x: 0, y: 0 });
  // useEffect(() => {
  //   const playerWidth = 344;
  //   const playerHeight = 80;
  //   const margin = 20;
  //   defaultPositionRef.current = {
  //     x: window.innerWidth - playerWidth - margin,
  //     y: window.innerHeight - playerHeight - margin,
  //   };

  //   setDraggableKey(Date.now());
  // }, []);
  const [draggableKey, setDraggableKey] = useState(Date.now());

  const { openToggle } = useToggle();

  const currentProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const playerElement = draggableRef.current;
    if (playerElement) {
      const updateBounds = () => {
        const elWidth = playerElement.offsetWidth;
        const elHeight = playerElement.offsetHeight;
        const initialTopBound = 60;
        const initialRightBound = 30;
        const initialBottomBound = 10;
        const initialLeftBound = 0;

        setBounds({
          left: initialLeftBound,
          top: initialTopBound,
          right: window.innerWidth - elWidth - initialRightBound,
          bottom: window.innerHeight - elHeight - initialBottomBound,
        });
      };

      updateBounds();
      window.addEventListener("resize", updateBounds);
      return () => window.removeEventListener("resize", updateBounds);
    }
  }, []);

  const handleLocalSeek = (event: MouseEvent<HTMLDivElement>) => {
    handleSeekInteraction(
      event,
      seekBarContainerRef,
      duration,
      seek,
      setSeekHoverTime,
      setSeekHoverPosition
    );
  };

  const handleLocalSeekMouseOut = () => {
    setSeekHoverTime(null);
  };

  const handleStart = (e: DraggableEvent) => {
    if (
      e.target instanceof HTMLElement &&
      e.target.classList.contains("no-drag")
    ) {
      return false; // 특정 요소에서 드래그 방지
    }
  };

  return (
    <Draggable
      key={draggableKey}
      bounds={bounds}
      defaultPosition={defaultPositionRef.current}
      nodeRef={draggableRef as React.RefObject<HTMLElement>}
      handle=".draggable-handle"
      onStart={handleStart}
    >
      <div
        ref={draggableRef}
        id="player-container"
        className="fixed w-[444px] h-[80px] mx-auto mt-[-4px] z-50 select-none"
      >
        <div
          id="player"
          className="relative h-full z-[3] draggable-handle cursor-grab active:cursor-grabbing"
        >
          <PlayerTrackDetails
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            currentProgress={currentProgress}
            seekBarContainerRef={seekBarContainerRef}
            handleSeek={handleLocalSeek}
            handleSeekMouseOut={handleLocalSeekMouseOut}
            seekHoverTime={seekHoverTime}
            seekHoverPosition={seekHoverPosition}
          />
          <div
            id="player-content"
            className="relative h-full bg-white shadow-[0_15px_40px_#656565] rounded-[15px] z-[2]"
          >
            <AlbumArtwork
              isPlaying={isPlaying}
              isBuffering={isBuffering}
              currentTrackInfo={currentTrack}
              onClick={openToggle}
            />
            <PlayerControlsSection
              currentTrackInfo={currentTrack}
              prevTrack={prevTrack}
              togglePlayPause={togglePlayPause}
              nextTrack={nextTrack}
              isPlaying={isPlaying}
              volume={volume}
              setVolume={setVolume}
              isMuted={isMuted}
              toggleMute={toggleMute}
            />
          </div>
        </div>
      </div>
    </Draggable>
  );
}
