import { ChatBlock } from "@/components/chatBlock";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      <header className="bg-blue-600 text-white p-4 flex items-center">
        <Image
          src="/logo.png"
          alt="Breeze Bot Logo"
          width={40}
          height={40}
          className="mr-4"
        />
        <h1 className="text-2xl font-bold">Breeze Bot</h1>
      </header>
      <main className="flex-grow grid grid-rows-[1fr] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
        <ChatBlock />
      </main>
    </div>
  );
}


