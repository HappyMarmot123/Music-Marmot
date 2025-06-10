import Spinner from "@/shared/components/spinner";

export default function Loading() {
  return (
    <div className="bg-black flex h-screen w-full items-center justify-center">
      <Spinner />
    </div>
  );
}
