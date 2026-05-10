export const PROCESS_STEPS = [
  { id:"saming",    label:"Saming",         phase:"PREP",           icon:"✂️" },
  { id:"splitting", label:"Splitting",      phase:"PREP",           icon:"⚡" },
  { id:"shaving",   label:"Shaving",        phase:"PREP",           icon:"🔧" },
  { id:"trimming1", label:"Trimming",       phase:"PREP",           icon:"✂️" },
  { id:"weigh",     label:"Weigh",          phase:"DRUM",           icon:"⚖️" },
  { id:"drum",      label:"Drum",           phase:"DRUM",           icon:"🥁" },
  { id:"setting",   label:"Setting/Vacuum", phase:"DRYING",         icon:"💨" },
  { id:"hooking",   label:"Hooking/Drying", phase:"DRYING",         icon:"🪝" },
  { id:"mollisa",   label:"Mollisa",        phase:"FINISHING PREP", icon:"📚" },
  { id:"trimming2", label:"Trimming",       phase:"FINISHING PREP", icon:"✂️" },
  { id:"assort1",   label:"Assortment 1",   phase:"FINISHING PREP", icon:"🗂️" },
  { id:"surface",   label:"Buff / Snuff",   phase:"SURFACE",        icon:"🔵" },
  { id:"spray1",    label:"Spray 1",        phase:"FINISHING",      icon:"🎨" },
  { id:"plate1",    label:"Plate (Mid)",    phase:"FINISHING",      icon:"🔩" },
  { id:"spray2",    label:"Spray 2",        phase:"FINISHING",      icon:"🎨" },
  { id:"plate2",    label:"Final Plate",    phase:"FINISHING",      icon:"🔩" },
  { id:"assort2",   label:"Assortment 2",   phase:"DISPATCH",       icon:"🗂️" },
  { id:"measure",   label:"Measurement",    phase:"DISPATCH",       icon:"📐" },
  { id:"delivery",  label:"Delivery",       phase:"DISPATCH",       icon:"🚚" },
]

export const PHASE_COLORS = {
  "PREP":           "#4a7c59",
  "DRUM":           "#2e6b9e",
  "DRYING":         "#2e6b9e",
  "FINISHING PREP": "#c4873a",
  "SURFACE":        "#4a7c59",
  "FINISHING":      "#8e4a9e",
  "DISPATCH":       "#22c55e",
}

export const ART_COLORS = {
  "DD":           "#2e6b9e",
  "F/L":          "#c4873a",
  "Goat Lining":  "#4a7c59",
  "Other":        "#8e4a9e",
}

export const PLATE_TYPES   = ["Plain","Sandblast","Roller Plain","Roller Sandblast","Emboss","Nappa","Vintage"]
export const SURFACE_TYPES = ["Buffing","Snuffing"]
export const BUYERS        = ["J&M","Polo RL","Cole Haan","Sioux","B&B"]
export const DRUM_SIZES    = ["300kg","600kg"]

export const DEFAULT_MACHINES = [
  "Saming Machine 1","Saming Machine 2","Splitting Machine",
  "Shaving Machine","Trimming Machine 1","Trimming Machine 2",
  "Weighing Scale","Vacuum Machine","Mollisa Machine",
  "Buffing Machine","Snuffing Machine","Spray Line 1","Spray Line 2",
  "Plating Press 1","Plating Press 2","Measuring Wheel",
]

export const STAFF_NAMES = [
  "Riyaz","Salman","Arif","Mustafa","Imran","Suresh","Kumar","Babu","Selvam","Kannan"
]

export const THEMES = {
  leather: {
    name:"Leather",
    emoji:"🟤",
    bg:"#0e0b08", surface:"#1a1410", card:"#12100d",
    border:"#2e2820", accent:"#c4873a", accentDark:"#1a1410",
    text:"#f0e6d8", textSub:"#d4c4b0", textMuted:"#6b5e50",
    done:"#22c55e", progress:"#c4873a",
    font:"'DM Mono', monospace", headerFont:"'Playfair Display', serif",
  },
  blue: {
    name:"Industrial",
    emoji:"🔵",
    bg:"#050d18", surface:"#0a1628", card:"#071020",
    border:"#1a3050", accent:"#3b82f6", accentDark:"#fff",
    text:"#e8f0fe", textSub:"#b0c4de", textMuted:"#4a6080",
    done:"#22c55e", progress:"#3b82f6",
    font:"'DM Mono', monospace", headerFont:"'DM Mono', monospace",
  },
  green: {
    name:"Factory",
    emoji:"🟢",
    bg:"#040e08", surface:"#081a0e", card:"#050e07",
    border:"#1a3a20", accent:"#22c55e", accentDark:"#050e07",
    text:"#e8f5e9", textSub:"#a5d6a7", textMuted:"#3a6040",
    done:"#22c55e", progress:"#22c55e",
    font:"'DM Mono', monospace", headerFont:"'DM Mono', monospace",
  },
  light: {
    name:"Clean",
    emoji:"⚪",
    bg:"#f5f5f3", surface:"#ffffff", card:"#f0f0ee",
    border:"#ddd", accent:"#1a1a1a", accentDark:"#fff",
    text:"#1a1a1a", textSub:"#333", textMuted:"#888",
    done:"#16a34a", progress:"#1a1a1a",
    font:"'DM Mono', monospace", headerFont:"'DM Mono', monospace",
  },
}

export const today   = () => new Date().toISOString().split("T")[0]
export const nowTime = () => new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})
export const fmt = n => {
  if (n===null||n===undefined||n==="") return "—"
  const num = Number(n); if (isNaN(num)) return "—"
  if (num>=1000) return (num/1000).toFixed(1)+"K"
  return num.toLocaleString("en-IN")
}
