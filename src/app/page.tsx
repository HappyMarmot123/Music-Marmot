"use client";

import React from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  Variants,
} from "framer-motion";
import { useRef } from "react";
import Cursor from "@/component/cursor";
import DustySnow from "@/component/dustySnow";
import Github from "@/component/github";
import Horizontal from "@/component/horizontal";
import ParallaxText from "@/lib/ParallaxText";
import Earth from "@/component/earth";

const Page: React.FC = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const customColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#ff98a2", "#00f"]
  );

  const cardVariants: Variants = {
    offscreen: {
      y: 200, // 300에서 200으로 변경하여 더 위쪽에서 시작하도록 함
    },
    onscreen: {
      y: 0, // 50에서 30으로 변경하여 최종 위치도 위로 조정
      rotate: -10,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  return (
    <>
      {/* <Test /> */}
      <motion.div className="progress-bar" style={{ scaleX: scaleX }} />
      <figure className="progress">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="30" pathLength="1" className="bg" />
          <motion.circle
            cx="50"
            cy="50"
            r="30"
            pathLength="1"
            className="indicator"
            style={{
              pathLength: scrollYProgress2,
              transition: "pathLength 0.3s ease",
              stroke: customColor,
            }}
          />
        </svg>
      </figure>
      <div ref={ref} className="h-full relative">
        <DustySnow />
        <Cursor />
        <article className="my-gradient fixed w-screen pointer-events-none" />
        <section className="min-h-screen h-screen  mb-[22vw]">
          <div className="flex justify-around">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold leading-[0.9]">
              EDMM
            </h1>
            <span className="flex flex-col text-end grid-cols-[2/-1] mt-[2.1vw]">
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="font-[900] uppercase leading-[100%] text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.1em]"
              >
                EDM Marmot
              </motion.p>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-[rgb(176,176,176)] text-lg sm:text-xl md:text-2xl lg:text-3xl font-[600] uppercase"
              >
                © 2025 HappyMarmot
              </motion.p>
            </span>
          </div>
          <div className="w-full flex justify-center items-center">
            <Earth width={500} height={500} />
          </div>
          <div className="grid grid-cols-[1fr_2fr_4fr] items-center justify-between leading-[0.9] px-[2vw] h-[12vw]">
            <div className="text-left">
              <p className="font-[900] text-[clamp(1rem,1.8vw,2.5rem)]">
                scroll to
              </p>
              <p className="font-[900] text-[clamp(1rem,1.8vw,2.5rem)]">
                explore
              </p>
            </div>
            <div className="text-left">
              <p className="font-[600] tracking-[-0.01em] uppercase text-[clamp(0.8rem,1.3vw,1.8rem)]">
                Smooth Scroll
              </p>
              <p className="font-[600] tracking-[-0.01em] uppercase text-[clamp(0.8rem,1.3vw,1.8rem)]">
                Framer Motion Animate
              </p>
              <p className="font-[600] tracking-[-0.01em] uppercase text-[clamp(0.8rem,1.3vw,1.8rem)]">
                Website designed by Happy marmot
              </p>
            </div>
            <div className="text-end">
              <Github />
            </div>
          </div>
        </section>
        <section className="min-[50vw] h-fit flex flex-col justify-between mb-[22vw]">
          <ParallaxText baseVelocity={-2}>Electronic</ParallaxText>
          <ParallaxText baseVelocity={2}>Dance Music</ParallaxText>
        </section>
        <section className="min-h-screen h-fit flex flex-col justify-between mb-[22vw]">
          <div className="w-full h-[200vh] grid grid-cols-12">
            <motion.div
              className="sticky top-[33%] self-start border-l-[4px] border-l-pink-300 col-[3/span_4] px-[2.2vw] py-[1.6vw]"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ amount: 0.8 }}
            >
              <motion.p
                className="text-[clamp(2rem,5vw,6rem)] text-white uppercase font-bold leading-[0.9]"
                variants={cardVariants}
              >
                why framer motion?
              </motion.p>
            </motion.div>
            <aside className="max-w-[40vw] col-[7/-1] mt-[14vw] flex flex-col justify-between py-[5vw]">
              <p className="text-gray-500 uppercase">dskjhsfkhsdkfhksdhkf</p>
              <p className="text-primary uppercase">dskjhsfkhsdkfhksdhkf</p>
            </aside>
          </div>
          s
        </section>
        <section>
          <Horizontal />
        </section>
        <section className="min-h-screen h-fit flex flex-col justify-between mb-[22vw]">
          <div>
            <p className="text-white text-[clamp(3rem,14vh,16rem)] font-bold leading-[0.9] tracking-[-1vh] uppercase">
              so we built{" "}
            </p>
            <h1 className="text-[clamp(3rem,14vh,16rem)] font-bold leading-[0.9] tracking-[-1vh] uppercase">
              web scrolling
            </h1>
            <br />
          </div>
          <p className="text-white text-[clamp(3rem,14vh,16rem)] font-bold leading-[0.9] tracking-[-1vh] uppercase">
            as it should be
          </p>
        </section>
      </div>
    </>
  );
};

export default Page;
