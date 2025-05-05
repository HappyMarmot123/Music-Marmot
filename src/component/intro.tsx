import React, { useEffect } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";

const Intro = () => {
  const introVariants: Variants = {
    initial: {
      backgroundColor: "#000",
      opacity: 1,
    },
    exit: {
      opacity: 0,
      transition: {
        delay: 1.0,
        duration: 0.5,
      },
    },
  };

  const textVariants: Variants = {
    initial: {
      y: 100,
      opacity: 0,
    },
    animate: (custom) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.2 + custom * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    exit: (custom) => ({
      y: -50,
      opacity: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.3,
        ease: "easeIn",
      },
    }),
  };

  const [showIntro, setShowIntro] = React.useState(true);

  useEffect(() => {
    // 모든 애니메이션이 끝나면 intro 요소를 사라지게 함
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          className="intro fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
          variants={introVariants}
          initial="initial"
          animate="initial"
          exit="exit"
        >
          <div className="intro-text">
            <motion.h1
              className="hide font-bold text-[clamp(2rem,5vw,6rem)]"
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              custom={0}
            >
              <span className="text text-primary">Experience the beat</span>
            </motion.h1>
            <motion.h1
              className="hide font-bold text-[clamp(2rem,5vw,6rem)]"
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              custom={1}
            >
              <span className="text text-white">of Electronic</span>
            </motion.h1>
            <motion.h1
              className="hide font-bold text-[clamp(2rem,5vw,6rem)]"
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              custom={2}
            >
              <span className="text text-primary">Dance Music.</span>
            </motion.h1>
          </div>
          <motion.div className="slider"></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Intro;
