import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function Horizontal() {
  type CardType = {
    title: string;
    content: string;
  };

  const cards: CardType[] = [
    {
      title: "01",
      content:
        "Erasing native APIs like Intersection-Observer, CSS Sticky, etc.",
    },
    {
      title: "02",
      content:
        "Erasing native APIs like Intersection-Observer, CSS Sticky, etc.",
    },
    {
      title: "03",
      content:
        "Erasing native APIs like Intersection-Observer, CSS Sticky, etc.",
    },
    {
      title: "04",
      content:
        "Erasing native APIs like Intersection-Observer, CSS Sticky, etc.",
    },
    {
      title: "05",
      content:
        "Erasing native APIs like Intersection-Observer, CSS Sticky, etc.",
    },
    {
      title: "06",
      content:
        "Erasing native APIs like Intersection-Observer, CSS Sticky, etc.",
    },
    {
      title: "07",
      content:
        "Erasing native APIs like Intersection-Observer, CSS Sticky, etc.",
    },
  ];

  const Card = ({ card }: { card: CardType }) => {
    return (
      <div
        key={card.title}
        className="group relative h-[30vw] w-[30vw] p-[1.6vw] overflow-hidden bg-transparent outline outline-white flex flex-col justify-between"
      >
        <h1 className="text-[6vw] font-[900] uppercase leading-[5vw] tracking-[-3px]">
          {card.title}
        </h1>
        <p className="text-[2.5vw] font-[700] uppercase leading-[2.5vw] tracking-[-1.5px]">
          {card.content}
        </p>
      </div>
    );
  };

  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: Horizon } = useScroll({
    target: targetRef,
  });

  const x = useTransform(Horizon, [0, 1], ["1%", "-95%"]);

  return (
    <article ref={targetRef} className="relative h-[300vh] mb-[22vw]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-20">
          {cards.map((card, index) => {
            return <Card card={card} key={card.title + index} />;
          })}
        </motion.div>
      </div>
    </article>
  );
}
