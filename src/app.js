const T={
 es:{
  h1:'C++: mapa mental de skills técnicos y glosario',
  sub:'Basado en la guía de contratación de BairesDev (23 skills técnicos). Los textos son resúmenes propios. Haz click en cualquier skill para ver el detalle.',
  tabMap:'Mapa mental',tabGl:'Glosario',
  tabQuiz:'Quiz',
  tabCode:'Código',
  cTitle:'Predice la salida del código',cSub:'Lees un fragmento y eliges qué imprime o qué ocurre. Es el formato típico de las pruebas de proficiencia.',
  cLang:'Lenguaje',cAll:'Todos',cNote:'Los fragmentos van dentro de main(), con los #include necesarios y using namespace std; en C++.',
  cAsk:'¿Qué imprime?',cSeeTerm:'Ver en el glosario',cExplain:'Explicación',cAvail:'preguntas disponibles',cCorrectWas:'Respuesta correcta',
  qTitle:'Quiz: elige el concepto correcto',qSub:'Te muestro una definición y tú eliges a qué concepto corresponde.',
  qPool:'Términos',qPoolPending:'Pendientes',qPoolPrio:'Solo prioritarios',qPoolAll:'Todos',qCat:'Categoría',qLen:'Preguntas',
  qAvail:'términos disponibles',qStart:'Empezar',qNoPool:'No hay términos con esa selección. Cambia el filtro.',qWeight:'Los prioritarios salen con más frecuencia.',
  qQ:'Pregunta',qHits:'Aciertos',qStreak:'Racha',qWhich:'¿Qué concepto es?',
  qRight:'¡Correcto!',qWrongIs:'Era',qNext:'Siguiente',qFinish:'Ver resultado',
  qDone:'Resultado',qAgain:'Jugar otra vez',qSettings:'Cambiar ajustes',qPrioMissed:'Priorizar los fallados',qMissed:'Para repasar',qPerfect:'¡Perfecto! Ni un fallo.',
  qKeys:'Atajos: 1-4 para responder, Enter para continuar.',
  qMsgHi:'Muy bien, ya dominas esto.',qMsgMid:'Vas bien, repasa los que fallaste.',qMsgLo:'Toca repasar: marca los fallados como prioritarios.',

  detail:'Detalle',hint:'Selecciona un skill del mapa. Si tocas una categoría, resalta sus ramas. Los términos de abajo te llevan al glosario.',
  study:'Qué estudiar',terms:'Términos del glosario',forYou:'Para ti:',
  centerSub:'23 skills técnicos',search:'Buscar término o definición (ej: RAII, mutex, linker)',
  st:'Estado',cat:'Categoría',all:'Todos',allF:'Todas',
  stPending:'Pendientes',stPrio:'Prioritarios',stDone:'Archivados',stAll:'Todos',
  of:'de',terms_n:'términos',prio:'prioritarios',done:'archivados',
  btnPrio:'Priorizar',btnPrioOn:'Prioritario',btnDone:'Ya lo sé',btnDoneOn:'Restaurar',
  tPrio:'Marcar como prioritario',tPrioOn:'Quitar prioridad',tDone:'Ya lo conozco: archivar',tDoneOn:'Sacar del archivo',
  empty:'No hay términos con estos filtros.',
  note:'Tus marcas (archivados y prioritarios) se guardan en este navegador. Los prioritarios aparecen primero.'
 },
 en:{
  h1:'C++: technical skills mind map and glossary',
  sub:'Based on the BairesDev hiring guide (23 technical skills). Texts are original summaries. Click any skill to see the details.',
  tabMap:'Mind map',tabGl:'Glossary',
  tabQuiz:'Quiz',
  tabCode:'Code',
  cTitle:'Predict the code output',cSub:'You read a snippet and pick what it prints or what happens. This is the typical format of proficiency tests.',
  cLang:'Language',cAll:'All',cNote:'Snippets go inside main(), with the needed #include lines and using namespace std; in C++.',
  cAsk:'What does it print?',cSeeTerm:'See in glossary',cExplain:'Explanation',cAvail:'questions available',cCorrectWas:'Correct answer',
  qTitle:'Quiz: pick the right concept',qSub:'I show you a definition and you choose the concept it belongs to.',
  qPool:'Terms',qPoolPending:'Pending',qPoolPrio:'Priority only',qPoolAll:'All',qCat:'Category',qLen:'Questions',
  qAvail:'terms available',qStart:'Start',qNoPool:'No terms match this selection. Change the filter.',qWeight:'Priority terms show up more often.',
  qQ:'Question',qHits:'Correct',qStreak:'Streak',qWhich:'Which concept is it?',
  qRight:'Correct!',qWrongIs:'It was',qNext:'Next',qFinish:'See result',
  qDone:'Result',qAgain:'Play again',qSettings:'Change settings',qPrioMissed:'Prioritize the missed ones',qMissed:'To review',qPerfect:'Perfect! Not a single miss.',
  qKeys:'Shortcuts: 1-4 to answer, Enter to continue.',
  qMsgHi:'Great, you know this well.',qMsgMid:'Going well, review the ones you missed.',qMsgLo:'Time to review: mark the missed ones as priority.',

  detail:'Details',hint:'Select a skill on the map. Clicking a category highlights its branches. The terms below take you to the glossary.',
  study:'What to study',terms:'Glossary terms',forYou:'For you:',
  centerSub:'23 technical skills',search:'Search term or definition (e.g. RAII, mutex, linker)',
  st:'Status',cat:'Category',all:'All',allF:'All',
  stPending:'Pending',stPrio:'Priority',stDone:'Archived',stAll:'All',
  of:'of',terms_n:'terms',prio:'priority',done:'archived',
  btnPrio:'Prioritize',btnPrioOn:'Priority',btnDone:'I know it',btnDoneOn:'Restore',
  tPrio:'Mark as priority',tPrioOn:'Remove priority',tDone:'I already know it: archive',tDoneOn:'Take out of the archive',
  empty:'No terms match these filters.',
  note:'Your marks (archived and priority) are saved in this browser. Priority terms are shown first.'
 }
};

