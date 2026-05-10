import { useState } from 'react'
import { F, Inp, Sel, SmartSel, SaveBtn, Divider, ChemicalAdder } from './UI'
import { today, nowTime, DEFAULT_MACHINES, PLATE_TYPES, SURFACE_TYPES, BUYERS, DRUM_SIZES } from '../constants'
import { useLS } from '../hooks'

export function PrepForm({ stepId, onSave, loading, t }) {
  const [date,setDate]=[useState(today()),v=>setDate(v)]
  const [qty,setQty]=useState("")
  const [machine,setMachine]=useState("")
  const [notes,setNotes]=useState("")
  const [machines,setMachines]=useLS("ih_machines",DEFAULT_MACHINES)
  const [d,setDate2]=useState(today())
  return (
    <div>
      <F t={t} label="Date"><Inp t={t} type="date" value={d} onChange={setDate2} /></F>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <F t={t} label="Qty (pcs)"><Inp t={t} type="number" value={qty} onChange={setQty} placeholder="0" /></F>
        <F t={t} label="Machine"><SmartSel t={t} value={machine} onChange={setMachine} options={machines} setOptions={setMachines} /></F>
      </div>
      <F t={t} label="Notes"><Inp t={t} value={notes} onChange={setNotes} placeholder="Optional" /></F>
      <SaveBtn t={t} loading={loading} onClick={()=>{ if(!qty)return; onSave({date:d,qty,machine,notes,step:stepId,time:nowTime()}) }} />
    </div>
  )
}

export function WeighForm({ onSave, loading, t }) {
  const [date,setDate]=useState(today())
  const [totalWt,setTotalWt]=useState("")
  const [pcs,setPcs]=useState("")
  const [drum,setDrum]=useState("300kg")
  const wtPerPcs = totalWt&&pcs ? (parseFloat(totalWt)/parseFloat(pcs)).toFixed(2) : ""
  return (
    <div>
      <F t={t} label="Date"><Inp t={t} type="date" value={date} onChange={setDate} /></F>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <F t={t} label="Total Wt (kg)"><Inp t={t} type="number" value={totalWt} onChange={setTotalWt} placeholder="0.0" step="0.1" /></F>
        <F t={t} label="Pcs"><Inp t={t} type="number" value={pcs} onChange={setPcs} placeholder="0" /></F>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <F t={t} label="Wt/Pcs (auto)"><Inp t={t} value={wtPerPcs} readOnly placeholder="Auto" /></F>
        <F t={t} label="Drum Size"><Sel t={t} value={drum} onChange={setDrum} options={DRUM_SIZES} /></F>
      </div>
      <SaveBtn t={t} loading={loading} onClick={()=>{ if(!totalWt)return; onSave({date,totalWt,pcs,wtPerPcs,drum,step:"weigh",time:nowTime()}) }} />
    </div>
  )
}

