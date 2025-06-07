import { motion } from "framer-motion";
import Github from "@/features/landing/components/github";
import Earth from "@/features/landing/components/earth";

export default function Hero() {
  return (
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
          <p className="font-black text-lg sm:text-xl md:text-2xl lg:text-3xl">
            scroll to
          </p>
          <p className="font-black text-lg sm:text-xl md:text-2xl lg:text-3xl">
            explore
          </p>
        </div>
        <div className="text-left">
          <p className="font-semibold tracking-tighter uppercase text-sm sm:text-base md:text-lg lg:text-xl">
            Smooth Scroll
          </p>
          <p className="font-semibold tracking-tighter uppercase text-sm sm:text-base md:text-lg lg:text-xl">
            Framer Motion Animate
          </p>
          <p className="font-semibold tracking-tighter uppercase text-sm sm:text-base md:text-lg lg:text-xl">
            Website designed by Happy marmot
          </p>
        </div>
        <div className="text-end">
          <Github />
        </div>
      </div>
    </section>
  );
}
