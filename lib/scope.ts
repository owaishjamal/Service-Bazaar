export function genScope(requirements: string, etaDays: number, revisions: number) {
  const r = (requirements || "").trim();
  const title = r ? r.slice(0, 64) : "Custom deliverable";
  const bullets = [
    `Deliverable: ${title}`,
    `Turnaround: ${etaDays} day(s)`,
    `Revisions: ${revisions}`,
    `Proof at milestones (link/file/screenshot)`,
    `Acceptance: meets requirements + final file/link delivered`,
  ];
  return bullets.join("\n");
}
