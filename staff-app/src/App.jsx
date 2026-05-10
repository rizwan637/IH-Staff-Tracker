import { useState } from 'react'
import { useCollection, updateDoc } from './db'
import { StepForm } from './components/StepForms'
import { toast, Spinner, Divider } from './components/UI'
import { useLS } from './hooks'
import { PROCESS_STEPS, PHASE_COLORS, ART_COLORS, THEMES, STAFF_NAMES } from './constants'

// ─── Theme Picker ─────────────────────────────────────────────
function ThemePicker({ current, onChange, t }) {
  return (
    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
      {Object.entries(THEMES).map(([key, th]) => (
        <button key={key} onClick={()=>onChange(key)} style={{
          padding:"8px 14px", borderRadius:999,
          border:`2px solid ${current===key ? th.accent : t.border}`,
          background: current===key ? th.accent : t.card,
          color: current===key ? th.accentDark : t.textMuted,
          fontFamily:"'DM Mono',monospace", fontSize:12,
          cursor:"pointer", fontWeight: current===key ? 700 : 400,
          display:"flex", alignItems:"center", gap:6, transition:"all 0.2s"
        }}>
          {th.emoji} {th.name}
        </button>
      ))}
    </div>
  )
}

// ─── Name Picker Screen ───────────────────────────────────────
function NamePicker({ onSelect, t }) {
  const [custom, setCustom] = useState("")
  const [showCustom, setShowCustom] = useState(false)

  return (
    <div style={{ minHeight:"100vh", background:t.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 20px" }}>
      <div style={{ width:"100%", maxWidth:380 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🏭</div>
          <div style={{ fontSize:9, color:t.textMuted, letterSpacing:3, textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:4 }}>I&H Leather</div>
          <div style={{ fontSize:26, color:t.accent, fontFamily:t.headerFont||"'DM Mono',monospace", fontWeight:700 }}>Production Tracker</div>
          <div style={{ fontSize:11, color:t.textMuted, fontFamily:"'DM Mono',monospace", marginTop:6 }}>Staff App · Select your name to continue</div>
        </div>

        {/* Name grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
          {STAFF_NAMES.map(name => (
            <button key={name} onClick={()=>onSelect(name)} style={{
              padding:"14px 10px", background:t.surface, border:`1.5px solid ${t.border}`,
              borderRadius:12, color:t.text, fontSize:13, fontFamily:"'DM Mono',monospace",
              cursor:"pointer", textAlign:"center", transition:"all 0.15s",
              WebkitTapHighlightColor:"transparent"
            }}
            onMouseEnter={e=>{ e.target.style.borderColor=t.accent; e.target.style.background=t.card }}
            onMouseLeave={e=>{ e.target.style.borderColor=t.border; e.target.style.background=t.surface }}
            >
              {name}
            </button>
          ))}
        </div>

        {!showCustom ? (
          <button onClick={()=>setShowCustom(true)} style={{ width:"100%", padding:"12px", background:"none", border:`1.5px dashed ${t.border}`, borderRadius:12, color:t.textMuted, fontSize:12, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>
            ＋ My name is not here
          </button>
        ) : (
          <div style={{ display:"flex", gap:8 }}>
            <input autoFocus value={custom} onChange={e=>setCustom(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&custom.trim()) onSelect(custom.trim()) }}
              placeholder="Enter your name..." style={{ flex:1, padding:"12px", background:t.card, border:`1.5px solid ${t.accent}`, borderRadius:12, color:t.text, fontSize:13, fontFamily:"'DM Mono',monospace", outline:"none" }} />
            <button onClick={()=>{ if(custom.trim()) onSelect(custom.trim()) }} style={{ padding:"12px 16px", background:t.accent, border:"none", borderRadius:12, color:t.accentDark, fontWeight:700, fontSize:14, cursor:"pointer" }}>→</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Lot Detail View ──────────────────────────────────────────
function LotDetail({ lot, staffName, onClose, t }) {
  const [activeStep, setActiveStep] = useState(null)
  const [saving, setSaving]         = useState(false)
  const currentIdx = PROCESS_STEPS.findIndex(s => s.id === lot.currentStep)
  const pct = Math.round(((currentIdx<0?PROCESS_STEPS.length:currentIdx)/PROCESS_STEPS.length)*100)
  const artColor = ART_COLORS[lot.article] || t.accent

  const handleSave = async (stepId, data) => {
    setSaving(true)
    const stepIdx = PROCESS_STEPS.findIndex(s=>s.id===stepId)
    const nextStep = PROCESS_STEPS[stepIdx+1]?.id || "done"
    const logEntry = { ...data, stepId, savedAt: new Date().toISOString(), updatedBy: staffName }
    await updateDoc(`lots/${lot._key}`, {
      currentStep: nextStep==="done" ? stepId : nextStep,
      status: nextStep==="done" ? "delivered" : "active",
      [`log/${stepId}`]: logEntry
    })
    setSaving(false)
    setActiveStep(null)
    toast(`${PROCESS_STEPS.find(s=>s.id===stepId)?.label} saved ✓`, "success", t)
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:t.bg, overflowY:"auto" }}>
      {/* Header */}
      <div style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, padding:"13px 16px", position:"sticky", top:0, zIndex:10, display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onClose} style={{ background:t.card, border:"none", borderRadius:99, color:t.text, fontSize:16, width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, color:artColor, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>{lot.lotId}</div>
          <div style={{ fontSize:15, color:t.textSub, fontFamily:t.headerFont||"'DM Mono',monospace" }}>{lot.article} · {lot.colour}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:9, color:t.textMuted, fontFamily:"'DM Mono',monospace" }}>STAGE</div>
          <div style={{ fontSize:11, color: lot.status==="delivered"?t.done:t.accent, fontFamily:"'DM Mono',monospace" }}>
            {lot.status==="delivered" ? "Delivered ✅" : PROCESS_STEPS.find(s=>s.id===lot.currentStep)?.label||"—"}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding:"10px 16px 12px", background:t.card, borderBottom:`1px solid ${t.border}` }}>
        <div style={{ display:"flex", gap:2, marginBottom:6 }}>
          {PROCESS_STEPS.map((s,i) => {
            const done=i<currentIdx; const curr=i===currentIdx
            return <div key={s.id} style={{ height:5, flex:1, borderRadius:99, background: done?t.done:curr?artColor:t.border, transition:"background 0.3s" }} />
          })}
        </div>
        <div style={{ fontSize:10, color:t.textMuted, fontFamily:"'DM Mono',monospace" }}>{pct}% complete · {Math.max(0,currentIdx)}/{PROCESS_STEPS.length} steps</div>
      </div>

      <div style={{ padding:"14px 15px 100px" }}>
        {/* Info */}
        <div style={{ background:t.surface, borderRadius:11, padding:"12px", border:`1px solid ${t.border}`, marginBottom:14, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {[{l:"Supplier",v:lot.supplier},{l:"Sqft",v:lot.sqft||"—"},{l:"Buyer",v:lot.buyer||"—"}].map(x=>(
            <div key={x.l}>
              <div style={{ fontSize:9, color:t.textMuted, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:1 }}>{x.l}</div>
              <div style={{ fontSize:12, color:t.text, fontFamily:"'DM Mono',monospace", marginTop:3 }}>{x.v}</div>
            </div>
          ))}
        </div>

        {/* Steps */}
        {PROCESS_STEPS.map((step, i) => {
          const done    = i < currentIdx
          const curr    = i === currentIdx
          const future  = i > currentIdx
          const isOpen  = activeStep === step.id
          const logEntry = lot.log?.[step.id]
          const phase   = step.phase
          const showPhaseLabel = i===0 || PROCESS_STEPS[i-1].phase !== phase

          return (
            <div key={step.id}>
              {showPhaseLabel && (
                <div style={{ display:"flex", alignItems:"center", gap:6, margin:"12px 0 6px" }}>
                  <div style={{ width:6, height:6, borderRadius:99, background:PHASE_COLORS[phase]||t.accent }} />
                  <span style={{ fontSize:9, color:PHASE_COLORS[phase]||t.accent, fontFamily:"'DM Mono',monospace", letterSpacing:2, textTransform:"uppercase", fontWeight:700 }}>{phase}</span>
                  <div style={{ flex:1, height:1, background:`${PHASE_COLORS[phase]||t.accent}33` }} />
                </div>
              )}
              <div
                onClick={()=>{ if(curr) setActiveStep(isOpen?null:step.id) }}
                style={{
                  background: done?t.card:curr?t.surface:t.bg,
                  border:`1.5px solid ${done?t.done+"44":curr?artColor:future?t.border:t.border}`,
                  borderRadius:10, padding:"11px 12px",
                  cursor:curr?"pointer":"default",
                  opacity:future?0.4:1,
                  display:"flex", alignItems:"center", gap:10,
                  marginBottom:isOpen?0:5, transition:"all 0.15s"
                }}
              >
                <div style={{ width:26, height:26, borderRadius:99, background:done?t.done+"22":curr?`${artColor}22`:t.card, border:`1.5px solid ${done?t.done:curr?artColor:t.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:done?t.done:curr?artColor:t.textMuted, flexShrink:0, fontWeight:700 }}>
                  {done?"✓":i+1}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:done?t.textMuted:curr?t.text:t.textMuted, fontFamily:"'DM Mono',monospace" }}>
                    {step.icon} {step.label}
                  </div>
                  {done && logEntry && (
                    <div style={{ fontSize:10, color:t.done, marginTop:2, fontFamily:"'DM Mono',monospace" }}>
                      {logEntry.date} · {logEntry.time}
                      {logEntry.updatedBy ? ` · ${logEntry.updatedBy}` : ""}
                    </div>
                  )}
                  {curr && !isOpen && <div style={{ fontSize:10, color:t.accent, marginTop:2, fontFamily:"'DM Mono',monospace" }}>Tap to enter →</div>}
                </div>
                {curr && <span style={{ fontSize:11, color:t.textMuted }}>{isOpen?"▲":"▼"}</span>}
              </div>

              {isOpen && curr && (
                <div style={{ background:t.surface, border:`1.5px solid ${artColor}44`, borderTop:"none", borderRadius:"0 0 10px 10px", padding:"14px 13px", marginBottom:5 }}>
                  <StepForm t={t} step={step} lot={lot} onSave={data=>handleSave(step.id,data)} loading={saving} />
                </div>
              )}
            </div>
          )
        })}

        {lot.status==="delivered" && (
          <div style={{ background:`${t.done}14`, border:`1.5px solid ${t.done}44`, borderRadius:12, padding:"18px", textAlign:"center", marginTop:12 }}>
            <div style={{ fontSize:22, marginBottom:4 }}>✅</div>
            <div style={{ fontSize:13, color:t.done, fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>LOT DELIVERED · COMPLETE</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────
export default function App() {
  const [themeKey, setThemeKey]     = useLS("ih_staff_theme", "leather")
  const [staffName, setStaffName]   = useLS("ih_staff_name", "")
  const [selectedLot, setSelectedLot] = useState(null)
  const [filter, setFilter]           = useState("active")
  const [showSettings, setShowSettings] = useState(false)
  const [lots, loading]               = useCollection("lots")

  const t = THEMES[themeKey] || THEMES.leather

  // Show name picker if no name selected
  if (!staffName) return <NamePicker t={t} onSelect={name=>setStaffName(name)} />

  // Show lot detail
  if (selectedLot) {
    const fresh = lots.find(l=>l._key===selectedLot._key)||selectedLot
    return <LotDetail lot={fresh} staffName={staffName} onClose={()=>setSelectedLot(null)} t={t} />
  }

  if (loading) return (
    <div style={{ minHeight:"100vh", background:t.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <Spinner t={t} />
    </div>
  )

  const filtered = lots.filter(l => filter==="all" ? true : l.status===filter)
  const pillBase   = { padding:"7px 14px", borderRadius:999, border:`1.5px solid ${t.border}`, fontSize:11, fontFamily:"'DM Mono',monospace", cursor:"pointer", background:"none", color:t.textMuted, whiteSpace:"nowrap" }
  const pillActive = { ...pillBase, background:t.accent, border:`1.5px solid ${t.accent}`, color:t.accentDark, fontWeight:700 }

  return (
    <div style={{ minHeight:"100vh", background:t.bg, color:t.text, fontFamily:"'DM Mono',monospace" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background:t.surface, borderBottom:`1.5px solid ${t.border}`, padding:"13px 18px 10px", position:"sticky", top:0, zIndex:200, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:9, color:t.textMuted, letterSpacing:2, textTransform:"uppercase", marginBottom:1 }}>I&H Leather · Staff</div>
          <div style={{ fontSize:18, color:t.accent, fontFamily:t.headerFont, fontWeight:700 }}>Production Tracker</div>
        </div>
        <button onClick={()=>setShowSettings(s=>!s)} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:99, padding:"7px 14px", color:t.text, fontSize:12, cursor:"pointer", fontFamily:"'DM Mono',monospace", display:"flex", alignItems:"center", gap:6 }}>
          👤 {staffName}
        </button>
      </div>

      {/* Settings drawer */}
      {showSettings && (
        <div style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, padding:"14px 18px" }}>
          <div style={{ fontSize:11, color:t.textMuted, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Theme</div>
          <ThemePicker current={themeKey} onChange={k=>{ setThemeKey(k); setShowSettings(false) }} t={t} />
          <div style={{ marginTop:14, borderTop:`1px solid ${t.border}`, paddingTop:14 }}>
            <div style={{ fontSize:11, color:t.textMuted, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Switch User</div>
            <button onClick={()=>{ setStaffName(""); setShowSettings(false) }} style={{ padding:"10px 18px", background:"none", border:`1.5px solid ${t.border}`, borderRadius:9, color:t.text, fontSize:12, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>
              🔄 Change Name
            </button>
          </div>
        </div>
      )}

      <div style={{ padding:"16px 15px 100px" }}>

        {/* Stats strip */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
          {[
            { l:"Active",    v:lots.filter(l=>l.status==="active").length,    c:t.accent },
            { l:"Delivered", v:lots.filter(l=>l.status==="delivered").length, c:t.done   },
            { l:"Total",     v:lots.length,                                   c:t.textSub },
          ].map(x=>(
            <div key={x.l} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:11, padding:"10px", textAlign:"center" }}>
              <div style={{ fontSize:20, color:x.c, fontFamily:t.headerFont }}>{x.v}</div>
              <div style={{ fontSize:9, color:t.textMuted, textTransform:"uppercase", letterSpacing:1, marginTop:2 }}>{x.l}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:8, marginBottom:14, overflowX:"auto", paddingBottom:2 }}>
          {[
            { key:"active",    label:`🟡 Active · ${lots.filter(l=>l.status==="active").length}` },
            { key:"delivered", label:`✅ Done · ${lots.filter(l=>l.status==="delivered").length}` },
            { key:"all",       label:`All · ${lots.length}` },
          ].map(f=>(
            <button key={f.key} onClick={()=>setFilter(f.key)} style={filter===f.key?pillActive:pillBase}>{f.label}</button>
          ))}
        </div>

        {/* Lot cards */}
        {filtered.length===0 && (
          <div style={{ textAlign:"center", color:t.textMuted, fontSize:13, padding:"50px 0" }}>
            {filter==="active" ? "No active lots right now" : "No lots found"}
          </div>
        )}

        {filtered.map(lot=>{
          const stepIdx  = PROCESS_STEPS.findIndex(s=>s.id===lot.currentStep)
          const pct      = Math.round(((stepIdx<0?PROCESS_STEPS.length:stepIdx)/PROCESS_STEPS.length)*100)
          const artColor = ART_COLORS[lot.article]||t.accent
          const currStep = PROCESS_STEPS.find(s=>s.id===lot.currentStep)
          const lastUpdatedBy = lot.log ? Object.values(lot.log).filter(e=>e.updatedBy).pop()?.updatedBy : null

          return (
            <div key={lot._key} onClick={()=>setSelectedLot(lot)} style={{ background:t.surface, border:`1.5px solid ${artColor}33`, borderRadius:13, padding:"13px 14px", marginBottom:10, cursor:"pointer", userSelect:"none", WebkitTapHighlightColor:"transparent", transition:"transform 0.1s" }}
              onMouseDown={e=>e.currentTarget.style.transform="scale(0.99)"}
              onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
              onTouchStart={e=>e.currentTarget.style.transform="scale(0.99)"}
              onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:11, color:artColor, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>{lot.lotId}</div>
                  <div style={{ fontSize:15, color:t.textSub, fontFamily:t.headerFont, marginTop:2 }}>{lot.article} · {lot.colour}</div>
                  <div style={{ fontSize:11, color:t.textMuted, marginTop:2 }}>{lot.supplier}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:9, color:t.textMuted, marginBottom:3 }}>{currStep?.phase||"DONE"}</div>
                  <div style={{ fontSize:12, color:lot.status==="delivered"?t.done:t.accent }}>
                    {lot.status==="delivered" ? "Delivered ✅" : currStep?.label||"—"}
                  </div>
                  {lot.status==="active" && (
                    <div style={{ fontSize:10, color:t.accent, marginTop:2, fontWeight:700 }}>TAP TO UPDATE →</div>
                  )}
                </div>
              </div>
              <div style={{ background:t.card, borderRadius:99, height:5, overflow:"hidden", marginBottom:5 }}>
                <div style={{ width:`${pct}%`, height:"100%", background:lot.status==="delivered"?t.done:artColor, borderRadius:99, transition:"width 0.5s" }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:10, color:t.textMuted }}>{pct}% · step {Math.max(1,stepIdx+1)}/{PROCESS_STEPS.length}</span>
                {lastUpdatedBy && <span style={{ fontSize:10, color:t.textMuted }}>by {lastUpdatedBy}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