export function DrumForm({ article, colour, onSave, loading, t }) {
  const [date,setDate]=useState(today())
  const [drumNo,setDrumNo]=useState("")
  const [duration,setDuration]=useState("")
  const [chemicals,setChemicals]=useState([{name:"",qty:"",unit:"kg"}])
  return (
    <div>
      <F t={t} label="Date"><Inp t={t} type="date" value={date} onChange={setDate} /></F>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <F t={t} label="Drum No"><Inp t={t} value={drumNo} onChange={setDrumNo} placeholder="e.g. D1" /></F>
        <F t={t} label="Duration (hrs)"><Inp t={t} type="number" value={duration} onChange={setDuration} placeholder="0.0" step="0.5" /></F>
      </div>
      <div style={{padding:"10px 12px",background:t?.bg||"#12100d",borderRadius:9,marginBottom:12,border:`1px solid ${t?.border||"#2e2820"}`}}>
        <div style={{fontSize:10,color:t?.textMuted||"#6b5e50",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Article · Colour</div>
        <div style={{fontSize:14,color:t?.textSub||"#d4c4b0",fontFamily:"'DM Mono',monospace"}}>{article} · {colour}</div>
      </div>
      <Divider t={t} label="Chemicals" />
      <ChemicalAdder t={t} chemicals={chemicals} setChemicals={setChemicals} />
      <SaveBtn t={t} loading={loading} onClick={()=>{ if(!drumNo)return; onSave({date,drumNo,article,colour,duration,chemicals,step:"drum",time:nowTime()}) }} />
    </div>
  )
}

export function SurfaceForm({ article, onSave, loading, t }) {
  const [date,setDate]=useState(today())
  const [type,setType]=useState(article==="DD"?"Snuffing":"Buffing")
  const [machine,setMachine]=useState("")
  const [qty,setQty]=useState("")
  const [notes,setNotes]=useState("")
  const [machines,setMachines]=useLS("ih_machines",DEFAULT_MACHINES)
  return (
    <div>
      <F t={t} label="Date"><Inp t={t} type="date" value={date} onChange={setDate} /></F>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <F t={t} label="Type"><Sel t={t} value={type} onChange={setType} options={SURFACE_TYPES} /></F>
        <F t={t} label="Machine"><SmartSel t={t} value={machine} onChange={setMachine} options={machines} setOptions={setMachines} /></F>
      </div>
      <F t={t} label="Qty (pcs)"><Inp t={t} type="number" value={qty} onChange={setQty} placeholder="0" /></F>
      <F t={t} label="Notes"><Inp t={t} value={notes} onChange={setNotes} placeholder="Optional" /></F>
      <SaveBtn t={t} loading={loading} onClick={()=>{ if(!qty)return; onSave({date,type,machine,qty,notes,step:"surface",time:nowTime()}) }} />
    </div>
  )
}

export function SprayForm({ stepId, onSave, loading, t }) {
  const [date,setDate]=useState(today())
  const [passes,setPasses]=useState("1")
  const [chemicals,setChemicals]=useState([{name:"",qty:"",unit:"kg"}])
  const [notes,setNotes]=useState("")
  return (
    <div>
      <F t={t} label="Date"><Inp t={t} type="date" value={date} onChange={setDate} /></F>
      <F t={t} label="No. of Passes"><Sel t={t} value={passes} onChange={setPasses} options={["1","2","3","4","5"]} /></F>
      <Divider t={t} label="Chemicals" />
      <ChemicalAdder t={t} chemicals={chemicals} setChemicals={setChemicals} />
      <F t={t} label="Notes"><Inp t={t} value={notes} onChange={setNotes} placeholder="Optional" /></F>
      <SaveBtn t={t} loading={loading} onClick={()=>onSave({date,passes,chemicals,notes,step:stepId,time:nowTime()})} />
    </div>
  )
}

export function PlateForm({ stepId, onSave, loading, t }) {
  const [date,setDate]=useState(today())
  const [plateType,setPlateType]=useState("")
  const [temp,setTemp]=useState("")
  const [pressure,setPressure]=useState("")
  const [passes,setPasses]=useState("1")
  const [notes,setNotes]=useState("")
  return (
    <div>
      <F t={t} label="Date"><Inp t={t} type="date" value={date} onChange={setDate} /></F>
      <F t={t} label="Plate Type"><Sel t={t} value={plateType} onChange={setPlateType} options={PLATE_TYPES} /></F>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        <F t={t} label="Temp (°C)"><Inp t={t} type="number" value={temp} onChange={setTemp} placeholder="0" /></F>
        <F t={t} label="Pressure"><Inp t={t} type="number" value={pressure} onChange={setPressure} placeholder="0" /></F>
        <F t={t} label="Passes"><Sel t={t} value={passes} onChange={setPasses} options={["1","2","3","4"]} /></F>
      </div>
      <F t={t} label="Notes"><Inp t={t} value={notes} onChange={setNotes} placeholder="Optional" /></F>
      <SaveBtn t={t} loading={loading} onClick={()=>{ if(!plateType)return; onSave({date,plateType,temp,pressure,passes,notes,step:stepId,time:nowTime()}) }} />
    </div>
  )
}

export function AssortForm({ stepId, onSave, loading, t }) {
  const [date,setDate]=useState(today())
  const [gradeA,setGradeA]=useState("")
  const [gradeB,setGradeB]=useState("")
  const [gradeC,setGradeC]=useState("")
  const [rejection,setRejection]=useState("")
  const [notes,setNotes]=useState("")
  return (
    <div>
      <F t={t} label="Date"><Inp t={t} type="date" value={date} onChange={setDate} /></F>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <F t={t} label="Grade A (pcs)"><Inp t={t} type="number" value={gradeA} onChange={setGradeA} placeholder="0" /></F>
        <F t={t} label="Grade B (pcs)"><Inp t={t} type="number" value={gradeB} onChange={setGradeB} placeholder="0" /></F>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <F t={t} label="Grade C (pcs)"><Inp t={t} type="number" value={gradeC} onChange={setGradeC} placeholder="0" /></F>
        <F t={t} label="Rejection (pcs)"><Inp t={t} type="number" value={rejection} onChange={setRejection} placeholder="0" /></F>
      </div>
      <F t={t} label="Notes"><Inp t={t} value={notes} onChange={setNotes} placeholder="Optional" /></F>
      <SaveBtn t={t} loading={loading} onClick={()=>onSave({date,gradeA,gradeB,gradeC,rejection,notes,step:stepId,time:nowTime()})} />
    </div>
  )
}

export function MeasureForm({ onSave, loading, t }) {
  const [date,setDate]=useState(today())
  const [pcs,setPcs]=useState("")
  const [sqft,setSqft]=useState("")
  const [buyer,setBuyer]=useState("")
  const [po,setPo]=useState("")
  const avg = pcs&&sqft?(parseFloat(sqft)/parseFloat(pcs)).toFixed(2):""
  return (
    <div>
      <F t={t} label="Date"><Inp t={t} type="date" value={date} onChange={setDate} /></F>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <F t={t} label="Pcs"><Inp t={t} type="number" value={pcs} onChange={setPcs} placeholder="0" /></F>
        <F t={t} label="Total Sqft"><Inp t={t} type="number" value={sqft} onChange={setSqft} placeholder="0.0" step="0.1" /></F>
      </div>
      <F t={t} label="Avg Sqft/Pcs (auto)"><Inp t={t} value={avg} readOnly placeholder="Auto" /></F>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <F t={t} label="Buyer"><Sel t={t} value={buyer} onChange={setBuyer} options={BUYERS} /></F>
        <F t={t} label="PO Number"><Inp t={t} value={po} onChange={setPo} placeholder="LPO..." /></F>
      </div>
      <SaveBtn t={t} loading={loading} onClick={()=>{ if(!pcs||!sqft)return; onSave({date,pcs,sqft,avg,buyer,po,step:"measure",time:nowTime()}) }} />
    </div>
  )
}

export function DeliveryForm({ onSave, loading, t }) {
  const [date,setDate]=useState(today())
  const [pcs,setPcs]=useState("")
  const [sqft,setSqft]=useState("")
  const [buyer,setBuyer]=useState("")
  const [po,setPo]=useState("")
  const avg = pcs&&sqft?(parseFloat(sqft)/parseFloat(pcs)).toFixed(2):""
  return (
    <div>
      <F t={t} label="Date"><Inp t={t} type="date" value={date} onChange={setDate} /></F>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <F t={t} label="Pcs"><Inp t={t} type="number" value={pcs} onChange={setPcs} placeholder="0" /></F>
        <F t={t} label="Sqft"><Inp t={t} type="number" value={sqft} onChange={setSqft} placeholder="0.0" step="0.1" /></F>
      </div>
      <F t={t} label="Avg Sqft/Pcs (auto)"><Inp t={t} value={avg} readOnly placeholder="Auto" /></F>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <F t={t} label="Buyer"><Sel t={t} value={buyer} onChange={setBuyer} options={BUYERS} /></F>
        <F t={t} label="PO Number"><Inp t={t} value={po} onChange={setPo} placeholder="LPO..." /></F>
      </div>
      <SaveBtn t={t} loading={loading} label="✓ Mark Delivered" onClick={()=>{ if(!pcs||!sqft)return; onSave({date,pcs,sqft,avg,buyer,po,step:"delivery",time:nowTime()}) }} />
    </div>
  )
}

export function StepForm({ step, lot, onSave, loading, t }) {
  const prepSteps = ["saming","splitting","shaving","trimming1","trimming2","setting","hooking","mollisa"]
  if (prepSteps.includes(step.id))            return <PrepForm    t={t} stepId={step.id} onSave={onSave} loading={loading} />
  if (step.id==="weigh")                      return <WeighForm   t={t} onSave={onSave} loading={loading} />
  if (step.id==="drum")                       return <DrumForm    t={t} article={lot.article} colour={lot.colour} onSave={onSave} loading={loading} />
  if (step.id==="surface")                    return <SurfaceForm t={t} article={lot.article} onSave={onSave} loading={loading} />
  if (step.id==="spray1"||step.id==="spray2") return <SprayForm   t={t} stepId={step.id} onSave={onSave} loading={loading} />
  if (step.id==="plate1"||step.id==="plate2") return <PlateForm   t={t} stepId={step.id} onSave={onSave} loading={loading} />
  if (step.id==="assort1"||step.id==="assort2") return <AssortForm t={t} stepId={step.id} onSave={onSave} loading={loading} />
  if (step.id==="measure")                    return <MeasureForm t={t} onSave={onSave} loading={loading} />
  if (step.id==="delivery")                   return <DeliveryForm t={t} onSave={onSave} loading={loading} />
  return null
}
