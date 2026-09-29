/* Évaluations professionnelles inédites : aucune épreuve officielle reproduite. */
(function(){
 "use strict";
 const KEY="ElecLearn.examHistory.v1", questions=window.ElecExamQuestions||[];
 let root=null,session=null;
 const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
 const one=s=>root.querySelector(s);
 const shuffle=arr=>{const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;};
 function getHistory(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return []}}
 function save(result){try{localStorage.setItem(KEY,JSON.stringify([result,...getHistory()].slice(0,30)))}catch(e){console.warn("Historique d'examens non enregistré",e)}}
 function mount(node,initialDomain){
   root=node;
   if(root.dataset.examReady==="yes"){if(initialDomain)showSetup(initialDomain);return;}
   root.dataset.examReady="yes";
   showSetup(initialDomain);
 }
 function showSetup(initialDomain){
   session=null;root.replaceChildren();
   const card=el("form","panel exam-setup");card.id="exam-setup-form";
   const title=el("h2","","Préparer une séance"),desc=el("p","","Choisissez un domaine et entraînez-vous sur des questions inédites. Les annales originales restent uniquement dans votre bibliothèque privée.");
   const scopeLabel=el("label","","Domaine d'entraînement");scopeLabel.htmlFor="exam-domain";
   const select=el("select");select.id="exam-domain";
   for(const d of ["Tout le programme professionnel",...new Set(questions.map(q=>q.domain))]){
     const opt=el("option","",d);opt.value=d==="Tout le programme professionnel"?"all":d;select.append(opt);
   }
   if(initialDomain && [...select.options].some(o=>o.value===initialDomain))select.value=initialDomain;
   const nlabel=el("label","","Durée de la séance");nlabel.htmlFor="exam-length";
   const length=el("select");length.id="exam-length";
   for(const n of [5,10,20,28]){
     const opt=el("option","",n+" question"+(n>1?"s":""));opt.value=n;length.append(opt);
   }
   const note=el("p","form-note","Un domaine isolé contient quatre questions pour cette première version. Les séances mixtes portent sur sept domaines.");
   const start=el("button","btn btn-primary","Démarrer la séance →");start.type="submit";
   card.append(title,desc,scopeLabel,select,nlabel,length,note,start);root.append(card);
   const history=getHistory();if(history.length){
     const recent=el("div","panel exam-history");
     recent.append(el("h2","","Mes dernières séances"));
     for(const item of history.slice(0,5)){
       const line=el("p","",new Date(item.date).toLocaleDateString("fr-CH")+" · "+item.domain+" · "+item.correct+"/"+item.total+" bonnes réponses");
       recent.append(line);
     }
     root.append(recent);
   }
   card.addEventListener("submit",e=>{e.preventDefault();begin(select.value,Number(length.value))});
 }
 function begin(domain,length){
   let selected;
   if(domain==="all"){
     const groups=[...new Set(questions.map(q=>q.domain))].map(d=>shuffle(questions.filter(q=>q.domain===d)));
     selected=[];
     while(selected.length<length&&groups.some(g=>g.length)){
       for(const g of groups)if(g.length&&selected.length<length)selected.push(g.pop());
     }
   }else selected=shuffle(questions.filter(q=>q.domain===domain)).slice(0,length);
   if(!selected.length){root.replaceChildren(el("p","empty-message","Aucune question disponible pour cette sélection."));return;}
   session={questions:selected,index:0,correct:0,errors:[],domain,answered:false};
   showQuestion();
 }
 function showQuestion(){
   if(!session)return;
   const q=session.questions[session.index];if(!q){showResults();return;}
   session.answered=false;root.replaceChildren();
   const header=el("div","exam-running-head");
   const back=el("button","btn btn-quiet","Quitter la séance");back.type="button";
   back.addEventListener("click",()=>{if(confirm("Abandonner cette séance ? Les réponses déjà données ne seront pas enregistrées."))showSetup()});
   header.append(el("span","eyebrow",q.domain+" · "+(session.index+1)+"/"+session.questions.length),back);
   const track=el("div","quiz-progress");const fill=el("span");fill.style.width=(session.index/session.questions.length*100)+"%";track.append(fill);
   const card=el("div","panel quiz-panel");
   const question=el("h2","",q.q);question.tabIndex=-1;
   card.append(question);
   if(q.figure&&window.ElecIllustrations){
     const holder=el("div","exam-figure");window.ElecIllustrations.render(q.figure,holder);card.append(holder);
   }
   const answers=el("div","quiz-options");answers.id="exam-answers";
   q.o.forEach((answer,i)=>{
     const b=el("button","quiz-option");b.type="button";b.dataset.answer=i;
     b.append(el("span","answer-index",String(i+1)),el("span","",answer));
     b.addEventListener("click",()=>choose(i));answers.append(b);
   });
   const feedback=el("div","quiz-feedback");feedback.hidden=true;feedback.id="exam-feedback";feedback.setAttribute("role","status");
   const next=el("button","btn btn-primary","Question suivante →");next.id="exam-next";next.type="button";next.hidden=true;
   next.addEventListener("click",()=>{if(!session?.answered)return;session.index++;if(session.index>=session.questions.length)showResults();else showQuestion()});
   card.append(answers,feedback,next);
   root.append(header,track,card,el("p","keyboard-hint","Touches 1 à 4 pour répondre. Aucune question officielle n'est reproduite."));
   question.focus({preventScroll:true});
 }
 function choose(index){
   if(!session||session.answered)return;
   const q=session.questions[session.index];
   if(!Number.isInteger(index)||index<0||index>=q.o.length)return;
   session.answered=true;
   const correct=index===q.a;
   if(correct)session.correct++;
   else session.errors.push(q.domain);
   one("#exam-answers").querySelectorAll("button").forEach((b,i)=>{
     b.disabled=true;
     if(i===q.a)b.classList.add("correct");
     else if(i===index)b.classList.add("incorrect");
   });
   const feedback=one("#exam-feedback");feedback.hidden=false;
   feedback.classList.toggle("incorrect",!correct);
   feedback.textContent=(correct?"Réponse correcte. ":"À revoir. ")+q.why;
   const btn=one("#exam-next");
   btn.textContent=session.index+1>=session.questions.length?"Afficher mon bilan →":"Question suivante →";
   btn.hidden=false;
   root.querySelector(".quiz-progress>span").style.width=((session.index+1)/session.questions.length*100)+"%";
 }
 function showResults(){
   if(!session)return;
   const result={date:new Date().toISOString(),domain:session.domain==="all"?"Tous les domaines":session.domain,correct:session.correct,total:session.questions.length,errors:[...new Set(session.errors)]};
   save(result);session=null;root.replaceChildren();
   const card=el("div","panel result-panel");
   const percent=Math.round(result.correct/result.total*100);
   card.append(el("p","eyebrow","ENTRAÎNEMENT TERMINÉ"),el("h2","","Résultats de la séance"),el("div","big-score",percent+" %"),
      el("p","",result.correct+" réponse(s) correcte(s) sur "+result.total+". Ce module sert à réviser : il ne délivre aucune certification officielle."));
   if(result.errors.length)card.append(el("p","", "Domaines à revoir : "+result.errors.join(", ")+"."));
   const again=el("button","btn btn-primary","Nouvel entraînement →");again.type="button";again.addEventListener("click",showSetup);
   card.append(again);root.append(card);
 }
 document.addEventListener("keydown",e=>{
   if(!root||!session||document.getElementById("examens")?.hidden||session.answered||e.altKey||e.ctrlKey||e.metaKey)return;
   if(document.activeElement?.matches("input,select,textarea"))return;
   if(/^[1-4]$/.test(e.key)){e.preventDefault();choose(Number(e.key)-1);}
 });
 window.ElecExams={mount,questionCount:questions.length,domains:[...new Set(questions.map(q=>q.domain))]};
})();