import { useMemo, useState } from "react";
import { BookOpenCheck, ChevronDown, ChevronUp, ExternalLink, Minus, PlayCircle, Plus, RotateCcw, X } from "lucide-react";
import type { CareerNode } from "@/data/cubi-demo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const stateClass: Record<CareerNode["state"], string> = {
  completed: "border-emerald-300 bg-emerald-50 text-emerald-900",
  "in-progress": "border-sky-300 bg-sky-50 text-sky-900",
  recommended: "border-primary/55 bg-primary/15 text-primary glow-ring",
  locked: "border-border bg-secondary/80 text-muted-foreground",
  optional: "border-violet-300 bg-violet-50 text-violet-900",
  verify: "border-amber-300 bg-amber-50 text-amber-800",
};

function linePath(from: CareerNode, to: CareerNode) {
  const x1 = from.x + 150;
  const y1 = from.y + 34;
  const x2 = to.x;
  const y2 = to.y + 34;
  const mid = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
}

export function CareerTree({ nodes }: { nodes: CareerNode[] }) {
  const [zoom, setZoom] = useState(0.82);
  const [selected, setSelected] = useState<CareerNode | null>(nodes[0] ?? null);
  const [showAlternative, setShowAlternative] = useState(true);
  const visible = useMemo(() => nodes.filter((node) => showAlternative || node.route === "primary"), [nodes, showAlternative]);
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const links: [string, string, "primary" | "alternative"][] = [
    ["n1", "n2", "primary"],
    ["n1", "n3", "primary"],
    ["n2", "n4", "primary"],
    ["n3", "n4", "primary"],
    ["n4", "n5", "primary"],
    ["n5", "n6", "primary"],
    ["n3", "n7", "alternative"],
    ["n7", "n8", "alternative"],
    ["n8", "n6", "alternative"],
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div className="panel overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div>
            <p className="font-display font-bold">Career path</p>
            <p className="text-xs text-muted-foreground">Select a step for details.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowAlternative((value) => !value)}>
              {showAlternative ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              Alternative route
            </Button>
            <Button variant="secondary" size="icon" onClick={() => setZoom((value) => Math.max(0.55, value - 0.1))} aria-label="Zoom out"><Minus className="size-4" /></Button>
            <span className="w-12 text-center text-xs font-bold text-muted-foreground">{Math.round(zoom * 100)}%</span>
            <Button variant="secondary" size="icon" onClick={() => setZoom((value) => Math.min(1.25, value + 0.1))} aria-label="Zoom in"><Plus className="size-4" /></Button>
            <Button variant="secondary" size="icon" onClick={() => setZoom(0.82)} aria-label="Reset zoom"><RotateCcw className="size-4" /></Button>
          </div>
        </div>
        <div className="career-tree-scroll min-h-[560px] overflow-auto bg-[radial-gradient(circle_at_1px_1px,rgba(23,107,77,0.12)_1px,transparent_0)] bg-[size:24px_24px]">
          <div className="relative h-[560px] w-[1160px] origin-top-left" style={{ transform: `scale(${zoom})` }}>
            <svg className="absolute inset-0 size-full" viewBox="0 0 1160 560" aria-hidden="true">
              {links.map(([fromId, toId, route]) => {
                const from = byId[fromId];
                const to = byId[toId];
                if (!from || !to || (route === "alternative" && !showAlternative)) return null;
                return <path key={`${fromId}-${toId}`} d={linePath(from, to)} fill="none" stroke={route === "alternative" ? "#295F8A" : "#176B4D"} strokeOpacity={route === "alternative" ? 0.5 : 0.72} strokeWidth="3" strokeDasharray={route === "alternative" ? "8 7" : undefined} />;
              })}
            </svg>
            {visible.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelected(node)}
                className={cn("absolute w-[150px] rounded-2xl border p-3 text-left shadow-lg transition hover:-translate-y-1", stateClass[node.state], selected?.id === node.id && "ring-2 ring-primary ring-offset-2 ring-offset-background")}
                style={{ left: node.x, top: node.y }}
                aria-label={`Open ${node.label}`}
              >
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-75">{node.type}</span>
                <span className="mt-1 block font-display text-sm font-bold leading-4">{node.label}</span>
                <span className="mt-2 block text-[10px] capitalize opacity-75">{node.state.replace("-", " ")}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="panel relative h-fit p-5 xl:sticky xl:top-8">
        {selected ? (
          <>
            <button className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-secondary" onClick={() => setSelected(null)} aria-label="Close node details"><X className="size-4" /></button>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">{selected.type}</p>
            <h2 className="mt-1 pr-7 font-display text-2xl font-extrabold">{selected.label}</h2>
            <span className={cn("mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-bold capitalize", stateClass[selected.state])}>{selected.state.replace("-", " ")}</span>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">{selected.description}</p>
            <Detail label="Why it matters" value={selected.relevance} />
            <Detail label="Estimated duration" value={selected.duration} />
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Skills gained</p>
              <div className="mt-2 flex flex-wrap gap-2">{selected.skills.map((skill) => <span key={skill} className="rounded-full bg-secondary px-2.5 py-1 text-xs">{skill}</span>)}</div>
            </div>
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prerequisites</p>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">{selected.prerequisites.length ? selected.prerequisites.map((item) => <li key={item}>• {item}</li>) : <li>None recorded</li>}</ul>
            </div>
            {selected.resources?.length ? (
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Courses & videos</p>
                <div className="mt-2 space-y-2">
                  {selected.resources.map((resource) => (
                    <a
                      key={`${resource.provider}-${resource.title}`}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-3 transition hover:border-primary/50 hover:bg-primary/[0.04]"
                    >
                      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        {resource.type === "Video" ? <PlayCircle className="size-4" /> : <BookOpenCheck className="size-4" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold leading-5">{resource.title}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {resource.provider}{resource.duration ? ` · ${resource.duration}` : ""}
                        </span>
                      </span>
                      <ExternalLink className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
            <Button className="mt-6 w-full" disabled={selected.state === "locked"}>{selected.state === "completed" ? "Review evidence" : selected.state === "locked" ? "Complete prerequisites first" : "Add to action plan"}</Button>
          </>
        ) : (
          <div className="grid min-h-64 place-items-center text-center text-sm text-muted-foreground">Select a node to view its details.</div>
        )}
      </aside>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="mt-5"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 text-sm leading-6">{value}</p></div>;
}
