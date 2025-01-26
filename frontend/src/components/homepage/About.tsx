// src/components/homepage/About.tsx
'use client'
import '../../styles/homepage/About.css'

export default function About() {
 return (
   <section className="about">
     <div className="about-container">
       <div className="about-text">
         <h2>Sobre o nosso projeto</h2>
         <h3>RN BJJ TV: levando a arte suave do Rio Grande do Norte para o mundo!</h3>

         <div className="about-content">
           <p>A RN BJJ TV nasceu da paixão pelo Jiu-Jitsu e da vontade de promover e divulgar o talento potiguar dessa arte marcial. Nossa missão é proporcionar uma plataforma onde atletas, entusiastas e amantes do Jiu-Jitsu possam se conectar, acompanhar competições ao vivo, e ficar por dentro das últimas notícias e eventos do cenário local e nacional.</p>

           <p>Além das transmissões ao vivo, a RN BJJ TV oferece uma gama de conteúdos exclusivos, incluindo entrevistas com grandes nomes do esporte, análises técnicas, e cobertura de eventos especiais. Queremos ser mais que um canal de transmissão; queremos ser um ponto de encontro para a comunidade do Jiu-Jitsu.</p>
         </div>
       </div>

       <div className="about-image">
         <img
          src="/images/about-bjj.jpg"
          alt="Jiu-jitsu em ação"
          width="500"
          height="300"
        />
       </div>
     </div>
   </section>
 )
}