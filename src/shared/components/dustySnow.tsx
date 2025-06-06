export default function DustySnow() {
  return (
    <article className="fixed w-screen h-screen shadow-[0_0_10px_white] pointer-events-none">
      {Array.from({ length: 50 }).map((_, index) => (
        <div
          className="snow absolute w-[5px] h-[5px] rounded-[50%]"
          key={index}
        />
      ))}
    </article>
  );
}
