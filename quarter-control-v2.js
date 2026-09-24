(function(){
'use strict';
const D=window.QUARTER_V2;if(!D)return;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const scope=()=>$('#ba-select')?.value||'BRASIL';
const qtr=()=>$('#quarter-select')?.value||localStorage.getItem('jager_quarter_view_v1')||'2026Q3';
const members=s=>{
  if(s==='BRASIL') return [...(D.t['BAS:BRUNO']||[]),...(D.t['BAS:LEONARDO']||[])];
  if(s==='GERENTE:BRUNO') return D.t['BAS:BRUNO']||[];
  if(s==='GERENTE:LEONARDO') return D.t['BAS:LEONARDO']||[];
  return [s];
};
const arr=(ba)=>D.q[qtr()]?.[ba]||[0,0,0,0,0,0,0,0,0,0];
const sum=(idx)=>members(scope()).reduce((a,b)=>a+(arr(b)[idx]||0),0);
const base=()=>{
  if(scope()==='BRASIL') return D.m.enabledUnique;
  return members(scope()).reduce((a,b)=>a+((D.b[b]||[0,0])[1]||0),0);
};
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const label=()=>{
  const s=scope();
  if(s==='BRASIL')return 'Visão total';
  if(s==='GERENTE:BRUNO')return 'Gerência Bruno';
  if(s==='GERENTE:LEONARDO')return 'Gerência Leonardo';
  return s;
};
const kpis=()=>{
  const b=base(), visited=sum(2), records=sum(0), po=sum(3), critical=sum(5), five=sum(6), train=sum(7), activation=sum(8), tailor=sum(9);
  return {b,visited,records,po,critical,five,train,activation,tailor,unvisited:Math.max(0,b-visited),noTraining:Math.max(0,visited-train)};
};
function updateSnapshot(){
  const x=kpis(), q=qtr().slice(-2);
  const n=$('.snapshot-note'); if(n)n.innerHTML='<span class="live-dot"></span><strong>'+q+' 2026 · execução</strong> · '+x.visited+' contas da carteira com visita conciliada · '+x.records+' registros no quarter · base ativa: '+x.b+' contas únicas';
}
function updateCards(){
  const x=kpis(), cards=$$('#metric-grid .metric-card');
  const vals=[
    ['Base ativa',x.b,'contas únicas · B.A Management'],
    ['PO no quarter',x.po,'Perfect Outlet · Report (12)'],
    ['Gap crítico',x.critical,'contas 0/6–1/6 no quarter'],
    ['Cobertura',x.visited,'de '+x.b+' contas visitadas']
  ];
  cards.slice(0,4).forEach((c,i)=>{
    if(!vals[i])return;
    const l=$('.metric-label span',c),v=$('.metric-value',c),f=$('.metric-foot',c);
    if(l)l.textContent=vals[i][0]; if(v)v.textContent=vals[i][1]; if(f)f.textContent=vals[i][2];
  });
}
function updateScore(){
  const x=kpis(), rows=$$('.scorecard-row');
  const map=[
    {re:/Perfect Outlet|ON6/i,val:x.po},
    {re:/Cardápio|ativação de consumo/i,val:x.activation},
    {re:/Treinamentos/i,val:x.train},
    {re:/Base visitada|Cobertura/i,val:x.visited}
  ];
  rows.forEach(r=>{
    const title=$('.scorecard-kpi strong',r)?.textContent||'';
    const hit=map.find(m=>m.re.test(title)); if(!hit)return;
    const strong=$('.scorecard-result strong',r); if(strong)strong.textContent=hit.val;
    const ttxt=$('.scorecard-result span',r)?.textContent||'';
    const m=ttxt.match(/([0-9]+)/); const target=m?Number(m[1]):null;
    const p=target?Math.min(100,Math.round(hit.val/target*100)):null;
    const fill=$('.scorecard-progress span',r), pct=$('.scorecard-percent',r);
    if(fill)fill.style.width=(p??0)+'%'; if(pct)pct.textContent=p===null?'Meta a confirmar':p+'%';
  });
  const owner=$('#scorecard-owner'); if(owner)owner.textContent=label()+' · '+qtr().slice(-2)+' 2026';
}
function examples(type){
  const p=D.p[qtr()]||{}, out=[];
  members(scope()).forEach(ba=>(p[ba]||[]).forEach(r=>{if(r[1]===type)out.push({ba,name:r[0],score:r[2],date:r[3]})}));
  return out.slice(0,8);
}
function readings(){
  const x=kpis(), cover=x.b?Math.round(x.visited/x.b*100):0, trainRate=x.visited?Math.round(x.train/x.visited*100):0;
  const notes=[];
  if(qtr()==='2026Q4') notes.push('Q4 ainda não possui execução no Report (12); o painel mantém a carteira como referência, sem tratar ausência de visita como atraso.');
  else {
    notes.push('Cobertura do quarter: '+x.visited+' de '+x.b+' contas ('+cover+'%).');
    notes.push(x.critical?x.critical+' contas aparecem em 0/6–1/6 e precisam de recuperação de execução.':'Não há contas 0/6–1/6 registradas no escopo selecionado.');
    notes.push(x.five?x.five+' contas estão em 5/6 — são o caminho mais curto para gerar novos Perfect Outlets.':'Não há contas 5/6 identificadas no quarter.');
    notes.push('Treinamento validado em '+x.train+' contas ('+trainRate+'% das visitadas); '+x.noTraining+' visitadas seguem sem treinamento validado.');
  }
  const inds=[];
  if(x.five) inds.push('Priorizar primeiro as contas 5/6: exigem uma correção pontual e têm maior chance de virar PO rapidamente.');
  if(x.critical) inds.push('Montar rota de recuperação para contas 0/6–1/6, começando pelas que também estão em hotzones ou carteira foco.');
  if(x.noTraining) inds.push('Acoplar treinamento às próximas revisitas para ganhar KPI sem criar uma rota separada.');
  if(x.unvisited && qtr()!=='2026Q4') inds.push('Distribuir as '+x.unvisited+' contas sem visita no quarter por BA e região antes do fechamento.');
  if(!inds.length) inds.push('Manter cadência e revisar qualidade dos registros; o escopo não apresenta um gap operacional dominante.');
  return {notes,inds};
}
function renderControl(){
  const host=$('#quarter-control-center'); if(!host)return;
  const x=kpis(), ri=readings(), q=qtr().slice(-2);
  host.innerHTML='<div class="qcc-head"><div><p class="eyebrow orange">CONTROLE DO QUARTER</p><h2>Prioridades e alertas</h2><p>'+esc(label())+' · '+q+' 2026</p></div><button id="open-planner">Abrir Planner semanal</button></div>'+
  '<div class="qcc-filters">'+
  '<button data-f="unvisited">Sem visita <b>'+x.unvisited+'</b></button>'+
  '<button data-f="critical">0/6–1/6 <b>'+x.critical+'</b></button>'+
  '<button data-f="five">Contas 5/6 <b>'+x.five+'</b></button>'+
  '<button data-f="training">Sem treinamento <b>'+x.noTraining+'</b></button>'+
  '<button data-f="activation">Ativações <b>'+x.activation+'</b></button>'+
  '</div>'+
  '<div class="qcc-alerts"><article><strong>'+x.visited+'/'+x.b+'</strong><span>cobertura do quarter</span></article><article><strong>'+x.po+'</strong><span>Perfect Outlets</span></article><article><strong>'+x.train+'</strong><span>treinamentos validados</span></article><article><strong>'+x.tailor+'</strong><span>Tailor Made</span></article></div>'+
  '<div id="qcc-detail" class="qcc-detail"></div>'+
  '<div class="qcc-reading-grid"><article><p class="eyebrow">LEITURAS</p>'+ri.notes.map(n=>'<p>• '+esc(n)+'</p>').join('')+'</article><article><p class="eyebrow">INDICAÇÕES</p>'+ri.inds.map(n=>'<p>→ '+esc(n)+'</p>').join('')+'</article></div>'+
  '<p class="qcc-note">Fonte: B.A Management (carteira) + Report (12) (execução de 02/01 a 24/09/2026). Contas e visitas são conciliadas por nome normalizado e owner; divergências ficam fora da cobertura.</p>';
  $('#open-planner',host)?.addEventListener('click',()=>{const bt=$('[data-view="acoes"]');if(bt)bt.click();setTimeout(()=>$('#weekly-planner')?.scrollIntoView({behavior:'smooth'}),80)});
  $$('.qcc-filters button',host).forEach(bt=>bt.addEventListener('click',()=>{
    const type=bt.dataset.f, d=$('#qcc-detail',host);
    let list=[];
    if(type==='critical'||type==='five'||type==='training'||type==='unvisited') list=examples(type==='training'?'training':type);
    const titles={unvisited:'Exemplos sem visita no quarter',critical:'Exemplos 0/6–1/6',five:'Exemplos 5/6',training:'Exemplos visitados sem treinamento',activation:'Ativações registradas'};
    if(type==='activation'){d.innerHTML='<strong>'+titles[type]+'</strong><p>'+x.activation+' contas com ativação registrada no quarter selecionado.</p>';return;}
    d.innerHTML='<strong>'+titles[type]+'</strong>'+(list.length?'<div class="qcc-example-list">'+list.map(i=>'<span>'+esc(i.name)+' <small>· '+esc(i.ba.split(' ')[0])+(i.date?' · '+esc(i.date.split('-').reverse().join('/')):'')+'</small></span>').join('')+'</div>':'<p>Sem exemplo nominal disponível nesta camada; o contador acima continua calculado na base consolidada.</p>');
  }));
}
function fixFilters(){
  const sel=$('#ba-select'); if(!sel)return;
  const desired=['BRASIL','GERENTE:BRUNO','GERENTE:LEONARDO'];
  desired.forEach(v=>{const o=$('option[value="'+v+'"]',sel);if(o)o.textContent=v==='BRASIL'?'Visão total':v==='GERENTE:BRUNO'?'Gerência Bruno':'Gerência Leonardo'});
}
function run(){fixFilters();updateSnapshot();updateCards();updateScore();renderControl();}
document.addEventListener('change',e=>{if(e.target?.id==='ba-select'||e.target?.id==='quarter-select')setTimeout(run,120)});
document.addEventListener('DOMContentLoaded',()=>setTimeout(run,180));
setTimeout(run,250);
})();