import assert from "node:assert/strict";
import fs from "node:fs";
import { deflateRawSync } from "node:zlib";
import { chromium } from "playwright";

// ZIP synthétique (un PDF minimal, sans document externe) pour vérifier la décompression privée.
function zipFixture(){
  const name=Buffer.from("2023_TS_ELM_donnee.pdf","utf-8"),pdf=Buffer.from("%PDF-1.4\n%%EOF\n");
  const compressed=deflateRawSync(pdf);
  const local=Buffer.alloc(30),central=Buffer.alloc(46),end=Buffer.alloc(22);
  local.writeUInt32LE(0x04034b50,0);local.writeUInt16LE(20,4);local.writeUInt16LE(8,8);
  local.writeUInt32LE(compressed.length,18);local.writeUInt32LE(pdf.length,22);local.writeUInt16LE(name.length,26);
  const offset=local.length+name.length+compressed.length;
  central.writeUInt32LE(0x02014b50,0);central.writeUInt16LE(20,4);central.writeUInt16LE(20,6);central.writeUInt16LE(8,10);
  central.writeUInt32LE(compressed.length,20);central.writeUInt32LE(pdf.length,24);central.writeUInt16LE(name.length,28);
  end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(1,8);end.writeUInt16LE(1,10);
  end.writeUInt32LE(central.length+name.length,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([local,name,compressed,central,name,end]);
}
const url=process.env.ELECLEARN_URL||"http://127.0.0.1:8000/";
const browser=await chromium.launch({headless:true});
fs.mkdirSync("tests/artifacts",{recursive:true});
const sizes=[["bureau",1440,900],["tablette",820,1180],["mobile",375,812],["compact",320,640]];
let done=0;
try {
 for(const [name,width,height] of sizes){
  const context=await browser.newContext({viewport:{width,height}});
  const page=await context.newPage(),errors=[];
  page.on("pageerror",err=>errors.push(err.message));
  await page.route("https://cdn.jsdelivr.net/**",r=>r.fulfill({status:200,contentType:"application/javascript",body:""}));
  async function checkOverflow(label){
   const size=await page.evaluate(()=>({
    w:innerWidth,body:document.documentElement.scrollWidth,
    elements:[...document.querySelectorAll("body *")].map(el=>{const r=el.getBoundingClientRect();return {tag:el.tagName,id:el.id,cls:String(el.className?.baseVal??el.className??"").slice(0,50),right:Math.round(r.right),width:Math.round(r.width)}}).filter(x=>x.width>0&&x.right>innerWidth+1).slice(0,8)
   }));
   if(size.body>size.w+1)await page.screenshot({path:"tests/artifacts/overflow-"+name+".png",fullPage:true});
   assert(size.body<=size.w+1,name+" / "+label+" : débordement "+JSON.stringify(size));
  }
  await page.goto(url,{waitUntil:"domcontentloaded"});
  await page.waitForSelector("#home-fascicules .fascicule-card");
  assert.equal(await page.locator("#home-fascicules .fascicule-card").count(),3);
  await checkOverflow("accueil");
  if(width<=720){
   const box=await page.locator(".top-nav").boundingBox();
   assert(box&&box.y>=height-100,"Navigation basse mobile");
   assert.equal(await page.locator(".top-nav a").count(),5);
  }
  await page.locator(".fascicule-card.fet-2").click();
  await page.waitForSelector("#course-list .chapter-card");
  assert.equal(await page.locator("#course-list .chapter-card").count(),4);
  await checkOverflow("sommaire FET 2");
  await page.locator("#course-list .chapter-card").first().click();
  await page.waitForSelector("#lesson-content .worked-panel");
  assert.equal(await page.locator("#lab-container:not([hidden])").count(),1);
  assert.equal(await page.locator("#lesson-content .concept-figure svg").count(),1,"Illustration principale visible");
  assert.equal(await page.locator("#lesson-content .atlas-card svg").count(),2,"Deux illustrations complémentaires par leçon");
  await checkOverflow("leçon FET 2");
  const before=await page.locator("#lab-container .lab-control output").first().textContent();
  await page.locator("#lab-container input[type=range]").first().evaluate(el=>{el.value="900";el.dispatchEvent(new Event("input",{bubbles:true}));});
  const after=await page.locator("#lab-container .lab-control output").first().textContent();
  assert.notEqual(before,after,"Simulation dynamique");
  await page.locator("#lesson-quiz-link").click();
  await page.waitForSelector("#quiz-options button");
  let answered=0;
  while(await page.locator("#quiz").isVisible()&&answered<12){
   assert.equal(await page.locator("#quiz-options button").count(),4);
   await page.locator("#quiz-options button").first().click();
   assert(await page.locator("#quiz-feedback").isVisible());
   await page.locator("#next-question").click();
   answered++;
   // Attendre soit la nouvelle question active, soit le changement de vue : évite une course sur hashchange.
   await page.waitForSelector("#quiz-options button:not([disabled]), #resultats:not([hidden])");
   if(await page.locator("#resultats").isVisible())break;
  }
  assert(answered>=4&&answered<=10,"Quiz de chapitre");
  assert.equal(await page.locator("#resultats:not([hidden])").count(),1);
  const data=await page.evaluate(()=>JSON.parse(localStorage.getItem("ElecLearn.progress.v2")));
  assert(data?.results?.length,"Progression non sauvegardée");
  await page.goto(url+"#/progression",{waitUntil:"domcontentloaded"});
  await page.waitForSelector("#progress-history .history-item");
  await page.goto(url+"#/cours?fet=3",{waitUntil:"domcontentloaded"});
  await page.waitForSelector("#course-list .chapter-card");
  assert.equal(await page.locator("#course-list .chapter-card").count(),5);
  await checkOverflow("sommaire FET 3");

  // La bibliothèque reste privée : import local simulé et suppression.
  await page.goto(url+"#/bibliotheque",{waitUntil:"domcontentloaded"});
  await page.waitForSelector("#library-file");
  assert.equal(await page.locator("#library-catalog .catalog-card").count(),7,"Sept matières communes disponibles immédiatement");
  assert.equal(await page.locator("#library-catalog .catalog-art svg").count(),7,"Matières déjà illustrées");
  await page.locator(".catalog-search input").fill("transformateur");
  assert((await page.locator("#library-catalog .catalog-card").count())>=1,"Recherche par cours");
  await page.locator(".catalog-search input").fill("");
  await page.locator("#library-file").setInputFiles({
    name:"2024_DT_PELE_donnee.pdf",mimeType:"application/pdf",
    buffer:Buffer.from("%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF")
  });
  await page.waitForFunction(()=>document.querySelector("#library-count")?.textContent?.startsWith("1 PDF"));
  assert.match(await page.locator("#library-documents").textContent(),/Examens/);
  assert(!((await page.locator("#library-documents .document-info small").textContent()).includes("Planificateur")),"Documents mélangés par matière");
  await checkOverflow("bibliothèque privée");
  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(()=>document.querySelector("#library-count")?.textContent?.startsWith("1 PDF"));
  page.once("dialog",dialog=>dialog.accept());
  await page.locator("#library-documents .document-actions button").last().click();
  await page.waitForFunction(()=>document.querySelector("#library-count")?.textContent?.startsWith("0 PDF"));
  await page.locator("#library-file").setInputFiles({name:"Annales.zip",mimeType:"application/zip",buffer:zipFixture()});
  await page.waitForFunction(()=>document.querySelector("#library-count")?.textContent?.startsWith("1 PDF"));
  assert.match(await page.locator("#library-documents").textContent(),/Examens/,"Classement commun des annales ZIP");
  await page.locator('#library-catalog a[href="#/examens?d=Math%C3%A9matiques"]').click();
  await page.waitForSelector("#exam-setup-form");
  assert.equal(await page.locator("#exam-domain").inputValue(),"Mathématiques","Préselection du domaine depuis le catalogue");
  await page.locator("#exam-setup-form button[type=submit]").click();
  for(let q=0;q<4;q++){
    await page.waitForSelector("#exam-answers .quiz-option:not([disabled])");
    await page.locator("#exam-answers .quiz-option").first().click();
    assert(await page.locator("#exam-feedback").isVisible());
    await page.locator("#exam-next").click();
  }
  await page.waitForSelector("#exam-host .result-panel");
  assert((await page.evaluate(()=>JSON.parse(localStorage.getItem("ElecLearn.examHistory.v1"))||[])).length>0);
  await checkOverflow("examens professionnels");

  if(name==="mobile"){
   await page.goto(url+"#/accueil",{waitUntil:"domcontentloaded"});
   await page.waitForSelector("#home-fascicules .fascicule-card");
   await page.screenshot({path:"tests/artifacts/eleclearn-mobile.png",fullPage:true});
   const ready=await page.evaluate(async()=>!!(await navigator.serviceWorker.ready).active);
   assert(ready,"Service worker inactif");
   await context.setOffline(true);
   await page.goto(url+"#/cours/15",{waitUntil:"domcontentloaded"});
   await page.waitForSelector("#lesson-content .worked-panel");
   assert.match(await page.locator("#lesson-title").textContent(),/Éclairage/);
   await checkOverflow("cours hors connexion");
  }
  assert.deepEqual(errors,[],"Erreurs JavaScript inattendues");
  console.log("OK : "+name+" "+width+"×"+height);
  done++;
  await context.close();
 }
} finally {await browser.close();}
console.log("Vérification navigateur : "+done+"/"+sizes.length+" formats.");
