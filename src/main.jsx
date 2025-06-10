import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TravelPlanner from "./travel-planner.tsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TravelPlanner/>
  </StrictMode>,
)
