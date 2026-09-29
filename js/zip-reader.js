/* Décompression ZIP locale pour les archives PDF privées.
 * Aucun transfert réseau, aucune dépendance ni contenu de manuel intégré.
 * Compatibilité : archives ZIP classiques sans chiffrement, méthode STORE ou DEFLATE.
 */
(function(){
"use strict";
const MAX_FILES=160, MAX_PDF_BYTES=60*1024*1024, MAX_ARCHIVE_BYTES=650*1024*1024;
const decoder=new TextDecoder("utf-8");
function validOffset(view,offset,length){
  if(!Number.isInteger(offset)||!Number.isInteger(length)||offset<0||length<0||offset+length>view.byteLength)
    throw Error("Archive ZIP tronquée ou structure invalide.");
}
async function extract(file){
  if(file.size>MAX_ARCHIVE_BYTES)throw Error("Archive trop volumineuse pour le navigateur.");
  const buffer=await file.arrayBuffer(),v=new DataView(buffer),data=new Uint8Array(buffer);
  if(buffer.byteLength<22)throw Error("Archive ZIP incomplète.");
  let eocd=-1;const start=Math.max(0,buffer.byteLength-22-65535);
  for(let i=buffer.byteLength-22;i>=start;i--)if(v.getUint32(i,true)===0x06054b50){eocd=i;break;}
  if(eocd<0)throw Error("Fin d'archive ZIP introuvable.");
  const count=v.getUint16(eocd+10,true),centralOffset=v.getUint32(eocd+16,true);
  if(count>MAX_FILES)throw Error("Archive trop volumineuse en nombre de fichiers.");
  if(count===0)throw Error("Aucun fichier dans cette archive.");
  if(centralOffset===0xffffffff||count===0xffff)throw Error("ZIP64 non pris en charge : extrayez les PDF localement.");
  let ptr=centralOffset,total=0;const pdfs=[];
  for(let i=0;i<count;i++){
    validOffset(v,ptr,46);
    if(v.getUint32(ptr,true)!==0x02014b50)throw Error("Index central ZIP invalide.");
    const flags=v.getUint16(ptr+8,true),method=v.getUint16(ptr+10,true);
    const compressed=v.getUint32(ptr+20,true),uncompressed=v.getUint32(ptr+24,true);
    const nlen=v.getUint16(ptr+28,true),elen=v.getUint16(ptr+30,true),clen=v.getUint16(ptr+32,true);
    const local=v.getUint32(ptr+42,true);
    validOffset(v,ptr,46+nlen+elen+clen);
    const fullName=decoder.decode(data.slice(ptr+46,ptr+46+nlen));
    ptr+=46+nlen+elen+clen;
    const base=fullName.split(/[/\\]/).pop();
    if(!base||!/\.pdf$/i.test(base))continue;
    if(flags&1)throw Error("Les archives chiffrées ne sont pas prises en charge.");
    if(method!==0&&method!==8)throw Error("Méthode de compression ZIP non prise en charge.");
    if(uncompressed>MAX_PDF_BYTES||total+uncompressed>MAX_ARCHIVE_BYTES)
      throw Error("Archive trop volumineuse décompressée. Sélectionnez les PDF par petits lots.");
    validOffset(v,local,30);
    if(v.getUint32(local,true)!==0x04034b50)throw Error("En-tête du fichier ZIP invalide.");
    const offset=local+30+v.getUint16(local+26,true)+v.getUint16(local+28,true);
    validOffset(v,offset,compressed);
    let blob;
    if(method===0)blob=new Blob([data.slice(offset,offset+compressed)],{type:"application/pdf"});
    else{
      if(!("DecompressionStream" in window))throw Error("Décompression ZIP indisponible sur ce navigateur : décompressez l'archive avant import.");
      try{
        blob=await new Response(new Blob([data.slice(offset,offset+compressed)]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).blob();
      }catch(e){throw Error("Décompression impossible sur ce navigateur : extrayez les PDF avant import.");}
    }
    if(blob.size!==uncompressed)throw Error("Taille du document incorrecte dans l'archive ZIP.");
    const signature=await blob.slice(0,5).text();
    if(signature!=="%PDF-")throw Error("Un fichier de l'archive n'est pas un PDF valide.");
    total+=uncompressed;
    pdfs.push(new File([blob],base,{type:"application/pdf",lastModified:file.lastModified}));
  }
  if(!pdfs.length)throw Error("Aucun PDF dans cette archive.");
  return pdfs;
}
window.ElecZip={extract};
})();