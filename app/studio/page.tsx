"use client";

import Link from "next/link";
import HouseScene from "./HouseScene";
import { useMemo, useState } from "react";

type Tool = "select" | "wall" | "door" | "window" | "measure";
const tools: { id: Tool; label: string; glyph: string }[] = [
  { id: "select", label: "Select", glyph: "↖" }, { id: "wall", label: "Draw wall", glyph: "⌜" },
  { id: "door", label: "Add door", glyph: "◔" }, { id: "window", label: "Add window", glyph: "▥" },
  { id: "measure", label: "Measure", glyph: "↔" }
];

export default function StudioPage() {
  const [tool, setTool] = useState<Tool>("select");
  const [view, setView] = useState<"split" | "plan" | "model">("split");
  const [floor, setFloor] = useState("Ground floor");
  const [projectName, setProjectName] = useState("Courtyard House");
  const [showDimensions, setShowDimensions] = useState(true);
  const [showFurniture, setShowFurniture] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [saved, setSaved] = useState(false);
  const roomCount = useMemo(() => showFurniture ? "08" : "06", [showFurniture]);

  function exportPlan() {
    const svg = document.getElementById("floor-plan-svg");
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "archnova-floor-plan.svg"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="studio-shell">
      <header className="studio-topbar">
        <Link className="studio-brand" href="/"><span className="brand-mark">A</span><span>ARCHNOVA <i>STUDIO</i></span></Link>
        <div className="project-title"><span className="project-kicker">PROJECT / 014</span><input aria-label="Project name" value={projectName} onChange={e => { setProjectName(e.target.value); setSaved(false); }} /></div>
        <div className="topbar-actions"><span className="saved-state"><span className={saved ? "live-dot" : "status-hollow"} />{saved ? "Saved locally" : "Unsaved changes"}</span><button className="top-action" onClick={() => setSaved(true)}>Save</button><button className="top-action" onClick={exportPlan}>Export SVG ↗</button><button className="avatar-button" title="Workspace profile">AN</button></div>
      </header>
      <div className="studio-subbar"><div className="breadcrumbs"><span>Projects</span><b>/</b><span>{projectName || "Untitled project"}</span><b>/</b><strong>Design workspace</strong></div><div className="subbar-right"><span className="online-indicator" /> LOCAL PROJECT <span className="sub-divider" /> AUTOSAVE OFF</div></div>
      <div className="studio-layout">
        <aside className="tool-rail" aria-label="Drawing tools"><div className="rail-group">{tools.map(t => <button key={t.id} className={tool === t.id ? "rail-tool active" : "rail-tool"} title={t.label} aria-label={t.label} onClick={() => setTool(t.id)}><span>{t.glyph}</span><small>{t.label}</small></button>)}</div><div className="rail-bottom"><button className="rail-tool" title="Settings" aria-label="Settings"><span>⚙</span><small>Settings</small></button><button className="rail-help" title="Help">?</button></div></aside>
        <section className="workspace-main">
          <div className="workspace-toolbar"><div className="tool-context"><span className="context-icon">{tools.find(t => t.id === tool)?.glyph}</span><span><b>{tools.find(t => t.id === tool)?.label}</b><small>{tool === "select" ? "Select and inspect elements" : tool === "wall" ? "Wall tool · click to begin (preview)" : "Tool selected · editing preview"}</small></span></div><div className="view-switch" role="group" aria-label="Workspace view"><button className={view === "plan" ? "selected" : ""} onClick={() => setView("plan")}>2D Plan</button><button className={view === "split" ? "selected" : ""} onClick={() => setView("split")}>Split view</button><button className={view === "model" ? "selected" : ""} onClick={() => setView("model")}>3D Model</button></div><button className="icon-action" title="Zoom out" onClick={() => setZoom(v => Math.max(50, v - 10))}>−</button><span className="zoom-value">{zoom}%</span><button className="icon-action" title="Zoom in" onClick={() => setZoom(v => Math.min(150, v + 10))}>+</button></div>
          <div className={view === "split" ? "viewport-grid" : view === "plan" ? "viewport-grid plan-only" : "viewport-grid model-only"}>
            <section className="viewport plan-viewport"><div className="viewport-head"><div><span className="view-index">01</span><b>FLOOR PLAN</b><small>ORTHOGRAPHIC / TOP</small></div><span className="viewport-menu">···</span></div><div className="plan-canvas" style={{ transform: `scale(${zoom / 100})` }}><svg id="floor-plan-svg" viewBox="0 0 540 410" className="floor-plan-svg" role="img" aria-label="Measured residential floor plan">
            <defs><pattern id="smallGrid" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" stroke="#61786b" strokeOpacity=".15" strokeWidth=".55"/></pattern><pattern id="bigGrid" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="url(#smallGrid)"/><path d="M60 0H0V60" fill="none" stroke="#789184" strokeOpacity=".23" strokeWidth=".7"/></pattern></defs>
            <rect width="540" height="410" fill="url(#bigGrid)"/>
            <g stroke="#b8c8bd" strokeWidth="5" fill="none" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M85 70H440V335H85Z"/><path d="M85 205H250V335"/><path d="M250 70V205H440"/><path d="M345 205V335"/><path d="M345 270H440"/>
            </g>
            <g stroke="#1c2823" strokeWidth="8" fill="none"><path d="M157 70H205M294 70H325M440 111V158M85 115V153M85 250V288M140 335H190M277 335H314M345 232V252"/></g>
            <g stroke="#77c69f" strokeWidth="1.4" fill="none"><path d="M157 70V105M205 70V105M157 99H205"/><path d="M440 111H405M440 158H405M411 111V158"/><path d="M85 250H119M85 288H119M113 250V288"/><path d="M140 335V300M190 335V300M140 306H190"/><path d="M250 205H284M250 239H284M278 205V239"/></g>
            {showFurniture && <g stroke="#6d8275" strokeWidth="1.3" fill="#304139" fillOpacity=".45"><rect x="108" y="100" width="106" height="72" rx="2"/><path d="M108 123H214M130 100V172M192 100V172"/><rect x="272" y="90" width="111" height="55"/><path d="M272 117H383M310 90V145M347 90V145"/><rect x="105" y="235" width="102" height="76"/><path d="M105 255H207M125 235V311M187 235V311"/><rect x="366" y="220" width="56" height="33"/><circle cx="390" cy="286" r="19"/></g>}
            <g fill="#9bb3a4" fontSize="10" fontFamily="monospace" letterSpacing="1.1" textAnchor="middle"><text x="159" y="188">LIVING / DINING</text><text x="326" y="165">KITCHEN</text><text x="168" y="326">BEDROOM 01</text><text x="295" y="247">BATH</text><text x="391" y="262">STUDY</text><text x="392" y="314">STORE</text></g>
            {showDimensions && <g stroke="#74bd97" strokeWidth=".8" fill="#8fc5a8" fontSize="9" fontFamily="monospace"><path d="M85 48V60M440 48V60M85 53H440"/><text x="250" y="44" textAnchor="middle" stroke="none">12.40 m</text><path d="M63 70H75M63 335H75M68 70V335"/><text x="57" y="206" textAnchor="middle" transform="rotate(-90 57 206)" stroke="none">9.20 m</text></g>}
            <g fill="#75c6a0"><circle cx="85" cy="70" r="3"/><circle cx="440" cy="335" r="3"/></g>
          </svg></div><div className="viewport-foot"><span>GFA / 114.2 m²</span><span>{roomCount} SPACES</span><span>{showDimensions ? "DIMENSIONS ON" : "DIMENSIONS OFF"}</span></div></section>
            <section className="viewport model-viewport"><div className="viewport-head"><div><span className="view-index">02</span><b>3D CONCEPT</b><small>AXONOMETRIC / PERSPECTIVE</small></div><span className="model-tag"><span className="live-dot" /> PREVIEW</span></div><div className="model-canvas"><HouseScene /><div className="model-caption">COURTYARD HOUSE <small>CONCEPT / REV 01</small></div><div className="viewport-foot"><span>CAMERA / AXON</span><span>CONCEPT MASSING</span><span>REV 01.04</span></div></section>
          </div>
          <footer className="workspace-status"><span><span className="online-indicator" /> READY</span><span>TOOL / {tool.toUpperCase()}</span><span>UNITS / METRIC</span><span className="status-spacer" /><span>GRID SNAP <b>ON</b></span><span>ORTHO <b>ON</b></span></footer>
        </section>
        <aside className="properties-panel"><div className="panel-heading"><span>INSPECTOR</span><span>···</span></div><div className="inspector-project"><div className="project-thumb"><span className="thumb-lines" /></div><div><b>{projectName || "Untitled project"}</b><small>RESIDENTIAL / CONCEPT</small><span className="project-chip">IN PROGRESS</span></div></div><div className="property-section"><div className="property-title">PROJECT DETAILS <span>−</span></div><label>Project name<input value={projectName} onChange={e => { setProjectName(e.target.value); setSaved(false); }} /></label><label>Building type<select defaultValue="Single-family residence"><option>Single-family residence</option><option>Multi-family residence</option><option>Commercial</option><option>Studio / annex</option></select></label><div className="two-fields"><label>Gross floor area<div className="field-value">114.2 <i>m²</i></div></label><label>Floors<div className="field-value">02 <i>levels</i></div></label></div></div><div className="property-section"><div className="property-title">VIEW SETTINGS <span>−</span></div><div className="setting-row"><span>Dimensions</span><button className={showDimensions ? "toggle on" : "toggle"} onClick={() => setShowDimensions(v => !v)} aria-label="Toggle dimensions"><span /></button></div><div className="setting-row"><span>Furniture guides</span><button className={showFurniture ? "toggle on" : "toggle"} onClick={() => setShowFurniture(v => !v)} aria-label="Toggle furniture"><span /></button></div><label>Active floor<select value={floor} onChange={e => setFloor(e.target.value)}><option>Ground floor</option><option>Upper floor</option><option>Roof plan</option></select></label></div><div className="property-section layer-section"><div className="property-title">LAYERS <span>+</span></div>{[{name:"Walls & partitions",color:"#a8bcb0"},{name:"Doors & windows",color:"#71c49a"},{name:"Furniture guides",color:"#70877a"},{name:"Dimensions",color:"#a1ad76"}].map((l,i)=><div className="layer-row" key={l.name}><span className="layer-eye">◉</span><span className="layer-color" style={{background:l.color}}/><span>{l.name}</span><span className="layer-count">{["14","08","06","12"][i]}</span></div>)}</div><div className="inspector-bottom"><div><span className="bottom-icon">⌘</span><span><b>Design notes</b><small>Keep your project intent close.</small></span></div><button onClick={exportPlan}>Export floor plan ↗</button></div></aside>
      </div>
    </main>
  );
}
