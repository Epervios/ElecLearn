/* ElecLearn : bibliothèque immédiatement utilisable + PDF privés en stockage local.
   Les supports importés restent sur cet appareil ; aucun contenu tiers n'est publié. */
(function(){
"use strict";
const DB="eleclearn-private-documents",STORE="documents";
const themes=[
 ["Installation","Installations et matériaux","Conducteurs, résistances, échauffement et mesures.",[1,3,5,9],3],
 ["Énergie","Production et énergie","Puissance, rendement, transport et transformation.",[4,10,11,14],14],
 ["Réglementation","Sécurité et contrôles","Principes de sécurité et instruments. Vérifiez les exigences dans les textes officiels en vigueur.",[1,5,9,11],9],
 ["Réseaux","Signaux et télématique","Fondements électriques utiles aux signaux et télécommunications.",[7,8,10],10],
 ["Dessin","Dessin et schémas électriques","Circuits, couplages, mesure et machines.",[2,3,9,11,12],11],
 ["Mathématiques","Mathématiques techniques","Loi d'Ohm, puissance, alternatif et calcul triphasé.",[2,3,4,10,11],2],
 ["Machines","Machines électriques","Champ magnétique, moteurs AC/DC et transformateurs.",[7,11,12,13,14],12]
];
const categories=[...themes.map(t=>t[0]),"Examens","Autres"];
let root=null,ready=false,connection=null,temporary=false,memory=new Map(),data=[],query="",topic="all",catalogQuery="",previewUrl=null;
const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
const at=(s)=>root.querySelector(s);
const normal=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const status=(msg,bad=false)=>{const n=at("#library-status");if(n){n.textContent=msg;n.classList.toggle("library-error",bad)}};
function classify(name){
 if(/(?:^|[ /_])20\d{2}[-_ /]|_(ELM|PELE)_|(?:examen|annale|epreuve|épreuve)/i.test(name))return "Examens";
 if(/nibt|oibt/i.test(name))return "Réglementation";
 if(/sch[eé]ma|dessin/i.test(name))return "Dessin";
 if(/t[eé]l[eé]m|t[eé]l[eé]com|r[eé]seau/i.test(name))return "Réseaux";
 if(/math/i.test(name))return "Mathématiques";
 if(/moteur|machine/i.test(name))return "Machines";
 if(/production|transpor|[eé]nergie/i.test(name))return "Énergie";
 if(/mat[eé]r|c[aâ]ble|isolant|install/i.test(name))return "Installation";
 return "Autres";
}
function localOnly(error){
 if(!temporary)for(const doc of data)memory.set(doc.key,doc);
 temporary=true;
 const box=at("#library-storage");
 if(box)box.textContent="Mode temporaire : vous pouvez consulter et importer des PDF, mais les nouveaux documents seront perdus au rechargement. "+(error?.message||"");
}
function openDatabase(){
 if(connection)return connection;
 connection=new Promise((resolve,reject)=>{
   if(!("indexedDB" in window)){reject(Error("IndexedDB non disponible"));return}
   const request=indexedDB.open(DB,1);
   request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(STORE))request.result.createObjectStore(STORE,{keyPath:"key"})};
   request.onsuccess=()=>resolve(request.result);
   request.onerror=()=>reject(request.error||Error("Stockage local non autorisé"));
   request.onblocked=()=>reject(Error("Une autre fenêtre bloque l'accès au stockage. Fermez-la puis réessayez."));
 }).catch(err=>{connection=null;throw err});
 return connection;
}
async function storage(op,value){
 if(temporary){if(op==="all")return [...memory.values()];if(op==="put")memory.set(value.key,value);if(op==="delete")memory.delete(value);return}
 try{
   const db=await openDatabase();
   return await new Promise((resolve,reject)=>{
     const tx=db.transaction(STORE,op==="all"?"readonly":"readwrite");
     const store=tx.objectStore(STORE);
     const req=op==="all"?store.getAll():op==="put"?store.put(value):store.delete(value);
     let answer;req.onsuccess=()=>answer=req.result;
     req.onerror=()=>reject(req.error);tx.onerror=()=>reject(tx.error);
     tx.oncomplete=()=>resolve(answer);
   });
 }catch(err){
   localOnly(err);return storage(op,value);
 }
}
function closePreview(){
 const pane=at("#library-preview");
 if(pane){pane.hidden=true;pane.querySelector("iframe").removeAttribute("src")}
 if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null}
}
function renderCatalog(){
 const host=at("#library-catalog");host.replaceChildren();
 const filtered=themes.filter(t=>normal(t.slice(0,3).join(" ")+t[3].map(c=>window.ElecApp?.getChapter(c)?.title||"").join(" ")).includes(normal(catalogQuery).trim()));
 for(const [tag,title,description,chapters,cover] of filtered){
   const card=el("article","catalog-card"),art=el("div","catalog-art"),body=el("div","catalog-body"),links=el("div","catalog-links");
   if(window.ElecIllustrations)window.ElecIllustrations.render(cover,art);
   body.append(el("span","eyebrow",tag),el("h3","",title),el("p","",description));
   for(const chapter of chapters){
     const entry=window.ElecApp?.getChapter(chapter);
     if(!entry)continue;
     const a=el("a","catalog-chapter",String(chapter).padStart(2,"0")+" · "+entry.title);
     a.href="#/cours/"+chapter;links.append(a);
   }
   const revision=el("a","text-link","Révisions de cette matière →");
   revision.href="#/examens?d="+encodeURIComponent(tag);
   links.append(revision);body.append(links);card.append(art,body);host.append(card);
 }
 if(!filtered.length)host.append(el("p","empty-message","Aucune matière trouvée."));
}
function renderDocs(){
 const host=at("#library-documents");host.replaceChildren();
 const results=data.filter(d=>(topic==="all"||topic===d.group)&&normal(d.name+" "+d.group+" "+d.year).includes(normal(query))).sort((a,b)=>b.year.localeCompare(a.year)||a.name.localeCompare(b.name,"fr"));
 at("#library-count").textContent=data.length+" PDF privé"+(data.length===1?"":"s")+" · "+results.length+" affiché"+(results.length===1?"":"s");
 if(!results.length){host.append(el("p","empty-message",data.length?"Aucun document trouvé pour ce filtre.":"Aucun PDF personnel importé. Les cours illustrés et exercices du haut de cette page sont déjà accessibles."));return}
 for(const d of results){
   const card=el("div","document-card"),info=el("div","document-info"),controls=el("div","document-actions");
   info.append(el("span","tag",d.group),el("strong","",d.name),
       el("small","",(d.year?d.year+" · ":"")+(d.blob.size/1048576).toLocaleString("fr-CH",{maximumFractionDigits:1})+" Mo"));
   const view=el("button","btn btn-secondary","Afficher PDF"),remove=el("button","btn btn-quiet","Retirer");
   view.type=remove.type="button";
   view.addEventListener("click",()=>{
     closePreview();previewUrl=URL.createObjectURL(d.blob);
     const pane=at("#library-preview");pane.hidden=false;
     pane.querySelector("h3").textContent=d.name;
     pane.querySelector("iframe").src=previewUrl;
     pane.querySelector("a").href=previewUrl;
     pane.scrollIntoView({behavior:"smooth",block:"start"});
   });
   remove.addEventListener("click",async()=>{
     if(!confirm("Retirer ce PDF de votre bibliothèque locale ?"))return;
     closePreview();
     try{await storage("delete",d.key);status("Document retiré.");await refresh();}
     catch(err){status("Suppression impossible : "+err.message,true)}
   });
   controls.append(view,remove);card.append(info,controls);host.append(card);
 }
}
async function refresh(){
 data=await storage("all");renderDocs();
 const box=at("#library-storage");
 if(box&&!temporary)box.textContent="Stockage local actif : vos PDF importés sont conservés dans ce navigateur.";
}
async function importFiles(files){
 const incoming=[...files||[]],items=incoming.filter(f=>/\.pdf$/i.test(f.name)||f.type==="application/pdf"),zips=incoming.filter(f=>/\.zip$/i.test(f.name)||f.type==="application/zip");
 let imported=0,failures=[];
 if(!items.length&&!zips.length){status("Sélectionnez au moins un fichier PDF ou ZIP.",true);return}
 for(const file of zips){
   status("Extraction locale : "+file.name);
   try{
     if(!window.ElecZip)throw Error("Décompresseur non chargé");
     items.push(...await window.ElecZip.extract(file));
   }catch(err){failures.push(file.name+" : "+err.message)}
 }
 for(const file of items){
   status("Import local "+(imported+1)+"/"+items.length+" : "+file.name);
   try{
     const signature=await file.slice(0,5).text();
     if(signature!=="%PDF-")throw Error("En-tête PDF invalide");
     const key=(file._archivePath||file.name)+"::"+file.size+"::"+file.lastModified;
     await storage("put",{key,name:file.name,blob:file,group:classify(file.name),year:(file.name.match(/20\d{2}/)||[])[0]||"",imported:Date.now()});
     imported++;
   }catch(err){failures.push(file.name+" : "+(err.message||String(err)))}
 }
 at("#library-file").value="";
 await refresh();
 if(failures.length)status(imported+" PDF importés ; "+failures.length+" échec(s). "+failures.slice(0,2).join(" · "),true);
 else if(temporary)status(imported+" PDF ouverts en mode temporaire. Conservez vos originaux : ils disparaîtront de cette bibliothèque au rechargement.");
 else status(imported+" PDF importés et conservés localement dans ce navigateur.");
}
function mount(node){
 root=node;
 if(ready){refresh().catch(err=>status(err.message,true));return}
 ready=true;
 const intro=el("div","library-feature-head");
 intro.append(el("span","eyebrow","COURS DISPONIBLES SANS IMPORT"),el("h2","","Un seul programme, toutes professions"),
   el("p","","Accédez directement aux notions communes : cours, schémas et exercices. Les supports PDF personnels sont facultatifs."));
 const filter=el("label","search-field catalog-search"),searchInput=el("input");searchInput.type="search";
 filter.append(el("span","sr-only","Rechercher une matière"),searchInput);
 searchInput.placeholder="Rechercher une matière ou une notion…";searchInput.value=catalogQuery;
 const catalog=el("div","library-catalog");catalog.id="library-catalog";
 node.append(intro,filter,catalog);
 const section=el("div","library-feature-head");
 section.append(el("span","eyebrow","SUPPORTS PERSONNELS"),el("h2","","Ajouter des documents à votre bibliothèque"),
     el("p","","Importez vos PDF ou une archive ZIP pour les consulter localement. Aucun document n'est envoyé au serveur."));
 const upload=el("div","panel library-upload");
 upload.innerHTML='<label class="btn btn-primary" for="library-file">Importer PDF ou ZIP</label><input class="sr-only" type="file" id="library-file" accept=".pdf,.zip,application/pdf,application/zip" multiple><p>Sélection multiple ou glisser-déposer ; les annales des différentes professions sont regroupées par matière.</p><p id="library-status" class="list-caption" role="status" aria-live="polite">Prêt à importer.</p><p id="library-storage" class="list-caption"></p>';
 const toolbar=el("div","toolbar library-toolbar");
 toolbar.innerHTML='<label class="search-field"><span class="sr-only">Recherche dans les documents</span><input id="library-search" type="search" placeholder="Nom, année, matière…"></label><label class="sr-only" for="library-group">Filtrer les documents par matière</label><select id="library-group"><option value="all">Toutes les matières</option>'+categories.map(c=>'<option value="'+c+'">'+c+'</option>').join("")+'</select>';
 const count=el("p","list-caption");count.id="library-count";
 const preview=el("section","panel library-preview");preview.id="library-preview";preview.hidden=true;
 preview.innerHTML='<div class="library-preview-head"><h3></h3><div><a class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Ouvrir en plein écran ↗</a><button type="button" class="btn btn-quiet" id="library-close">Fermer</button></div></div><iframe title="Aperçu de votre PDF" loading="lazy"></iframe>';
 const docs=el("div","library-documents");docs.id="library-documents";
 node.append(section,upload,toolbar,count,preview,docs);
 const diagnostic=el("button","btn btn-secondary","Vérifier ma bibliothèque");
 diagnostic.type="button";diagnostic.id="library-diagnostic";
 diagnostic.addEventListener("click",async()=>{
   status("Vérification du stockage en cours…");
   try{
     const key="__eleclearn_check__",blob=new Blob(["%PDF-1.4\n%%EOF"],{type:"application/pdf"});
     await storage("put",{key,name:"test",blob,group:"Autres",year:"",imported:Date.now()});
     await storage("delete",key);
     await refresh();
     status(temporary?"Catalogue opérationnel ; stockage permanent indisponible, import temporaire seulement.":"Catalogue, import et stockage local opérationnels.");
   }catch(err){status("Diagnostic : "+(err?.message||err),true)}
 });
 upload.append(diagnostic);
 searchInput.addEventListener("input",e=>{catalogQuery=e.target.value;renderCatalog()});
 at("#library-search").addEventListener("input",e=>{query=e.target.value;renderDocs()});
 at("#library-group").addEventListener("change",e=>{topic=e.target.value;renderDocs()});
 at("#library-file").addEventListener("change",e=>importFiles(e.target.files).catch(err=>status(err.message,true)));
 upload.addEventListener("dragover",e=>{e.preventDefault();upload.classList.add("library-drag")});
 upload.addEventListener("dragleave",()=>upload.classList.remove("library-drag"));
 upload.addEventListener("drop",e=>{e.preventDefault();upload.classList.remove("library-drag");importFiles(e.dataTransfer?.files).catch(err=>status(err.message,true))});
 at("#library-close").addEventListener("click",closePreview);
 renderCatalog();refresh().catch(err=>status(err.message,true));
}
window.ElecLibrary={mount,classification:classify,subjects:themes.map(t=>t[0]),get temporary(){return temporary}};
})();