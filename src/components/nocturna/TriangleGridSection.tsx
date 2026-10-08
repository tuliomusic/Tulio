import { SocialBar, type SocialUrls } from "@/components/jula/SocialBar";
import { useMenuOpen } from "@/lib/menu-open";
import { FramerGridPreview } from "./FramerGridPreview";
import { GlitchingTechEye } from "./GlitchingTechEye";
import { ImageGlitch } from "./ImageGlitch";

/** Section 1 — triangle grid, eye on the left, glitch photo on the right. */
export function TriangleGridSection({
  links,
  imageUrl = "/brand/tulio-session.jpg",
  imageAlt = "Tulio no set",
}: {
  links: SocialUrls;
  imageUrl?: string;
  imageAlt?: string;
}) {
  const menuOpen = useMenuOpen();

  return (
    <section className="relative overflow-hidden bg-black md:min-h-[100dvh]" aria-label="Abertura">
      <FramerGridPreview className="pointer-events-none absolute inset-0" shape="triangle" controls={false} />
      <div className="relative z-10 grid grid-cols-1 md:h-[100dvh] md:grid-cols-2">
        <div className="relative h-[68vh] md:h-full">
          <GlitchingTechEye
            logoSrc="/brand/tulio-mark.png"
            logoBlur={menuOpen}
            className="absolute inset-0 h-full w-full"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-6 transition-opacity duration-500 md:bottom-8"
            style={{ opacity: menuOpen ? 0 : 1 }}
          >
            <div className={menuOpen ? "pointer-events-none w-full" : "pointer-events-auto w-full"}>
              <SocialBar links={links} all />
            </div>
          </div>
        </div>
        <ImageGlitch src={imageUrl} alt={imageAlt} />
      </div>
    </section>
  );
}
