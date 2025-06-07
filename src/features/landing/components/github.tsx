import { motion } from "framer-motion";

export default function Github() {
  return (
    <>
      {/* 하위 요소의 height은 inherit으로 부모 요소 크기만 수정하세요. */}
      <motion.a
        className="flex border border-solid border-[#ff98a2] cursor-pointer"
        href="https://github.com/HappyMarmot123/"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <span className="h-full">
          <p className="text-white px-3 py-2 bg-black text-base sm:text-lg md:text-xl font-semibold leading-tight">
            H
          </p>
        </span>
        <span className="h-full">
          <p className="uppercase text-black bg-[#ff98a2] px-4 py-2 text-base sm:text-lg md:text-xl font-semibold leading-tight whitespace-nowrap">
            Check out Github
          </p>
        </span>
      </motion.a>
    </>
  );
}
