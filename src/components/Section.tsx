import { cn } from "@/lib/utils";
import { Container } from "./Container";

export function Section({
  children,
  className,
  containerClassName,
  muted = false,
  inverse = false,
  noPadding = false,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  muted?: boolean;
  inverse?: boolean;
  noPadding?: boolean;
}) {
  return (
    <section
      className={cn(
        muted && "cb-section-muted",
        inverse && "cb-section-inverse",
        !muted && !inverse && "cb-section",
        !noPadding && "py-[var(--cb-space-section)]",
        "scroll-mt-[68px]",
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
