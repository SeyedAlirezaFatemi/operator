type AgentAssignment = {
  id: string;
  name: string;
  status: string;
};

type AgentStatus = AgentAssignment & {
  description: string;
  task: string | null;
  lastActive: string;
};

function getStatusAccent(status: string) {
  switch (status) {
    case "active":
      return {
        ring:
          "border-[rgba(143,247,166,0.58)] shadow-[0_0_1rem_rgba(107,242,160,0.34),0_0_2rem_rgba(69,201,126,0.2)]",
        halo:
          "bg-[radial-gradient(circle_at_50%_50%,rgba(160,255,195,0.34)_0%,rgba(99,233,154,0.18)_42%,transparent_72%)]",
        aura:
          "bg-[conic-gradient(from_210deg_at_50%_50%,rgba(255,255,255,0.18),rgba(126,250,178,0.72),rgba(46,181,110,0.3),rgba(255,255,255,0.18))]",
        statusText: "text-[#a6f2bf]",
        idleHint: "rgba(117,227,120,0.24)",
      };
    case "idle":
      return {
        ring:
          "border-[rgba(125,217,247,0.58)] shadow-[0_0_1rem_rgba(98,205,242,0.32),0_0_2rem_rgba(61,146,214,0.18)]",
        halo:
          "bg-[radial-gradient(circle_at_50%_50%,rgba(155,229,255,0.3)_0%,rgba(90,194,238,0.16)_44%,transparent_72%)]",
        aura:
          "bg-[conic-gradient(from_205deg_at_50%_50%,rgba(255,255,255,0.16),rgba(122,222,255,0.7),rgba(57,145,214,0.28),rgba(255,255,255,0.16))]",
        statusText: "text-[#9fe7f7]",
        idleHint: "rgba(87,191,220,0.24)",
      };
    case "error":
      return {
        ring:
          "border-[rgba(255,143,143,0.58)] shadow-[0_0_1rem_rgba(255,116,116,0.34),0_0_2rem_rgba(213,58,58,0.22)]",
        halo:
          "bg-[radial-gradient(circle_at_50%_50%,rgba(255,186,186,0.32)_0%,rgba(245,92,92,0.18)_42%,transparent_72%)]",
        aura:
          "bg-[conic-gradient(from_210deg_at_50%_50%,rgba(255,255,255,0.16),rgba(255,164,164,0.72),rgba(203,48,48,0.3),rgba(255,255,255,0.16))]",
        statusText: "text-[#ffb8b8]",
        idleHint: "rgba(255,116,116,0.24)",
      };
    default:
      return {
        ring:
          "border-[rgba(188,196,206,0.46)] shadow-[0_0_0.9rem_rgba(181,188,198,0.2),0_0_1.6rem_rgba(117,123,136,0.14)]",
        halo:
          "bg-[radial-gradient(circle_at_50%_50%,rgba(220,225,232,0.18)_0%,rgba(160,170,180,0.12)_46%,transparent_74%)]",
        aura:
          "bg-[conic-gradient(from_220deg_at_50%_50%,rgba(255,255,255,0.14),rgba(214,221,229,0.44),rgba(131,140,151,0.18),rgba(255,255,255,0.14))]",
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
  agents,
  gateway,
  isConnected,
  onAssignAgent,
  onMoveAssignment,
  onPadDragStateChange,
  isDraggingAgent = false,
  draggedPadIndex = null,
}: {
  assignments: Array<AgentAssignment | null>;
  agents: AgentStatus[];
  gateway: string;
  isConnected: boolean;
  onAssignAgent: (slotIndex: number, agentId: string) => void;
  onMoveAssignment: (fromIndex: number, toIndex: number) => void;
  onPadDragStateChange: (slotIndex: number | null) => void;
  isDraggingAgent?: boolean;
  draggedPadIndex?: number | null;
}) {
  const activeCount = agents.filter((agent) => agent.status === "active").length;
  const attentionCount = agents.filter((agent) => agent.status === "error").length;
  const featuredAgents = agents
    .filter((agent) => agent.status === "error" || agent.status === "active")
    .slice(0, 2);

  return (
    <section
      aria-label="Application pad mockup"
      className="flex w-[min(80vw,26rem)] shrink-0 flex-col justify-between rounded-[2.4rem] border border-[rgba(186,182,176,0.9)] bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.45),transparent_62%),radial-gradient(rgba(200,197,192,0.38)_0.7px,transparent_0.8px),linear-gradient(145deg,#f4f3f1,#efeeec)] bg-[length:auto,5px_5px,auto] px-[1.3rem] pt-6 pb-[1.2rem] shadow-[inset_0_2px_3px_rgba(255,255,255,0.88),inset_0_-5px_8px_rgba(151,147,141,0.45),0_0_0_4px_rgba(208,205,200,0.9),0_20px_34px_rgba(170,164,158,0.28)] max-[560px]:w-[min(92vw,22rem)] max-[560px]:rounded-[2rem] max-[560px]:px-[0.95rem] max-[560px]:pt-[1.05rem] max-[560px]:pb-4"
    >
      <div className="flex flex-col gap-5">
        <PadStatusScreen
          agents={featuredAgents}
          activeCount={activeCount}
          attentionCount={attentionCount}
          gateway={gateway}
          isConnected={isConnected}
        />

        <div className="mx-auto grid w-fit grid-cols-3 gap-[0.85rem] max-[560px]:gap-[0.7rem]">
          {padSlots.map((slot, index) => (
            <PadButton
              key={slot.label}
              label={slot.label}
              assignment={assignments[index]}
              onAssignAgent={(agentId) => onAssignAgent(index, agentId)}
              onMoveAssignment={(fromIndex) => onMoveAssignment(fromIndex, index)}
              onPadDragStateChange={onPadDragStateChange}
              isDraggingAgent={isDraggingAgent}
              slotIndex={index}
              isDraggingPadItem={draggedPadIndex !== null}
              isDraggedPadItem={draggedPadIndex === index}
            />
          ))}
        </div>
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

function PadStatusScreen({
  agents,
  activeCount,
  attentionCount,
  gateway,
  isConnected,
}: {
  agents: AgentStatus[];
  activeCount: number;
  attentionCount: number;
  gateway: string;
  isConnected: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.4rem] border border-[rgba(255,255,255,0.5)] bg-[linear-gradient(180deg,#151515,#040404)] px-4 pt-4 pb-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-10px_18px_rgba(255,255,255,0.04),0_12px_24px_rgba(87,84,80,0.2)] max-[560px]:rounded-[1.2rem] max-[560px]:px-3 max-[560px]:pt-3">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_30%),linear-gradient(120deg,transparent_18%,rgba(255,255,255,0.12)_45%,transparent_60%),radial-gradient(rgba(255,255,255,0.08)_0.5px,transparent_0.7px)] bg-[length:auto,auto,4px_4px] opacity-50" />
      <div className="pointer-events-none absolute inset-[0.4rem] rounded-[1.05rem] border border-[rgba(255,255,255,0.08)]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.62rem] font-semibold tracking-[0.28em] text-[#b1b1b1] uppercase">
              Pad display
            </p>
            <h3 className="mt-1 font-mono text-[1.55rem] leading-none tracking-[-0.03em] text-[#f6f6f2] max-[560px]:text-[1.2rem]">
              Agents checking
            </h3>
          </div>
          <span className="rounded-full border border-[rgba(255,255,255,0.12)] bg-white/6 px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.2em] text-[#d4d4d2] uppercase">
            {isConnected ? gateway : "offline"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
          {agents.length > 0 ? (
            agents.map((agent) => (
              <article
                key={agent.id}
                className="rounded-[1rem] border border-[rgba(255,255,255,0.08)] bg-white/4 px-3 py-2.5 backdrop-blur-[1px]"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                    <img
                      src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(agent.id)}`}
                      alt=""
                      aria-hidden="true"
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate font-mono text-[0.95rem] leading-none text-[#f8f8f4]">
                      {agent.name}
                    </h4>
                    <p className="mt-1 line-clamp-2 font-mono text-[0.68rem] leading-4 text-[#9c9c98]">
                      {agent.task ?? agent.description}
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full rounded-[1rem] border border-[rgba(255,255,255,0.08)] bg-white/4 px-3 py-4 font-mono text-[0.74rem] text-[#a7a7a2]">
              No agents available
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[rgba(255,255,255,0.12)] pt-3 font-mono text-[0.78rem] text-[#f0eee8] max-[560px]:text-[0.72rem]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#efb766] shadow-[0_0_10px_rgba(239,183,102,0.65)]" />
            <span>{attentionCount} need attention</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#7ce38e] shadow-[0_0_10px_rgba(124,227,142,0.72)]" />
            <span>{activeCount} agents active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PadButton({
  label,
  assignment,
  onAssignAgent,
  onMoveAssignment,
  onPadDragStateChange,
  isDraggingAgent,
  slotIndex,
  isDraggingPadItem,
  isDraggedPadItem,
}: {
  label: string;
  assignment: AgentAssignment | null;
  onAssignAgent: (agentId: string) => void;
  onMoveAssignment: (fromIndex: number) => void;
  onPadDragStateChange: (slotIndex: number | null) => void;
  isDraggingAgent: boolean;
  slotIndex: number;
  isDraggingPadItem: boolean;
  isDraggedPadItem: boolean;
}) {
  const accent = assignment ? getStatusAccent(assignment.status) : null;

  return (
    <button
      aria-label={label}
      draggable={Boolean(assignment)}
      onDragStart={(event) => {
        if (!assignment) {
          return;
        }

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/x-pad-slot", String(slotIndex));
        onPadDragStateChange(slotIndex);
      }}
      onDragEnd={() => onPadDragStateChange(null)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const fromSlotIndex = event.dataTransfer.getData("application/x-pad-slot");
        if (fromSlotIndex) {
          onMoveAssignment(Number(fromSlotIndex));
          onPadDragStateChange(null);
          return;
        }

        const agentId = event.dataTransfer.getData("text/plain");
        if (agentId) {
          onAssignAgent(agentId);
        }
      }}
      className={[
        "relative isolate grid h-[5.4rem] w-[5.4rem] place-items-center rounded-[0.95rem] border-2 border-[#373735] p-0 shadow-[0_0_0_0.24rem_rgba(255,255,255,0.72),0_0_1.1rem_rgba(255,255,255,0.4),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-10px_12px_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.16)] transition-[transform,box-shadow,background-color,opacity] duration-200 active:translate-y-px max-[560px]:h-[4.55rem] max-[560px]:w-[4.55rem]",
        assignment
          ? "bg-[linear-gradient(180deg,#121212,#040404)]"
          : "bg-[linear-gradient(180deg,#6e6e6c,#5b5b59)]",
        !assignment && isDraggingAgent
          ? "scale-[1.03] shadow-[0_0_0_0.24rem_rgba(255,255,255,0.72),0_0_1.35rem_rgba(117,227,120,0.26),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-10px_12px_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.16)]"
          : "",
        assignment && isDraggingPadItem && !isDraggedPadItem
          ? "scale-[1.02] shadow-[0_0_0_0.24rem_rgba(255,255,255,0.72),0_0_1.35rem_rgba(87,191,220,0.22),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-10px_12px_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.16)]"
          : "",
        isDraggedPadItem ? "scale-[1.04] -translate-y-1 opacity-60" : "",
      ].join(" ")}
    >
      {assignment ? (
        <>
          <span
            className={[
              "pointer-events-none absolute -inset-[0.52rem] rounded-[1.32rem] opacity-90 blur-[0.42rem]",
              accent?.halo,
            ].join(" ")}
          />
          <span
            className={[
              "pointer-events-none absolute -inset-[0.28rem] rounded-[1.12rem] opacity-80",
              accent?.aura,
            ].join(" ")}
          />
        </>
      ) : null}
      <span className="pointer-events-none absolute inset-[0.42rem] rounded-[0.72rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)] opacity-50" />
      <span
        className={[
          "pointer-events-none absolute -inset-[0.18rem] rounded-[1.08rem] border-[0.16rem] transition",
          assignment
            ? accent?.ring ?? "border-[rgba(255,255,255,0.2)]"
            : isDraggingAgent
              ? "border-[rgba(117,227,120,0.24)]"
              : isDraggingPadItem
                ? "border-[rgba(87,191,220,0.22)]"
              : "border-[rgba(255,255,255,0.2)]",
        ].join(" ")}
      />
      {assignment ? (
        <span className="pointer-events-none absolute inset-[0.08rem] rounded-[0.98rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.18),transparent_28%,transparent_72%,rgba(255,255,255,0.08))] opacity-80" />
      ) : null}
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