/* ---------- State ---------- */
const KEY='cppmap.v1';
const ST={lang:'es',done:[],prio:[]};
try{
  const r=JSON.parse(localStorage.getItem(KEY)||'null');
  if(r){ST.lang=r.lang==='en'?'en':'es';ST.done=Array.isArray(r.done)?r.done:[];ST.prio=Array.isArray(r.prio)?r.prio:[]}
}catch(e){}
const doneSet=new Set(ST.done),prioSet=new Set(ST.prio);
function persist(){
  ST.done=[...doneSet];ST.prio=[...prioSet];
  try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}
}
const L=()=>T[ST.lang];

/* ---------- Helpers ---------- */
const $=s=>document.querySelector(s);
const catById=Object.fromEntries(CATS.map(c=>[c.id,c]));
const gIndex=Object.fromEntries(GLOSS.map(g=>[g.t,g]));
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const skillOf=s=>ST.lang==='en'?Object.assign({},s,SKILLS_EN[s.n]):s;
const catName=id=>CAT_LINES[ST.lang][id].join(' ');
const defOf=g=>ST.lang==='en'?(GL_EN[g.t]||g.d):g.d;
const gcName=c=>GCAT[c][ST.lang];
const gcColor=c=>(GCAT[c]||{color:'#8b9bab'}).color;

/* ---------- Mind map ---------- */
const NS='http://www.w3.org/2000/svg';
const svg=$('#svg');
const W=1300,H=1000,CX=W/2,CY=H/2;
const R1=175,R2=395;
let selN=null;
function el(n,a,p){const e=document.createElementNS(NS,n);for(const k in (a||{}))e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e}

