"use client";

import { useState, type ChangeEvent, type ReactElement } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";

const themes = [
  { name: "dark", label: "Dark", color: "#0d1117", textColor: "#fff" },
  { name: "light", label: "Light", color: "#f0f6fc", textColor: "#1f2328" },
  { name: "neon", label: "Neon", color: "#00ff88", textColor: "#0a0a0a" },
  { name: "sunset", label: "Sunset", color: "#ff7b3a", textColor: "#1a1a2e" },
  { name: "ocean", label: "Ocean", color: "#0077b6", textColor: "#e0f7fa" },
  { name: "forest", label: "Forest", color: "#2d6a4f", textColor: "#d8f3dc" },
];

export default function GitHubStatsPreview(): ReactElement {
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [username, setUsername] = useState("seu-usuario");
  const [copied, setCopied] = useState(false);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const baseUrl = getBaseUrl();

  const sizeParams = new URLSearchParams();
  if (width.trim() !== "") sizeParams.set("width", width.trim());
  if (height.trim() !== "") sizeParams.set("height", height.trim());
  const sizeQuery = sizeParams.toString();

  const codeParams = new URLSearchParams(sizeQuery);
  codeParams.set("theme", selectedTheme);
  const codeUrl = `${baseUrl}/api/github-stats/${username}?${codeParams.toString()}`;

  const querySuffix = sizeQuery === "" ? "" : `?${sizeQuery}`;
  const previewUrl = `${baseUrl}/api/github-stats/preview/${selectedTheme}${querySuffix}`;

  const handleCopy = (): void => {
    const markdown = `![GitHub Stats](${codeUrl})`;
    navigator.clipboard.writeText(markdown).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="border-[var(--border-default)]/50 shadow-black/20 hover:border-[var(--accent-teal)]/60 group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[rgb(15_23_42_/_25%)] p-6 shadow-lg backdrop-blur-sm transition-all duration-500 hover:shadow-[var(--shadow-card-hover-teal)] md:p-8">
      {/* Accent glow on hover */}
      <div className="from-[var(--accent-teal)]/0 via-[var(--accent-teal)]/0 to-[var(--accent-cyan)]/0 group-hover:from-[var(--accent-teal)]/5 group-hover:via-[var(--accent-teal)]/5 group-hover:to-[var(--accent-cyan)]/5 pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r opacity-0 blur-xl transition-all duration-700 group-hover:opacity-100" />

      {/* Header */}
      <div className="relative mb-6">
        <div className="flex items-center gap-3">
          <div className="shadow-[var(--accent-teal)]/20 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-teal)] to-[var(--accent-cyan)] text-base text-white shadow-lg">
            <i className="fas fa-chart-line" />
          </div>
          <div>
            <h2 className="textGradientTealCyan text-xl font-bold md:text-2xl">
              GitHub Stats SVG
            </h2>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)] md:text-sm">
              Commits, PRs e contribuições em tempo real
            </p>
          </div>
        </div>
      </div>

      {/* Username + Size row */}
      <div className="relative mb-5 grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-5">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Usuário
          </label>
          <input
            type="text"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.currentTarget.value)
            }
            placeholder="seu-usuario"
            className="border-[var(--border-default)]/60 focus:border-[var(--accent-cyan)]/50 focus:ring-[var(--accent-cyan)]/15 w-full rounded-xl border bg-[rgb(15_23_42_/_60%)] px-4 py-2.5 text-sm text-[var(--text-bright)] placeholder-[var(--text-tertiary)] transition-all focus:bg-[rgb(15_23_42_/_80%)] focus:outline-none focus:ring-2"
          />
        </div>
        <div className="md:col-span-3">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Largura
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={width}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setWidth(e.currentTarget.value)
            }
            placeholder="600"
            className="border-[var(--border-default)]/60 focus:border-[var(--accent-cyan)]/50 focus:ring-[var(--accent-cyan)]/15 w-full rounded-xl border bg-[rgb(15_23_42_/_60%)] px-4 py-2.5 text-sm text-[var(--text-bright)] placeholder-[var(--text-tertiary)] transition-all focus:bg-[rgb(15_23_42_/_80%)] focus:outline-none focus:ring-2"
          />
        </div>
        <div className="md:col-span-4">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Altura
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={height}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setHeight(e.currentTarget.value)
            }
            placeholder="320"
            className="border-[var(--border-default)]/60 focus:border-[var(--accent-cyan)]/50 focus:ring-[var(--accent-cyan)]/15 w-full rounded-xl border bg-[rgb(15_23_42_/_60%)] px-4 py-2.5 text-sm text-[var(--text-bright)] placeholder-[var(--text-tertiary)] transition-all focus:bg-[rgb(15_23_42_/_80%)] focus:outline-none focus:ring-2"
          />
        </div>
      </div>

      {/* Theme selector */}
      <div className="relative mb-5">
        <label className="mb-2.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Tema
        </label>
        <div className="flex flex-wrap gap-2">
          {themes.map((t) => {
            const isActive = selectedTheme === t.name;
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => setSelectedTheme(t.name)}
                className={`group/theme relative flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "border-[var(--accent-cyan)]/60 bg-[var(--accent-teal)]/20 shadow-[var(--accent-cyan)]/10 text-[var(--text-bright)] shadow-md"
                    : "border-[var(--border-default)]/40 hover:border-[var(--accent-teal)]/50 bg-transparent text-[var(--text-secondary)] hover:bg-[rgb(26_77_92_/_12%)] hover:text-[var(--accent-cyan)]"
                }`}
              >
                <span
                  className="size-3.5 shrink-0 rounded-full border border-white/10"
                  style={{ backgroundColor: t.color }}
                />
                <span>{t.label}</span>
                {isActive && (
                  <span className="ml-0.5 text-[10px] text-[var(--accent-cyan)]">
                    <i className="fas fa-check" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview - window frame style */}
      <div className="border-[var(--border-default)]/40 shadow-black/30 relative mb-5 overflow-hidden rounded-xl border bg-[rgb(10_10_10_/_80%)] shadow-inner backdrop-blur-sm">
        {/* Window chrome */}
        <div className="border-[var(--border-default)]/20 flex items-center gap-1.5 border-b bg-[rgb(15_23_42_/_40%)] px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-red-500/80" />
          <span className="size-2.5 rounded-full bg-yellow-500/80" />
          <span className="size-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-[10px] text-[var(--text-tertiary)]">
            github-stats — {selectedTheme}
          </span>
        </div>
        {/* Image */}
        <div className="flex items-center justify-center p-4 md:p-6">
          <img
            src={previewUrl}
            alt="GitHub Stats Preview"
            className="max-w-full rounded-lg"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const target = e.currentTarget;
              target.style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Code + Copy */}
      <div className="relative">
        <div className="border-[var(--border-default)]/30 overflow-hidden rounded-xl border bg-[rgb(0_0_0_/_40%)] backdrop-blur-sm">
          <div className="border-[var(--border-default)]/10 flex items-center justify-between border-b px-4 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Markdown
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 ${
                copied
                  ? "bg-[var(--accent-teal)]/30 text-[var(--accent-light)]"
                  : "shadow-[var(--accent-teal)]/20 hover:shadow-[var(--accent-cyan)]/20 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--accent-cyan)] text-white shadow-md hover:shadow-lg"
              }`}
            >
              {copied ? (
                <>
                  <i className="fas fa-check" />
                  Copiado
                </>
              ) : (
                <>
                  <i className="fas fa-copy" />
                  Copiar
                </>
              )}
            </button>
          </div>
          <div className="overflow-x-auto px-4 py-3">
            <code className="text-[var(--accent-cyan)]/90 whitespace-nowrap text-xs">
              {`![GitHub Stats](${codeUrl})`}
            </code>
          </div>
        </div>
      </div>

      {/* Instructions - collapsible style */}
      <details className="group/details relative mt-4">
        <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] transition-colors hover:text-[var(--accent-cyan)]">
          <i className="fas fa-info-circle mr-1.5" />
          Como usar
          <i className="fas fa-chevron-down ml-1.5 text-[9px] transition-transform group-open/details:rotate-180" />
        </summary>
        <div className="border-[var(--border-default)]/20 mt-3 rounded-xl border bg-[rgb(26_77_92_/_8%)] p-4">
          <ol className="space-y-2 text-xs text-[var(--text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="bg-[var(--accent-teal)]/20 mt-0.5 flex size-4 shrink-0 items-center justify-center rounded text-[10px] font-bold text-[var(--accent-cyan)]">
                1
              </span>
              Substitua{" "}
              <code className="rounded bg-[rgb(0_0_0_/_30%)] px-1.5 py-0.5 font-mono text-[var(--accent-cyan)]">
                seu-usuario
              </code>{" "}
              pelo seu username
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-[var(--accent-teal)]/20 mt-0.5 flex size-4 shrink-0 items-center justify-center rounded text-[10px] font-bold text-[var(--accent-cyan)]">
                2
              </span>
              Escolha o tema e ajuste largura/altura se necessário
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-[var(--accent-teal)]/20 mt-0.5 flex size-4 shrink-0 items-center justify-center rounded text-[10px] font-bold text-[var(--accent-cyan)]">
                3
              </span>
              Copie o código e cole no seu README.md
            </li>
          </ol>
        </div>
      </details>
    </div>
  );
}
