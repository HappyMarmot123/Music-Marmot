"use client";

import React from "react";
import MyArticle from "@/widgets/myArticle";
import Hero from "@/pages/landing/hero";
import BodySection from "@/pages/landing/bodySection";
import { useToggle } from "@/app/providers/toggleProvider";
import AudioPlayer from "@/widgets/audioPlayer";
import ListModal from "@/widgets/listModal";
import { AnimatePresence } from "framer-motion";

const Page: React.FC = () => {
  const { isOpen, closeToggle } = useToggle();

  return (
    <>
      {/* <Test /> */}
      <MyArticle>
        {!isOpen && <AudioPlayer />}
        <AnimatePresence>
          {isOpen && <ListModal isOpen={isOpen} closeToggle={closeToggle} />}
        </AnimatePresence>
        <Hero />
        <BodySection />
      </MyArticle>
    </>
  );
};

export default Page;