function buildMap(){
  svg.innerHTML='';svg.dataset.hl='';
  svg.setAttribute('aria-label',L().h1);
  const total=SKILLS.length,step=360/total;
  let angle=-90;
  const gLinks=el('g'),gNodes=el('g');
  CATS.forEach(cat=>{
    const items=SKILLS.filter(s=>s.c===cat.id);
    const start=angle;
    const pts=items.map((s,i)=>({s:skillOf(s),a:(start+step*(i+.5))*Math.PI/180}));
    angle+=step*items.length;
    const mid=(start+step*items.length/2)*Math.PI/180;
    const cx=CX+Math.cos(mid)*R1,cy=CY+Math.sin(mid)*R1;
    el('path',{d:`M${CX},${CY} L${cx},${cy}`,class:'link','data-c':cat.id,stroke:cat.color,'stroke-width':3,opacity:.7},gLinks);
    pts.forEach(({s,a})=>{
      const x=CX+Math.cos(a)*R2,y=CY+Math.sin(a)*R2;
      const mx=CX+Math.cos(a)*(R1+110),my=CY+Math.sin(a)*(R1+110);
      el('path',{d:`M${cx},${cy} Q${mx},${my} ${x},${y}`,class:'link','data-c':cat.id,stroke:cat.color,'stroke-opacity':.5},gLinks);
      const g=el('g',{class:'leaf'+(s.n===selN?' sel':''),'data-n':s.n,'data-c':cat.id,tabindex:0,role:'button','aria-label':s.name},gNodes);
      el('circle',{cx:x,cy:y,r:8,fill:cat.color,stroke:'#0f1419'},g);
      const cosA=Math.cos(a),side=Math.abs(cosA)<.25;
      const anchor=side?'middle':(cosA>0?'start':'end');
      const dx=side?0:(cosA>0?16:-16);
      const dy=side?(Math.sin(a)>0?26:-16):4;
      const t=el('text',{x:x+dx,y:y+dy,'text-anchor':anchor},g);
      wrapLabel(t,`${s.n}. ${s.name}`,x+dx);
      g.addEventListener('click',()=>selectSkill(s.n));
      g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectSkill(s.n)}});
    });
    const cg=el('g',{class:'cat','data-c':cat.id},gNodes);
    el('circle',{cx,cy,r:54,fill:cat.color},cg);
    const t=el('text',{x:cx,y:cy-4},cg);
    CAT_LINES[ST.lang][cat.id].forEach((l,i)=>{
      const s=document.createElementNS(NS,'tspan');s.setAttribute('x',cx);s.setAttribute('dy',i?'15':'0');s.textContent=l;t.appendChild(s);
    });
    cg.addEventListener('click',()=>highlightCat(cat.id));
  });
  const c=el('g',{class:'center'},gNodes);
  el('circle',{cx:CX,cy:CY,r:70},c);
  el('text',{x:CX,y:CY+2},c).textContent='C++';
  el('text',{x:CX,y:CY+22,class:'sub'},c).textContent=L().centerSub;
  $('#legend').innerHTML=CATS.map(c=>`<span style="--k:${c.color}">${esc(catName(c.id))}</span>`).join('');
}
function wrapLabel(t,text,x){
  const words=text.split(' ');let l1='',l2='';
  words.forEach(w=>{if((l1+' '+w).trim().length<=24&&!l2)l1=(l1+' '+w).trim();else l2=(l2+' '+w).trim()});
  const a=document.createElementNS(NS,'tspan');a.setAttribute('x',x);a.textContent=l1;t.appendChild(a);
  if(l2){const b=document.createElementNS(NS,'tspan');b.setAttribute('x',x);b.setAttribute('dy','15');b.textContent=l2;t.appendChild(b)}
}
function highlightCat(id){
  const on=svg.dataset.hl===id;
  svg.dataset.hl=on?'':id;
  svg.querySelectorAll('[data-c]').forEach(n=>n.classList.toggle('dim',!on&&n.dataset.c!==id));
}
function renderSide(){
  if(selN==null){
    $('#side').innerHTML=`<h2>${esc(L().detail)}</h2><p class="hint">${esc(L().hint)}</p>`;return;
  }
  const s=skillOf(SKILLS.find(x=>x.n===selN)),cat=catById[s.c];
  svg.querySelectorAll('.leaf').forEach(l=>l.classList.toggle('sel',+l.dataset.n===selN));
  const chips=(s.terms||[]).filter(t=>gIndex[t]).map(t=>{
    const g=gIndex[t];
    const cls=doneSet.has(t)?' done':'';
    const mark=prioSet.has(t)?'★ ':(doneSet.has(t)?'✓ ':'');
    return `<button class="chip${cls}" style="--k:${gcColor(g.c)}" data-t="${esc(t)}">${mark}${esc(t)}</button>`;
  }).join('');
  $('#side').innerHTML=`
    <span class="badge" style="background:${cat.color}">${esc(catName(s.c))}</span>
    <h2>${s.n}. ${esc(s.name)}</h2>
    <p>${esc(s.sum)}</p>
    <h4>${esc(L().study)}</h4>
    <ul>${s.study.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
    <h4>${esc(L().terms)}</h4>
    <div class="chips">${chips}</div>
    ${s.david?`<div class="david"><b>${esc(L().forYou)}</b> ${esc(s.david)}</div>`:''}`;
  $('#side').querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>gotoTerm(c.dataset.t)));
}
function selectSkill(n){selN=n;renderSide()}

