"use client";

import React from "react";
import MyArticle from "@/widgets/myArticle";

import { useToggle } from "@/app/providers/toggleProvider";
import AudioPlayer from "@/widgets/audioPlayer";
import ListModal from "@/widgets/listModal";
import { AnimatePresence } from "framer-motion";
import Landing from "@/widgets/landing";

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
        <Landing />
      </MyArticle>
    </>
  );
};

export default Page;
