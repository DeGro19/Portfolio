import { Reveal } from "./reveal";

export function Section({
  id,
  title,
  index,
  children,
}: {
  id: string;
  title: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="mb-10">
            <p aria-hidden className="text-accent mb-3 font-mono text-sm">
              {String(index).padStart(2, "0")}
            </p>
            <div className="flex items-center gap-5">
              <h2
                id={`${id}-heading`}
                className="text-3xl font-bold tracking-tight sm:text-4xl"
              >
                {title}
              </h2>
              <span aria-hidden className="bg-border h-px flex-1" />
            </div>
          </div>
          {children}
        </Reveal>
      </div>
    </section>
  );
}