/* ---------- Glossary ---------- */
const GCATS=[...new Set(GLOSS.map(g=>g.c))];
let gCat='all',gStatus='pending';
function renderFilters(){
  const stOpts=[['pending',L().stPending],['prio','★ '+L().stPrio],['done','✓ '+L().stDone],['all',L().stAll]];
  $('#status').innerHTML=`<span class="lbl">${esc(L().st)}</span>`+stOpts.map(([k,n])=>`<button class="${k===gStatus?'on':''}" data-k="${k}">${esc(n)}</button>`).join('');
  $('#status').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{gStatus=b.dataset.k;renderFilters();renderGloss()}));
  $('#filters').innerHTML=`<span class="lbl">${esc(L().cat)}</span><button class="${gCat==='all'?'on':''}" data-k="all">${esc(L().allF)}</button>`+
    GCATS.map(c=>`<button class="cat-btn ${gCat===c?'on':''}" style="--k:${gcColor(c)}" data-k="${esc(c)}">${esc(gcName(c))}</button>`).join('');
  $('#filters').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{gCat=b.dataset.k;renderFilters();renderGloss()}));
}
function renderGloss(flash){
  const q=$('#q').value.trim().toLowerCase();
  const list=GLOSS.filter(g=>{
    if(gStatus==='pending'&&doneSet.has(g.t))return false;
    if(gStatus==='prio'&&!prioSet.has(g.t))return false;
    if(gStatus==='done'&&!doneSet.has(g.t))return false;
    if(gCat!=='all'&&g.c!==gCat)return false;
    if(q&&!(g.t.toLowerCase().includes(q)||defOf(g).toLowerCase().includes(q)))return false;
    return true;
  }).sort((a,b)=>(prioSet.has(b.t)-prioSet.has(a.t))||a.t.localeCompare(b.t,'en',{sensitivity:'base'}));
  const n=GLOSS.length,d=doneSet.size,p=prioSet.size;
  $('#count').textContent=`${list.length} ${L().of} ${n} ${L().terms_n} · ★ ${p} ${L().prio} · ✓ ${d} ${L().done}`;
  $('#prog').style.width=(d/n*100)+'%';
  $('#pct').textContent=Math.round(d/n*100)+'%';
  $('#gl').innerHTML=list.length?list.map(g=>{
    const isP=prioSet.has(g.t),isD=doneSet.has(g.t);
    return `<div class="term${isP?' isprio':''}${isD?' isdone':''}${flash===g.t?' flash':''}" style="--k:${gcColor(g.c)}" data-t="${esc(g.t)}">
      <div class="top"><div><small>${esc(gcName(g.c))}</small><b>${esc(g.t)}</b></div>
        <div class="acts">
          <button class="star${isP?' on':''}" data-act="prio" data-t="${esc(g.t)}" title="${esc(isP?L().tPrioOn:L().tPrio)}" aria-pressed="${isP}">★ ${esc(isP?L().btnPrioOn:L().btnPrio)}</button>
          <button class="ok${isD?' on':''}" data-act="done" data-t="${esc(g.t)}" title="${esc(isD?L().tDoneOn:L().tDone)}" aria-pressed="${isD}">✓ ${esc(isD?L().btnDoneOn:L().btnDone)}</button>
        </div></div>
      <p>${esc(defOf(g))}</p></div>`;
  }).join(''):`<div class="empty">${esc(L().empty)}</div>`;
  if(flash){const e=$('#gl .flash');if(e)e.scrollIntoView({block:'center'})}
}
$('#gl').addEventListener('click',e=>{
  const b=e.target.closest('button[data-act]');if(!b)return;
  const t=b.dataset.t;
  if(b.dataset.act==='prio'){
    if(prioSet.has(t))prioSet.delete(t);else{prioSet.add(t);doneSet.delete(t)}
  }else{
    if(doneSet.has(t))doneSet.delete(t);else{doneSet.add(t);prioSet.delete(t)}
  }
  persist();renderGloss();renderSide();
});
function gotoTerm(t){
  show('gl');gStatus='all';gCat='all';$('#q').value='';renderFilters();renderGloss(t);
}
$('#q').addEventListener('input',()=>renderGloss());


