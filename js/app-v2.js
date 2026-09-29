/* ElecLearn v2 · Application statique progressive
   Les cours HTML existants sont conservés. SQLite est optionnel : la bibliothèque de
   questions originale garantit des révisions même si la base historique échoue. */
(function () {
  "use strict";
  const CHAPTERS = [
    ["Notions fondamentales","Atome, sens du courant, conducteurs et sécurité","électricité atome charges courant"],
    ["Grandeurs fondamentales","Courant, tension, résistance et loi d’Ohm","courant tension résistance ohm"],
    ["Résistance électrique et couplages","Résistivité, série, parallèle et circuits mixtes","résistivité série parallèle pont"],
    ["Énergie, puissance et rendement","Calculs énergétiques et efficacité des récepteurs","énergie puissance rendement"],
    ["Effets calorifiques du courant","Effet Joule, échauffement et densité de courant","chaleur joule thermique"],
    ["Sources chimiques de tension","Piles, accumulateurs et association des sources","batterie pile accumulateur"],
    ["Magnétisme et électromagnétisme","Flux, champ magnétique, bobines et induction","aimant flux bobine induction electromagnetisme"],
    ["Électrostatique et condensateurs","Capacité, champs électriques, charge et décharge RC","condensateur electrostatique charge capacité"],
    ["Instruments de mesure","Multimètre, oscilloscope, TI, TP et métrologie","mesure ampèremètre voltmètre TI TP"],
    ["Courant alternatif monophasé","Sinusoïdes, déphasage, impédance et puissance","sinusoïde réactance impédance fréquence"],
    ["Courant alternatif triphasé","Étoile, triangle, équilibrage et conducteur neutre","triphasé étoile triangle neutre"],
    ["Moteurs à courant alternatif","Machines synchrones et asynchrones, démarrage et glissement","moteur alternatif synchrone asynchrone"],
    ["Moteurs à courant continu","Excitation, commutation et moteurs sans balais","moteur continu dynamo brushless"],
    ["Transformateurs","Rapports de transformation, pertes, TI et TP","transformateur rapport spires tension"],
    ["Éclairage","Flux, éclairement, luminance et technologies lumineuses","lumen lux LED lampe"]
  ].map(function (r,i) {return {num:i+1,title:r[0],description:r[1],keywords:r[2],fet:i<6?1:i<10?2:3,path:"contenu/f"+(i+1)+".html"};});
  const FETS={
    1:{title:"Les fondations",desc:"Les lois de l'électricité, les circuits, l'énergie et les sources chimiques.",range:"Chapitres 01—06"},
    2:{title:"Les phénomènes",desc:"Magnétisme, condensateurs, instruments de mesure et courant alternatif monophasé.",range:"Chapitres 07—10"},
    3:{title:"Les applications",desc:"Triphasé, moteurs électriques, transformateurs et éclairage.",range:"Chapitres 11—15"}
  };
  const GLOSSARY=[
    ["Alternatif (AC)","Courant dont le sens varie au cours du temps, généralement de forme sinusoïdale."],
    ["Ampère (A)","Unité SI de l'intensité du courant électrique."],
    ["Capacité (F)","Aptitude d'un condensateur à stocker de la charge par volt de tension."],
    ["Champ magnétique (H)","Excitation magnétique exprimée en ampères par mètre."],
    ["Cos φ","Facteur de puissance d'un circuit sinusoïdal : rapport P/S."],
    ["Courant continu (DC)","Courant qui conserve le même sens de circulation."],
    ["Éclairement (lx)","Flux lumineux reçu par unité de surface, en lux."],
    ["Effet Joule","Échauffement dû au passage du courant dans une résistance : P = R I²."],
    ["Excitation","Produit du nombre de spires et du courant d'une bobine : N × I."],
    ["Farad (F)","Unité SI de capacité électrique."],
    ["Flux lumineux (lm)","Grandeur photométrique représentant le flux de lumière visible."],
    ["Flux magnétique (Wb)","Grandeur décrivant le flux du champ magnétique à travers une surface."],
    ["Fréquence (Hz)","Nombre de périodes par seconde d'un phénomène périodique."],
    ["Glissement","Écart relatif entre la vitesse synchrone du champ et celle du rotor asynchrone."],
    ["Impédance (Ω)","Opposition d'un récepteur au courant alternatif, comprenant résistance et réactance."],
    ["Induction magnétique (T)","Densité de flux magnétique, en teslas."],
    ["Kilowattheure (kWh)","Énergie consommée par une puissance de 1 kW durant une heure."],
    ["LED","Diode électroluminescente produisant de la lumière dans un semi-conducteur."],
    ["Loi d'Ohm","Relation entre tension, courant et résistance : U = R × I."],
    ["Luminance (cd/m²)","Intensité lumineuse émise ou réfléchie dans une direction par surface apparente."],
    ["Monophasé","Circuit alimenté par une seule tension alternative."],
    ["Neutre","Conducteur relié au point neutre d'un réseau, susceptible de transporter un courant de déséquilibre."],
    ["Puissance active (W)","Puissance réellement convertie en travail ou chaleur par un récepteur."],
    ["Puissance apparente (VA)","Produit des valeurs efficaces de tension et de courant en monophasé."],
    ["Puissance réactive (var)","Puissance associée aux échanges d'énergie magnétique ou électrique en régime alternatif."],
    ["Rendement (η)","Rapport de la puissance utile à la puissance absorbée."],
    ["Résistivité (ρ)","Propriété d'un matériau caractérisant sa résistance électrique."],
    ["TI","Transformateur d'intensité destiné notamment à la mesure indirecte du courant."],
    ["TP","Transformateur de tension destiné notamment à la mesure indirecte de la tension."],
    ["Triphasé","Système comprenant trois grandeurs alternatives déphasées de 120° dans le cas équilibré."]
  ];
  const STORAGE_KEY="ElecLearn.progress.v2";
  const $=id=>document.getElementById(id);
  const num=(v)=>Number.isFinite(v)?v:0;
  const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const shuffle=a=>{const r=a.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r};
  const elt=(tag,cls,value)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(value!==undefined)node.textContent=value;return node};
  let state,db=null,filter=0,query="",lessonRequest=0,session=null,lastResult=null,glossaryCache=null;
  function emptyState(){return {chapters:{},results:[],lastChapter:null};}
  function readState(){
    try{
      const raw=JSON.parse(localStorage.getItem(STORAGE_KEY));
      if(raw&&typeof raw==="object"&&!Array.isArray(raw)){
        return {chapters:raw.chapters&&typeof raw.chapters==="object"&&!Array.isArray(raw.chapters)?raw.chapters:{},
          results:Array.isArray(raw.results)?raw.results.slice(0,100):[],
          lastChapter:Number.isInteger(raw.lastChapter)&&raw.lastChapter>=1&&raw.lastChapter<=15?raw.lastChapter:null};
      }
    }catch(err){console.warn("Progression locale indisponible.",err)}
    return emptyState();
  }
  function saveState(){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
    catch(err){console.warn("Sauvegarde locale impossible.",err);$("network-status").textContent="Stockage local indisponible";}
  }
  function getChapter(id){return CHAPTERS.find(c=>c.num===Number(id));}
  function completed(c){return !!(state.chapters[c.num]&&state.chapters[c.num].best>=70);}
  function visited(c){return !!(state.chapters[c.num]&&state.chapters[c.num].visited);}
  function progressFor(fet){const list=CHAPTERS.filter(c=>c.fet===fet);return {total:list.length,visited:list.filter(visited).length,completed:list.filter(completed).length};}
  function getTitle(fet){return "F.E.T "+fet+" · "+FETS[fet].title;}
  function showView(id,nav){
    const current=document.querySelector(".view:not([hidden])");
    document.querySelectorAll(".view").forEach(s=>s.hidden=s.id!==id);
    document.querySelectorAll(".top-nav a").forEach(a=>{if(a.dataset.nav===nav)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
    if(!current || current.id!==id)window.scrollTo(0,0);
  }
  function renderHome(){
    const total=CHAPTERS.filter(completed).length;
    $("home-progress").textContent="Maîtrisés : "+total+" / 15";
    const host=$("home-fascicules");host.replaceChildren();
    for(const fet of [1,2,3]){
      const p=progressFor(fet);
      const a=elt("a","fascicule-card fet-"+fet);a.href="#/cours?fet="+fet;
      a.append(elt("span","fet-no","F.E.T "+fet+" / "+FETS[fet].range),elt("h3","",FETS[fet].title),elt("p","",FETS[fet].desc));
      if(window.ElecIllustrations){const preview=elt("div","fet-art");window.ElecIllustrations.render(({1:1,2:7,3:11})[fet],preview);a.append(preview);}
      const bottom=elt("div","card-bottom");bottom.append(elt("span","",p.visited+" parcourus · "+p.total+" chapitres"),elt("strong","",p.completed+"/"+p.total+" acquis →"));a.append(bottom);host.append(a);
    }
    const next=getChapter(state.lastChapter);
    $("continue-title").textContent=next?"Chapitre "+next.num+" · "+next.title:"Prêt pour la prochaine leçon ?";
    $("continue-description").textContent=next?"Reprenez votre apprentissage là où vous l'avez laissé.":"Choisissez un fascicule pour commencer.";
    $("continue-link").href=next?"#/cours/"+next.num:"#/cours";
    $("continue-link").textContent=next?"Reprendre le chapitre →":"Ouvrir le sommaire →";
    showView("accueil","accueil");
  }
  function renderCourses(searchParams){
    if(searchParams&&searchParams.has("fet"))filter=Math.max(0,Math.min(3,Number(searchParams.get("fet"))||0));
    $("course-search").value=query;
    document.querySelectorAll("#fet-filters button").forEach(b=>b.setAttribute("aria-pressed",String(Number(b.dataset.fet)===filter)));
    const matching=CHAPTERS.filter(c=>(!filter||c.fet===filter)&&norm(c.title+" "+c.description+" "+c.keywords+" "+c.num).includes(norm(query)));
    $("course-count").textContent=matching.length+" chapitre"+(matching.length!==1?"s":"")+" disponible"+(matching.length!==1?"s":"");
    const host=$("course-list");host.replaceChildren();
    if(!matching.length)host.append(elt("p","empty-message","Aucun chapitre ne correspond à votre recherche."));
    for(const c of matching){
      const a=elt("a","chapter-card");a.href="#/cours/"+c.num;
      a.append(elt("span","chapter-kicker","F.E.T "+c.fet+" / "+String(c.num).padStart(2,"0")),elt("h2","",c.title),elt("p","",c.description));
      const bottom=elt("div","chapter-bottom");
      bottom.append(elt("span","",completed(c)?"Acquis · réviser":visited(c)?"En cours":"À découvrir"),elt("strong","",window.ElecLabs&&window.ElecLabs.available.includes(c.num)?"LAB + COURS →":"LIRE LE COURS →"));
      a.append(bottom);host.append(a);
    }
    showView("cours","cours");
  }
  async function renderLesson(id){
    const c=getChapter(id);if(!c){location.hash="#/cours";return;}
    const request=++lessonRequest;
    $("lesson-fet").textContent="F.E.T "+c.fet;
    $("lesson-num").textContent="CHAPITRE "+String(c.num).padStart(2,"0")+" / "+FETS[c.fet].range;
    $("lesson-title").textContent=c.title;
    $("lesson-status").textContent=completed(c)?"Chapitre acquis · Vous pouvez le réviser":visited(c)?"Chapitre déjà consulté":"Nouvelle leçon";
    $("lesson-quiz-link").href=$("lesson-bottom-quiz").href="#/quiz/"+c.num;
    $("lesson-content").replaceChildren(elt("p","","Chargement de la leçon…"));
    $("toc-list").replaceChildren();
    $("lab-container").hidden=true;
    showView("lecon","cours");
    try{
      const response=await fetch(c.path);
      if(!response.ok)throw new Error("HTTP "+response.status);
      const content=await response.text();
      if(request!==lessonRequest)return;
      $("lesson-content").innerHTML=content; // HTML de cours versionné dans ce dépôt
      if(window.ElecIllustrations){
        const host=elt("div","concept-figure-wrap");
        window.ElecIllustrations.render(c.num,host);
        $("lesson-content").insertBefore(host,$("lesson-content").querySelector("h3")||$("lesson-content").firstChild);
      }
      if(c.num>=7 && window.ElecExtensions && window.ElecExtensions[c.num]){
        $("lesson-content").insertAdjacentHTML("beforeend",window.ElecExtensions[c.num]);
      }
      if(window.ElecAtlas)window.ElecAtlas.attach(c.num,$("lesson-content"));
      const headings=$("lesson-content").querySelectorAll("h3,h4");
      headings.forEach((h,i)=>{
        h.id="section-"+c.num+"-"+i;
        const b=elt("button",h.tagName==="H4"?"sublevel":"",h.textContent.trim());b.type="button";
        b.addEventListener("click",()=>h.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"}));
        $("toc-list").append(b);
      });
      if(!headings.length)$("toc-list").append(elt("span","list-caption","Lire le cours."));
      const rec=state.chapters[c.num]||{};
      rec.visited=true;state.chapters[c.num]=rec;state.lastChapter=c.num;saveState();
      $("lesson-status").textContent=completed(c)?"Chapitre acquis · Vous pouvez le réviser":"Cours consulté · Passez au quiz pour valider les acquis";
      if(window.ElecLabs)window.ElecLabs.mount(c.num,$("lab-container"));
      if(window.MathJax&&typeof window.MathJax.typesetPromise==="function")window.MathJax.typesetPromise([$("lesson-content")]).catch(console.warn);
    }catch(err){
      if(request!==lessonRequest)return;
      $("lesson-content").replaceChildren(elt("p","empty-message","Le fichier du chapitre est momentanément inaccessible. Réessayez lorsque votre connexion est disponible."));
      console.error("Chargement du chapitre "+c.num,err);
    }
  }
  async function initLegacyDB(){
    if(typeof window.initSqlJs!=="function")return;
    try{
      const SQL=await window.initSqlJs({locateFile:file=>"js/"+file});
      const response=await fetch("db/ElecLearn.db");
      if(!response.ok)throw new Error("Base SQL : HTTP "+response.status);
      db=new SQL.Database(new Uint8Array(await response.arrayBuffer()));
      glossaryCache=null;
      if(document.querySelector("#glossaire:not([hidden])"))renderGlossary();
    }catch(err){console.info("Base historique indisponible : les questions intégrées restent accessibles.",err)}
  }
  function questionsForChapter(chapter){
    const result=(window.ElecQuestions||[]).filter(q=>!chapter||q.c===chapter).map((q,i)=>({id:"original-"+q.c+"-"+i,chapter:q.c,text:q.q,options:q.o.map((s,index)=>({text:s,correct:index===q.a})),why:q.why,ref:q.ref}));
    if(!db)return result;
    try{
      const chapterRow=db.exec("SELECT id FROM Chapitres WHERE CAST(numero_chapitre AS INTEGER)="+Number(chapter)+" LIMIT 1");
      if(chapterRow.length&&chapterRow[0].values.length){
        const id=Number(chapterRow[0].values[0][0]);
        const qstmt=db.prepare("SELECT id, texte_question, explication FROM Questions WHERE chapitre_id = ? AND type_question = 'QCM'");
        qstmt.bind([id]);
        while(qstmt.step()){
          const q=qstmt.getAsObject();
          const opts=db.prepare("SELECT texte_option, est_correcte FROM OptionsReponses WHERE question_id = ?");opts.bind([q.id]);const options=[];
          while(opts.step()){const o=opts.getAsObject();options.push({text:String(o.texte_option),correct:!!o.est_correcte});}
          opts.free();
          if(options.length>=2&&options.filter(o=>o.correct).length===1)result.push({id:"legacy-"+q.id,chapter,text:String(q.texte_question),options:shuffle(options),why:String(q.explication||"Consultez la leçon correspondante."),ref:"Cours "+chapter});
        }
        qstmt.free();
      }
    }catch(err){console.info("Questionnaire historique non utilisé pour le chapitre "+chapter,err)}
    return result;
  }
  function createQuiz(scope,length,chapter){
    let questions=[];
    if(chapter){questions=shuffle(questionsForChapter(chapter)).slice(0,length||10);}
    else{
      const targets=scope?[scope]:[1,2,3];
      // Répartition alternée pour ne pas évincer les fascicules 2 et 3.
      const groups=targets.map(fet=>shuffle(CHAPTERS.filter(c=>c.fet===fet).flatMap(c=>questionsForChapter(c.num))));
      while(questions.length<length&&groups.some(g=>g.length)){
        for(const g of groups)if(g.length&&questions.length<length)questions.push(g.shift());
      }
    }
    if(!questions.length)return false;
    session={questions,index:0,correct:0,wrong:[],scope,chapter};
    showView("quiz","quiz");
    displayQuestion();
    return true;
  }
  function displayQuestion(){
    const q=session.questions[session.index];
    if(!q){finishQuiz();return}
    $("quiz-eyebrow").textContent=session.chapter?"CHAPITRE "+session.chapter:"F.E.T "+(session.scope||"1 + 2 + 3");
    $("quiz-title").textContent=session.chapter?getChapter(session.chapter).title:"Révision du programme";
    $("quiz-count-text").textContent="Question "+(session.index+1)+" sur "+session.questions.length;
    $("quiz-progress-bar").style.width=((session.index)/session.questions.length*100)+"%";
    $("quiz-reference").textContent="Chapitre "+q.chapter+" · §"+q.ref;
    $("question-text").textContent=q.text;
    const host=$("quiz-options");host.replaceChildren();
    q.options.forEach((opt,i)=>{
      const b=elt("button","quiz-option");b.type="button";b.dataset.answer=i;
      b.append(elt("span","answer-index",i+1),elt("span","",opt.text));
      b.addEventListener("click",()=>chooseAnswer(i));host.append(b);
    });
    $("quiz-feedback").hidden=true;$("quiz-feedback").className="quiz-feedback";
    $("next-question").hidden=true;$("next-question").textContent=session.index===session.questions.length-1?"Voir mon bilan →":"Question suivante →";
    $("question-text").focus({preventScroll:true});
  }
  function chooseAnswer(index){
    if(!session||session.answered)return;
    const q=session.questions[session.index];
    if(!q||!q.options[index])return;
    const right=q.options[index].correct;
    if(right)session.correct++;else session.wrong.push(q.chapter);
    session.answered=true;
    $("quiz-options").querySelectorAll("button").forEach((b,i)=>{
      b.disabled=true;
      if(q.options[i].correct)b.classList.add("correct");
      else if(i===index)b.classList.add("incorrect");
    });
    const feedback=$("quiz-feedback");feedback.hidden=false;feedback.className="quiz-feedback"+(right?"":" incorrect");
    feedback.textContent=(right?"Bonne réponse. ":"À revoir. ")+q.why;
    $("next-question").hidden=false;
    $("quiz-progress-bar").style.width=((session.index+1)/session.questions.length*100)+"%";
  }
  function finishQuiz(){
    if(!session)return;
    const score=session.correct,total=session.questions.length;
    const entry={id:Date.now(),date:new Date().toISOString(),chapter:session.chapter||null,scope:session.scope||null,correct:score,total,wrong:[...new Set(session.wrong)]};
    state.results.unshift(entry);state.results=state.results.slice(0,100);
    if(entry.chapter){
      const c=state.chapters[entry.chapter]||{};
      c.best=Math.max(num(c.best),Math.round(100*score/total));c.visited=true;
      state.chapters[entry.chapter]=c;
    }
    saveState();lastResult=entry;session=null;location.hash="#/resultats";
  }
  function renderResults(){
    const r=lastResult||state.results[0];
    if(!r){location.hash="#/quiz";return}
    const percentage=Math.round(100*r.correct/r.total);
    $("results-score").textContent=percentage+" %";
    $("results-message").textContent=r.correct+" bonnes réponses sur "+r.total+". "+(percentage>=80?"Très bonne maîtrise de cette série.":percentage>=60?"Continuez : quelques notions méritent une révision.":"Reparcourez les chapitres indiqués puis recommencez.");
    const host=$("results-details");host.replaceChildren();
    host.append(elt("span","",r.chapter?"Chapitre "+r.chapter:getScopeTitle(r.scope)));
    if(r.wrong.length)host.append(elt("span","","À revoir : chapitres "+r.wrong.join(", ")));
    if(r.chapter&&percentage>=70)host.append(elt("span","","Chapitre acquis"));
    showView("resultats","quiz");
  }
  function getScopeTitle(scope){return scope?"F.E.T "+scope:"F.E.T 1 + 2 + 3";}
  function renderProgress(){
    const studied=CHAPTERS.filter(visited).length,mastered=CHAPTERS.filter(completed).length,results=state.results;
    const average=results.length?Math.round(results.reduce((sum,r)=>sum+100*r.correct/r.total,0)/results.length):0;
    const stats=$("progress-stats");stats.replaceChildren();
    for(const [value,label] of [[studied+"/15","Chapitres consultés"],[mastered+"/15","Chapitres acquis"],[results.length?average+" %":"—","Moyenne des quiz"]]){
      const card=elt("div","stat-card");card.append(elt("strong","",value),elt("span","",label));stats.append(card);
    }
    const groups=$("progress-fascicules");groups.replaceChildren();
    for(const f of [1,2,3]){
      const p=progressFor(f);
      const row=elt("div","progress-row"),head=elt("div","progress-row-heading");
      head.append(elt("span","",getTitle(f)),elt("span","",p.completed+" / "+p.total+" maîtrisés"));
      const track=elt("div","progress-track"),fill=elt("span");fill.style.width=(100*p.completed/p.total)+"%";track.append(fill);row.append(head,track);groups.append(row);
    }
    const history=$("progress-history");history.replaceChildren();
    if(!results.length)history.append(elt("p","empty-message","Aucun résultat pour l'instant. Lancez votre première révision."));
    for(const r of results){
      const row=elt("div","history-item"),info=elt("div");
      const title=r.chapter?"Chapitre "+r.chapter+" · "+(getChapter(r.chapter)?.title||""):"Révision · "+getScopeTitle(r.scope);
      info.append(elt("strong","",title),elt("small","",new Date(r.date).toLocaleString("fr-CH",{dateStyle:"medium",timeStyle:"short"})));
      row.append(info,elt("span","history-score",r.correct+"/"+r.total+" · "+Math.round(100*r.correct/r.total)+" %"));history.append(row);
    }
    showView("progression","progression");
  }
  function getGlossary(){
    if(glossaryCache)return glossaryCache;
    const dictionary=new Map(GLOSSARY.map(([term,definition])=>[norm(term),{term,definition}]));
    if(db){
      try{
        const rows=db.exec("SELECT terme,definition FROM Glossaire ORDER BY terme");
        if(rows.length)for(const row of rows[0].values){
          const term=String(row[0]||"").trim(),definition=String(row[1]||"").trim();
          if(term&&definition&&!dictionary.has(norm(term)))dictionary.set(norm(term),{term,definition});
        }
      }catch(err){console.info("Glossaire historique indisponible.",err)}
    }
    return glossaryCache=[...dictionary.values()].sort((a,b)=>a.term.localeCompare(b.term,"fr"));
  }
  function renderGlossary(){
    const search=norm($("glossary-search").value);
    const data=getGlossary().filter(i=>norm(i.term+" "+i.definition).includes(search));
    $("glossary-count").textContent=data.length+" terme"+(data.length!==1?"s":"");
    const host=$("glossary-list");host.replaceChildren();
    for(const item of data){const card=elt("div","glossary-entry");card.append(elt("dt","",item.term),elt("dd","",item.definition));host.append(card)}
    if(!data.length)host.append(elt("p","empty-message","Aucun terme trouvé."));
    showView("glossaire","bibliotheque");
  }
  function updateNetwork(){
    const node=$("network-status");node.classList.toggle("offline",navigator.onLine===false);
    node.textContent=navigator.onLine===false?"Mode hors connexion":"Cours disponibles";
  }
  function route(){
    if(location.hash==="#main"){$("main").focus();return;}
    const raw=(location.hash||"#/accueil").replace(/^#\/?/,"");
    const [path,qs]=raw.split("?");
    const [view,arg]=path.split("/");
    const params=new URLSearchParams(qs||"");
    if(!(view==="cours"&&arg))lessonRequest++;
    if(view==="accueil"||!view)renderHome();
    else if(view==="cours"&&arg){renderLesson(arg);}
    else if(view==="cours")renderCourses(params);
    else if(view==="quiz"&&arg&&getChapter(arg)){if(!createQuiz(0,10,Number(arg)))location.hash="#/quiz";}
    else if(view==="quiz"){showView("quiz-setup","quiz");}
    else if(view==="resultats")renderResults();
    else if(view==="progression")renderProgress();
    else if(view==="glossaire")renderGlossary();
    else if(view==="bibliotheque"){showView("bibliotheque","bibliotheque");window.ElecLibrary?.mount($("library-host"));}
    else if(view==="examens"){showView("examens","bibliotheque");window.ElecExams?.mount($("exam-host"),params.get("d"));}
    else location.hash="#/accueil";
  }
  function init(){
    state=readState();
    $("course-search").addEventListener("input",e=>{query=e.target.value;renderCourses();});
    $("fet-filters").addEventListener("click",e=>{const b=e.target.closest("button[data-fet]");if(b){filter=Number(b.dataset.fet);renderCourses();}});
    $("glossary-search").addEventListener("input",renderGlossary);
    $("quiz-form").addEventListener("submit",e=>{
      e.preventDefault();
      const scope=Number($("quiz-scope").value),length=Number($("quiz-length").value);
      if(!createQuiz(scope,length,null))alert("Aucune question disponible pour ce choix.");
    });
    $("next-question").addEventListener("click",()=>{
      if(!session||!session.answered)return;
      session.answered=false;
      session.index++;
      if(session.index>=session.questions.length)finishQuiz();else displayQuestion();
    });
    $("clear-progress").addEventListener("click",()=>{
      if(!confirm("Effacer définitivement tous les résultats et les chapitres parcourus sur cet appareil ?"))return;
      state=emptyState();lastResult=null;
      try{localStorage.removeItem(STORAGE_KEY)}catch(err){console.warn(err)}
      renderProgress();
    });
    document.addEventListener("keydown",e=>{
      if(!session||$("quiz").hidden||session.answered||document.activeElement?.matches("input,select,textarea")||e.altKey||e.ctrlKey||e.metaKey)return;
      if(/^[1-4]$/.test(e.key)){const index=Number(e.key)-1;if(index<session.questions[session.index].options.length){e.preventDefault();chooseAnswer(index);}}
    });
    window.addEventListener("hashchange",route);
    window.addEventListener("online",updateNetwork);
    window.addEventListener("offline",updateNetwork);
    updateNetwork();
    if(!location.hash)location.replace(location.pathname+location.search+"#/accueil");
    else route();
    initLegacyDB();
    if("serviceWorker" in navigator&&location.protocol!=="file:")navigator.serviceWorker.register("./sw.js").catch(err=>console.info("Installation hors connexion indisponible.",err));
  }
  window.ElecApp={chapters:CHAPTERS,getChapter,progressFor,normalise:norm};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();