import MusicList from "@/widgets/musicList";
import RecentList from "@/widgets/recentList";
import Parallax from "@/shared/components/parallax";

export default function BodySection() {
  return (
    <>
      <section className="relative min-[50vw] h-fit flex flex-col justify-between py-24">
        <Parallax baseVelocity={-2}>Electronic</Parallax>
        <div className="py-4"></div>
        <Parallax baseVelocity={2}>Dance Music</Parallax>
      </section>
      <section className="flex flex-col gap-16 !py-16">
        <MusicList />
        <RecentList />
        {/* <SpotifyList /> */}
      </section>
    </>
  );
}