/* ---------- Quiz ---------- */
const Q={pool:'pending',cat:'all',len:10,s:null,last:null};
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function maskDef(g){
  let d=defOf(g);
  [g.t,...g.t.split(' / ').filter(p=>p.length>=3)].forEach(p=>{
    const re=new RegExp('(?<![A-Za-z0-9_+])'+p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![A-Za-z0-9_])','gi');
    d=d.replace(re,'____');
  });
  return d;
}
function qPoolList(){
  return GLOSS.filter(g=>{
    if(Q.pool==='pending'&&doneSet.has(g.t))return false;
    if(Q.pool==='prio'&&!prioSet.has(g.t))return false;
    if(Q.cat!=='all'&&g.c!==Q.cat)return false;
    return true;
  });
}
function startQuiz(){
  const pool=qPoolList();if(!pool.length)return;
  const weighted=[];pool.forEach(g=>{const w=prioSet.has(g.t)?3:1;for(let i=0;i<w;i++)weighted.push(g)});
  const picked=[];const seen=new Set();
  shuffle(weighted).forEach(g=>{if(!seen.has(g.t)&&picked.length<Math.min(Q.len,pool.length)){seen.add(g.t);picked.push(g)}});
  const qs=picked.map(g=>{
    const same=shuffle(GLOSS.filter(x=>x.c===g.c&&x.t!==g.t));
    const other=shuffle(GLOSS.filter(x=>x.c!==g.c));
    const ds=[...same,...other].slice(0,3);
    return {g,opts:shuffle([g,...ds])};
  });
  Q.s={qs,i:0,score:0,streak:0,best:0,ans:null,missed:[]};
  renderQuiz();
}
function renderQuiz(){
  const box=$('#quiz'),l=L(),s=Q.s;
  if(!s){
    const n=qPoolList().length;
    const pools=[['pending',l.qPoolPending],['prio','★ '+l.qPoolPrio],['all',l.qPoolAll]];
    box.innerHTML=`<div class="qcard">
      <h2 style="margin:0 0 4px;font-size:20px">${esc(l.qTitle)}</h2>
      <p class="hint" style="margin:0 0 16px">${esc(l.qSub)}</p>
      <div class="row"><span class="lbl">${esc(l.qPool)}</span>${pools.map(([k,nm])=>`<button class="${Q.pool===k?'on':''}" data-qpool="${k}">${esc(nm)}</button>`).join('')}</div>
      <div class="row"><span class="lbl">${esc(l.qCat)}</span><button class="${Q.cat==='all'?'on':''}" data-qcat="all">${esc(l.allF)}</button>${GCATS.map(c=>`<button class="cat-btn ${Q.cat===c?'on':''}" style="--k:${gcColor(c)}" data-qcat="${esc(c)}">${esc(gcName(c))}</button>`).join('')}</div>
      <div class="row"><span class="lbl">${esc(l.qLen)}</span>${[5,10,20].map(k=>`<button class="${Q.len===k?'on':''}" data-qlen="${k}">${k}</button>`).join('')}</div>
      <p class="hint" style="margin:10px 0 14px">${n} ${esc(l.qAvail)}. ${esc(l.qWeight)}</p>
      ${n?'':`<p class="hint">${esc(l.qNoPool)}</p>`}
      <button class="btn primary" data-qact="start" ${n?'':'disabled'}>${esc(l.qStart)}</button>
    </div>`;
    return;
  }
  if(s.i>=s.qs.length){
    if(!s.logged){s.logged=1;setTimeout(()=>markDone('quiz'),0)}
    const N=s.qs.length,pct=Math.round(s.score/N*100);
    const msg=pct>=80?l.qMsgHi:(pct>=50?l.qMsgMid:l.qMsgLo);
    box.innerHTML=`<div class="qcard">
      <div class="qhead"><b>${esc(l.qDone)}</b><span>${esc(l.qStreak)}: <b>${s.best}</b></span></div>
      <div class="qscore">${s.score} / ${N} <span style="font-size:20px;color:var(--mut)">(${pct}%)</span></div>
      <p>${esc(s.missed.length?msg:l.qPerfect)}</p>
      ${s.missed.length?`<h4 style="margin:16px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--mut)">${esc(l.qMissed)}</h4>
      <ul class="qmiss">${s.missed.map(g=>`<li style="--k:${gcColor(g.c)}"><b>${esc(g.t)}</b>: ${esc(defOf(g))}</li>`).join('')}</ul>`:''}
      <div class="qbtns">
        <button class="btn primary" data-qact="again">${esc(l.qAgain)}</button>
        ${s.missed.length?`<button class="btn" data-qact="prioMissed">★ ${esc(l.qPrioMissed)}</button>`:''}
        <button class="btn" data-qact="settings">${esc(l.qSettings)}</button>
      </div></div>`;
    return;
  }
  const q=s.qs[s.i],g=q.g,N=s.qs.length,ans=s.ans;
  const isP=prioSet.has(g.t),isD=doneSet.has(g.t);
  box.innerHTML=`<div class="qcard">
    <div class="qhead"><span>${esc(l.qQ)} <b>${s.i+1}/${N}</b></span><span>${esc(l.qHits)}: <b>${s.score}</b></span><span>${esc(l.qStreak)}: <b>${s.streak}</b> ${s.streak>=3?'🔥':''}</span><span style="margin-left:auto"><button class="btn" data-qact="settings" style="padding:3px 10px;font-size:12px">${esc(l.qSettings)}</button></span></div>
    <div class="qprog"><i style="width:${(s.i+(ans?1:0))/N*100}%"></i></div>
    <span class="qcat" style="--k:${gcColor(g.c)}">${esc(gcName(g.c))}</span>
    <p class="qdef">${esc(maskDef(g))}</p>
    <div class="qopts">${q.opts.map((o,k)=>{
      let cls='';
      if(ans){if(o.t===g.t)cls='right';else if(o.t===ans)cls='wrong';else cls='faded'}
      return `<button class="qopt ${cls}" style="--k:${gcColor(o.c)}" data-qopt="${esc(o.t)}" ${ans?'disabled':''}><span class="n">${k+1}</span>${esc(o.t)}</button>`;
    }).join('')}</div>
    ${ans?`<div class="qfb ${ans===g.t?'ok':'bad'}">${ans===g.t?'✓ '+esc(l.qRight):'✗ '+esc(l.qWrongIs)+': <b>'+esc(g.t)+'</b>'}</div>
    <div class="qbtns">
      <button class="btn primary" data-qact="next">${esc(s.i+1>=N?l.qFinish:l.qNext)}</button>
      <button class="btn ${isP?'on':''}" data-qact="prio">★ ${esc(isP?l.btnPrioOn:l.btnPrio)}</button>
      <button class="btn ${isD?'on':''}" data-qact="done">✓ ${esc(isD?l.btnDoneOn:l.btnDone)}</button>
    </div>`:''}
    <p class="qkeys">${esc(l.qKeys)}</p></div>`;
}
function qToggle(kind,t){
  if(kind==='prio'){if(prioSet.has(t))prioSet.delete(t);else{prioSet.add(t);doneSet.delete(t)}}
  else{if(doneSet.has(t))doneSet.delete(t);else{doneSet.add(t);prioSet.delete(t)}}
  persist();renderGloss();renderSide();
}
function qAnswer(t){
  const s=Q.s;if(!s||s.ans||s.i>=s.qs.length)return;
  const g=s.qs[s.i].g;s.ans=t;recordActivity();
  if(t===g.t){s.score++;s.streak++;s.best=Math.max(s.best,s.streak)}else{s.streak=0;s.missed.push(g)}
  renderQuiz();
}
function qNext(){const s=Q.s;if(!s||!s.ans)return;s.i++;s.ans=null;renderQuiz()}
$('#quiz').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  const d=b.dataset;
  if(d.qpool){Q.pool=d.qpool;renderQuiz()}
  else if(d.qcat){Q.cat=d.qcat;renderQuiz()}
  else if(d.qlen){Q.len=+d.qlen;renderQuiz()}
  else if(d.qopt!==undefined)qAnswer(d.qopt);
  else if(d.qact==='start'||d.qact==='again')startQuiz();
  else if(d.qact==='settings'){Q.s=null;renderQuiz()}
  else if(d.qact==='next')qNext();
  else if(d.qact==='prio'||d.qact==='done'){qToggle(d.qact,Q.s.qs[Q.s.i].g.t);renderQuiz()}
  else if(d.qact==='prioMissed'){Q.s.missed.forEach(g=>{prioSet.add(g.t);doneSet.delete(g.t)});persist();renderGloss();renderSide();b.disabled=true;b.textContent='★ ✓'}
});
document.addEventListener('keydown',e=>{
  if(!$('#v-quiz').classList.contains('on')||!Q.s)return;
  if(e.target.tagName==='INPUT')return;
  const s=Q.s;
  if(s.i<s.qs.length&&!s.ans&&/^[1-4]$/.test(e.key)){const o=s.qs[s.i].opts[+e.key-1];if(o){e.preventDefault();qAnswer(o.t)}}
  else if((e.key==='Enter'||e.key===' ')&&s.ans&&s.i<s.qs.length){e.preventDefault();qNext()}
});


