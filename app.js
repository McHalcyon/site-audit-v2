/* =========================================================
   BRANDING  —  edit these two lines to brand the app
   ---------------------------------------------------------
   LOGO_SRC : filename of a logo image placed in THIS folder,
              e.g. "logo.png" or "logo.svg". Leave "" for none.
              Shows in the header on the dashboard.
   APP_TITLE: the title shown in the header on the dashboard.
   ========================================================= */
const LOGO_SRC = "Assets/logo2.png";               // e.g. "logo.png"
const APP_TITLE = "Site Audits";   // dashboard header title

let logoOk=false;
function applyBranding(){
  const img=document.getElementById("appLogo");
  if(!img||!LOGO_SRC)return;
  img.onload=()=>{logoOk=true;renderApp();};
  img.onerror=()=>{logoOk=false;img.style.display="none";};
  img.src=LOGO_SRC;
}

/* ============ audit type definitions ============ */
const MDU_ITEMS=[
  {n:"1", q:"Lynham Lead-in pit installed?", yn:1, photo:1},
  {n:"2", q:"Building Entry Point installed?", opts:{lab:"Type",c:["2 × P50","1 × P100"]}, yn:1, photo:1},
  {n:"3", q:"Pathway from BEP to MCR installed?", opts:{lab:"Via",c:["Conduit","Cabletray"]}, yn:1, photo:1},
  {n:"4", q:"Comms Room with lockable door installed (and DGPO)?", yn:1, photo:1, subs:[
    {q:"Depth-Width-Height fit for MCR?", yn:1},
    {q:"Wall (if MDF)", opts:{c:["Fire Rate","Fire Proof","Unsure - Sparky to confirm"]}},
    {q:"Power (DGPO) to MCR?", yn:1}
  ]},
  {n:"5", q:"Pathway from MCR to Riser — Cabletray ready?", opts:{lab:"Run (select all that apply)",c:["Vertical","Horizontal"],multi:1}, yn:1, photo:1, subs:[
    {q:"Is MCR/Risers dust-free?", yn:1}
  ]},
  {n:"6", q:"Depth of Riser to fit FDT–FDH–DR (and DGPO)?", schem:1, yn:1, photo:1, subs:[
    {q:"Depth of Riser", inp:"e.g. 600 mm"},
    {q:"Size of penetration", inp:"e.g. 150 mm"},
    {q:"Wall (if MDF)", opts:{c:["Fire Rate","Fire Proof","Unsure - Sparky to confirm"]}}
  ]},
  {n:"7", q:"Apartments — Conduits/Cabletrays with drawstring ready?", yn:1, photo:1, subs:[
    {q:"How many Apartments/Lots ready (or Levels)?", inp:"e.g. 24"}
  ]},
  {n:"8", q:"Tenancies — Conduits/Cabletrays with drawstring ready?", yn:1, photo:1},
  {n:"9", q:"Cutouts in nominated location (and DGPO)?", schem:1, yn:1, photo:1, subs:[
    {q:"Cutout as per schematic?", yn:1},
    {q:"Drawstrings visible?", yn:1}
  ]},
  {n:"10", q:"Roof — 2 × P50 penetration + WP Cabinet/JBox ready?", yn:1, photo:1, subs:[
    {q:"Penetration size", inp:"e.g. 50 mm"},
    {q:"WPC/JBox location (mark on photo)", inp:"location note"}
  ]},
  {n:"11", q:"WAPs", photo:1, subs:[
    {q:"Visible terminated Cat6 run to ALL WAP locations?", yn:1},
    {q:"Correct WAP locations?", yn:1}
  ]},
  {n:"12", q:"Building Services", photo:1, subs:[
    {q:"Terminated Cat6 run to ALL Building Services locations?", yn:1},
    {q:"Location of NTD for BMS", inp:"location note"}
  ]},
  {n:"13", q:"Permanent power to ALL apartments ready?", yn:1, photo:1, subs:[
    {q:"ETA if not ready", inp:"e.g. Aug 2026"}
  ]}
];
const PIT_ITEMS=[
  {n:"1", q:"Lynham lead-in pit installed in approved location (per IFC)?", yn:1, photo:1},
  {n:"2", q:"Correct pit installed (as per design)?", opts:{lab:"Pit type",c:["P5","P50","P100"]}, yn:1, photo:1},
  {n:"3", q:"Pit level with finished ground?", yn:1, photo:1},
  {n:"4", q:"Pit lid fitted correctly and undamaged?", yn:1, photo:1},
  {n:"5", q:"Pit clean (no water, mud or debris)?", yn:1, photo:1},
  {n:"6", q:"Pit accessible (not covered by concrete, landscaping or fencing)?", yn:1, photo:1},
  {n:"7", q:"Correct number of conduits entering pit?", yn:1, photo:1},
  {n:"8", q:"Correct conduit size installed?", opts:{lab:"Conduit size",c:["P50","P100"]}, yn:1, photo:1},
  {n:"9", q:"Conduits securely connected into pit?", yn:1, photo:1},
  {n:"10", q:"Draw rope installed in every conduit?", yn:1, photo:1},
  {n:"11", q:"Conduits capped/sealed where required?", yn:1, photo:1},
  {n:"12", q:"Conduits free from blockage (rod passes through)?", yn:1, photo:1},
  {n:"13", q:"Conduit direction matches IFC towards Building Entry Point?", yn:1, photo:1},
  {n:"14", q:"No sharp bends, crushed or damaged conduits?", yn:1, photo:1},
  {n:"15", q:"Distance/location matches approved drawings?", yn:1, photo:1},
  {n:"16", q:"Pit labelled/marked if required?", yn:1, photo:1},
  {n:"17", q:"Site safe for fibre installation?", yn:1, photo:1},
  {n:"18", q:"All required photos taken?", yn:1, photo:1}
];
const TYPES={
  MDU:{name:"MDU Site Audit", sub:"Multi-Dwelling Unit", ver:"V.1.1", items:MDU_ITEMS, ready:true, mode:"wizard"},
  PIT:{name:"Lead-in Pit Audit", sub:"Lead-in pit inspection", ver:"", items:PIT_ITEMS, ready:true, mode:"wizard",
    intro:"Mandatory photos: overall pit location · pit open (conduit entries) · pit lid closed · conduits inside pit · direction to BEP · any defects or damage."},
  SDU:{name:"SDU Site Audit", sub:"PCTSI pit inspection", ver:"V.1", items:[], ready:true, mode:"grid"}
};
/* PCTSI (SDU grid) — project info fields and per-pit columns */
const SDU_META=[
  {k:"date", label:"Date", type:"date"},
  {k:"siteName", label:"Site Name", ph:"Site name"},
  {k:"pm", label:"Project Manager", ph:"Name"},
  {k:"fieldTech", label:"Field Tech", ph:"Name"}
];
const PIT_FIELDS=[
  {k:"pitId", label:"Pit ID", type:"text"},
  {k:"pitType", label:"Pit Type", type:"text"},
  {k:"units", label:"Units Associated", type:"text"},
  {k:"physical", label:"Physical Pit Condition", type:"pf"},
  {k:"gasket", label:"Gasket", type:"pf"},
  {k:"spigot", label:"Spigot", type:"pf"},
  {k:"plugs", label:"Plugs", type:"pf"},
  {k:"drawstring", label:"Draw String", type:"pf"},
  {k:"elevation", label:"Elevation", type:"pf"},
  {k:"compaction", label:"Compaction", type:"pf"},
  {k:"surrounding", label:"Surrounding Condition", type:"pf"},
  {k:"comments", label:"Additional Comments", type:"textarea"}
];

