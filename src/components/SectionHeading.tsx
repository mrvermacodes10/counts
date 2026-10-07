export function SectionHeading({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {detail && <p>{detail}</p>}
    </div>
  );
}

export function entriesLabel(n: number) {
  return n === 1 ? "1 entry, newest first" : `${n.toLocaleString("en-IN")} entries, newest first`;
}