/* ---------- Code output game ---------- */
const CO={lang:'all',len:10,s:null};
const TOK={'@UB@':{es:'Comportamiento indefinido',en:'Undefined behavior'},'@CE@':{es:'Error de compilación',en:'Compile error'}};
const optTxt=o=>typeof o==='string'?(TOK[o]?TOK[o][ST.lang]:o):o[ST.lang];
const LGC={cpp:'#4f9cf9',c:'#e8e8e8'};
const lgName=l=>l==='cpp'?'C++':'C';
const cPool=()=>CQ.filter(q=>CO.lang==='all'||q.lang===CO.lang);
function startCode(){
  const pool=cPool();if(!pool.length)return;
  const picked=shuffle(pool).slice(0,Math.min(CO.len,pool.length));
  CO.s={qs:picked.map(q=>({q,order:shuffle(q.opts.map((_,i)=>i))})),i:0,score:0,streak:0,best:0,ans:null,missed:[]};
  renderCode();
}
function renderCode(){
  const box=$('#code'),l=L(),s=CO.s;
  if(!s){
    const n=cPool().length;
    const langs=[['all',l.cAll],['cpp','C++'],['c','C']];
    box.innerHTML=`<div class="qcard">
      <h2 style="margin:0 0 4px;font-size:20px">${esc(l.cTitle)}</h2>
      <p class="hint" style="margin:0 0 16px">${esc(l.cSub)}</p>
      <div class="row"><span class="lbl">${esc(l.cLang)}</span>${langs.map(([k,nm])=>`<button class="${CO.lang===k?'on':''}" data-clang="${k}">${esc(nm)}</button>`).join('')}</div>
      <div class="row"><span class="lbl">${esc(l.qLen)}</span>${[5,10,20].map(k=>`<button class="${CO.len===k?'on':''}" data-clen="${k}">${k}</button>`).join('')}</div>
      <p class="hint" style="margin:10px 0 14px">${n} ${esc(l.cAvail)}. ${esc(l.cNote)}</p>
      <button class="btn primary" data-cact="start" ${n?'':'disabled'}>${esc(l.qStart)}</button>
    </div>`;
    return;
  }
  if(s.i>=s.qs.length){
    if(!s.logged){s.logged=1;setTimeout(()=>markDone('code'),0)}
    const N=s.qs.length,pct=Math.round(s.score/N*100);
    const msg=pct>=80?l.qMsgHi:(pct>=50?l.qMsgMid:l.qMsgLo);
    box.innerHTML=`<div class="qcard">
      <div class="qhead"><b>${esc(l.qDone)}</b><span>${esc(l.qStreak)}: <b>${s.best}</b></span></div>
      <div class="qscore">${s.score} / ${N} <span style="font-size:20px;color:var(--mut)">(${pct}%)</span></div>
      <p>${esc(s.missed.length?msg:l.qPerfect)}</p>
      ${s.missed.length?`<h4 style="margin:16px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--mut)">${esc(l.qMissed)}</h4>
      <ul class="qmiss">${s.missed.map(q=>`<li style="--k:${gcColor(gIndex[q.term]?gIndex[q.term].c:'Lenguaje')}"><b>${esc(q.term)}</b>: ${esc(q.exp[ST.lang])}</li>`).join('')}</ul>`:''}
      <div class="qbtns">
        <button class="btn primary" data-cact="again">${esc(l.qAgain)}</button>
        ${s.missed.length?`<button class="btn" data-cact="prioMissed">★ ${esc(l.qPrioMissed)}</button>`:''}
        <button class="btn" data-cact="settings">${esc(l.qSettings)}</button>
      </div></div>`;
    return;
  }
  const {q,order}=s.qs[s.i],N=s.qs.length,ans=s.ans,tm=q.term,isP=prioSet.has(tm);
  const code=(q.pre?q.pre+'\n\n':'')+q.body;
  box.innerHTML=`<div class="qcard">
    <div class="qhead"><span>${esc(l.qQ)} <b>${s.i+1}/${N}</b></span><span>${esc(l.qHits)}: <b>${s.score}</b></span><span>${esc(l.qStreak)}: <b>${s.streak}</b> ${s.streak>=3?'🔥':''}</span><span style="margin-left:auto"><button class="btn" data-cact="settings" style="padding:3px 10px;font-size:12px">${esc(l.qSettings)}</button></span></div>
    <div class="qprog"><i style="width:${(s.i+(ans!==null?1:0))/N*100}%"></i></div>
    <span class="lgbadge" style="background:${LGC[q.lang]}">${lgName(q.lang)}</span>
    <pre class="code">${esc(code)}</pre>
    <p class="cask">${esc(q.ask?q.ask[ST.lang]:l.cAsk)}</p>
    <div class="qopts">${order.map((oi,k)=>{
      let cls='';
      if(ans!==null){if(oi===q.ans)cls='right';else if(oi===ans)cls='wrong';else cls='faded'}
      return `<button class="qopt plain ${cls}" style="--k:var(--c1)" data-copt="${oi}" ${ans!==null?'disabled':''}><span class="n">${k+1}</span>${esc(optTxt(q.opts[oi]))}</button>`;
    }).join('')}</div>
    ${ans!==null?`<div class="qfb ${ans===q.ans?'ok':'bad'}">${ans===q.ans?'✓ '+esc(l.qRight):'✗ '+esc(l.cCorrectWas)+': <b>'+esc(optTxt(q.opts[q.ans]))+'</b>'}
      <div class="qexp">${esc(q.exp[ST.lang])}</div></div>
    <div class="qbtns">
      <button class="btn primary" data-cact="next">${esc(s.i+1>=N?l.qFinish:l.qNext)}</button>
      <button class="btn" data-cact="term">${esc(l.cSeeTerm)}: ${esc(tm)}</button>
      <button class="btn ${isP?'on':''}" data-cact="prio">★ ${esc(isP?l.btnPrioOn:l.btnPrio)}</button>
    </div>`:''}
    <p class="qkeys">${esc(l.qKeys)}</p></div>`;
}
function cAnswer(oi){
  const s=CO.s;if(!s||s.ans!==null||s.i>=s.qs.length)return;
  const q=s.qs[s.i].q;s.ans=oi;recordActivity();
  if(oi===q.ans){s.score++;s.streak++;s.best=Math.max(s.best,s.streak)}else{s.streak=0;s.missed.push(q)}
  renderCode();
}
function cNext(){const s=CO.s;if(!s||s.ans===null)return;s.i++;s.ans=null;renderCode()}
$('#code').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  const d=b.dataset;
  if(d.clang){CO.lang=d.clang;renderCode()}
  else if(d.clen){CO.len=+d.clen;renderCode()}
  else if(d.copt!==undefined)cAnswer(+d.copt);
  else if(d.cact==='start'||d.cact==='again')startCode();
  else if(d.cact==='settings'){CO.s=null;renderCode()}
  else if(d.cact==='next')cNext();
  else if(d.cact==='term')gotoTerm(CO.s.qs[CO.s.i].q.term);
  else if(d.cact==='prio'){const t=CO.s.qs[CO.s.i].q.term;if(prioSet.has(t))prioSet.delete(t);else{prioSet.add(t);doneSet.delete(t)}persist();renderGloss();renderSide();renderCode()}
  else if(d.cact==='prioMissed'){CO.s.missed.forEach(q=>{prioSet.add(q.term);doneSet.delete(q.term)});persist();renderGloss();renderSide();b.disabled=true;b.textContent='★ ✓'}
});
document.addEventListener('keydown',e=>{
  if(!$('#v-code').classList.contains('on')||!CO.s)return;
  if(e.target.tagName==='INPUT')return;
  const s=CO.s;
  if(s.i<s.qs.length&&s.ans===null&&/^[1-4]$/.test(e.key)){const o=s.qs[s.i].order[+e.key-1];if(o!==undefined){e.preventDefault();cAnswer(o)}}
  else if((e.key==='Enter'||e.key===' ')&&s.ans!==null&&s.i<s.qs.length){e.preventDefault();cNext()}
});

