import { getAllInstruments } from "@/db/instrumentQueries";

export default async function InstrumentsPage() {
  const instruments = await getAllInstruments();

  if (!instruments || instruments.length === 0) {
    return <p>No instruments found.</p>;
  }

  return <pre>{JSON.stringify(instruments, null, 2)}</pre>;
}
