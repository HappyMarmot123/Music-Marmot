"use client";
import Hero from "@/features/landing/ui/landingHero";
import BodySection from "@/features/landing/ui/landingBodySection";
import React from "react";
import { useToggle } from "@/app/providers/toggleProvider";
import AudioPlayer from "@/widgets/audioPlayer";
import ListModal from "@/widgets/listModal";
import { AnimatePresence } from "framer-motion";
import LandingWrapper from "@/features/landing/ui/landingWrapper";

export default function Landing() {
  const { isOpen } = useToggle();

  return (
    <>
      <LandingWrapper>
        {!isOpen && <AudioPlayer />}
        <AnimatePresence>{isOpen && <ListModal />}</AnimatePresence>
        <Hero />
        <BodySection />
      </LandingWrapper>
    </>
  );
}
