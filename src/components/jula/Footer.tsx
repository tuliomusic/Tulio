import { Link } from "@tanstack/react-router";
import { TulioWordmark } from "@/components/tulio/TulioWordmark";
import { FramerGridPreview } from "@/components/nocturna/FramerGridPreview";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden nc-grid-border-t bg-black py-14 md:py-16">
      <FramerGridPreview className="pointer-events-none absolute inset-0 z-0" shape="triangle" controls={false} />
      <div className="relative z-10 px-5 md:px-10 lg:px-14">
        <Link to="/" className="inline-block text-white transition-opacity hover:opacity-75">
          <TulioWordmark className="text-[clamp(3.25rem,7vw,6rem)]" />
        </Link>
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="font-mono text-xs tracking-[0.18em] text-white/70">{new Date().getFullYear()}</p>
          <Link
            to="/auth"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white"
          >
            ADM
          </Link>
        </div>
      </div>
    </footer>
  );
}
