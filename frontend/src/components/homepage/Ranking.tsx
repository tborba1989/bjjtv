'use client'

import '../../styles/homepage/Ranking.css'
import { PlayCircle, Info } from 'lucide-react'

export default function Ranking() {
  return (
    <section className="ranking">
      <div className="ranking-container">
        <div className="ranking-header">
          <div className="header-content">
            <div className="title-section">
              <h2>Ranking BJJ</h2>
              <Info className="info-icon" size={24} />
            </div>
            <p>Acompanhe o desempenho dos atletas em tempo real</p>
          </div>

          <button className="tutorial-btn">
            <PlayCircle />
            <span>Como usar o ranking</span>
          </button>
        </div>

        <div className="dashboard-container">
          <iframe
            title="BJJ Rankings"
            src="https://app.powerbi.com/view?r=eyJrIjoiMDYyZDA5ZDUtOGJmMC00N2JkLTllN2EtYTQ2ODNhYWIwZmUxIiwidCI6IjRhZmYyYzdjLWE1NTgtNGQwMy1iZTFkLTFkMWRkYzY1YWQxOSIsImMiOjZ9"
            className="dashboard-frame"
          />
        </div>
      </div>
    </section>
  )
}