import type { ReactNode } from "react";
import { DmbokLens } from "@/components/DmbokLens";

export function PageHeader({
  title,
  description,
  actions,
  dmbok,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** DMBOK knowledge-area slug(s) — renders the DMBOK Lens teaching panel under the header. */
  dmbok?: string | string[];
}) {
  const lenses = dmbok ? (Array.isArray(dmbok) ? dmbok : [dmbok]) : [];
  return (
    <>
      <div className="flex items-start justify-between mb-6 gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {lenses.map((slug) => (
        <DmbokLens key={slug} slug={slug} />
      ))}
    </>
  );
}
