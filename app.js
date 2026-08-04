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
    {q:"Wall (if MDF)", opts:{c:["Fire Rate","Fire Proof"]}},
    {q:"Power (DGPO) to MCR?", yn:1}
  ]},
  {n:"5", q:"Pathway from MCR to Riser — Cabletray ready?", opts:{lab:"Run (select all that apply)",c:["Vertical","Horizontal"],multi:1}, yn:1, photo:1},
  {n:"6", q:"Depth of Riser to fit FDT–FDH–DR (and DGPO)?", schem:1, yn:1, photo:1, subs:[
    {q:"Depth of Riser", inp:"e.g. 600 mm"},
    {q:"Size of penetration", inp:"e.g. 150 mm"},
    {q:"Wall (if MDF)", opts:{c:["Fire Rate","Fire Proof"]}}
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
  MDU:{name:"MDU Site Audit", sub:"Multi-Dwelling Unit", ver:"V.1.1", items:MDU_ITEMS, ready:true},
  PIT:{name:"Lead-in Pit Audit", sub:"Lead-in pit inspection", ver:"", items:PIT_ITEMS, ready:true,
    intro:"Mandatory photos: overall pit location · pit open (conduit entries) · pit lid closed · conduits inside pit · direction to BEP · any defects or damage."},
  SDU:{name:"SDU Site Audit", sub:"Single-Dwelling Unit", ver:"", items:[], ready:false}
};

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
var CH={};
function A(){return DB.audits[activeId];}
function pctOf(s,items){let t=0,c=0;items.forEach(it=>{if(it.yn){t++;if((s.items[it.n]||{}).yn)c++;}(it.subs||[]).forEach((sb,i)=>{if(sb.yn){t++;if((s.items[it.n]||{})["s"+i+"yn"])c++;}});});return t?Math.round(c/t*100):0;}

function save(){if(activeId&&DB.audits[activeId]){const a=DB.audits[activeId];a.updated=Date.now();a.site=(st.meta.addr||"").trim();a.date=st.meta.date||"";a.pct=pctOf(st,ITEMS);}saveDB();}

/* ============ render router ============ */
function renderApp(){
  const wiz=view==="wizard";
  document.getElementById("backMenu").style.display=wiz?"block":"none";
  document.getElementById("pbarWrap").style.display=wiz?"block":"none";
  document.getElementById("nav").style.display=wiz?"flex":"none";
  const logo=document.getElementById("appLogo");
  if(logo)logo.style.display=(logoOk&&!wiz)?"block":"none";
  if(wiz)renderScreen();else renderDashboard();
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
      const items=TYPES[a.type]?TYPES[a.type].items:[];
      const pct=pctOf(a.st,items);
      const site=a.site||"Untitled site";
      const when=a.updated?new Date(a.updated).toLocaleDateString():"";
      h+=`<div class="acard">
        <div class="r1"><span class="badge ${a.type}">${a.type}</span><span class="site">${esc(site)}</span></div>
        <div class="sub">${pct}% complete${when?" · updated "+when:""}</div>
        <div class="minibar"><span style="width:${pct}%"></span></div>
        <div class="acts">
          <button class="open" onclick="openAudit('${a.id}')">Open</button>
          <button onclick="pdfAudit('${a.id}')">PDF</button>
          <button class="del" onclick="deleteAudit('${a.id}')">🗑</button>
        </div>
      </div>`;
    });
  }
  sc.innerHTML=h;
  sc.scrollTop=0;
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
  activeId=id;ITEMS=TYPES[A().type].items;st=A().st;pos=0;view="wizard";renderApp();
}
function goMenu(){save();view="dashboard";renderApp();}
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
  activeId=id;ITEMS=TYPES[a.type].items;st=a.st;
  await buildPrint();setTimeout(()=>window.print(),80);
}

/* ============ wizard ============ */
function LAST(){return ITEMS.length+1;}
function ynHTML(id,key){const cur=(st.items[id]||{})[key]||"";return `<div class="yn">
  <button class="y ${cur==='Y'?'on':''}" onclick="setVal('${id}','${key}','Y',1)">Yes</button>
  <button class="n ${cur==='N'?'on':''}" onclick="setVal('${id}','${key}','N',1)">No</button>
  <button class="x ${cur==='NA'?'on':''}" onclick="setVal('${id}','${key}','NA',1)">N/A</button></div>`;}
