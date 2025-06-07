export default function DustySnow() {
  return (
    <article className="fixed w-screen h-screen shadow-[0_0_10px_white] pointer-events-none z-10">
      {Array.from({ length: 150 }).map((_, index) => {
        const style = {
          "--left-pos": `${Math.random() * 100}vw`,
          "--opacity": Math.random() * 0.7 + 0.3, // 0.3 to 1.0
          "--scale": Math.random() * 0.8 + 0.2, // 0.2 to 1.0
          "--duration": `${Math.random() * 10 + 10}s`, // 10s to 20s
          "--delay": `${Math.random() * -20}s`, // -20s to 0s
        } as React.CSSProperties;
        return (
          <div
            className="snow absolute w-[5px] h-[5px] rounded-[50%]"
            key={index}
            style={style}
          />
        );
      })}
    </article>
  );
}
