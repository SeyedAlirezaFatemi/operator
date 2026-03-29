import { useState } from "react";
import type { Route } from "./+types/home";
import agentsData from "../assets/agents.json";
import { Pad } from "../components/pad";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MX Orchestrator" },
    { name: "description", content: "Application launcher mockup" },
  ];
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [draggedAgentId, setDraggedAgentId] = useState<string | null>(null);
  const [draggedPadIndex, setDraggedPadIndex] = useState<number | null>(null);
  const { agents, gateway } = agentsData;
  const [padAssignments, setPadAssignments] = useState<Array<(typeof agents)[number] | null>>(
    () => Array.from({ length: 9 }, () => null),
  );

  function assignAgentToPad(slotIndex: number, agentId: string) {
    const nextAgent = agents.find((agent) => agent.id === agentId);

    if (!nextAgent) {
      return;
    }

    setPadAssignments((currentAssignments) =>
      currentAssignments.map((assignedAgent, currentIndex) => {
        if (currentIndex === slotIndex) {
          return nextAgent;
        }

        return assignedAgent?.id === agentId ? null : assignedAgent;
      }),
    );
  }

  function movePadAssignment(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) {
      return;
    }

    setPadAssignments((currentAssignments) => {
      const nextAssignments = [...currentAssignments];
      const draggedAssignment = nextAssignments[fromIndex];

      nextAssignments[fromIndex] = nextAssignments[toIndex];
      nextAssignments[toIndex] = draggedAssignment;

      return nextAssignments;
    });
  }

  function insertAllAgents() {
    setPadAssignments(() =>
      Array.from({ length: 9 }, (_, index) => agents[index] ?? null),
    );
  }

  function connectOpenClaw() {
    insertAllAgents();
    setIsConnected(true);
  }

  return (
    <main className="min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),transparent_42%),linear-gradient(180deg,#faf8f7_0%,#f5f3f2_100%)] px-6 py-8 text-[#615f5b] sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-stretch justify-center gap-8 lg:gap-12 max-[980px]:min-h-0 max-[980px]:flex-col">
        <div className="flex flex-1 items-center justify-center max-[980px]:flex-none">
          <div className="flex items-center justify-center">
            <Pad
              assignments={padAssignments}
              agents={agents}
              gateway={gateway}
              isConnected={isConnected}
              onAssignAgent={assignAgentToPad}
              onMoveAssignment={movePadAssignment}
              onPadDragStateChange={setDraggedPadIndex}
              isDraggingAgent={draggedAgentId !== null}
              draggedPadIndex={draggedPadIndex}
            />
          </div>
        </div>

        <section
          aria-label={isConnected ? "OpenClaw agents panel" : "OpenClaw connection panel"}
          className={[
            "relative w-full max-w-[28rem] overflow-visible rounded-[2rem] border border-[rgba(31,50,64,0.12)] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(242,247,249,0.96))] p-6 shadow-[0_24px_60px_rgba(81,104,114,0.16),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur md:p-7 max-[980px]:h-auto max-[980px]:max-h-none",
            isConnected ? "h-[calc(100vh-4rem)]" : "max-w-[26rem] self-center pb-10",
          ].join(" ")}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(72,191,227,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_26%)]" />
          <div
            className={[
              "relative py-3",
              isConnected
                ? "-mx-4 h-full overflow-y-auto px-7 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[980px]:mx-0 max-[980px]:px-0 max-[980px]:h-auto"
                : "px-3",
            ].join(" ")}
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-[1.35rem] bg-[linear-gradient(180deg,#0f1d25,#163748)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_28px_rgba(15,29,37,0.22)]">
                <img
                  src="/openclaw.png"
                  alt="OpenClaw logo"
                  className="h-10 w-10 object-contain opacity-95"
                />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.28em] text-[#5d8794] uppercase">
                  {isConnected ? "Connected Gateway" : "Device Bridge"}
                </p>
                <h2 className="mt-1 text-[1.9rem] leading-none font-semibold tracking-[-0.05em] text-[#16313c]">
                  {isConnected ? "OpenClaw agents" : "Connect OpenClaw"}
                </h2>
              </div>
            </div>

            {isConnected ? (
              <>
                <div className="flex items-center justify-between rounded-[1.1rem] border border-[rgba(86,125,136,0.15)] bg-white/60 px-4 py-3 text-sm text-[#4c6871] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <span className="font-medium">Gateway status</span>
                  <span className="rounded-full bg-[#dff6e8] px-3 py-1 text-[0.7rem] font-semibold tracking-[0.18em] text-[#1f8b57] uppercase">
                    {gateway}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-[0.72rem] font-semibold tracking-[0.24em] text-[#6c8a95] uppercase">
                    Agents
                  </p>
                  <button
                    type="button"
                    onClick={insertAllAgents}
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(72,191,227,0.18)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(227,244,248,0.94))] px-4 py-2 text-[0.72rem] font-semibold tracking-[0.18em] text-[#1b5a6e] uppercase shadow-[0_10px_20px_rgba(121,150,160,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(72,191,227,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] active:translate-y-0"
                  >
                    Insert all
                  </button>
                </div>

                <div className="mt-5 space-y-3 pb-10">
                  {agents.map((agent) => (
                    <article
                      key={agent.id}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", agent.id);
                        setDraggedAgentId(agent.id);
                      }}
                      onDragEnd={() => setDraggedAgentId(null)}
                      className={[
                        "cursor-grab rounded-[1.25rem] border border-[rgba(86,125,136,0.15)] bg-white/72 px-4 py-4 shadow-[0_10px_24px_rgba(121,150,160,0.12),inset_0_1px_0_rgba(255,255,255,0.72)] transition-[transform,box-shadow,opacity] duration-200 active:cursor-grabbing",
                        draggedAgentId === agent.id
                          ? "scale-[1.03] -translate-y-1 opacity-60 shadow-[0_18px_30px_rgba(72,191,227,0.24),inset_0_1px_0_rgba(255,255,255,0.72)]"
                          : "hover:-translate-y-0.5",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(agent.id)}`}
                            alt={`${agent.name} profile`}
                            className="h-12 w-12 shrink-0 rounded-2xl border border-[rgba(86,125,136,0.16)] bg-[linear-gradient(180deg,#f8fcfd,#e8f2f5)] p-1 shadow-[0_8px_18px_rgba(121,150,160,0.14)]"
                          />
                          <div>
                            <h3 className="text-base font-semibold text-[#17313a]">{agent.name}</h3>
                            <p className="mt-1 text-sm text-[#637880]">
                              {agent.task ?? "Standing by for the next task"}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-center gap-2">
                          <span
                            className={[
                              "rounded-full px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] uppercase",
                              agent.status === "active"
                                ? "bg-[#dff6e8] text-[#1f8b57]"
                                : agent.status === "idle"
                                  ? "bg-[#eef5ff] text-[#4577d4]"
                                  : agent.status === "error"
                                    ? "bg-[#ffe7e7] text-[#c53b3b]"
                                  : "bg-[#eceff2] text-[#6d7782]",
                            ].join(" ")}
                          >
                            {agent.status}
                          </span>
                          <span className="text-[0.68rem] font-medium tracking-[0.08em] text-[#7e9199] uppercase">
                            {agent.lastActive}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 text-xs font-medium text-[#7e9199]">
                        <span className="max-w-[16rem] leading-5">{agent.description}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="max-w-sm text-sm leading-6 text-[#5f727a]">
                  Enter your controller endpoint and launch a visual connection flow.
                </p>

                <label className="mt-6 block">
                  <span className="mb-2 block text-[0.7rem] font-semibold tracking-[0.24em] text-[#6c8a95] uppercase">
                    URL
                  </span>
                  <input
                    type="url"
                    placeholder="ws://127.0.0.1:18789"
                    className="w-full rounded-[1.1rem] border border-[rgba(86,125,136,0.22)] bg-white/80 px-4 py-3.5 text-[0.98rem] text-[#17313a] shadow-[inset_0_1px_2px_rgba(23,49,58,0.06),0_6px_18px_rgba(138,167,176,0.12)] outline-none transition focus:border-[#57bfdc] focus:ring-4 focus:ring-[#57bfdc]/20"
                  />
                </label>

                <button
                  type="button"
                  onClick={connectOpenClaw}
                  className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-[1.2rem] bg-[linear-gradient(135deg,#163748,#1f5568_55%,#2f8ca7)] px-5 py-4 text-base font-semibold text-white shadow-[0_18px_30px_rgba(28,83,101,0.28),inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_36px_rgba(28,83,101,0.34),inset_0_1px_0_rgba(255,255,255,0.16)] active:translate-y-0"
                >
                  <img src="/openclaw.png" alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
                  <span>Connect OpenClaw</span>
                </button>
                <p className="mt-3 text-center text-sm text-[#5f727a]">
                  Demo: No need for a URL, just press connect!
                </p>
              </>
            )}
          </div>
          {isConnected ? (
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-24 rounded-b-[2rem] bg-[linear-gradient(180deg,rgba(242,247,249,0)_0%,rgba(244,248,248,0.72)_45%,rgba(242,247,249,0.98)_100%)]" />
          ) : null}
        </section>
      </div>
    </main>
  );
}
