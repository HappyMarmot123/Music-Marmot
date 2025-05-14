"use client";

import { useState, useRef, MouseEvent, useEffect } from "react";
import { useAudioPlayer } from "@/lib/useAudioPlayer";
import PlayerTrackDetails from "@/component/playerTrackDetails";
import PlayerControlsSection from "@/component/playerControlsSection";
import AlbumArtwork from "@/component/albumArtwork";
import Draggable, { type DraggableBounds } from "react-draggable";

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
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    currentTrackInfo,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
  } = useAudioPlayer();

  const [seekHoverTime, setSeekHoverTime] = useState<number | null>(null);
  const [seekHoverPosition, setSeekHoverPosition] = useState(0);
  const seekBarContainerRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<DraggableBounds | undefined>(undefined);
  const defaultPositionRef = useRef({ x: 700, y: 640 });

  const currentProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // useEffect를 사용하여 드래그 경계 계산
  useEffect(() => {
    const playerElement = draggableRef.current;
    if (playerElement) {
      const updateBounds = () => {
        const elWidth = playerElement.offsetWidth;
        const elHeight = playerElement.offsetHeight;
        const initialTopBound = 60;
        const initialRightBound = 30;
        const initialBottomBound = 10;

        setBounds({
          left: 0,
          top: 0 + initialTopBound,
          right: window.innerWidth - elWidth - initialRightBound,
          bottom: window.innerHeight - elHeight - initialBottomBound,
        });
      };

      updateBounds();
      window.addEventListener("resize", updateBounds); // 윈도우 크기 변경 시 경계 업데이트
      return () => window.removeEventListener("resize", updateBounds);
    }
  }, []);

  const handleSeek = (event: MouseEvent<HTMLDivElement>) => {
    if (!seekBarContainerRef.current || !duration) return;
    const seekBarRect = seekBarContainerRef.current.getBoundingClientRect();
    const seekRatio = (event.clientX - seekBarRect.left) / seekBarRect.width;
    const seekTime = duration * seekRatio;
    seek(seekTime);
  };

  const handleSeekMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!seekBarContainerRef.current || !duration) return;
    const seekBarRect = seekBarContainerRef.current.getBoundingClientRect();
    const hoverRatio = Math.max(
      0,
      Math.min(1, (event.clientX - seekBarRect.left) / seekBarRect.width)
    );
    const hoverTime = duration * hoverRatio;
    const hoverPosition = hoverRatio * seekBarRect.width;
    setSeekHoverTime(hoverTime);
    setSeekHoverPosition(hoverPosition);
  };

  const handleSeekMouseOut = () => {
    setSeekHoverTime(null);
    setSeekHoverPosition(0);
  };

  return (
    <Draggable
      bounds={bounds}
      defaultPosition={defaultPositionRef.current}
      nodeRef={draggableRef as React.RefObject<HTMLElement>}
    >
      <div
        ref={draggableRef}
        id="player-container"
        className="fixed w-[344px] h-[80px] mx-auto mt-[-4px] z-20 cursor-grab active:cursor-grabbing select-none"
      >
        <div id="player" className="relative h-full z-[3]">
          <PlayerTrackDetails
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            currentProgress={currentProgress}
            seekBarContainerRef={seekBarContainerRef}
            handleSeek={handleSeek}
            handleSeekMouseMove={handleSeekMouseMove}
            handleSeekMouseOut={handleSeekMouseOut}
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
              currentTrackInfo={currentTrackInfo}
            />
            <PlayerControlsSection
              currentTrackInfo={currentTrackInfo}
              prevTrack={prevTrack}
              togglePlayPause={togglePlayPause}
              nextTrack={nextTrack}
              isPlaying={isPlaying}
            />
          </div>
        </div>
      </div>
    </Draggable>
  );
}
