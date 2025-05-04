import { motion } from "framer-motion";

export default function Github() {
  return (
    <>
      {/* 하위 요소의 height은 inherit으로 부모 요소 크기만 수정하세요. */}
      <motion.a
        className="h-[3vw] flex border border-solid border-[#ff98a2] float-right cursor-pointer"
        href="https://github.com/HappyMarmot123/"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="h-[inherit]">
          <p className="text-white px-2 bg-black h-[inherit] text-[1.8vw] font-[600] leading-[1.5]">
            H
          </p>
        </span>
        <span className="h-[inherit]">
          <p className="uppercase text-[black] bg-[#ff98a2] px-2 h-[inherit] text-[1.8vw] font-[600] leading-[1.5]">
            Check out Github
          </p>
        </span>
      </motion.a>
    </>
  );
}
