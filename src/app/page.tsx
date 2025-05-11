"use client";

import React from "react";
import { motion } from "framer-motion";
import Github from "@/component/github";
import Earth from "@/component/earth";
import Parallax from "@/component/parallax";
import MyArticle from "@/layout/myArticle";
import MusicList from "@/layout/musicList";
import { SpotifyList } from "@/layout/spotifyList";
import ParallaxText from "@/component/parallaxText";

const Page: React.FC = () => {
  return (
    <>
      {/* <Test /> */}
      <MyArticle>
        <section className="min-h-screen h-screen">
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
        <section className="min-[50vw] h-fit flex flex-col justify-between py-24">
          <Parallax baseVelocity={-2}>Electronic</Parallax>
          <div className="py-4"></div>
          <Parallax baseVelocity={2}>Dance Music</Parallax>
        </section>
        <section className="flex flex-col gap-16 !py-16">
          <MusicList />
          <SpotifyList />
        </section>
      </MyArticle>
    </>
  );
};

export default Page;