function chipHTML(id,key,opts){
  if(opts.multi){const cur=Array.isArray((st.items[id]||{})[key])?(st.items[id][key]):[];
    return `<div class="chips">${opts.c.map(o=>`<button class="chip ${cur.indexOf(o)>-1?'on':''}" onclick="toggleMulti('${id}','${key}','${esc(o)}')">${esc(o)}</button>`).join("")}</div>`;}
  const cur=(st.items[id]||{})[key]||"";return `<div class="chips">${opts.c.map((o,i)=>`<button class="chip ${cur===o?'on':''}" onclick="setVal('${id}','${key}',CH['${id}_${key}'][${i}],1)">${esc(o)}</button>`).join("")}</div>`;
}
function toggleMulti(id,key,val){const d=get(id);let a=Array.isArray(d[key])?d[key].slice():[];const i=a.indexOf(val);if(i>-1)a.splice(i,1);else a.push(val);d[key]=a;save();renderScreen();}
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
        <label class="addph" id="addlbl_${it.n}"><span class="ic" style="font-size:18px">＋</span> Add photo
          <input type="file" accept="image/*" multiple style="display:none" onchange="addPhotos('${it.n}',this.files)"></label>
        <div class="hint">Tap to take a photo or choose from your library. Stored on this device; also upload to Towers.</div>`;
    }
    h+=`<div class="label">Comment (optional)</div><textarea placeholder="Notes for this item…" oninput="setVal('${it.n}','note',this.value,0)">${esc((st.items[it.n]||{}).note)}</textarea>`;
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
  sc.scrollTop=0;
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
function goItem(i){pos=i;renderScreen();}
function renderNav(){
  const nav=document.getElementById("nav");
  if(pos===0)nav.innerHTML=`<button class="next" onclick="next()">Start →</button>`;
  else if(pos===LAST())nav.innerHTML=`<button class="back" onclick="prev()">← Back</button><button class="save" onclick="saveP()">Save PDF</button>`;
  else nav.innerHTML=`<button class="back" onclick="prev()">← Back</button><button class="next" onclick="next()">${pos===ITEMS.length?'Review →':'Next →'}</button>`;
}
function next(){if(pos<LAST()){pos++;renderScreen();}}
function prev(){if(pos>0){pos--;renderScreen();}}
function setVal(id,key,val,re){const d=get(id);d[key]=(re&&d[key]===val)?"":val;save();if(re)renderScreen();}
function setMeta(k,v){st.meta[k]=v;save();}
function setObs(v){st.obs=v;save();}

/* photo UI wrappers (use activeId) */
async function addPhotos(item,files){
  if(!files||!files.length)return;const lbl=document.getElementById("addlbl_"+item);if(lbl)lbl.textContent="Adding…";
  for(const f of Array.from(files)){const b=await compress(f);await addPhoto(activeId,item,b);}
  if(lbl)lbl.innerHTML='<span class="ic" style="font-size:18px">＋</span> Add photo';loadThumbs(item);save();
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
  let h=`<h2>${esc(t.name)}${t.ver?" — "+esc(t.ver):""}</h2>
    <table>
      <tr><td><b>Site address</b></td><td>${esc(m.addr)||'—'}</td><td><b>Auditor (FTT)</b></td><td>${esc(m.auditor)||'—'}</td></tr>
      <tr><td><b>Site contact</b></td><td>${esc(m.contact)||'—'}</td><td><b>Target date</b></td><td>${esc(m.date)||'—'}</td></tr>
      <tr><td><b>Contact mobile</b></td><td>${esc(m.contactPhone)||'—'}</td><td><b>Contact email</b></td><td>${esc(m.contactEmail)||'—'}</td></tr>
    </table>`;
  for(const it of ITEMS){
    const d=st.items[it.n]||{};let ai="";
    if(it.yn){const v=d.yn;ai+=`<b>${v==='NA'?'N/A':v==='Y'?'YES':v==='N'?'NO':'—'}</b>`;}
    if(d.chip && (!Array.isArray(d.chip)||d.chip.length))ai+=` &nbsp; [${esc(Array.isArray(d.chip)?d.chip.join(", "):d.chip)}]`;
    let subs="";
    (it.subs||[]).forEach((s,i)=>{let sv=d["s"+i+"yn"]?(d["s"+i+"yn"]==='NA'?'N/A':d["s"+i+"yn"]==='Y'?'Yes':'No'):(d["s"+i+"chip"]||d["s"+i+"txt"]||'—');subs+=`<div style="margin-left:14px;font-size:12px">› ${esc(s.q)}: <b>${esc(sv)}</b></div>`;});
    let imgs="";
    if(it.photo){const ph=await getPhotos(activeId,it.n);if(ph.length){const urls=(await Promise.all(ph.map(p=>blobToDataURL(p.blob)))).filter(Boolean);if(urls.length)imgs=`<div class="pimgs">${urls.map(u=>`<img src="${u}">`).join("")}</div>`;}}
    h+=`<div class="pi"><div class="pq">${esc(it.n)}. ${esc(it.q)} — ${ai}</div>${subs}${d.note?`<div class="pa">Note: ${esc(d.note)}</div>`:''}${imgs}</div>`;
  }
  if(st.obs)h+=`<div class="pi"><div class="pq">Other comments / observations</div><div class="pa">${esc(st.obs)}</div></div>`;
  document.getElementById("printView").innerHTML=h;
}
async function saveP(){const btn=document.querySelector(".nav .save");if(btn)btn.textContent="Preparing…";await buildPrint();if(btn)btn.textContent="Save PDF";setTimeout(()=>window.print(),80);}

/* ============ init ============ */
idbOpen().then(()=>{loadDB();view="dashboard";renderApp();applyBranding();});
