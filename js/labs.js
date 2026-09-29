/* Laboratoires originaux : modèles théoriques de simulation, aucune manipulation sous tension. */
(function () {
  "use strict";
  const nf = new Intl.NumberFormat("fr-CH", {maximumFractionDigits:2});
  const n = (x) => nf.format(x);
  const svg = (body, label) => '<svg viewBox="0 0 440 230" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>';
  const text = (x,y,t,size=13,fill="#bbd6e0") => '<text x="'+x+'" y="'+y+'" fill="'+fill+'" font-size="'+size+'" font-family="system-ui,sans-serif">'+t+'</text>';
  const line = (x1,y1,x2,y2,col="#38576c",w=1) => '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+col+'" stroke-width="'+w+'"/>';
  const card = (label,value) => ({label,value});
  const labs = {
    2:{
      title:"Loi d'Ohm en direct",intro:"Changez la tension et la résistance. Observez immédiatement le courant et la puissance dissipée dans ce récepteur idéal.",
      controls:[["u","Tension U","V",5,240,5,24],["r","Résistance R","Ω",5,200,5,24]],
      calc(v){const i=v.u/v.r;return{values:[card("Intensité I",n(i)+" A"),card("Puissance P",n(v.u*i)+" W")],note:"I = U/R et P = U × I. Ces valeurs concernent un récepteur purement résistif."}},
      chart(v){const i=v.u/v.r;const w=Math.min(350,350*i/12);return svg('<rect x="40" y="70" width="350" height="53" rx="9" fill="#173549" stroke="#42647a"/><rect x="40" y="70" width="'+w+'" height="53" rx="9" fill="#43e3d3"/>'+text(40,48,"Courant calculé · échelle 0–12 A",15)+text(40,153,n(i)+" A",27,"#43e3d3")+text(40,196,"La largeur est proportionnelle au courant.",12),"Barre du courant en fonction de la tension et de la résistance");}
    },
    7:{
      title:"Champ magnétique d'une bobine",intro:"Expérimentez l'excitation N × I et le champ H d'une bobine longue idéale sans noyau.",
      controls:[["turns","Nombre de spires N","",100,1200,100,500],["i","Courant I","A",.1,2,.1,.5],["length","Longueur de bobine","m",.2,2,.1,1]],
      calc(v){const h=v.turns*v.i/v.length,b=4*Math.PI*1e-7*h*1000;return{values:[card("Excitation N × I",n(v.turns*v.i)+" A·t"),card("Champ H",n(h)+" A/m"),card("Induction B (air)",n(b)+" mT")],note:"Approximation d'un solénoïde long : H ≈ NI/l ; B = μ₀H. Les noyaux ferromagnétiques demandent un modèle tenant compte de la saturation."}},
      chart(v){const width=270,windings=Math.max(5,Math.min(16,Math.round(v.turns/75)));let loops="";for(let j=0;j<windings;j++){const x=86+j*(width/(windings-1));loops+='<ellipse cx="'+x+'" cy="111" rx="15" ry="53" fill="none" stroke="#ffbf80" stroke-width="3"/>';}const strength=Math.min(8,Math.sqrt(v.i*v.turns/200));return svg('<path d="M68 111H370" stroke="#657d8c" stroke-width="24" stroke-linecap="round"/>'+loops+'<path d="M25 111H414" stroke="#43e3d3" stroke-width="'+strength+'" stroke-dasharray="9 5"/>'+text(72,32,"Champ magnétique axial →",15,"#43e3d3")+text(170,211,"Bobine schématique",13),"Bobine idéale et champ magnétique axial");}
    },
    8:{
      title:"Charge d'un condensateur RC",intro:"Faites avancer le temps et observez la charge d'un condensateur idéal sous 12 V.",
      controls:[["r","Résistance R","kΩ",1,100,1,10],["c","Capacité C","µF",10,1000,10,100],["t","Temps écoulé","τ",0,5,.1,1]],
      calc(v){const tau=v.r*v.c/1000,percent=100*(1-Math.exp(-v.t));return{values:[card("Constante τ",n(tau)+" s"),card("Temps écoulé",n(v.t*tau)+" s"),card("Tension du condensateur",n(12*percent/100)+" V"),card("Charge",n(percent)+" %")],note:"Uᴄ(t) = 12 × (1 − e⁻ᵗ/τ). On suppose que le condensateur est initialement déchargé."}},
      chart(v){let path="";for(let i=0;i<=100;i++){const t=5*i/100,x=36+i*3.7,y=192-154*(1-Math.exp(-t));path+=(i?"L":"M")+x.toFixed(1)+" "+y.toFixed(1)+" ";}const tx=36+74*v.t,ty=192-154*(1-Math.exp(-v.t));return svg(line(36,38,36,192)+line(36,192,408,192)+'<path d="'+path+'" fill="none" stroke="#43e3d3" stroke-width="3"/>'+line(tx,ty,tx,192,"#a9a1ff",1.7)+'<circle cx="'+tx+'" cy="'+ty+'" r="6" fill="#a9a1ff"/>'+text(39,31,"Tension de charge · 0 à 5τ",15)+text(365,215,"t / τ",13)+text(5,46,"12 V",13),"Courbe exponentielle de charge d'un condensateur");}
    },
    10:{
      title:"Oscilloscope monophasé",intro:"Variez la fréquence et la valeur efficace d'une tension sinusoïdale. Le tracé couvre 40 millisecondes.",
      controls:[["f","Fréquence","Hz",25,100,5,50],["u","Tension efficace","V",50,250,10,230]],
      calc(v){return{values:[card("Période T",n(1000/v.f)+" ms"),card("Valeur de crête Û",n(v.u*Math.SQRT2)+" V"),card("Pulsation ω",n(2*Math.PI*v.f)+" rad/s")],note:"u(t) = √2 × Ueff × sin(2πft). Le tracé normalise verticalement l'amplitude pour rester lisible."}},
      chart(v){let path="";for(let i=0;i<=400;i+=2){const t=i/400*.04,y=111-80*Math.sin(2*Math.PI*v.f*t);path+=(i?"L":"M")+(24+i*.95).toFixed(1)+" "+y.toFixed(1)+" ";}return svg('<path d="M24 111H404M24 24V202" stroke="#547083" stroke-dasharray="4 4"/>'+[0,1,2,3,4].map(j=>line(24+j*95,24,24+j*95,202,"#29495b")).join("")+'<path d="'+path+'" fill="none" stroke="#43e3d3" stroke-width="2.5"/>'+text(25,21,"u(t)",14)+text(360,220,"40 ms",13),"Tension sinusoïdale sur une durée de 40 millisecondes");}
    },
    11:{
      title:"Équilibrage triphasé",intro:"Modifiez trois charges résistives raccordées en étoile avec neutre. Visualisez le courant de chaque phase et le courant résultant dans le neutre.",
      controls:[["r1","Résistance L1","Ω",30,300,10,100],["r2","Résistance L2","Ω",30,300,10,100],["r3","Résistance L3","Ω",30,300,10,100]],
      calc(v){const i1=230/v.r1,i2=230/v.r2,i3=230/v.r3,re=i1-.5*i2-.5*i3,im=Math.sqrt(3)/2*(i2-i3);return{values:[card("Courant L1",n(i1)+" A"),card("Courant L2",n(i2)+" A"),card("Courant L3",n(i3)+" A"),card("Courant neutre",n(Math.hypot(re,im))+" A")],note:"Modèle de charges purement résistives sous 230 V phase-neutre, espacées de 120°. Le courant dans le neutre est l'opposé de la somme vectorielle des trois courants de phase."}},
      chart(v){const cx=214,cy=113,s=29;const vector=(amp,angle,color,label)=>{const x=cx+Math.cos(angle)*amp*s,y=cy-Math.sin(angle)*amp*s;return line(cx,cy,x,y,color,3)+'<circle cx="'+x+'" cy="'+y+'" r="4" fill="'+color+'"/>'+text(x+5,y-5,label,13,color)};const i1=230/v.r1,i2=230/v.r2,i3=230/v.r3,re=i1-.5*i2-.5*i3,im=Math.sqrt(3)/2*(i2-i3);return svg('<circle cx="'+cx+'" cy="'+cy+'" r="89" stroke="#29495a" fill="none"/>'+line(cx-112,cy,cx+112,cy)+line(cx,cy-102,cx,cy+102)+vector(i1,0,"#43e3d3","L1")+vector(i2,2*Math.PI/3,"#b6a8ff","L2")+vector(i3,4*Math.PI/3,"#ffbf80","L3")+vector(Math.hypot(re,im),Math.atan2(-im,-re),"#fff","N"),"Diagramme vectoriel des courants triphasés et du neutre");}
    },
    12:{
      title:"Vitesse et glissement moteur",intro:"Explorez la relation entre la fréquence réseau, le nombre de pôles et la vitesse d'un moteur asynchrone.",
      controls:[["f","Fréquence d'alimentation","Hz",30,70,5,50],["p","Paires de pôles","",1,6,1,2],["slip","Glissement","%",0,10,.5,2]],
      calc(v){const ns=60*v.f/v.p,rotor=ns*(1-v.slip/100);return{values:[card("Vitesse synchrone",n(ns)+" tr/min"),card("Vitesse rotor",n(rotor)+" tr/min"),card("Différence",n(ns-rotor)+" tr/min")],note:"nₛ = 60f/p, puis n = nₛ × (1 − s). Le comportement réel dépend aussi de la charge et du variateur éventuel."}},
      chart(v){const ns=60*v.f/v.p;const rotor=ns*(1-v.slip/100);return svg(text(28,35,"Vitesse du champ tournant",16)+text(28,122,"Vitesse du rotor",16)+'<rect x="29" y="47" width="'+(360*ns/4200)+'" height="33" fill="#43e3d3" rx="5"/><rect x="29" y="135" width="'+(360*rotor/4200)+'" height="33" fill="#b6a8ff" rx="5"/>'+text(30,207,"Échelle de référence : 0 à 4200 tr/min",12),"Comparaison des vitesses du champ tournant et du rotor");}
    },
    14:{
      title:"Transformateur idéal",intro:"Ajustez le rapport de transformation. Le modèle suppose des pertes négligeables et une alimentation primaire de 230 V AC.",
      controls:[["n1","Spires du primaire N₁","",100,2000,100,1000],["n2","Spires du secondaire N₂","",100,2000,100,500]],
      calc(v){const ratio=v.n2/v.n1;return{values:[card("Rapport N₂/N₁",n(ratio)),card("Tension secondaire U₂",n(230*ratio)+" V"),card("Tension primaire U₁","230 V")],note:"Pour un transformateur idéal : U₂/U₁ = N₂/N₁. Les pertes et la saturation ne sont pas représentées."}},
      chart(v){const p=Math.round(v.n1/120),s=Math.round(v.n2/120);let coils="";for(let i=0;i<p;i++){coils+='<ellipse cx="'+(105+i*8)+'" cy="111" rx="5" ry="40" stroke="#43e3d3" fill="none" stroke-width="2"/>'}for(let j=0;j<s;j++){coils+='<ellipse cx="'+(304+j*8)+'" cy="111" rx="5" ry="40" stroke="#ffbf80" fill="none" stroke-width="2"/>'}return svg('<rect x="74" y="47" width="300" height="125" fill="none" stroke="#6d8995" stroke-width="17" rx="14"/>'+coils+text(92,29,"PRIMAIRE",13,"#43e3d3")+text(302,29,"SECONDAIRE",13,"#ffbf80")+text(95,204,"230 V AC",16,"#43e3d3")+text(302,204,n(230*v.n2/v.n1)+" V",16,"#ffbf80"),"Schéma simplifié du transformateur et des deux enroulements");}
    },
    15:{
      title:"Étude d'éclairage",intro:"Évaluez l'éclairement théorique moyen d'une surface et l'efficacité lumineuse d'une source.",
      controls:[["flux","Flux utile reçu","lm",200,6000,100,1200],["area","Surface éclairée","m²",2,60,2,12],["power","Puissance électrique","W",5,100,5,15]],
      calc(v){return{values:[card("Éclairement moyen",n(v.flux/v.area)+" lx"),card("Efficacité calculée",n(v.flux/v.power)+" lm/W")],note:"Modèle uniforme idéal : E = Φreçu/A. L'efficacité calculée est ici un ratio flux utile reçu/puissance ; elle inclut donc implicitement les pertes de distribution lumineuse."}},
      chart(v){const lx=v.flux/v.area,light=Math.max(.08,Math.min(1,lx/500));return svg('<rect x="75" y="31" width="290" height="157" rx="14" fill="#203b4c" stroke="#647e8b"/><rect x="87" y="43" width="266" height="133" rx="8" fill="#ffdc87" fill-opacity="'+light+'"/>'+text(145,105,n(lx)+" lx",31,"#f5f9ff")+text(145,135,"Éclairement moyen",13,"#f5f9ff")+text(95,215,"Représentation qualitative uniquement",12),"Surface éclairée dont la luminosité représente l'éclairement théorique");}
    }
  };
  function mount(chapter,host) {
    const def=labs[chapter];
    host.replaceChildren();
    host.hidden=!def;
    if(!def)return;
    const title=document.createElement("div");
    title.className="lab-heading";
    title.innerHTML='<div><p class="eyebrow">LABORATOIRE INTERACTIF · CHAPITRE '+chapter+'</p><h2>'+def.title+'</h2><p>'+def.intro+'</p></div><span class="tag">Simulation</span>';
    const grid=document.createElement("div");
    grid.className="lab-grid";
    const controls=document.createElement("div");controls.className="lab-controls";
    const output=document.createElement("div");output.className="lab-output";
    const inputs={};
    for(const [id,label,unit,min,max,step,initial] of def.controls){
      const wrap=document.createElement("div");wrap.className="lab-control";
      const lbl=document.createElement("label");lbl.htmlFor="lab-"+id;lbl.append(document.createTextNode(label));
      const value=document.createElement("output");value.htmlFor=lbl.htmlFor;lbl.appendChild(value);
      const input=document.createElement("input");
      input.type="range";input.id=lbl.htmlFor;input.min=min;input.max=max;input.step=step;input.value=initial;
      wrap.append(lbl,input);controls.appendChild(wrap);
      inputs[id]={input,value,unit};
    }
    grid.append(controls,output);host.append(title,grid);
    function update(){
      const v={};
      for(const [id,item] of Object.entries(inputs)){v[id]=Number(item.input.value);item.value.textContent=n(v[id])+(item.unit?" "+item.unit:"");}
      const result=def.calc(v);
      output.innerHTML=def.chart(v)+'<div class="lab-values"></div><p class="lab-note"></p>';
      const cells=output.querySelector(".lab-values");
      for(const val of result.values){const el=document.createElement("div");el.className="lab-value";const small=document.createElement("small");small.textContent=val.label;const strong=document.createElement("strong");strong.textContent=val.value;el.append(small,strong);cells.appendChild(el)}
      output.querySelector(".lab-note").textContent=result.note+" Simulation théorique : ne pas reproduire sur une installation sous tension.";
    }
    for(const item of Object.values(inputs))item.input.addEventListener("input",update);
    update();
  }
  window.ElecLabs={mount,available:Object.keys(labs).map(Number)};
})();