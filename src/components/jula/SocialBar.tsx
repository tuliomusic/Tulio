import { visibleSocialPlatforms, type SocialLinks } from "@/lib/social-order";

export type SocialUrls = SocialLinks & {
  booking_email?: string | null;
  social_order?: string[] | null;
};

const iconClass =
  "grid size-11 shrink-0 place-items-center transition-transform duration-300 hover:-translate-y-1";

export function SocialBar({
  links,
  spread = false,
  large = false,
  footer = false,
  showEmail = true,
}: {
  links: SocialUrls;
  /** Wide rows (section 1 and footer) instead of a compact inline cluster. */
  spread?: boolean;
  large?: boolean;
  footer?: boolean;
  showEmail?: boolean;
}) {
  const items = visibleSocialPlatforms(links, links.social_order);
  const email = showEmail ? (links.booking_email ?? "").trim() : "";
  const baseHit = footer
    ? "grid size-[22px] shrink-0 place-items-center transition-transform duration-300 hover:-translate-y-0.5"
    : large
      ? "grid size-14 shrink-0 place-items-center transition-transform duration-300 hover:-translate-y-1"
      : iconClass;
  // Mobile rows of five: a short last row stays centered under the full one.
  const hitClass = spread || large || footer ? `${baseHit} max-md:w-1/5` : baseHit;
  if (!items.length && !email) return null;
  return (
    <div className="pointer-events-auto flex w-full flex-col items-center gap-3">
      {email && (
        <a
          href={`mailto:${email}`}
          className="block max-w-full text-center font-mono text-[10px] uppercase tracking-[.08em] text-white/70 transition-colors [overflow-wrap:anywhere] hover:text-white md:px-4 md:tracking-[.16em]"
        >
          Bookings · {email}
        </a>
      )}
      <div
        className={
          footer
            ? "flex w-full flex-wrap justify-center gap-y-3 md:gap-3"
            : large
            ? "flex w-full flex-wrap justify-center gap-y-8 md:gap-8"
            : spread
              ? "flex w-full flex-wrap justify-center gap-y-6 md:gap-5"
              : "flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:gap-x-4"
        }
      >
        {items.map((item) => (
          <a
            key={item.key}
            href={(links[item.key] ?? "").trim()}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={item.label}
            title={item.label}
            className={hitClass}
          >
            <img
              src={item.icon}
              alt=""
              className={`${footer ? "size-[18px]" : large ? "size-11" : "size-9"} object-contain`}
              decoding="async"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
