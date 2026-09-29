/* Atlas visuel ElecLearn : trente figures complémentaires originales.
 * Les tracés pédagogiques sont qualitatifs, non destinés à l'exécution. */
(function(){
"use strict";
const records={
 1:[
  ["1.1.1","Pourquoi un métal conduit-il ?","compare",["CONDUCTEUR","Électrons libres mobiles","Charge transportée"],["ISOLANT","Charges fortement liées","Très peu de porteurs"],"La mobilité des porteurs explique la différence de comportement entre matériaux."],
  ["1.2.4","Deux sens à ne pas confondre","directions",["ÉLECTRONS","de − vers +"],["COURANT CONVENTIONNEL","de + vers −"],"Dans un métal, les électrons dérivent en sens inverse du courant conventionnel."]
 ],
 2:[
  ["2.1","Courant et quantité de charge","plot",["TEMPS t","CHARGE Q","linear"],null,"La pente de la courbe Q(t) représente l'intensité I = ΔQ/Δt."],
  ["2.4","La droite de la loi d'Ohm","plot",["COURANT I","TENSION U","linear"],null,"À température constante pour une résistance ohmique : U = R × I."]
 ],
 3:[
  ["3.2","Longueur et résistance","plot",["LONGUEUR l","RÉSISTANCE R","linear"],null,"À section et matériau constants, la résistance croît avec la longueur."],
  ["3.3.7","Un circuit mixte : série + parallèle","mixed",null,null,"Le bloc parallèle s'ajoute en série à R₁ : Rₑq = R₁ + (R₂ × R₃)/(R₂ + R₃)."]
 ],
 4:[
  ["4.7","De la production à l'énergie utile","flow",["Source","Transport","Récepteur","Énergie utile"],null,"Chaque conversion et transport peut occasionner des pertes."],
  ["4.9","Lire le rendement d'une machine","energy",["PUISSANCE ABSORBÉE","80 % utile","20 % pertes"],null,"Exemple pédagogique : η = P utile / P absorbée = 0,80."]
 ],
 5:[
  ["5.1","Effet Joule : le courant au carré","plot",["COURANT I","PUISSANCE P","square"],null,"Quand I double, les pertes résistives R × I² sont multipliées par quatre."],
  ["5.2","Chauffer un matériau","plot",["ÉLÉVATION ΔT","ÉNERGIE Q","linear"],null,"À masse et capacité thermique constantes, Q = m × c × ΔT."]
 ],
 6:[
  ["6.1","Pile et accumulateur","compare",["PILE PRIMAIRE","Réactions non réversibles en pratique","Usage puis recyclage"],["ACCUMULATEUR","Réactions réversibles adaptées","Cycles charge/décharge"],"Les chimies et paramètres réels diffèrent selon les technologies."],
  ["6.1.5","Capacité nominale : une énergie ?","flow",["Capacité Ah","× tension V","Énergie Wh"],null,"L'estimation Wh ≈ Ah × V suppose une tension caractéristique. L'énergie réelle dépend du régime."]
 ],
 7:[
  ["7.1","Lignes de champ d'un aimant","magnet",null,null,"Hors de l'aimant, les lignes de champ sont dirigées du pôle nord vers le sud."],
  ["7.4","Variation de flux et tension induite","plot",["VITESSE DE VARIATION |ΔΦ/Δt|","TENSION INDUITE |e|","linear"],null,"À nombre de spires fixé, la tension induite augmente avec la vitesse de variation du flux."]
 ],
 8:[
  ["8.3","Ce qui constitue un condensateur","capacitor",null,null,"Deux armatures conductrices séparées par un diélectrique stockent des charges opposées."],
  ["8.3.4","Charge et décharge RC","rc",null,null,"À une constante de temps τ, la charge atteint environ 63 % et la décharge descend vers 37 %."]
 ],
 9:[
  ["9.2.4","Classe et étendue de mesure","compare",["ERREUR ABSOLUE","Dépend du calibre de l'appareil","À vérifier dans la notice"],["ERREUR RELATIVE","Plus importante à faible indication","Ne pas confondre avec résolution"],"La classe d'un appareil analogique se rapporte habituellement à son étendue de mesure."],
  ["9.3","Choisir comment mesurer","flow",["Grandeur","Instrument","Calibre","Incertitude"],null,"Un bon nombre de chiffres affichés ne garantit pas une mesure exacte."]
 ],
 10:[
  ["10.3.1","Période et fréquence du réseau","wave",null,null,"À 50 Hz, une période de la sinusoïde dure 20 ms."],
  ["10.6","Triangle des puissances","triangle",null,null,"En régime sinusoïdal : S² = P² + Q², et cos φ = P/S."]
 ],
 11:[
  ["11.4","Couplage étoile","star",null,null,"En régime équilibré, la tension de ligne est √3 fois la tension aux bornes d'une phase."],
  ["11.7","Couplage triangle","delta",null,null,"En triangle, chaque élément reçoit la tension entre phases du réseau."]
 ],
 12:[
  ["12.1.4","Fréquence, pôles et vitesse synchrone","bars",["2 pôles","4 pôles","6 pôles","8 pôles"],[3000,1500,1000,750],"Exemple à 50 Hz : nₛ = 120f / nombre de pôles."],
  ["12.3","Le glissement du moteur asynchrone","plot",["VITESSE DU ROTOR","GLISSEMENT s","descending"],null,"Le glissement décroît quand la vitesse du rotor se rapproche de la vitesse synchrone."]
 ],
 13:[
  ["13.1.6","Démarrage et courant d'induit","plot",["TEMPS","COURANT D'INDUIT","decay"],null,"Schéma qualitatif : la force contre-électromotrice augmente avec la vitesse et limite le courant."],
  ["13.2","Deux modes d'excitation","compare",["MOTEUR SÉRIE","Excitation parcourue par I induit","Comportement variable avec la charge"],["MOTEUR SHUNT","Excitation en dérivation","Flux plus stable à tension fixée"],"La constitution de l'excitation influence directement vitesse et couple."]
 ],
 14:[
  ["14.2.2","Rapports d'un transformateur idéal","flow",["N₂ / N₁","= U₂ / U₁","= I₁ / I₂"],null,"Rapport de spires et tensions direct ; rapport des courants inverse en valeur absolue."],
  ["14.2.3","Où passent les pertes ?","energy",["PUISSANCE D'ENTRÉE","96 % de sortie","4 % de pertes"],null,"Exemple fictif : pertes cuivre et fer réduisent le rendement d'un transformateur réel."]
 ],
 15:[
  ["15.1.3","Température de couleur : ambiance","kelvin",null,null,"La température de couleur décrit l'apparence chromatique, pas la chaleur dissipée par une lampe."],
  ["15.2.5","Flux reçu et surface éclairée","plot",["SURFACE A","ÉCLAIREMENT E","inverse"],null,"À flux effectivement reçu constant et réparti uniformément, E = Φutile / A."]
 ]
};
const E=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const path=(p,col="#45e3d4",w=2.8)=>'<path d="'+p+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"/>';
const label=(x,y,s,color="#ebf5ff",size=15)=>'<text x="'+x+'" y="'+y+'" fill="'+color+'" font-size="'+size+'" font-family="system-ui,sans-serif">'+E(s)+'</text>';
const rect=(x,y,w,h,fill="#153e50",stroke="#446f7c")=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="9" fill="'+fill+'" stroke="'+stroke+'"/>';
const arrow=(x,y,color="#45e3d4")=>path("M"+x+" "+y+"l-9 -7m9 7l-9 7",color,3);
function fig(rec,ch,n){
 const [section,title,type,a,b,description]=rec;
 let content="";
 switch(type){
 case "compare":
   content=rect(24,26,205,142,"#183e4f","#4adfce")+rect(251,26,205,142,"#203548","#c9a5ff");
   for(const [i,col,xx] of [[a,"#4adfce",39],[b,"#c9a5ff",266]]){
     content+=label(xx,54,i[0],col,14)+path("M"+xx+" 67h163",col,1)+label(xx,98,i[1],"#e7f5fc",12)+label(xx,123,i[2],"#bed0db",12);
   }break;
 case "directions":
   content=rect(35,42,412,113);
   content+=label(50,77,a[0],"#4adfce",14)+path("M430 95H77","#4adfce",5)+arrow(77,95,"#4adfce");
   content+=label(50,125,b[0],"#ffc78a",14)+path("M76 145H432","#ffc78a",4)+arrow(432,145,"#ffc78a");break;
 case "plot":{
   const xlabel=a[0],ylabel=a[1],shape=a[2];const pts=[];
   for(let i=0;i<=90;i++){const t=i/90,y=shape==="square"?t*t:shape==="inverse"?1/(1+5*t):shape==="descending"?1-t:shape==="decay"?.24+.76*Math.exp(-5*t):t;pts.push((i===0?"M":"L")+(65+t*325).toFixed(1)+" "+(159-y*120).toFixed(1))}
   content=path("M56 31V160H407","#829bac",1.5)+path(pts.join(""),"#4ae0d0",3)+
   label(40,23,ylabel,"#e6f8ff",13)+label(278,186,xlabel,"#bfd3dd",12);
   for(let i=1;i<=3;i++)content+=path("M56 "+(159-i*30)+"H407","#315364",.8);
   break;
 }
 case "mixed":
   content=path("M29 93H71M109 93H167V52H204M240 52H300V93H428M167 93V132H204M240 132H300V93","#ebf5ff",3);
   for(const [x,y] of [[74,81],[204,40],[204,120]])content+=rect(x,y,35,24,"#294459","#ffc78a");
   content+=label(75,72,"R₁","#ffc78a")+label(204,34,"R₂","#ffc78a")+label(204,161,"R₃","#ffc78a");break;
 case "flow":
   const width=Math.min(140,(420-a.length*10)/a.length),step=420/a.length;
   a.forEach((s,i)=>{const x=28+i*step;content+=rect(x,73,width,53,i%2?"#223e50":"#164c49",i%2?"#bea2fa":"#49dac8")+label(x+7,105,s,"#f0f8fc",Math.min(14,140/s.length));if(i<a.length-1)content+=path("M"+(x+width+3)+" 100h"+(step-width-12),"#ffa950",2)+arrow(x+step-12,100,"#ffa950")});break;
 case "energy":
   content=rect(25,67,136,94,"#173e50","#45decd")+label(35,89,a[0],"#a7c5d3",10)+label(37,133,"100 %","#effbff",30)+
   path("M165 112H212M212 112l-9 -7m9 7l-9 7","#46e2d1",3)+
   rect(224,40,223,66,"#1b4f47","#46e2d1")+label(242,81,a[1],"#66e9d7",21)+
   rect(224,127,223,49,"#4a343a","#fcb971")+label(245,158,a[2],"#ffd6aa",17)+path("M194 112v39h26","#fcb971",2);break;
 case "magnet":
   content=rect(145,82,180,65,"#354456","#c2d0d8")+rect(145,82,90,65,"#455778","#a9baff")+rect(235,82,90,65,"#764839","#ffc38a");
   content+=label(176,124,"N","#f4fcff",23)+label(270,124,"S","#fff2e3",23);
   for(let i=0;i<3;i++){let yy=31+i*13;content+=path("M171 82C"+(68+i*8)+" "+(yy-17)+" "+(79+i*3)+" "+(yy-21)+" 292 82","#47e1d0",1.7)+arrow(297,74,"#47e1d0")}
   content+=label(146,181,"Lignes fermées autour de l’aimant","#bfd3dc",13);break;
 case "capacitor":
   content=rect(140,39,22,124,"#4497ab","#4ae1d0")+rect(310,39,22,124,"#4497ab","#4ae1d0");
   for(let i=0;i<3;i++)content+=label(116,68+i*40,"+","#ffc78a",26)+label(339,68+i*40,"−","#c0b0ff",26);
   content+=path("M171 42H301M171 82H301M171 122H301","#7593a0",1);
   content+=label(189,97,"DIÉLECTRIQUE","#effaff",14)+label(153,187,"Deux armatures, charges opposées","#bed5e1",13);break;
 case "rc":{
   content=path("M51 20V169H436","#839caa",1.5);
   const mk=(formula,color)=>{let p="";for(let i=0;i<=100;i++){const t=i/100,y=formula(t);p+=(i?"L":"M")+(52+3.66*i).toFixed(1)+" "+(168-127*y).toFixed(1)}return path(p,color,3)};
   content+=mk(t=>1-Math.exp(-5*t),"#4ae3d5")+mk(t=>Math.exp(-5*t),"#fec68d");
   content+=path("M127 169V35","#8b9da9",1)+label(132,62,"τ","#e6f8ff",19)+label(290,48,"CHARGE","#4ae3d5",14)+label(281,143,"DÉCHARGE","#fec68d",14);
   break;
 }
 case "wave":{
   content=path("M40 101H443M40 27V174","#849bad",1.5);
   let p="";for(let i=0;i<=120;i++){const x=42+i*3.3,y=102-61*Math.sin(i*2*Math.PI/60);p+=(i?"L":"M")+x.toFixed(1)+" "+y.toFixed(1)}content+=path(p,"#45e3d4",3);
   content+=path("M42 170V178M240 170V178M42 173H240","#ffbb78",2)+label(76,196,"Une période T = 20 ms","#ffca8c",16);break;
 }
 case "triangle":
   content=path("M98 155H356L98 41Z","#45e3d4",3)+label(207,179,"P : puissance active","#48e4d4",15)+label(14,87,"Q","#ffc78a",19)+label(232,81,"S : apparente","#d9c1fa",15)+label(118,146,"φ","#fff",18);break;
 case "star":
   content=path("M234 105V37M234 105L102 177M234 105L365 177M234 105V181","#ebf5ff",3);
   content+=label(242,43,"L1","#4adfce",20)+label(85,192,"L2","#ffc78a",20)+label(365,192,"L3","#c5b2ff",20)+label(241,194,"N","#b6cddb",18);
   for(const [x,y,rotate] of [[215,53,90],[140,145,-30],[301,145,30]])content+='<rect x="'+x+'" y="'+y+'" width="40" height="16" rx="2" fill="#234759" stroke="#ffbb78" transform="rotate('+rotate+" "+(x+20)+" "+(y+8)+')"/>';break;
 case "delta":
   content=path("M234 36L103 174H365Z","#e9f7ff",3);
   for(const [x,y] of [[222,75],[151,139],[308,139]])content+=rect(x-10,y-13,23,27,"#2b4657","#ffc78a");
   content+=label(222,25,"L1","#4ae3d4",19)+label(73,193,"L2","#ffc78a",19)+label(370,193,"L3","#c8b5ff",19)+label(182,202,"U élément = U ligne","#e4f5fc",14);break;
 case "bars":{
   const mx=3000;content=path("M60 21V165H439","#8ba0aa",1);
   a.forEach((lab,i)=>{const h=b[i]/mx*120,x=94+i*91;content+=rect(x,160-h,35,h,"#286b6c","#47e3d4")+label(x-13,181,lab,"#d4e2eb",13)+label(x-7,151-h,b[i]+"","#ffe4bb",14)});break;
 }
 case "kelvin":
   content='<defs><linearGradient id="temp-scale-'+ch+'" x1="0" x2="1"><stop offset="0" stop-color="#ff9a44"/><stop offset=".5" stop-color="#faf9e2"/><stop offset="1" stop-color="#c5e4ff"/></linearGradient></defs>';
   content+=rect(36,58,407,68,"url(#temp-scale-"+ch+")","#68818f");
   content+=label(48,151,"2700 K","#ffbe86",18)+label(204,151,"4000 K","#f7f8ee",18)+label(365,151,"6500 K","#bbdbff",18)+label(49,181,"CHAUD", "#ffbe86",12)+label(373,181,"FROID","#bbdbff",12);break;
 }
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 210" role="img" aria-label="'+E(title)+'" preserveAspectRatio="xMidYMid meet">'+
 '<rect width="480" height="210" rx="13" fill="#0b2636" stroke="#355766"/>'+content+'</svg>';
 return {section,title,description,svg};
}
function attach(chapter,host){
 const entries=records[chapter]||[];
 const headings=[...host.querySelectorAll("h3,h4")];
 let count=0;
 for(let n=0;n<entries.length;n++){
   const row=entries[n];
   const target=headings.find(h=>h.textContent.trim().startsWith(row[0]+" ")||h.textContent.trim()===row[0]);
   const item=fig(row,chapter,n);
   const card=document.createElement("figure");card.className="atlas-card";
   const heading=document.createElement("div");heading.className="atlas-heading";heading.textContent=item.title;
   const art=document.createElement("div");art.className="atlas-art";art.innerHTML=item.svg;
   const caption=document.createElement("figcaption");caption.textContent=item.description;
   card.append(heading,art,caption);
   if(target)target.insertAdjacentElement("afterend",card);else host.append(card);
   count++;
 }
 return count;
}
window.ElecAtlas={attach,data:records,figureCount:Object.values(records).reduce((n,rows)=>n+rows.length,0)};
})();