/* ============ storage ============ */
const DBKEY="siteAuditsDB_v1";
let DB={audits:{}};
function loadDB(){try{const r=localStorage.getItem(DBKEY);if(r)DB=JSON.parse(r);}catch(e){}if(!DB.audits)DB.audits={};}
function saveDB(){try{localStorage.setItem(DBKEY,JSON.stringify(DB));}catch(e){}}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

/* photos in IndexedDB, namespaced by auditId + item */
let db=null; const mem={}; const urlCache={};
function mkey(a,i){return a+"|"+i;}
function idbOpen(){return new Promise(res=>{try{
  const r=indexedDB.open("siteAuditPhotos",1);
  r.onupgradeneeded=e=>{const d=e.target.result;if(!d.objectStoreNames.contains("photos"))d.createObjectStore("photos",{keyPath:"id",autoIncrement:true});};
  r.onsuccess=e=>{db=e.target.result;res(true);};r.onerror=()=>res(false);
}catch(e){res(false);}});}
function addPhoto(a,i,blob){return new Promise(res=>{
  if(!db){const k=mkey(a,i);mem[k]=mem[k]||[];const id="m"+Date.now()+Math.floor(Math.random()*1e4);mem[k].push({id,blob});return res(id);}
  try{const tx=db.transaction("photos","readwrite").objectStore("photos").add({auditId:a,item:i,blob});tx.onsuccess=()=>res(tx.result);tx.onerror=()=>res(null);}catch(e){res(null);}
});}
function getPhotos(a,i){return new Promise(res=>{
  if(!db)return res((mem[mkey(a,i)]||[]).slice());
  try{const tx=db.transaction("photos","readonly").objectStore("photos").getAll();tx.onsuccess=()=>res(tx.result.filter(r=>r.auditId===a&&r.item===i));tx.onerror=()=>res([]);}catch(e){res([]);}
});}
function rmPhoto(a,i,id){return new Promise(res=>{
  if(!db){const k=mkey(a,i);mem[k]=(mem[k]||[]).filter(p=>p.id!==id);return res();}
  try{const tx=db.transaction("photos","readwrite").objectStore("photos").delete(id);tx.onsuccess=()=>res();tx.onerror=()=>res();}catch(e){res();}
});}
function clearAuditPhotos(a){return new Promise(res=>{
  if(!db){Object.keys(mem).forEach(k=>{if(k.indexOf(a+"|")===0)delete mem[k];});return res();}
  try{const os=db.transaction("photos","readwrite").objectStore("photos");const g=os.getAll();g.onsuccess=()=>{(g.result||[]).forEach(r=>{if(r.auditId===a)os.delete(r.id);});res();};g.onerror=()=>res();}catch(e){res();}
});}
function thumbURL(p){if(!urlCache[p.id])urlCache[p.id]=URL.createObjectURL(p.blob);return urlCache[p.id];}
function blobToDataURL(b){return new Promise(r=>{try{if(!(b instanceof Blob))return r("");const fr=new FileReader();fr.onload=()=>r(fr.result);fr.onerror=()=>r("");fr.readAsDataURL(b);}catch(e){r("");}});}
function compress(file){return new Promise(res=>{try{
  const img=new Image();const url=URL.createObjectURL(file);
  img.onload=()=>{let w=img.width,h=img.height;const max=1280;if(w>h&&w>max){h=Math.round(h*max/w);w=max;}else if(h>=w&&h>max){w=Math.round(w*max/h);h=max;}
    const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);URL.revokeObjectURL(url);c.toBlob(b=>res(b||file),"image/jpeg",0.6);};
  img.onerror=()=>{URL.revokeObjectURL(url);res(file);};img.src=url;
}catch(e){res(file);}});}

/* ============ app state ============ */
let view="dashboard", activeId=null, pos=0, st=null, ITEMS=[];
let gridView="main", editingPit=null;
let goTop=false;
var CH={};
function A(){return DB.audits[activeId];}
function mode(){return A()?TYPES[A().type].mode:"wizard";}
function pctOf(s,items){let t=0,c=0;items.forEach(it=>{if(it.yn){t++;if((s.items[it.n]||{}).yn)c++;}(it.subs||[]).forEach((sb,i)=>{if(sb.yn){t++;if((s.items[it.n]||{})["s"+i+"yn"])c++;}});});return t?Math.round(c/t*100):0;}

function save(){if(activeId&&DB.audits[activeId]){const a=DB.audits[activeId];a.updated=Date.now();
  if(TYPES[a.type].mode==="grid"){a.site=(st.meta.siteName||"").trim();a.date=st.meta.date||"";a.count=(st.pits||[]).length;}
  else{a.site=(st.meta.addr||"").trim();a.date=st.meta.date||"";a.pct=pctOf(st,ITEMS);}
}saveDB();}

