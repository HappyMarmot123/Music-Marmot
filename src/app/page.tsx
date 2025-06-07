"use client";

import React from "react";
import MyArticle from "@/widgets/myArticle";
import Hero from "@/pages/landing/hero";
import BodySection from "@/pages/landing/bodySection";
import { useToggle } from "@/app/providers/toggleProvider";
import AudioPlayer from "@/widgets/audioPlayer";
import ListModal from "@/widgets/listModal";

const Page: React.FC = () => {
  const { isOpen, closeToggle } = useToggle();

  return (
    <>
      {/* <Test /> */}
      <MyArticle>
        {!isOpen && <AudioPlayer />}
        {isOpen && <ListModal isOpen={isOpen} closeToggle={closeToggle} />}
        <Hero />
        <BodySection />
      </MyArticle>
    </>
  );
};

export default Page;
