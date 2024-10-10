import { ChatBlock } from "@/components/chatBlock";
import Image from 'next/image';

const MarqueeText = () => (
  <div className="bg-transparent text-white p-2 text-center overflow-hidden absolute top-0 left-0 right-0 z-10">
    <p className="animate-marquee whitespace-nowrap inline-block">
      Hi，I'm Wang,This is An AI-Bot named Breeze.This App is still under continuous development,try to use it for fun.
    </p>
  </div>
);

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      <MarqueeText />
      <header className="bg-blue-600 text-white p-4 flex items-center relative z-0">
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
