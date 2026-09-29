/* Bibliothèque PRIVÉE : les fichiers importés sont stockés dans IndexedDB
   sur l'appareil de l'utilisateur, jamais inclus dans le dépôt ou transmis. */
(function(){
 "use strict";
 const DATABASE="eleclearn-private-documents", STORE="documents", VERSION=1;
 const groups=[
   {tag:"Installation",title:"Matériaux et techniques",description:"Métaux, isolants, câbles, dispositifs de protection et appareillage."},
   {tag:"Énergie",title:"Production et distribution",description:"Production d'énergie, transport, transformation et installations électriques."},
   {tag:"Réglementation",title:"Contrôles OIBT et NIBT 2025",description:"Principes, vérifications et recherche dans les prescriptions en vigueur."},
   {tag:"Réseaux",title:"Télécommunication et télématique",description:"Transmission cuivre, fibre optique, systèmes numériques et réseaux."},
   {tag:"Dessin",title:"Dessins professionnels I et II",description:"Schémas de principe, circuits de commande, plans de raccordement et de force."},
   {tag:"Mathématiques",title:"Mathématiques techniques",description:"Unités, puissances de dix, trigonométrie, vecteurs et calculs électriques."},
   {tag:"Examens",title:"Annales de formation CFC",description:"Épreuves historiques : distinguez électricien de montage et planificateur-électricien."}
 ];
 const $=(root,s)=>root.querySelector(s);
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 let dbPromise=null,root=null,initialised=false,search="",category="all",objectUrl=null,loaded=[];
 function openDB(){
   if(!("indexedDB" in window))return Promise.reject(Error("IndexedDB indisponible dans ce navigateur."));
   if(dbPromise)return dbPromise;
   dbPromise=new Promise((resolve,reject)=>{
     const req=indexedDB.open(DATABASE,VERSION);
     req.onupgradeneeded=()=>{
       const db=req.result;
       if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:"key"});
     };
     req.onsuccess=()=>resolve(req.result);
     req.onerror=()=>reject(req.error||Error("Ouverture de la bibliothèque impossible."));
   }).catch(e=>{dbPromise=null;throw e;});
   return dbPromise;
 }
 async function tx(mode,action){
   const db=await openDB();
   return new Promise((resolve,reject)=>{
     const transaction=db.transaction(STORE,mode),store=transaction.objectStore(STORE);
     let output,request;
     try{request=action(store);}catch(e){reject(e);return;}
     if(request){request.onsuccess=()=>{output=request.result};request.onerror=()=>reject(request.error);}
     transaction.oncomplete=()=>resolve(output);
     transaction.onerror=()=>reject(transaction.error);
     transaction.onabort=()=>reject(transaction.error||Error("Opération annulée."));
   });
 }
 function classify(name){
   if(/(?:^|[\/_ ])(20\d{2}|2015.zero)[_ -]|_(ELM|PELE)_donnee\.pdf/i.test(name))return "Examens";
   if(/nibt|oibt/i.test(name))return "Réglementation";
   if(/dessin|schéma|schema/i.test(name))return "Dessin";
   if(/télécom|telecom|télémat|telemat/i.test(name))return "Réseaux";
   if(/math/i.test(name))return "Mathématiques";
   if(/production/i.test(name))return "Énergie";
   if(/mater|matér|câble|cable/i.test(name))return "Installation";
   return "Autres";
 }
 function profession(name){
   if(/_PELE_/i.test(name))return "Planificateur-électricien CFC";
   if(/_ELM_/i.test(name))return "Électricien de montage CFC";
   return "";
 }
 function setStatus(message,isError=false){
   const node=$(root,"#library-status");node.textContent=message;node.classList.toggle("library-error",!!isError);
 }
 function bytes(n){if(n>=1024*1024)return (n/1048576).toLocaleString("fr-CH",{maximumFractionDigits:1})+" Mo";return Math.round(n/1024)+" Ko";}
 function id(file){return file.name+"::"+file.size+"::"+file.lastModified;}
 async function list(){loaded=await tx("readonly",store=>store.getAll());draw();}
 async function importFiles(files){
   const selection=Array.from(files||[]);
   if(!selection.length)return;
   const pdfs=selection.filter(f=>f.type==="application/pdf"||/\.pdf$/i.test(f.name));
   if(pdfs.length!==selection.length)setStatus("Les archives ZIP doivent être décompressées avant l'importation. Seuls les fichiers PDF ont été sélectionnés.");
   if(!pdfs.length)return;
   let imported=0,errors=[];
   for(const file of pdfs){
     setStatus("Importation privée "+(imported+errors.length+1)+"/"+pdfs.length+" : "+file.name);
     try{
       await tx("readwrite",store=>store.put({
         key:id(file),name:file.name,size:file.size,changed:file.lastModified,
         group:classify(file.name),profession:profession(file.name),
         year:((file.name.match(/20\d{2}/)||[])[0]||""),imported:Date.now(),
         blob:file
       }));
       imported++;
     }catch(e){
       errors.push(file.name+" : "+(e?.name==="QuotaExceededError"?"espace de stockage insuffisant":e?.message||e));
     }
   }
   $(root,"#library-file").value="";
   if(errors.length)setStatus(imported+" PDF importés, "+errors.length+" en échec. "+errors[0]+". Pour les gros fichiers, utilisez un espace de stockage local suffisant.",true);
   else setStatus(imported+" PDF importés sur cet appareil. Aucun document n'a été envoyé à un serveur.");
   await list();
 }
 function closePreview(){
   const frame=$(root,"#library-preview");if(frame){frame.hidden=true;frame.querySelector("iframe").removeAttribute("src");}
   if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null;}
 }
 function draw(){
   const host=$(root,"#library-documents");host.replaceChildren();
   const records=loaded.filter(d=>(category==="all"||d.group===category) &&
       (d.name+" "+d.year+" "+d.profession+" "+d.group).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(search.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()))
     .sort((a,b)=>(a.group===b.group?0:a.group.localeCompare(b.group,"fr"))||b.year.localeCompare(a.year)||a.name.localeCompare(b.name,"fr"));
   $(root,"#library-count").textContent=loaded.length+" document"+(loaded.length===1?"":"s")+" privé"+(loaded.length===1?"":"s")+" · "+records.length+" affiché"+(records.length===1?"":"s");
   if(!records.length){
     host.append(el("p","empty-message",loaded.length?"Aucun document pour ce filtre.":"Bibliothèque vide. Importez vos PDF pour les consulter directement sur cet appareil."));
     return;
   }
   for(const d of records){
     const row=el("div","document-card"),info=el("div","document-info");
     const badge=el("span","tag",d.group),title=el("strong","",d.name);
     const meta=el("small","",(d.profession?d.profession+" · ":"")+(d.year?d.year+" · ":"")+bytes(d.size));
     info.append(badge,title,meta);
     const controls=el("div","document-actions");
     const open=el("button","btn btn-secondary","Ouvrir");open.type="button";open.addEventListener("click",()=>{
       closePreview();
       objectUrl=URL.createObjectURL(d.blob);
       const preview=$(root,"#library-preview");preview.hidden=false;
       preview.querySelector("h3").textContent=d.name;
       preview.querySelector("iframe").src=objectUrl+"#toolbar=1";
       const nativeLink=preview.querySelector("a");nativeLink.href=objectUrl;
       preview.scrollIntoView({block:"start",behavior:"smooth"});
     });
     const remove=el("button","btn btn-quiet","Retirer");remove.type="button";remove.setAttribute("aria-label","Retirer "+d.name);
     remove.addEventListener("click",async()=>{
       if(!confirm("Retirer ce PDF de la bibliothèque privée de cet appareil ?"))return;
       closePreview();
       try{await tx("readwrite",store=>store.delete(d.key));setStatus("Document retiré de cet appareil.");await list();}
       catch(e){setStatus("Suppression impossible : "+e.message,true);}
     });
     controls.append(open,remove);row.append(info,controls);host.append(row);
   }
 }
 function mount(node){
   root=node;
   if(initialised){list().catch(e=>setStatus(e.message,true));return;}
   initialised=true;
   const grid=el("div","library-topics");
   for(const topic of groups){
     const card=el("div","library-topic");
     card.append(el("span","eyebrow",topic.tag),el("h3","",topic.title),el("p","",topic.description));
     grid.append(card);
   }
   const heading=el("div","library-feature-head");
   heading.innerHTML='<div><p class="eyebrow">IMPORT LOCAL</p><h2>Vos documents sur cet appareil</h2><p>Choisissez les PDF à importer. Aucun fichier n’est envoyé au site ni ajouté à GitHub. Les données restent dans le stockage local de votre navigateur.</p></div>';
   const importBox=el("div","panel library-upload");
   importBox.innerHTML='<label class="btn btn-primary" for="library-file">Sélectionner des PDF</label><input class="sr-only" id="library-file" type="file" accept=".pdf,application/pdf" multiple>'+
     '<p>Vous pouvez sélectionner plusieurs fichiers à la fois ou les déposer ici. Pour les archives ZIP d’examens, décompressez-les avant l’importation.</p>'+
     '<p class="list-caption" id="library-status" role="status" aria-live="polite">Aucun document ne sera publié automatiquement.</p>';
   const filters=el("div","toolbar library-toolbar");
   filters.innerHTML='<label class="search-field"><span class="sr-only">Rechercher un document</span><input id="library-search" type="search" placeholder="Titre, année ou profession…"></label>'+
      '<label class="sr-only" for="library-group">Domaine</label><select id="library-group" aria-label="Filtrer les documents"><option value="all">Tous les domaines</option>'+
      [...groups.map(g=>g.tag),"Autres"].map(g=>'<option value="'+g+'">'+g+'</option>').join("")+'</select>';
   const preview=el("section","panel library-preview");preview.id="library-preview";preview.hidden=true;
   preview.innerHTML='<div class="library-preview-head"><h3></h3><div><a class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Ouvrir en plein écran ↗</a> <button type="button" class="btn btn-quiet" id="library-close">Fermer</button></div></div><iframe title="Aperçu du document personnel" loading="lazy"></iframe>';
   node.append(
      el("h2","library-heading","Domaines de révision"),grid,
      heading,importBox,filters,el("p","list-caption","") ,preview
   );
   node.querySelector(".list-caption:not(#library-status)").id="library-count";
   node.append(el("div","library-documents"));node.querySelector(".library-documents").id="library-documents";
   const file=$(node,"#library-file");
   file.addEventListener("change",()=>importFiles(file.files));
   importBox.addEventListener("dragover",e=>{e.preventDefault();importBox.classList.add("library-drag")});
   importBox.addEventListener("dragleave",()=>importBox.classList.remove("library-drag"));
   importBox.addEventListener("drop",e=>{e.preventDefault();importBox.classList.remove("library-drag");importFiles(e.dataTransfer?.files)});
   $(node,"#library-group").addEventListener("change",e=>{category=e.target.value;draw()});
   $(node,"#library-search").addEventListener("input",e=>{search=e.target.value;draw()});
   $(node,"#library-close").addEventListener("click",closePreview);
   list().catch(e=>setStatus("Stockage local indisponible : "+e.message,true));
 }
 window.ElecLibrary={mount,classification:classify,domains:groups.map(x=>x.tag)};
})();