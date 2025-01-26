// src/components/homepage/Header.tsx
'use client'
import '../../styles/homepage/Header.css'
import Image from 'next/image';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa'

export default function Header() {
 return (
   <header className="header">
     <nav className="header-content">
       <div className="logo">
         <Image
          src="/images/rnbjj-logo.png"
          alt="RN BJJ TV"
          width={120}
          height={40}
          priority  // importante para o logo que é above the fold
          className="w-auto h-auto"
        />
       </div>

       <div className="right-section">
         <div className="info-group">
           <div className="info-item">
             <FaMapMarkerAlt />
             <span>Sede Natal/RN</span>
           </div>
           <div className="info-item">
             <FaClock />
             <span>Dom-Dom: 9:00 - 17:00</span>
           </div>
           <div className="buttons">
             <button className="portal-btn">Portal Admin</button>
             <button className="atleta-btn">Portal Atleta</button>
           </div>
         </div>
       </div>
     </nav>
   </header>
 )
}