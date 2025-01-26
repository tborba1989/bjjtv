// src/components/homepage/MainBanner.tsx
'use client'
import '../../styles/homepage/MainBanner.css'

export default function MainBanner() {
 return (
   <section className="main-banner">
     <div className="banner-content">
       <h1>Sua fonte oficial</h1>
       <h2>Para o Melhor do Jiu-jitsu Potiguar</h2>
       <button className="cta-button">SIGA NOSSAS REDES</button>
     </div>
     
     <div className="slider-nav">
       <button className="nav-dot active"></button>
       <button className="nav-dot"></button>
       <button className="nav-dot"></button>
     </div>
   </section>
 )
}