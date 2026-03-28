type AgentAssignment = {
  id: string;
  name: string;
  status: string;
};

function getStatusAccent(status: string) {
  switch (status) {
    case "active":
      return {
        ring: "border-[rgba(117,227,120,0.5)] shadow-[0_0_0.75rem_rgba(117,227,120,0.35)]",
        statusText: "text-[#a6f2bf]",
        idleHint: "rgba(117,227,120,0.24)",
      };
    case "idle":
      return {
        ring: "border-[rgba(87,191,220,0.5)] shadow-[0_0_0.75rem_rgba(87,191,220,0.32)]",
        statusText: "text-[#9fe7f7]",
        idleHint: "rgba(87,191,220,0.24)",
      };
    default:
      return {
        ring: "border-[rgba(160,170,180,0.42)] shadow-[0_0_0.65rem_rgba(160,170,180,0.24)]",
        statusText: "text-[#d7dce2]",
        idleHint: "rgba(255,255,255,0.2)",
      };
  }
}

const padSlots = Array.from({ length: 9 }, (_, index) => ({
  label: `Pad slot ${index + 1}`,
}));

export function Pad({
  assignments,
  onAssignAgent,
  isDraggingAgent = false,
}: {
  assignments: Array<AgentAssignment | null>;
  onAssignAgent: (slotIndex: number, agentId: string) => void;
  isDraggingAgent?: boolean;
}) {
  return (
    <section
      aria-label="Application pad mockup"
      className="flex aspect-square w-[min(76vw,24rem)] shrink-0 flex-col justify-between rounded-[2.4rem] border border-[rgba(186,182,176,0.9)] bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.45),transparent_62%),radial-gradient(rgba(200,197,192,0.38)_0.7px,transparent_0.8px),linear-gradient(145deg,#f4f3f1,#efeeec)] bg-[length:auto,5px_5px,auto] px-[1.3rem] pt-8 pb-[1.2rem] shadow-[inset_0_2px_3px_rgba(255,255,255,0.88),inset_0_-5px_8px_rgba(151,147,141,0.45),0_0_0_4px_rgba(208,205,200,0.9),0_20px_34px_rgba(170,164,158,0.28)] max-[560px]:w-[min(92vw,22rem)] max-[560px]:rounded-[2rem] max-[560px]:px-[0.95rem] max-[560px]:pt-[1.55rem] max-[560px]:pb-4"
    >
      <div className="mx-auto grid w-fit grid-cols-3 gap-[0.85rem] max-[560px]:gap-[0.7rem]">
        {padSlots.map((slot, index) => (
          <PadButton
            key={slot.label}
            label={slot.label}
            assignment={assignments[index]}
            onAssignAgent={(agentId) => onAssignAgent(index, agentId)}
            isDraggingAgent={isDraggingAgent}
          />
        ))}
      </div>

      <div className="mx-auto mt-[1.2rem] grid w-fit grid-cols-3 items-center gap-x-[0.85rem] max-[560px]:mt-4 max-[560px]:gap-x-[0.7rem]">
        <PadNavButton direction="left" />
        <PadNavButton direction="right" />
        <div
          aria-label="Logi brand"
          className="min-w-0 justify-self-center text-[2rem] leading-none font-semibold tracking-[-0.08rem] text-[#a7a39e] lowercase [text-shadow:0_1px_0_rgba(255,255,255,0.7)] max-[560px]:text-[1.7rem]"
        >
          logi
        </div>
      </div>
    </section>
  );
}

function PadButton({
  label,
  assignment,
  onAssignAgent,
  isDraggingAgent,
}: {
  label: string;
  assignment: AgentAssignment | null;
  onAssignAgent: (agentId: string) => void;
  isDraggingAgent: boolean;
}) {
  const accent = assignment ? getStatusAccent(assignment.status) : null;

  return (
    <button
      aria-label={label}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const agentId = event.dataTransfer.getData("text/plain");
        if (agentId) {
          onAssignAgent(agentId);
        }
      }}
      className={[
        "relative isolate grid h-[5.4rem] w-[5.4rem] place-items-center rounded-[0.95rem] border-2 border-[#373735] p-0 shadow-[0_0_0_0.24rem_rgba(255,255,255,0.72),0_0_1.1rem_rgba(255,255,255,0.4),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-10px_12px_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.16)] transition-[transform,box-shadow,background-color] duration-200 active:translate-y-px max-[560px]:h-[4.55rem] max-[560px]:w-[4.55rem]",
        assignment
          ? "bg-[linear-gradient(180deg,#121212,#040404)]"
          : "bg-[linear-gradient(180deg,#6e6e6c,#5b5b59)]",
        !assignment && isDraggingAgent
          ? "scale-[1.03] shadow-[0_0_0_0.24rem_rgba(255,255,255,0.72),0_0_1.35rem_rgba(117,227,120,0.26),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-10px_12px_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.16)]"
          : "",
      ].join(" ")}
    >
      <span className="pointer-events-none absolute inset-[0.42rem] rounded-[0.72rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)] opacity-50" />
      <span
        className={[
          "pointer-events-none absolute -inset-[0.18rem] rounded-[1.08rem] border-[0.16rem] transition",
          assignment
            ? accent?.ring ?? "border-[rgba(255,255,255,0.2)]"
            : isDraggingAgent
              ? "border-[rgba(117,227,120,0.24)]"
              : "border-[rgba(255,255,255,0.2)]",
        ].join(" ")}
      />
      {assignment ? (
        <span className="absolute inset-[0.42rem] overflow-hidden rounded-[0.72rem]">
          <img
            src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(assignment.id)}`}
            alt={`${assignment.name} avatar`}
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,10,0.08),rgba(6,8,10,0.22)_45%,rgba(6,8,10,0.78))]" />
        </span>
      ) : null}
      {assignment ? (
        <span className="relative z-10 flex h-full w-full flex-col items-center justify-between px-2 pt-2 pb-1.5 text-center">
          <span className="line-clamp-2 text-[0.72rem] leading-3.5 font-semibold tracking-[0.03em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] max-[560px]:text-[0.62rem]">
            {assignment.name}
          </span>
          <span
            className={[
              "text-[0.42rem] font-semibold tracking-[0.18em] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] max-[560px]:text-[0.38rem]",
              accent?.statusText ?? "text-[#d7dce2]",
            ].join(" ")}
          >
            {assignment.status}
          </span>
        </span>
      ) : null}
    </button>
  );
}

function PadNavButton({ direction }: { direction: "left" | "right" }) {
  return (
    <button
      aria-label={direction === "left" ? "Previous page" : "Next page"}
      className="h-[3.55rem] w-full rounded-[1.05rem_1.05rem_1.25rem_1.25rem] border-2 border-[#9d9a95] bg-[linear-gradient(180deg,#faf8f6,#f3f0ed)] p-0 text-[2rem] leading-none text-[#9a9894] shadow-[0_0_0_0.24rem_rgba(255,255,255,0.78),0_0_1rem_rgba(255,255,255,0.46),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-6px_8px_rgba(176,169,161,0.22),0_1px_2px_rgba(0,0,0,0.14)] transition-transform active:translate-y-px max-[560px]:h-[3.1rem]"
    >
      <span className="inline-block -translate-y-[0.12rem]">
        {direction === "left" ? "\u2039" : "\u203a"}
      </span>
    </button>
  );
}
