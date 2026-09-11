import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Artikel from './pages/Artikel'
import Vokabeln from './pages/Vokabeln'
import Deklination from './pages/Deklination'
import Stats from './pages/Stats'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/vokabeln" element={<Vokabeln />} />
        <Route path="/deklination" element={<Deklination />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </div>
  )
}
