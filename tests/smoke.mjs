import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const file = path => new URL('../'+path, import.meta.url);
const read = path => fs.readFileSync(file(path), 'utf8');

const context = {window:{}};
vm.runInNewContext(read('js/questions.js'), context);
const questions = context.window.ElecQuestions;
assert.equal(questions.length, 48, '48 questions originales attendues');
for (let chapter = 1; chapter <= 15; chapter++) {
  assert(fs.existsSync(file('contenu/f'+chapter+'.html')), 'Leçon absente : '+chapter);
  assert.match(read('contenu/f'+chapter+'.html'), /<h2\b/i, 'Titre H2 absent : '+chapter);
  const selected = questions.filter(q => q.c === chapter);
  assert(selected.length >= (chapter <= 6 ? 2 : 4), 'Questions insuffisantes : '+chapter);
  for (const q of selected) {
    assert.equal(q.o.length, 4, 'Quatre options obligatoires');
    assert(Number.isInteger(q.a) && q.a >= 0 && q.a < q.o.length, 'Réponse incorrectement indexée');
    assert(q.q && q.why && q.ref, 'Correction ou référence absente');
    assert.equal(new Set(q.o).size, q.o.length, 'Options identiques');
  }
}
const app = read('js/app-v2.js');
for (const marker of ['localStorage','hashchange','questionsForChapter','renderLesson','serviceWorker','renderGlossary'])
  assert(app.includes(marker), 'Fonctionnalité absente : '+marker);
const html = read('index.html');
for (const path of ['css/style-v2.css','js/questions.js','js/labs.js','js/approfondissements.js','js/illustrations.js','js/metier-questions.js','js/exams.js','js/library.js','js/app-v2.js','manifest.webmanifest']) {
  assert(html.includes(path), 'Ressource non référencée : '+path);
  assert(fs.existsSync(file(path)), 'Ressource absente : '+path);
}
const sw = read('sw.js');
for(let c=1;c<=15;c++)assert(sw.includes('contenu/f'+c+'.html'), 'Chapitre absent du cache : '+c);
const labs = read('js/labs.js');
for(const c of [2,7,8,10,11,12,14,15])
  assert(labs.includes('    '+c+':{'), 'Simulateur absent : '+c);
console.log('OK — 15 chapitres, 48 questions originales, 8 simulateurs et fichiers hors connexion présents.');

const extensions = {window:{}};
vm.runInNewContext(read("js/approfondissements.js"),extensions);
for(let c=7;c<=15;c++)assert(extensions.window.ElecExtensions[c].includes("Exemple résolu"),"Approfondissement absent : "+c);


// Nouvelles illustrations et entraînements : contenu original, fichiers publics sans PDF externe.
const visual={window:{}};
vm.runInNewContext(read('js/illustrations.js'),visual);
assert.equal(visual.window.ElecIllustrations.available.length,15,"Illustrations des 15 chapitres");
for(let i=1;i<=15;i++){
 const data=visual.window.ElecIllustrations.diagrams[i];
 assert(data?.title&&data?.caption&&data?.body,"Illustration incomplète : "+i);
 assert(!/https?:\/\//i.test(data.body),"Illustrations uniquement locales");
}
const metier={window:{}};
vm.runInNewContext(read('js/metier-questions.js'),metier);
assert.equal(metier.window.ElecExamQuestions.length,28,"Questionnaire professionnel initial de 28 questions");
for(const q of metier.window.ElecExamQuestions){
 assert(q.domain&&q.q&&q.why,"Question professionnelle incomplète");
 assert(q.o.length===4&&q.a>=0&&q.a<4,"Réponses professionnelles invalides");
 assert.equal(new Set(q.o).size,4,"Options redondantes");
}
for(const path of ['js/illustrations.js','js/metier-questions.js','js/exams.js','js/library.js']){
 assert(read('index.html').includes(path),"Ressource non chargée : "+path);
 assert(read('sw.js').includes(path),"Ressource non disponible hors connexion : "+path);
}
assert.match(read('index.html'),/id="bibliotheque"/);
assert.match(read('index.html'),/id="examens"/);
const lib=read('js/library.js');
assert(lib.includes("indexedDB")&&!lib.includes('fetch('),"La bibliothèque privée n'envoie pas les PDF au réseau");
console.log("OK — 15 illustrations vectorielles, 28 questions inédites, bibliothèque privée uniquement locale.");
