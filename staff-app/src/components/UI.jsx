import { useState } from 'react'

export function toast(msg, type="success", t) {
  const el = document.createElement("div")
  el.innerText = msg
  const bg = type==="success" ? (t?.done||"#22c55e") : "#ef4444"
  el.style.cssText = `position:fixed;bottom:100px;left:50%;transform:translateX(-50%);
    background:${bg};color:#fff;padding:10px 22px;border-radius:999px;
    font-size:13px;font-family:'DM Mono',monospace;z-index:9999;
    box-shadow:0 4px 20px rgba(0,0,0,0.4);white-space:nowrap`
  document.body.appendChild(el)
  setTimeout(()=>el.remove(), 2500)
}

export function Spinner({ t }) {
  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", padding:"60px 0" }}>
      <div style={{ width:36, height:36, border:`3px solid ${t?.border||"#2e2820"}`, borderTop:`3px solid ${t?.accent||"#c4873a"}`, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export function F({ label, children, t }) {
  return (
    <div style={{ marginBottom:12 }}>
      <label style={{ display:"block", fontSize:10, fontFamily:"'DM Mono',monospace", color:t?.textMuted||"#8a7a6a", letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>{label}</label>
      {children}
    </div>
  )
}

export function Inp({ value, onChange, type="text", placeholder, step, readOnly, t }) {
  const base = { width:"100%", boxSizing:"border-box", background:t?.card||"#1e1a16", border:`1.5px solid ${t?.border||"#3a3028"}`, color:t?.text||"#f0e6d8", padding:"11px 13px", borderRadius:10, fontSize:14, fontFamily:"'DM Mono',monospace", outline:"none", appearance:"none" }
  return <input type={type} value={value} onChange={e=>onChange&&onChange(e.target.value)} placeholder={placeholder} step={step} readOnly={readOnly} style={{ ...base, background: readOnly?(t?.bg||"#161210"):base.background }} />
}

export function Sel({ value, onChange, options, placeholder="-- Select --", t }) {
  const base = { width:"100%", boxSizing:"border-box", background:t?.card||"#1e1a16", border:`1.5px solid ${t?.border||"#3a3028"}`, color:t?.text||"#f0e6d8", padding:"11px 13px", borderRadius:10, fontSize:14, fontFamily:"'DM Mono',monospace", outline:"none", appearance:"none", backgroundImage:"none" }
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} style={base}>
      <option value="">{placeholder}</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  )
}

export function SmartSel({ value, onChange, options, setOptions, placeholder="-- Select --", t }) {
  const [adding, setAdding] = useState(false)
  const [nv, setNv] = useState("")
  const confirm = () => {
    const tv = nv.trim(); if (!tv) return
    if (!options.includes(tv)) setOptions([...options, tv])
    onChange(tv); setNv(""); setAdding(false)
  }
  const base = { width:"100%", boxSizing:"border-box", background:t?.card||"#1e1a16", border:`1.5px solid ${t?.border||"#3a3028"}`, color:t?.text||"#f0e6d8", padding:"11px 13px", borderRadius:10, fontSize:14, fontFamily:"'DM Mono',monospace", outline:"none", appearance:"none", backgroundImage:"none" }
  if (adding) return (
    <div style={{ display:"flex", gap:6 }}>
      <input autoFocus value={nv} onChange={e=>setNv(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")confirm();if(e.key==="Escape")setAdding(false)}} placeholder="Type new..." style={{ ...base, flex:1 }} />
      <button onClick={confirm} style={{ background:t?.accent||"#c4873a", border:"none", borderRadius:9, color:t?.accentDark||"#1a1410", fontWeight:700, fontSize:16, padding:"0 12px", cursor:"pointer" }}>✓</button>
      <button onClick={()=>setAdding(false)} style={{ background:t?.card||"#2e2820", border:"none", borderRadius:9, color:t?.textMuted||"#8a7a6a", fontSize:16, padding:"0 10px", cursor:"pointer" }}>✕</button>
    </div>
  )
  return (
    <select value={value} onChange={e=>e.target.value==="__add__"?setAdding(true):onChange(e.target.value)} style={base}>
      <option value="">{placeholder}</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
      <option value="__add__" style={{ color:t?.accent||"#c4873a", fontWeight:700 }}>＋ Add New</option>
    </select>
  )
}

export function SaveBtn({ onClick, label="Save", loading=false, t }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      width:"100%", padding:"14px", background:loading?(t?.textMuted||"#6b5e50"):(t?.accent||"#c4873a"),
      border:"none", borderRadius:11, color:t?.accentDark||"#1a1410", fontSize:14,
      fontFamily:"'DM Mono',monospace", fontWeight:700, letterSpacing:1,
      textTransform:"uppercase", cursor:loading?"not-allowed":"pointer",
      marginBottom:20, marginTop:4, boxShadow:`0 4px 16px ${t?.accent||"#c4873a"}55`
    }}>
      {loading?"Saving...":label}
    </button>
  )
}

export function Divider({ label, t }) {
  return (
    <div style={{ margin:"14px 0 10px", display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ fontSize:10, color:t?.accent||"#c4873a", letterSpacing:2, textTransform:"uppercase", fontWeight:700, fontFamily:"'DM Mono',monospace", whiteSpace:"nowrap" }}>{label}</span>
      <div style={{ flex:1, height:1, background:t?.border||"#2e2820" }} />
    </div>
  )
}

export function ChemicalAdder({ chemicals, setChemicals, t }) {
  const add = () => setChemicals(c=>[...c,{name:"",qty:"",unit:"kg"}])
  const upd = (i,k,v) => setChemicals(c=>c.map((x,j)=>j===i?{...x,[k]:v}:x))
  const rem = i => setChemicals(c=>c.filter((_,j)=>j!==i))
  return (
    <div>
      {chemicals.map((c,i)=>(
        <div key={i} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr auto", gap:6, marginBottom:8 }}>
          <Inp t={t} value={c.name} onChange={v=>upd(i,"name",v)} placeholder="Chemical name" />
          <Inp t={t} type="number" value={c.qty} onChange={v=>upd(i,"qty",v)} placeholder="Qty" />
          <Sel t={t} value={c.unit} onChange={v=>upd(i,"unit",v)} options={["kg","g","L","mL"]} />
          {chemicals.length>1 && <button onClick={()=>rem(i)} style={{ background:t?.card||"#2e2820", border:"none", borderRadius:8, color:"#ef4444", fontSize:16, padding:"0 10px", cursor:"pointer" }}>×</button>}
        </div>
      ))}
      <button onClick={add} style={{ background:"none", border:`1.5px dashed ${t?.border||"#3a3028"}`, color:t?.accent||"#c4873a", borderRadius:9, padding:"8px", width:"100%", fontFamily:"'DM Mono',monospace", fontSize:11, cursor:"pointer", marginBottom:14 }}>
        ＋ Add Chemical
      </button>
    </div>
  )
}
