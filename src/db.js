import { useState, useEffect } from 'react'
import { ref, onValue, set, push, remove, update } from 'firebase/database'
import { db } from './firebase'

export function useCollection(path) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const r = ref(db, path)
    const unsub = onValue(r, snap => {
      const val = snap.val()
      if (val) {
        const arr = Object.entries(val).map(([k, v]) => ({ ...v, _key: k }))
        setData(arr.reverse())
      } else { setData([]) }
      setLoading(false)
    })
    return () => unsub()
  }, [path])
  return [data, loading]
}

export async function updateDoc(path, data) {
  const r = ref(db, path)
  await update(r, data)
}

export async function addRecord(path, data) {
  const r = ref(db, path)
  await push(r, { ...data, createdAt: Date.now() })
}
