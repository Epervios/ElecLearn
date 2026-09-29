/* Schémas vectoriels originaux ElecLearn.
 * Dessins simplifiés pour l'apprentissage, jamais des schémas d'exécution.
 * Aucun schéma ou extrait d'ouvrage externe n'est reproduit.
 */
(function(){
 "use strict";
 const C="#4ae0d0", O="#ffc17a", V="#b6a8ff", F="#e5f4ff", M="#91aec0";
 const wire=(d,color=C,w=2.6,extra="")=>'<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round" '+extra+'/>';
 const txt=(x,y,t,color=F,size=14)=>'<text x="'+x+'" y="'+y+'" fill="'+color+'" font-family="system-ui, sans-serif" font-size="'+size+'">'+t+'</text>';
 const box=(x,y,w,h,color="#173d4b",stroke="#456574",r=9)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+color+'" stroke="'+stroke+'"/>';
 const coil=(x,y,count,space=13,rad=14,color=O)=>Array.from({length:count},(_,i)=>'<ellipse cx="'+(x+i*space)+'" cy="'+y+'" rx="8" ry="'+rad+'" stroke="'+color+'" stroke-width="2.8" fill="none"/>').join("");
 const diagrams={
  1:{title:"Charges électriques et courant",caption:"Les électrons portent une charge négative ; le courant conventionnel est orienté à l'opposé de leur déplacement dans un conducteur métallique.",body:
    '<circle cx="126" cy="112" r="66" fill="none" stroke="#42637a" stroke-dasharray="5 7"/><circle cx="126" cy="112" r="26" fill="#ffc17a" fill-opacity=".2" stroke="'+O+'"/>'+txt(119,118,"+",O,25)+
    '<circle cx="65" cy="86" r="8" fill="'+C+'"/>'+txt(62,91,"−","#08212b",13)+
    '<circle cx="172" cy="160" r="8" fill="'+C+'"/>'+txt(169,165,"−","#08212b",13)+
    txt(92,209,"Atome (modèle)",M,13)+txt(252,65,"Conducteur",F,17)+
    box(253,84,188,51)+txt(266,117,"e⁻  →  e⁻  →  e⁻",C,18)+wire("M260 174H438",O,3)+wire("M421 163L439 174L421 185",O,3)+txt(257,209,"Courant conventionnel ←",O,13)
  },
  2:{title:"Circuit et loi d'Ohm",caption:"Un ampèremètre se monte en série ; un voltmètre mesure la tension en parallèle aux bornes du récepteur.",body:
    wire("M70 160V60H187",F)+wire("M221 60H374V160H70",F)+
    '<circle cx="70" cy="131" r="23" fill="#0d293a" stroke="'+C+'" stroke-width="2"/>'+txt(63,138,"U",C,18)+
    '<circle cx="204" cy="60" r="17" fill="#0d293a" stroke="'+O+'" stroke-width="2"/>'+txt(198,66,"A",O,15)+
    wire("M374 60V83M374 131V160",F)+
    box(357,82,34,49,"#213d50",O,2)+txt(403,111,"R",O,18)+
    wire("M374 81H284V104",V,2)+wire("M374 133H284V124",V,2)+
    '<circle cx="284" cy="114" r="15" stroke="'+V+'" stroke-width="2" fill="#0b2636"/>'+txt(279,120,"V",V,13)+
    txt(38,208,"U = R × I",C,24)+txt(220,207,"Exemple : 24 V / 12 Ω = 2 A",M,14)
  },
  3:{title:"Montages série et parallèle",caption:"Deux résistances de même valeur donnent 2R en série, mais R/2 en parallèle.",body:
    txt(36,44,"SÉRIE",C,15)+wire("M36 90H80M114 90H160M194 90H222",F)+box(80,80,34,20,"#1a364b",O,2)+box(160,80,34,20,"#1a364b",O,2)+txt(92,72,"R₁",O,13)+txt(171,72,"R₂",O,13)+txt(36,133,"Rₑq = R₁ + R₂",M,16)+
    txt(266,44,"PARALLÈLE",V,15)+wire("M271 88H298V68H337M371 68H419V88M298 88V125H337M371 125H419V88H447",F)+
    box(337,58,34,20,"#1a364b",O,2)+box(337,115,34,20,"#1a364b",O,2)+
    txt(314,170,"1/Rₑq = 1/R₁ + 1/R₂",M,14)
  },
  4:{title:"Bilan de puissance et rendement",caption:"La puissance absorbée se répartit en puissance utile et en pertes. Le rendement exprime la proportion utile.",body:
    txt(35,50,"PUISSANCE ABSORBÉE",M,13)+box(35,72,135,87,"#23465a",C,3)+txt(64,125,"1000 W",F,23)+
    wire("M174 115H232M232 115L220 105M232 115L220 125",C,4)+
    box(239,56,194,60,"#164a45",C,4)+txt(265,92,"800 W utiles",C,21)+
    box(239,139,194,48,"#4a343b",O,3)+txt(266,169,"200 W pertes",O,17)+
    wire("M216 115V163H235",O,3)+txt(130,220,"η = 800 / 1000 = 80 %",F,20)
  },
  5:{title:"Effet Joule dans un conducteur",caption:"À résistance constante, doubler le courant multiplie les pertes thermiques par quatre.",body:
    wire("M37 114H115M365 114H444",C,5)+
    box(116,90,246,49,"#8c6549",O,8)+
    Array.from({length:12},(_,i)=>wire("M"+(129+18*i)+" 101l8 25", "#f5bf82",1.3)).join("")+
    Array.from({length:6},(_,i)=>wire("M"+(145+37*i)+" 80q-9 -10 0 -21q9 -11 0 -19",O,2)).join("")+
    txt(113,169,"Conducteur résistif",F,17)+txt(56,216,"P = R × I²",C,22)+txt(273,212,"I × 2 → P × 4",O,16)
  },
  6:{title:"Deux éléments en série",caption:"Les tensions de deux sources en série s'additionnent si leurs polarités sont raccordées dans le bon sens.",body:
    box(42,83,155,76,"#1a3349",C,3)+box(280,83,155,76,"#1a3349",C,3)+
    txt(88,127,"1,5 V",F,23)+txt(322,127,"1,5 V",F,23)+
    wire("M197 120H280",C,4)+txt(51,77,"−",M,22)+txt(181,77,"+",O,22)+txt(287,77,"−",M,22)+txt(418,77,"+",O,22)+
    wire("M95 185H381M95 185L108 177M95 185L108 193M381 185L368 177M381 185L368 193",O,2)+txt(197,216,"Total : 3 V",C,21)
  },
  7:{title:"Induction dans une bobine",caption:"Le champ d'une bobine augmente avec N × I. Une variation du flux traversant les spires induit une tension.",body:
    box(68,102,331,30,"#254052","#59788a",5)+coil(87,117,19,16,41,O)+
    wire("M33 117H450",C,2.8,'stroke-dasharray="11 7"')+
    wire("M404 117L391 107M404 117L391 127",C,3)+
    txt(46,44,"Flux magnétique Φ →",C,18)+txt(115,207,"N spires · courant I · longueur l",M,15)
  },
  8:{title:"Charge d'un condensateur",caption:"Dans un modèle RC idéal, le condensateur atteint environ 63 % de la tension finale après une constante de temps τ = R × C.",body:
    wire("M40 159V66H158",F)+box(158,54,60,24,"#1c394a",O,3)+wire("M218 66H312V100M312 124V159H40",F)+
    wire("M279 100H345M279 124H345",C,4)+txt(160,47,"R",O,17)+txt(350,119,"C",C,18)+
    txt(58,184,"τ = R × C",C,21)+
    wire("M70 14H405",M,1,'stroke-dasharray="3 6"')+txt(247,28,"Uᴄ : 0 → 63 % après 1τ",F,14)
  },
  9:{title:"Choisir l'instrument de mesure",caption:"Le branchement d'un instrument change selon la grandeur mesurée. Le secondaire d'un TI sous charge ne doit pas rester ouvert.",body:
    txt(30,48,"MESURER UN COURANT",C,14)+wire("M28 115H83M117 115H204",F,3)+'<circle cx="100" cy="115" r="18" fill="#142f42" stroke="'+C+'" stroke-width="2"/>'+txt(94,122,"A",C,18)+
    txt(261,48,"MESURER UNE TENSION",V,14)+wire("M270 113H441M294 113V145H334M369 145H408V113",F,3)+box(334,103,35,20,"#1a364b",O,2)+
    '<circle cx="351" cy="161" r="17" fill="#142f42" stroke="'+V+'" stroke-width="2"/>'+txt(345,168,"V",V,17)+wire("M334 145V150M369 145V150",V,2)+
    txt(35,215,"Série",C,19)+txt(290,215,"Parallèle",V,19)
  },
  10:{title:"Tension alternative monophasée",caption:"La valeur de crête d'un signal sinusoïdal vaut √2 fois sa valeur efficace. À 50 Hz, une période dure 20 ms.",body:
    '<defs><pattern id="elec-plot-10" width="28" height="27" patternUnits="userSpaceOnUse"><path d="M28 0H0V27" stroke="#234657" fill="none"/></pattern></defs><rect x="33" y="25" width="415" height="175" fill="url(#elec-plot-10)" rx="8"/>'+
    wire("M34 115H448",M,1)+
    (function(){let p="";for(let i=0;i<=300;i++){const x=40+1.32*i,y=115-69*Math.sin(4*Math.PI*i/300);p+=(i===0?"M":"L")+x.toFixed(1)+" "+y.toFixed(1)+" ";}return wire(p,C,3)})()+
    txt(41,16,"U crête = √2 × U efficace",F,18)+txt(41,224,"0 ms",M,12)+txt(241,224,"20 ms",M,12)+txt(418,224,"40 ms",M,12)
  },
  11:{title:"Trois phases à 120°",caption:"Les tensions d'un réseau triphasé équilibré sont déphasées de 120°. En étoile, U ligne = √3 × U phase.",body:
    '<circle cx="232" cy="116" r="79" fill="none" stroke="#3a5b6e" stroke-dasharray="4 6"/>'+
    wire("M232 116H352",C,3)+wire("M232 116L172 220",V,3)+wire("M232 116L172 12",O,3)+
    '<circle cx="232" cy="116" r="6" fill="'+F+'"/>'+
    txt(358,120,"L1 · 0°",C,17)+txt(73,18,"L2 · −120°",O,15)+txt(71,226,"L3 · +120°",V,15)+
    txt(350,208,"Uᴸ = √3 × Uᴾ",F,17)
  },
  12:{title:"Champ tournant du moteur asynchrone",caption:"Le champ tournant possède une vitesse synchrone déterminée par la fréquence et le nombre de paires de pôles ; le rotor tourne légèrement moins vite.",body:
    '<circle cx="191" cy="118" r="93" fill="#1b394c" stroke="#456e7c" stroke-width="11"/>'+
    '<circle cx="191" cy="118" r="52" fill="#263f53" stroke="'+C+'" stroke-width="3"/>'+
    [0,90,180,270].map(a=>'<rect x="176" y="29" width="30" height="27" fill="'+O+'" rx="6" transform="rotate('+a+' 191 118)"/>').join("")+
    '<path d="M183 52Q268 67 252 143" fill="none" stroke="'+C+'" stroke-width="3" stroke-dasharray="7 5"/>'+wire("M252 143L255 126M252 143L269 131",C,3)+
    txt(306,82,"Stator",O,18)+txt(306,121,"Rotor",C,18)+txt(305,170,"n < nₛ",F,24)+txt(35,228,"Glissement s = (nₛ − n) / nₛ",M,15)
  },
  13:{title:"Moteur à courant continu à balais",caption:"Les balais alimentent l'induit par le collecteur. La commutation maintient le couple dans le même sens.",body:
    '<path d="M56 65h92v104H56Z" fill="#224052" stroke="'+V+'" stroke-width="3"/>'+txt(88,120,"N",V,25)+
    '<path d="M332 65h92v104h-92Z" fill="#423948" stroke="'+O+'" stroke-width="3"/>'+txt(362,120,"S",O,25)+
    '<circle cx="240" cy="116" r="74" fill="none" stroke="#42667b" stroke-width="6"/>'+
    wire("M205 85L275 147M275 85L205 147",C,5)+
    '<circle cx="240" cy="116" r="21" fill="#674b35" stroke="'+O+'" stroke-width="3"/>'+
    '<rect x="199" y="108" width="17" height="16" fill="'+F+'" rx="3"/><rect x="264" y="108" width="17" height="16" fill="'+F+'" rx="3"/>'+
    wire("M199 116H171M281 116H309",O,3)+txt(164,209,"Balai",F,15)+txt(265,209,"Collecteur",F,15)
  },
  14:{title:"Rapport de transformation",caption:"Dans un transformateur idéal, les tensions sont proportionnelles aux spires. Dans cet exemple : N₂ = N₁/2, donc U₂ = U₁/2.",body:
    '<rect x="69" y="45" width="337" height="142" rx="25" stroke="#6b8892" stroke-width="14" fill="none"/>'+
    coil(104,116,8,16,43,C)+coil(308,116,4,19,43,O)+
    txt(66,26,"PRIMAIRE",C,14)+txt(323,26,"SECONDAIRE",O,14)+
    txt(100,221,"N₁ = 8",C,20)+txt(304,221,"N₂ = 4",O,20)+txt(180,29,"U₂/U₁ = N₂/N₁",F,16)
  },
  15:{title:"Du flux lumineux à l'éclairement",caption:"Le flux utile reçu sur une surface détermine son éclairement moyen. Le calcul de 100 lx est un exemple idéal à répartition uniforme.",body:
    '<path d="M190 45L156 83H270L235 45Z" fill="#314d5c" stroke="#a1c3cb" stroke-width="3"/>'+
    '<path d="M161 83L82 188H359L267 83Z" fill="#ffe4a1" fill-opacity=".27" stroke="'+O+'" stroke-width="2"/>'+
    '<path d="M82 188H359L403 213H42Z" fill="#224658" stroke="'+M+'" stroke-width="2"/>'+
    txt(303,73,"1200 lm utiles",O,15)+txt(112,206,"12 m²",M,15)+txt(295,230,"E = 100 lx",C,19)
  }
 };
 function render(chapter,host){
   const d=diagrams[chapter];host.replaceChildren();host.hidden=!d;if(!d)return;
   const figure=document.createElement("figure");figure.className="concept-figure";
   const svg='<svg viewBox="0 0 480 240" role="img" aria-labelledby="vis-title-'+chapter+'" xmlns="http://www.w3.org/2000/svg"><title id="vis-title-'+chapter+'">'+d.title+'</title><rect x="1" y="1" width="478" height="238" rx="14" fill="#0b2636" stroke="#284a5d"/>'+d.body+'</svg>';
   const area=document.createElement("div");area.className="concept-figure-art";area.innerHTML=svg;
   const caption=document.createElement("figcaption");caption.textContent=d.caption;
   figure.append(area,caption);host.append(figure);
 }
 window.ElecIllustrations={render,available:Object.keys(diagrams).map(Number),diagrams};
})();