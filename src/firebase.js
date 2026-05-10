import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDTo9iQwEp4mA40WWn4wh4Jp03XwuKYpMM",
  authDomain: "ih-leather-tracker.firebaseapp.com",
  databaseURL: "https://ih-leather-tracker-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ih-leather-tracker",
  storageBucket: "ih-leather-tracker.firebasestorage.app",
  messagingSenderId: "98335964840",
  appId: "1:98335964840:web:62eafbfd884d0b7bf40c9d"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