/* ============ render router ============ */
function renderApp(){
  const scEl=document.getElementById("screen");
  const keep=scEl?scEl.scrollTop:0;
  const wiz=view==="wizard", grid=view==="grid", inAudit=wiz||grid;
  document.getElementById("backMenu").style.display=inAudit?"block":"none";
  document.getElementById("pbarWrap").style.display=wiz?"block":"none";
  document.getElementById("nav").style.display=inAudit?"flex":"none";
  const logo=document.getElementById("appLogo");
  if(logo)logo.style.display=(logoOk&&!inAudit)?"block":"none";
  if(wiz)renderScreen();else if(grid)renderGrid();else renderDashboard();
  const sc2=document.getElementById("screen");
  if(sc2)sc2.scrollTop=goTop?0:keep;
  if(goTop){try{if(window.scrollTo)window.scrollTo(0,0);}catch(e){}}
  goTop=false;
}

/* ============ dashboard ============ */
function renderDashboard(){
  document.getElementById("topTitle").textContent=APP_TITLE;
  document.getElementById("topStep").textContent="";
  const sc=document.getElementById("screen");
  let h=`<div class="sec">New audit</div><div class="tiles">`;
  Object.keys(TYPES).forEach(k=>{
    const t=TYPES[k];
    if(t.ready){
      h+=`<div class="tile" onclick="newAuditOf('${k}')"><div class="ic">${k}</div><div class="tx"><div class="tn">${esc(t.name)}</div><div class="ts">${esc(t.sub)}</div></div><div class="arw">›</div></div>`;
    }else{
      h+=`<div class="tile dim"><div class="ic">${k}</div><div class="tx"><div class="tn">${esc(t.name)}</div><div class="ts">${esc(t.sub)}</div></div><span class="soon">Coming soon</span></div>`;
    }
  });
  h+=`</div>`;

  const list=Object.values(DB.audits).sort((a,b)=>(b.updated||0)-(a.updated||0));
  h+=`<div class="sec mt">Saved audits</div>`;
  if(!list.length){
    h+=`<div class="empty">No saved audits yet.<br>Start one above — it'll be saved here so you can reopen or re-export it.</div>`;
  }else{
    list.forEach(a=>{
      const t=TYPES[a.type];const grid=t&&t.mode==="grid";
      const site=a.site||"Untitled site";
      const when=a.updated?new Date(a.updated).toLocaleDateString():"";
      let sub,bar;
      if(grid){const n=((a.st&&a.st.pits)||[]).length;sub=`${n} pit${n!==1?'s':''}${when?" · updated "+when:""}`;bar="";}
      else{const pct=pctOf(a.st,t?t.items:[]);sub=`${pct}% complete${when?" · updated "+when:""}`;bar=`<div class="minibar"><span style="width:${pct}%"></span></div>`;}
      h+=`<div class="acard">
        <div class="r1"><span class="badge ${a.type}">${a.type}</span><span class="site">${esc(site)}</span></div>
        <div class="sub">${sub}</div>
        ${bar}
        <div class="acts">
          <button class="open" onclick="openAudit('${a.id}')">Open</button>
          <button onclick="pdfAudit('${a.id}')">PDF</button>
          <button class="del" onclick="deleteAudit('${a.id}')">🗑</button>
        </div>
      </div>`;
    });
  }
  sc.innerHTML=h;
}

/* ============ audit lifecycle ============ */
function newAuditOf(type){
  if(!TYPES[type]||!TYPES[type].ready)return;
  const id=Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  DB.audits[id]={id,type,site:"",date:"",updated:Date.now(),pct:0,st:{meta:{},obs:"",items:{}}};
  saveDB();openAudit(id);
}
function openAudit(id){
  if(!DB.audits[id])return;
  activeId=id;const a=A();ITEMS=TYPES[a.type].items||[];st=a.st;
  if(TYPES[a.type].mode==="grid"){if(!st.pits)st.pits=[];gridView="main";editingPit=null;view="grid";}
  else{pos=0;view="wizard";}
  goTop=true;renderApp();
}
function goMenu(){
  if(view==="grid"&&gridView==="pit"&&pitInvalid(pit(editingPit))){showCmtWarn();return;}
  if((view==="grid"||view==="wizard")&&!confirm("Leave and return to the menu?\n\nYour progress is saved.")) return;
  save();view="dashboard";goTop=true;renderApp();
}
async function deleteAudit(id){
  const a=DB.audits[id];if(!a)return;
  if(!confirm(`Delete this ${a.type} audit for "${a.site||'Untitled site'}"? This removes its answers and photos from this device.`))return;
  await clearAuditPhotos(id);
  delete DB.audits[id];
  if(activeId===id){activeId=null;st=null;}
  saveDB();renderApp();
}
async function pdfAudit(id){
  const a=DB.audits[id];if(!a)return;
  activeId=id;ITEMS=TYPES[a.type].items||[];st=a.st;
  if(TYPES[a.type].mode==="grid"){const bad=(st.pits||[]).find(pitInvalid);if(bad){alert("This inspection has a pit marked Fail without a comment.\n\nOpen it and add the comment before exporting.");openAudit(id);editPit(bad.id);setTimeout(showCmtWarn,80);return;}}
  else{for(let i=0;i<ITEMS.length;i++){const it=ITEMS[i];if(itemNeedsComment(it)&&!itemHasComment(it)){alert("Item "+it.n+" is marked No but has no comment.\n\nFTT to provide more info before exporting.");openAudit(id);pos=i+1;goTop=true;renderApp();setTimeout(showItemCmtWarn,80);return;}}}
  await buildPrint();setTimeout(()=>window.print(),80);
}

/* ============ grid mode (SDU / PCTSI pit inspection) ============ */
function pit(id){return (st.pits||[]).find(p=>p.id===id)||{fields:{}};}
function setPitField(id,key,val){const p=pit(id);p.fields=p.fields||{};p.fields[key]=val;save();}
function setPF(id,key,val){const p=pit(id);p.fields=p.fields||{};p.fields[key]=(p.fields[key]===val)?"":val;save();renderApp();}
function pfHTML(id,key){const v=(pit(id).fields||{})[key]||"";return `<div class="yn">
  <button class="y ${v==='P'?'on':''}" onclick="setPF('${id}','${key}','P')">Pass</button>
  <button class="n ${v==='F'?'on':''}" onclick="setPF('${id}','${key}','F')">Fail</button></div>`;}
function addPit(){const id="p"+Date.now().toString(36)+Math.floor(Math.random()*1e4);st.pits.push({id,fields:{}});save();editingPit=id;gridView="pit";goTop=true;renderApp();}
function editPit(id){editingPit=id;gridView="pit";goTop=true;renderApp();}
async function deletePit(id){
  if(!confirm("Delete this pit?"))return;
  const ph=await getPhotos(activeId,"P"+id);for(const p of ph)await rmPhoto(activeId,"P"+id,p.id);
  st.pits=st.pits.filter(p=>p.id!==id);save();gridView="main";editingPit=null;goTop=true;renderApp();
}
function backToPits(){gridView="main";editingPit=null;goTop=true;renderApp();}