/* ---------- Navigation by hash ---------- */
const VIEW_HASH={today:'hoy',map:'mapa',gl:'glosario',quiz:'quiz',code:'codigo',set:'ajustes'};
const HASH_VIEW=Object.fromEntries(Object.entries(VIEW_HASH).map(([k,v])=>[v,k]));
function nav(v){show(v);try{history.replaceState(null,'','#'+VIEW_HASH[v])}catch(e){}}
function route(){
  const h=(location.hash||'').slice(1);
  const go=h.endsWith('-go'),base=go?h.slice(0,-3):h;
  const v=HASH_VIEW[base];if(!v)return;
  show(v);
  if(go&&(v==='quiz'||v==='code'))goKind(v);
}
window.addEventListener('hashchange',route);

/* ---------- Tabs and language ---------- */
function show(v){
  ['today','map','gl','quiz','code','set'].forEach(k=>{
    $('#v-'+k).classList.toggle('on',v===k);$('#b-'+k).classList.toggle('on',v===k);
  });
  if(v==='set')renderSet();
  if(v==='today')renderToday();
  if(v==='quiz')renderQuiz();
  if(v==='code')renderCode();
}
$('#b-today').addEventListener('click',()=>nav('today'));
$('#b-map').addEventListener('click',()=>nav('map'));
$('#b-gl').addEventListener('click',()=>nav('gl'));
$('#b-quiz').addEventListener('click',()=>nav('quiz'));
$('#b-code').addEventListener('click',()=>nav('code'));
$('#b-set').addEventListener('click',()=>nav('set'));

function applyLang(){
  document.documentElement.lang=ST.lang;
  $('#t-h1').textContent=L().h1;$('#t-sub').textContent=L().sub;
  $('#b-today').textContent=TT().tab;$('#b-map').textContent=L().tabMap;$('#b-gl').textContent=L().tabGl;$('#b-quiz').textContent=L().tabQuiz;$('#b-code').textContent=L().tabCode;$('#b-set').textContent=SXT().tab;
  $('#q').placeholder=L().search;$('#note').textContent=L().note;
  document.title=L().h1;
  $('#l-es').classList.toggle('on',ST.lang==='es');$('#l-en').classList.toggle('on',ST.lang==='en');
  buildMap();renderSide();renderFilters();renderGloss();renderQuiz();renderCode();renderToday();renderSet();renderDue();syncSW();
}
function setLang(l){ST.lang=l;persist();applyLang()}
$('#l-es').addEventListener('click',()=>setLang('es'));
$('#l-en').addEventListener('click',()=>setLang('en'));

applyLang();
show('today');
initSW();
route();
