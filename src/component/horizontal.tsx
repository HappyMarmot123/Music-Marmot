"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Card from "./card";
import { TrackObjectFull } from "@/type/dataType";

interface HorizontalProps {
  sectionTitle: string;
  data: TrackObjectFull[];
}

export default function Horizontal({ sectionTitle, data }: HorizontalProps) {
  const controls = useAnimationControls();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [currentX, setCurrentX] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isReadyForDrag, setIsReadyForDrag] = useState(false);

  useEffect(() => {
    const calculateWidths = () => {
      if (containerRef.current && contentRef.current) {
        const containerW = containerRef.current.offsetWidth;
        const contentW = contentRef.current.scrollWidth; // Use scrollWidth for total content width
        setContainerWidth(containerW);
        const scrollableWidth = contentW - containerW;
        setMaxScroll(scrollableWidth > 0 ? -scrollableWidth : 0); // 0보다 클 때만 음수값 설정
      }
    };

    let resizeObserver: ResizeObserver | null = null;

    if (containerRef.current && contentRef.current) {
      calculateWidths();
      setIsReadyForDrag(true);

      resizeObserver = new ResizeObserver(calculateWidths);
      resizeObserver.observe(containerRef.current);
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver?.disconnect();
      setIsReadyForDrag(false);
    };
  }, [data]);

  const scrollStep = () => {
    return Math.max(containerWidth * 0.8, 1);
  };

  const scrollPrev = () => {
    const step = scrollStep();
    const newX = Math.min(currentX + step, 0); // Ensure not scrolling beyond 0
    controls.start(
      { x: newX },
      { type: "tween", ease: "easeInOut", duration: 0.5 }
    );
    setCurrentX(newX);
  };

  const scrollNext = () => {
    const step = scrollStep();
    const newX = Math.max(currentX - step, maxScroll); // Ensure not scrolling beyond maxScroll
    controls.start(
      { x: newX },
      { type: "tween", ease: "easeInOut", duration: 0.5 }
    );
    setCurrentX(newX);
  };

  const handleDragEnd = () =>
    // _event: MouseEvent | TouchEvent | PointerEvent,
    // _info: {
    //   offset: { x: number; y: number };
    //   velocity: { x: number; y: number };
    // }
    {
      if (contentRef.current) {
        const finalX = parseFloat(
          contentRef.current.style.transform.split("translateX(")[1] || "0"
        );
        setCurrentX(finalX);
      }
    };

  return (
    <div className="w-full">
      <h2 className="text-3xl md:text-4xl font-bold grid grid-cols-10">
        <span className="col-start-2 w-max">{sectionTitle}</span>
      </h2>
      <div
        ref={containerRef}
        className="relative w-full flex items-center overflow-hidden"
      >
        {/* Buttons */}
        <button
          onClick={scrollPrev}
          disabled={currentX >= 0} // Disable if at the beginning
          className="h-16 absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-neutral-700/60 text-white disabled:opacity-30 rounded-full hover:bg-neutral-600/80 transition-all duration-200 focus:outline-none"
          aria-label="Previous"
          style={{ touchAction: "manipulation" }} // Improve mobile interaction
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            // Responsive icon size
            className="w-6 h-6 md:w-8 md:h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <motion.div
          ref={contentRef}
          className="flex gap-4 md:gap-6 lg:gap-8 xl:gap-10 !p-8 cursor-grab active:cursor-grabbing"
          drag={isReadyForDrag ? "x" : false}
          dragElastic={0.1}
          dragConstraints={{ left: maxScroll, right: 0 }}
          animate={controls}
          onDragEnd={handleDragEnd}
          style={{ x: currentX }}
        >
          {data &&
            data.length > 0 &&
            data.map((track) => {
              return <Card card={track} key={track.id} />;
            })}
        </motion.div>

        <button
          onClick={scrollNext}
          disabled={currentX <= maxScroll + 1} // Disable if at the end
          className="h-16 absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-neutral-700/60 text-white disabled:opacity-30 rounded-full hover:bg-neutral-600/80 transition-all duration-200 focus:outline-none"
          aria-label="Next"
          style={{ touchAction: "manipulation" }} // Improve mobile interaction
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            // Responsive icon size
            className="w-6 h-6 md:w-8 md:h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