/* ---- import PM pit list (xlsx / csv) ---- */
function parseCSV(text){const rows=[];let row=[],field="",i=0,inQ=false;text=String(text).replace(/\r\n/g,"\n").replace(/\r/g,"\n");while(i<text.length){const c=text[i];if(inQ){if(c==='"'){if(text[i+1]==='"'){field+='"';i+=2;continue;}inQ=false;i++;continue;}field+=c;i++;continue;}if(c==='"'){inQ=true;i++;continue;}if(c===","){row.push(field);field="";i++;continue;}if(c==="\n"){row.push(field);rows.push(row);row=[];field="";i++;continue;}field+=c;i++;}if(field.length||row.length){row.push(field);rows.push(row);}return rows;}
function parsePitFile(file){return new Promise((res,rej)=>{const name=(file.name||"").toLowerCase();const isX=/\.xlsx$|\.xls$/.test(name);const reader=new FileReader();reader.onerror=()=>rej(new Error("Could not read the file."));if(isX){if(typeof XLSX==="undefined"){rej(new Error("Excel reader isn't loaded. Save the file as CSV, or make sure vendor/xlsx.full.min.js is present."));return;}reader.onload=e=>{try{const wb=XLSX.read(e.target.result,{type:"array"});const ws=wb.Sheets[wb.SheetNames[0]];res(XLSX.utils.sheet_to_json(ws,{header:1,blankrows:false,defval:""}));}catch(err){rej(err);}};reader.readAsArrayBuffer(file);}else{reader.onload=e=>{try{res(parseCSV(e.target.result));}catch(err){rej(err);}};reader.readAsText(file);}});}
function parseImport(rows){
  rows=rows||[];
  // locate the pit-table header row
  let hi=-1;
  for(let r=0;r<rows.length;r++){const low=(rows[r]||[]).map(c=>String(c).trim().toLowerCase());if(low.indexOf("pit id")>-1||low.indexOf("pitid")>-1){hi=r;break;}}
  // project metadata (key in col A, value in col B) — scanned from rows above the table
  const meta={};
  const scan=hi>-1?rows.slice(0,hi):[];
  scan.forEach(row=>{const k=String((row&&row[0])||"").trim().toLowerCase();const v=String((row&&row[1])||"").trim();if(!v)return;if(k==="site name"||k==="site")meta.siteName=v;else if(k==="project manager"||k==="project manager name"||k==="pm")meta.pm=v;});
  // pits
  const pits=[];
  if(hi>-1){
    const header=(rows[hi]||[]).map(c=>String(c).trim().toLowerCase());
    const idx=names=>{for(const n of names){const j=header.indexOf(n);if(j>-1)return j;}return -1;};
    const iId=idx(["pit id","pitid"]),iType=idx(["pit type","pittype","type"]),iUnits=idx(["units associated","units","unit"]);
    for(let r=hi+1;r<rows.length;r++){const row=rows[r]||[];const pitId=iId>-1?String(row[iId]||"").trim():"";const pitType=iType>-1?String(row[iType]||"").trim():"";const units=iUnits>-1?String(row[iUnits]||"").trim():"";if(!pitId&&!pitType&&!units)continue;pits.push({id:"p"+Date.now().toString(36)+Math.floor(Math.random()*1e6)+"_"+r,fields:{pitId,pitType,units}});}
  }
  return {meta,pits};
}
async function importPits(files){
  const file=files&&files[0];if(!file)return;
  let rows;try{rows=await parsePitFile(file);}catch(e){alert("Couldn't read that file.\n\n"+(e.message||e)+"\n\nUse the Template button to get the correct format.");return;}
  const {meta,pits}=parseImport(rows);
  if(!pits.length){alert("No pits found. The file needs a “Pit ID” column with rows underneath. Use the Template button for the correct format.");return;}
  if(st.pits.length&&!confirm("Import "+pits.length+" pit"+(pits.length>1?"s":"")+"?\n\nThis REPLACES the current list of "+st.pits.length+" pit"+(st.pits.length>1?"s":"")+", and removes their photos.")) return;
  await clearAuditPhotos(activeId);
  if(meta.siteName)st.meta.siteName=meta.siteName;
  if(meta.pm)st.meta.pm=meta.pm;
  st.pits=pits;save();gridView="main";editingPit=null;renderApp();
  alert(pits.length+" pit"+(pits.length>1?"s":"")+" imported"+((meta.siteName||meta.pm)?" — site details pre-filled":"")+". Fill in the checks for each pit.");
}
function downloadTemplate(){
  const csv="Site Name,\nProject Manager,\n,\nPit ID,Pit Type,Units Associated\nP-101,P50,12\nP-102,P100,\n";
  try{const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="pit-list-template.csv";document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(e){alert("Template: put Site Name and Project Manager in the top rows (col A label, col B value), then a Pit ID / Pit Type / Units Associated table below.");}
}

/* a pit with any Fail must have a comment */
function pitInvalid(p){const f=(p&&p.fields)||{};const anyFail=PIT_FIELDS.some(x=>x.type==="pf"&&f[x.k]==="F");return anyFail&&!(f.comments&&f.comments.trim());}
function showCmtWarn(){const wn=document.getElementById("cmtWarn");if(wn)wn.style.display="block";const b=document.getElementById("cmtBox");if(b){b.style.borderColor="var(--red)";try{b.scrollIntoView({behavior:"smooth",block:"center"});}catch(e){}try{b.focus();}catch(e){}}}
function hideCmtWarn(){const wn=document.getElementById("cmtWarn");if(wn)wn.style.display="none";const b=document.getElementById("cmtBox");if(b)b.style.borderColor="";}
function ensurePitValid(){if(pitInvalid(pit(editingPit))){showCmtWarn();return false;}return true;}
function leavePits(){if(ensurePitValid())backToPits();}
function pitSummary(p){const f=p.fields||{};const pf=PIT_FIELDS.filter(x=>x.type==="pf");const P=pf.filter(x=>f[x.k]==="P").length,F=pf.filter(x=>f[x.k]==="F").length,N=pf.filter(x=>f[x.k]==="NA").length;return "Save this pit and start a new one?\n\nPit: "+(f.pitId||"(no ID)")+(f.pitType?" · "+f.pitType:"")+"\nPass "+P+" · Fail "+F;}
function newPitFromEditor(){if(!ensurePitValid())return;if(!confirm(pitSummary(pit(editingPit))))return;addPit();}
function nextPit(){if(!ensurePitValid())return;const i=st.pits.findIndex(x=>x.id===editingPit);if(i>-1&&i<st.pits.length-1)editPit(st.pits[i+1].id);}
function prevPit(){if(!ensurePitValid())return;const i=st.pits.findIndex(x=>x.id===editingPit);if(i>0)editPit(st.pits[i-1].id);}

function renderGrid(){
  const t=TYPES[A().type];
  document.getElementById("topTitle").textContent=t.name+(t.ver?" · "+t.ver:"");
  const sc=document.getElementById("screen");
  const nav=document.getElementById("nav");

  if(gridView==="pit"){
    const p=pit(editingPit);
    const titleTxt=(p.fields&&p.fields.pitId)?p.fields.pitId:"New pit";
    document.getElementById("topStep").textContent=titleTxt;
    let h=`<div class="qtitle" id="pitTitle" style="margin-bottom:14px">${esc(titleTxt)}</div>`;
    PIT_FIELDS.forEach(f=>{
      h+=`<div class="label">${esc(f.label)}</div>`;
      const v=(p.fields||{})[f.k]||"";
      if(f.type==="text"){
        const extra=f.k==="pitId"?`;var _t=document.getElementById('pitTitle'),_s=document.getElementById('topStep');if(_t)_t.textContent=this.value||'New pit';if(_s)_s.textContent=this.value||'New pit'`:"";
        h+=`<input type="text" value="${esc(v)}" oninput="setPitField('${p.id}','${f.k}',this.value)${extra}">`;
      }
      else if(f.type==="textarea"){
        const isC=f.k==="comments";
        h+=`<textarea ${isC?'id="cmtBox"':''} placeholder="Notes…" oninput="setPitField('${p.id}','${f.k}',this.value)${isC?";hideCmtWarn()":""}">${esc(v)}</textarea>`;
        if(isC)h+=`<div id="cmtWarn" style="display:none;color:var(--red);font-size:12.5px;font-weight:700;margin-top:8px">⚠︎ A comment is required when any item is marked <b>Fail</b> — FTT to provide more info.</div>`;
      }
      else if(f.type==="pf")h+=pfHTML(p.id,f.k);
    });
    h+=`<div class="label">Photos</div><div class="photos" id="ph_P${p.id}"></div>
      <label class="addph" id="addlbl_P${p.id}"><span class="addtxt"><span class="ic" style="font-size:18px">＋</span> Add photo</span>
        <input type="file" accept="image/*" multiple style="display:none" onchange="addPhotos('P${p.id}',this.files)"></label>
      <div class="hint">Photos for this pit. Stored on this device; also upload under the project folder.</div>
      <button onclick="deletePit('${p.id}')" style="width:100%;margin-top:24px;border:1px solid var(--line);background:#fff;color:var(--red);border-radius:12px;padding:14px;font-size:14px;font-weight:700;cursor:pointer">🗑 Delete this pit</button>`;
    sc.innerHTML=h;
    loadThumbs("P"+p.id);
    const _pi=st.pits.findIndex(x=>x.id===editingPit);const _first=_pi<=0;const _last=_pi===st.pits.length-1;
    const _grey="flex:1;border:none;border-radius:12px;padding:15px 6px;font-size:15px;font-weight:700;cursor:pointer;background:#e4e9f0;color:var(--navy);";
    nav.innerHTML=
      `<button onclick="prevPit()" style="${_grey}${_first?'opacity:.4;':''}">‹ Prev</button>`
      +`<button onclick="leavePits()" style="${_grey}">Pits</button>`
      +(_last?`<button class="next" onclick="newPitFromEditor()" style="flex:1">＋ New</button>`:`<button class="next" onclick="nextPit()" style="flex:1">Next ›</button>`);
  }else{
    document.getElementById("topStep").textContent="Inspection";
    let h=`<div style="background:#fff6df;border:1px solid #ecd99a;color:#7a5a13;border-radius:12px;padding:13px 15px;font-size:13.5px;line-height:1.45">⚠︎ <b>Refer to the schematic / design</b> during the inspection. All photos to be uploaded under the project folder with the date.</div>`;
    h+=`<div class="label" style="margin-top:18px">PCTSI details</div><div class="grid2">`;
    SDU_META.forEach(m=>{const v=(st.meta||{})[m.k]||"";h+=`<div><div class="label">${esc(m.label)}</div><input type="${m.type||'text'}" value="${esc(v)}" placeholder="${esc(m.ph||'')}" oninput="setMeta('${m.k}',this.value)"></div>`;});
    h+=`</div>`;
    h+=`<div class="label" style="margin-top:24px">Pits (${st.pits.length})</div>`;
    h+=`<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <label class="importbtn" style="flex:1;min-width:150px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:2px solid var(--accent);background:#fff;color:var(--accent);border-radius:12px;padding:12px;font-size:14px;font-weight:700;cursor:pointer">Import pit list<input type="file" accept=".csv,.xlsx,.xls" style="display:none" onchange="importPits(this.files)"></label>
      <button onclick="downloadTemplate()" style="border:1px solid var(--line);background:#fff;color:var(--navy);border-radius:12px;padding:12px 14px;font-size:13px;font-weight:700;cursor:pointer">Template</button>
    </div>
    <div class="hint" style="margin-top:-6px;margin-bottom:6px">PM fills Site Name, Project Manager &amp; the pit list (Excel/CSV) → import here to pre-fill.</div>`;
    if(!st.pits.length)h+=`<div class="empty">No pits added yet. Tap “Add pit” to record the first one.</div>`;
    st.pits.forEach((p)=>{
      const f=p.fields||{};const pfs=PIT_FIELDS.filter(x=>x.type==="pf");
      const passes=pfs.filter(x=>f[x.k]==="P").length,fails=pfs.filter(x=>f[x.k]==="F").length;
      const title=f.pitId||"Untitled";
      h+=`<div class="acard"><div class="r1"><span class="badge">${esc(title)}</span>${f.pitType?`<span class="site">${esc(f.pitType)}</span>`:""}</div>
        <div class="sub">${passes} pass · ${fails} fail${f.units?" · units "+esc(f.units):""}</div>
        <div class="acts"><button class="open" onclick="editPit('${p.id}')">Edit</button><button class="del" onclick="deletePit('${p.id}')">🗑</button></div></div>`;
    });
    h+=`<button onclick="addPit()" style="width:100%;margin-top:6px;border:2px dashed var(--accent);background:#fff;color:var(--accent);border-radius:12px;padding:15px;font-size:15px;font-weight:700;cursor:pointer">＋ Add pit</button>`;
    h+=`<div class="label" style="margin-top:26px">Other comments / observations</div><textarea placeholder="Anything else noted on site…" oninput="setObs(this.value)">${esc(st.obs)}</textarea>`;
    sc.innerHTML=h;
    nav.innerHTML=`<button class="save" onclick="saveP()">Save PDF</button>`;
  }
}

/* ============ wizard ============ */
function LAST(){return ITEMS.length+1;}
function ynHTML(id,key){const cur=(st.items[id]||{})[key]||"";return `<div class="yn">
  <button class="y ${cur==='Y'?'on':''}" onclick="setVal('${id}','${key}','Y',1)">Yes</button>
  <button class="n ${cur==='N'?'on':''}" onclick="setVal('${id}','${key}','N',1)">No</button></div>`;}
function chipHTML(id,key,opts){
  if(opts.multi){const cur=Array.isArray((st.items[id]||{})[key])?(st.items[id][key]):[];
    return `<div class="chips">${opts.c.map(o=>`<button class="chip ${cur.indexOf(o)>-1?'on':''}" onclick="toggleMulti('${id}','${key}','${esc(o)}')">${esc(o)}</button>`).join("")}</div>`;}
  const cur=(st.items[id]||{})[key]||"";return `<div class="chips">${opts.c.map((o,i)=>`<button class="chip ${cur===o?'on':''}" onclick="setVal('${id}','${key}',CH['${id}_${key}'][${i}],1)">${esc(o)}</button>`).join("")}</div>`;
}
function toggleMulti(id,key,val){const d=get(id);let a=Array.isArray(d[key])?d[key].slice():[];const i=a.indexOf(val);if(i>-1)a.splice(i,1);else a.push(val);d[key]=a;save();renderApp();}
function inpHTML(id,key,ph){const cur=(st.items[id]||{})[key]||"";return `<input type="text" value="${esc(cur)}" placeholder="${esc(ph)}" oninput="setVal('${id}','${key}',this.value,0)">`;}
function get(id){st.items[id]=st.items[id]||{};return st.items[id];}

function renderScreen(){
  const t=TYPES[A().type];
  document.getElementById("topTitle").textContent=t.name+(t.ver?" · "+t.ver:"");
  document.getElementById("pbar").style.width=pctOf(st,ITEMS)+"%";
  const sc=document.getElementById("screen");

  if(pos===0){
    document.getElementById("topStep").textContent="Site details";
    sc.innerHTML=`
      <div style="background:#fff6df;border:1px solid #ecd99a;color:#7a5a13;border-radius:12px;padding:13px 15px;font-size:13.5px;line-height:1.45">⚠︎ <b>Refer to the schematic / IFC</b> during the audit. All photos also to be uploaded to <b>Towers</b> under the project folder with the date.</div>
      ${TYPES[A().type].intro?`<div style="background:#ece3ff;border:1px solid #cdbdf3;color:#3a1576;border-radius:12px;padding:12px 15px;font-size:13px;line-height:1.45;margin-top:12px">📷 <b>${esc(TYPES[A().type].intro)}</b></div>`:''}
      <div class="label" style="margin-top:18px">Site details</div>
      <div class="grid2">
        <div><div class="label">Targeted completion date</div><input type="date" value="${esc(st.meta.date)}" oninput="setMeta('date',this.value)"></div>
        <div><div class="label">Auditor (FTT)</div><input type="text" value="${esc(st.meta.auditor)}" placeholder="Allocated by Alvin" oninput="setMeta('auditor',this.value)"></div>
        <div><div class="label">Site contact name</div><input type="text" value="${esc(st.meta.contact)}" placeholder="Name" oninput="setMeta('contact',this.value)"></div>
        <div><div class="label">Site contact mobile</div><input type="tel" inputmode="tel" value="${esc(st.meta.contactPhone)}" placeholder="04xx xxx xxx" oninput="setMeta('contactPhone',this.value)"></div>
        <div><div class="label">Site contact email</div><input type="email" inputmode="email" value="${esc(st.meta.contactEmail)}" placeholder="name@email.com" oninput="setMeta('contactEmail',this.value)"></div>
        <div><div class="label">Site address</div><input type="text" value="${esc(st.meta.addr)}" placeholder="Address" oninput="setMeta('addr',this.value)"></div>
      </div>
      <div class="hint" style="margin-top:16px">Saved automatically to this device. Use ‹ Menu any time — your progress is kept.</div>`;
  }
  else if(pos>=1&&pos<=ITEMS.length){
    const it=ITEMS[pos-1];
    document.getElementById("topStep").textContent=`Item ${pos} of ${ITEMS.length}`;
    let h=`<div class="qhead"><div class="qnum">${esc(it.n)}</div><div><div class="qtitle">${esc(it.q)}</div>${it.schem?'<div class="schem">see schematic</div>':''}</div></div>`;
    if(it.yn){h+=`<div class="label">Installed / ready?</div>`+ynHTML(it.n,"yn");}
    if(it.opts){CH[it.n+"_chip"]=it.opts.c;h+=`<div class="label">${esc(it.opts.lab)}</div>`+chipHTML(it.n,"chip",it.opts);}
    (it.subs||[]).forEach((s,i)=>{
      h+=`<div class="sub"><div class="sq"><span class="d">›</span>${esc(s.q)}</div>`;
      if(s.yn)h+=ynHTML(it.n,"s"+i+"yn");
      if(s.opts){CH[it.n+"_s"+i+"chip"]=s.opts.c;h+=chipHTML(it.n,"s"+i+"chip",s.opts);}
      if(s.inp)h+=inpHTML(it.n,"s"+i+"txt",s.inp);
      h+=`</div>`;
    });
    if(it.photo){
      h+=`<div class="label">Photos</div><div class="photos" id="ph_${it.n}"></div>
        <label class="addph" id="addlbl_${it.n}"><span class="addtxt"><span class="ic" style="font-size:18px">＋</span> Add photo</span>
          <input type="file" accept="image/*" multiple style="display:none" onchange="addPhotos('${it.n}',this.files)"></label>
        <div class="hint">Tap to take a photo or choose from your library. Stored on this device; also upload to Towers.</div>`;
    }
    const needC=itemNeedsComment(it);
    h+=`<div class="label">Comment${needC?' <span style="color:var(--red)">(required)</span>':' (optional)'}</div>
      <textarea id="itemCmt" placeholder="${needC?'Required — FTT to provide more info on the No':'Notes for this item…'}" oninput="setVal('${it.n}','note',this.value,0);hideItemCmtWarn()">${esc((st.items[it.n]||{}).note)}</textarea>
      <div id="itemCmtWarn" style="display:none;color:var(--red);font-size:12.5px;font-weight:700;margin-top:8px">⚠︎ A comment is required when any answer is <b>No</b> — FTT to provide more info.</div>`;
    sc.innerHTML=h;
    if(it.photo)loadThumbs(it.n);
  }
  else{
    document.getElementById("topStep").textContent="Review & save";
    sc.innerHTML=`<div class="qtitle" style="margin-bottom:14px">Review & save</div>
      <div class="label">Other comments / observations</div>
      <textarea placeholder="Anything else noted on site…" oninput="setObs(this.value)">${esc(st.obs)}</textarea>
      <div class="label" style="margin-top:18px">Summary</div>
      <div id="reviewList">Loading…</div>
      <div class="hint" style="text-align:center;margin-top:18px">Saved to your dashboard. Use ‹ Menu to return, or delete it from there.</div>`;
    buildReview();
  }
  renderNav();
}

async function buildReview(){
  const wrap=document.getElementById("reviewList");if(!wrap)return;
  let h="";
  for(const it of ITEMS){
    const d=st.items[it.n]||{};let ans="";
    if(it.yn){const v=d.yn||"none";ans+=`<span class="tag ${v}">${v==='NA'?'N/A':(v==='none'?'—':v==='Y'?'Yes':'No')}</span>`;}
    if(d.chip && (!Array.isArray(d.chip)||d.chip.length))ans+=esc(Array.isArray(d.chip)?d.chip.join(", "):d.chip)+" ";
    (it.subs||[]).forEach((s,i)=>{
      if(d["s"+i+"yn"]){const v=d["s"+i+"yn"];ans+=`<br><small>${esc(s.q)}: ${v==='NA'?'N/A':v==='Y'?'Yes':'No'}</small>`;}
      if(d["s"+i+"chip"])ans+=`<br><small>${esc(s.q)}: ${esc(d["s"+i+"chip"])}</small>`;
      if(d["s"+i+"txt"])ans+=`<br><small>${esc(s.q)}: ${esc(d["s"+i+"txt"])}</small>`;
    });
    if(it.photo){const ph=await getPhotos(activeId,it.n);if(ph.length)ans+=`<br><small>📷 ${ph.length} photo${ph.length>1?'s':''}</small>`;}
    if(d.note)ans+=`<br><small>Note: ${esc(d.note)}</small>`;
    h+=`<div class="rev-item"><div class="rq" onclick="goItem(${ITEMS.indexOf(it)+1})">${esc(it.n)}. ${esc(it.q)}</div><div class="ra">${ans||'<span class="tag none">not answered</span>'}</div></div>`;
  }
  wrap.innerHTML=h;
}
function goItem(i){pos=i;goTop=true;renderApp();}
function renderNav(){
  const nav=document.getElementById("nav");
  if(pos===0)nav.innerHTML=`<button class="next" onclick="next()">Start →</button>`;
  else if(pos===LAST())nav.innerHTML=`<button class="back" onclick="prev()">← Back</button><button class="save" onclick="saveP()">Save PDF</button>`;
  else nav.innerHTML=`<button class="back" onclick="prev()">← Back</button><button class="next" onclick="next()">${pos===ITEMS.length?'Review →':'Next →'}</button>`;
}
function itemNeedsComment(it){const d=st.items[it.n]||{};if(it.yn&&d.yn==='N')return true;return (it.subs||[]).some((s,i)=>s.yn&&d["s"+i+"yn"]==='N');}
function itemHasComment(it){return !!((st.items[it.n]||{}).note||"").trim();}
function showItemCmtWarn(){const wn=document.getElementById("itemCmtWarn");if(wn)wn.style.display="block";const b=document.getElementById("itemCmt");if(b){b.style.borderColor="var(--red)";try{b.scrollIntoView({behavior:"smooth",block:"center"});}catch(e){}try{b.focus();}catch(e){}}}
function hideItemCmtWarn(){const wn=document.getElementById("itemCmtWarn");if(wn)wn.style.display="none";const b=document.getElementById("itemCmt");if(b)b.style.borderColor="";}
function next(){
  if(pos>=1&&pos<=ITEMS.length){const it=ITEMS[pos-1];if(itemNeedsComment(it)&&!itemHasComment(it)){showItemCmtWarn();return;}}
  if(pos<LAST()){pos++;goTop=true;renderApp();}
}
function prev(){if(pos>0){pos--;goTop=true;renderApp();}}
function setVal(id,key,val,re){const d=get(id);d[key]=(re&&d[key]===val)?"":val;save();if(re)renderApp();}
function setMeta(k,v){st.meta[k]=v;save();}
function setObs(v){st.obs=v;save();}

/* photo UI wrappers (use activeId) */
async function addPhotos(item,files){
  if(!files||!files.length)return;
  const lbl=document.getElementById("addlbl_"+item);
  const txt=lbl?lbl.querySelector(".addtxt"):null;
  if(txt)txt.textContent="Adding…";
  for(const f of Array.from(files)){const b=await compress(f);await addPhoto(activeId,item,b);}
  if(txt)txt.innerHTML='<span class="ic" style="font-size:18px">＋</span> Add photo';
  loadThumbs(item);save();
  if(lbl){const inp=lbl.querySelector('input[type=file]');if(inp)inp.value="";}
}
async function loadThumbs(item){
  const el=document.getElementById("ph_"+item);if(!el)return;
  const list=await getPhotos(activeId,item);
  el.innerHTML=list.map(p=>`<div class="thumb"><img src="${thumbURL(p)}"><button class="rm" onclick="delPhoto('${item}','${p.id}')">×</button></div>`).join("");
}
async function delPhoto(item,id){
  const realId=(typeof id==='string'&&id[0]==='m')?id:Number(id);
  await rmPhoto(activeId,item,realId);
  if(urlCache[realId]){URL.revokeObjectURL(urlCache[realId]);delete urlCache[realId];}
  loadThumbs(item);
}

/* ============ PDF ============ */
async function buildPrint(){
  const a=A();const t=TYPES[a.type];const m=st.meta;
  if(t.mode==="grid"){return buildPrintGrid(t,m);}
  let h=`<h2>${esc(t.name)}${t.ver?" — "+esc(t.ver):""}</h2>
    <table>
      <tr><td><b>Site address</b></td><td>${esc(m.addr)||'—'}</td><td><b>Auditor (FTT)</b></td><td>${esc(m.auditor)||'—'}</td></tr>
      <tr><td><b>Site contact</b></td><td>${esc(m.contact)||'—'}</td><td><b>Target date</b></td><td>${esc(m.date)||'—'}</td></tr>
      <tr><td><b>Contact mobile</b></td><td>${esc(m.contactPhone)||'—'}</td><td><b>Contact email</b></td><td>${esc(m.contactEmail)||'—'}</td></tr>
    </table>`;
  for(const it of ITEMS){
    const d=st.items[it.n]||{};let ai="";
    if(it.yn){const v=d.yn;ai+= v==='Y'?'<b style="color:#0a8f2a">YES</b>':v==='N'?'<b style="color:#c00">NO</b>':v==='NA'?'<b>N/A</b>':'<b>—</b>';}
    if(d.chip && (!Array.isArray(d.chip)||d.chip.length))ai+=` &nbsp; [${esc(Array.isArray(d.chip)?d.chip.join(", "):d.chip)}]`;
    let subs="";
    (it.subs||[]).forEach((s,i)=>{
      const yn=d["s"+i+"yn"];
      let disp;
      if(yn)disp= yn==='N'?'<b style="color:#c00">No</b>':yn==='NA'?'<b>N/A</b>':'<b style="color:#0a8f2a">Yes</b>';
      else disp='<b>'+esc(d["s"+i+"chip"]||d["s"+i+"txt"]||'—')+'</b>';
      subs+=`<div style="margin-left:14px;font-size:12px">› ${esc(s.q)}: ${disp}</div>`;
    });
    let imgs="";
    if(it.photo){const ph=await getPhotos(activeId,it.n);if(ph.length){const urls=(await Promise.all(ph.map(p=>blobToDataURL(p.blob)))).filter(Boolean);if(urls.length)imgs=`<div class="pimgs">${urls.map(u=>`<img src="${u}">`).join("")}</div>`;}}
    h+=`<div class="pi"><div class="pq">${esc(it.n)}. ${esc(it.q)} — ${ai}</div>${subs}${d.note?`<div class="pa">Note: ${esc(d.note)}</div>`:''}${imgs}</div>`;
  }
  if(st.obs)h+=`<div class="pi"><div class="pq">Other comments / observations</div><div class="pa">${esc(st.obs)}</div></div>`;
  document.getElementById("printView").innerHTML=h;
}
async function buildPrintGrid(t,m){
  const pf=v=>v==='P'?'Pass':v==='F'?'Fail':v==='NA'?'N/A':'—';
  let h=`<h2>${esc(t.name)}${t.ver?" — "+esc(t.ver):""}</h2>
    <table>
      <tr><td><b>Site name</b></td><td>${esc(m.siteName)||'—'}</td><td><b>Date</b></td><td>${esc(m.date)||'—'}</td></tr>
      <tr><td><b>Project Manager</b></td><td>${esc(m.pm)||'—'}</td><td><b>Field Tech</b></td><td>${esc(m.fieldTech)||'—'}</td></tr>
    </table>`;
  const pits=st.pits||[];
  if(pits.length){
    h+=`<table style="font-size:10.5px"><tr>${PIT_FIELDS.map(f=>`<td><b>${esc(f.label)}</b></td>`).join("")}</tr>`;
    pits.forEach(p=>{const f=p.fields||{};h+=`<tr>${PIT_FIELDS.map(col=>{let v=f[col.k]||"";if(col.type==="pf"){const disp=v==='P'?'<span style="color:#0a8f2a;font-weight:700">Pass</span>':v==='F'?'<span style="color:#c00;font-weight:700">Fail</span>':v==='NA'?'N/A':'—';return `<td>${disp}</td>`;}return `<td>${esc(v)||'—'}</td>`;}).join("")}</tr>`;});
    h+=`</table>`;
  }else{h+=`<p style="font-size:12px">No pits recorded.</p>`;}
  for(let i=0;i<pits.length;i++){const p=pits[i];const ph=await getPhotos(activeId,"P"+p.id);if(ph.length){const urls=(await Promise.all(ph.map(x=>blobToDataURL(x.blob)))).filter(Boolean);if(urls.length)h+=`<div class="pi"><div class="pq">${esc(p.fields.pitId||("Pit "+(i+1)))} — photos</div><div class="pimgs">${urls.map(u=>`<img src="${u}">`).join("")}</div></div>`;}}
  if(st.obs)h+=`<div class="pi"><div class="pq">Other comments / observations</div><div class="pa">${esc(st.obs)}</div></div>`;
  document.getElementById("printView").innerHTML=h;
}
async function saveP(){
  if(mode()==="grid"){const bad=(st.pits||[]).find(pitInvalid);if(bad){alert("“"+((bad.fields&&bad.fields.pitId)||"A pit")+"” has an item marked Fail but no comment.\n\nPlease add a comment for that pit before saving.");editPit(bad.id);setTimeout(showCmtWarn,80);return;}}
  else{for(let i=0;i<ITEMS.length;i++){const it=ITEMS[i];if(itemNeedsComment(it)&&!itemHasComment(it)){alert("Item "+it.n+" is marked No but has no comment.\n\nFTT to provide more info before saving.");pos=i+1;goTop=true;renderApp();setTimeout(showItemCmtWarn,80);return;}}}
  const btn=document.querySelector(".nav .save");if(btn)btn.textContent="Preparing…";await buildPrint();if(btn)btn.textContent="Save PDF";setTimeout(()=>window.print(),80);}

/* ============ init ============ */
idbOpen().then(()=>{loadDB();view="dashboard";renderApp();applyBranding();});
