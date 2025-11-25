import Hero from "@/components/Hero";
import Productivity from "@/components/Productivity";
import { Workflow } from "@/components/Workflow";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="py-16 bg-[#e6fafc]">
        <Productivity />
        <Workflow />
      </div>
    </main>
  );
}
