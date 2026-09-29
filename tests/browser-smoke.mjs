import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "playwright";

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
   const size=await page.evaluate(()=>({w:innerWidth,body:document.documentElement.scrollWidth}));
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
