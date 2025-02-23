import Counter from "../components/Counter";
import Link from 'next/link'

export default function Home() {
  return (
    <div className="grid p-8 h-screen pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Counter />
        <Link href="/login" className="p-4 rounded bg-slate-500">
          Go to Login
        </Link>
      </main>
    </div>
  );
}
