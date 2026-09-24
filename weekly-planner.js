(function(){
'use strict';
var KEY='jager_weekly_planner_v1',QSTART='2026-07-01',QEND='2026-09-30';
var TYPES=['LIG56','Ativação de consumo','Incentivo de brigada','Tailor Made','Treinamento de brigada','Visita comercial','Contrato','Cardápio','Outro'];
var KPIS=['ON6 / Perfect Outlet','Treinamento de brigada','Ativação de consumo','Contrato','Cardápio','Cobertura / visita','Outro'];
function q(s,r){return (r||document).querySelector(s)} function qa(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]})}
function ba(){return q('#ba-select')?q('#ba-select').value:'TODOS'}
function now(){return new Date().toISOString().slice(0,10)}
function add(s,n){var d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
function monday(s){var d=new Date((s||now())+'T12:00:00'),x=(d.getDay()+6)%7;d.setDate(d.getDate()-x);return d.toISOString().slice(0,10)}
function fmt(s){return s?new Date(s+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}):'sem data'}
function day(s){return new Date(s+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long'})}
function all(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}}
function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
function scoped(){var b=ba();return all().filter(function(x){return b==='TODOS'||x.ba===b})}
function modal(html){var old=q('#planner-modal');if(old)old.remove();var d=document.createElement('div');d.id='planner-modal';d.className='planner-modal';d.innerHTML='<div class="planner-dialog"><button class="planner-close">×</button>'+html+'</div>';document.body.appendChild(d);q('.planner-close',d).onclick=function(){d.remove()};d.onclick=function(e){if(e.target===d)d.remove()};return d}
function candidates(){
 var out={},b=ba(),tap=(window.PORTAL_DATA&&window.PORTAL_DATA.tapData)||{},groups=b==='TODOS'?Object.keys(tap):[b];
 groups.forEach(function(owner){(tap[owner]||[]).forEach(function(x){out[x.name]={name:x.name,area:x.area||'',ba:owner}})});
 return Object.keys(out).map(function(k){return out[k]})
}
function trainCount(){
 var r=window.PORTAL_DATA&&window.PORTAL_DATA.trainingRecords;if(!Array.isArray(r))return null;var b=ba();
 return r.filter(function(x){var yes=String(x.barStaffTraining||x.training||'').toLowerCase()==='yes',dt=String(x.trainingDate||x.date||'').slice(0,10);return yes&&dt>=QSTART&&dt<=QEND&&(b==='TODOS'||x.ba===b)}).length
}
function patchTraining(){
 var row=qa('.scorecard-row').filter(function(x){return /Treinamentos/i.test(x.innerText)})[0];if(!row)return;
 var st=q('.scorecard-kpi strong',row),sm=q('.scorecard-kpi small',row),n=trainCount();
 if(st)st.textContent='Treinamentos de brigada no Q3';
 if(sm)sm.textContent='Bar Staff Training = Yes + data dentro do quarter';
 if(n!==null&&q('.scorecard-result strong',row))q('.scorecard-result strong',row).textContent=n;
 if(n===null)row.title='A data de Bar Staff Training ainda não está exposta neste snapshot; a regra nova não força uma contagem.';
}
function addTask(pref){
 pref=pref||{};var cs=candidates(),bopts=qa('#ba-select option').filter(function(o){return o.value!=='TODOS'}).map(function(o){return '<option '+(o.value===(pref.ba||ba())?'selected':'')+'>'+esc(o.value)+'</option>'}).join('');
 var d=modal('<p class="eyebrow orange">PLANEJAR / IMPUTAR</p><h2>'+(pref.exec?'Registrar execução':'Adicionar à semana')+'</h2><div class="planner-form-grid">'+
 '<label>BA<select id="p-ba">'+bopts+'</select></label><label>Cliente<input id="p-client" list="p-clients" value="'+esc(pref.client||'')+'"></label><datalist id="p-clients">'+cs.map(function(c){return '<option value="'+esc(c.name)+'">' }).join('')+'</datalist>'+
 '<label>Área / rota<input id="p-area" value="'+esc(pref.area||'')+'"></label><label>Tipo<select id="p-type">'+TYPES.map(function(x){return '<option '+(x===(pref.type||'')?'selected':'')+'>'+x+'</option>'}).join('')+'</select></label>'+
 '<label>KPI<select id="p-kpi">'+KPIS.map(function(x){return '<option '+(x===(pref.kpi||'')?'selected':'')+'>'+x+'</option>'}).join('')+'</select></label><label>Data<input id="p-date" type="date" value="'+esc(pref.date||now())+'"></label>'+
 '<label>Status<select id="p-status"><option>Planejada</option><option '+(pref.exec?'selected':'')+'>Executada</option></select></label><label class="wide">Objetivo / tarefa<input id="p-obj" value="'+esc(pref.objective||'')+'"></label><label class="wide">Observação / resultado<textarea id="p-note" rows="3"></textarea></label></div><div id="p-near"></div><button class="planner-primary" id="p-save">Salvar</button>');
 function near(){
  var name=q('#p-client',d).value,hit=cs.filter(function(c){return c.name===name})[0];if(hit&&!q('#p-area',d).value)q('#p-area',d).value=hit.area||'';
  var area=q('#p-area',d).value.toLowerCase(),same=cs.filter(function(c){return c.name!==name&&area&&String(c.area).toLowerCase()===area}).slice(0,4);
  q('#p-near',d).innerHTML=same.length?'<strong>Outras visitas próximas</strong>'+same.map(function(c){return '<button type="button" data-near="'+esc(c.name)+'">'+esc(c.name)+'</button>'}).join(''):'';
  qa('[data-near]',d).forEach(function(bt){bt.onclick=function(){var c=same.filter(function(x){return x.name===bt.dataset.near})[0];d.remove();addTask({client:c.name,area:c.area,date:q('#p-date',d)?q('#p-date',d).value:now(),type:'Visita comercial',kpi:'Cobertura / visita'})}})
 }
 q('#p-client',d).onchange=near;q('#p-area',d).oninput=near;near();
 q('#p-save',d).onclick=function(){var rows=all();rows.push({id:'p'+Date.now(),ba:q('#p-ba',d).value,client:q('#p-client',d).value.trim()||'Tarefa sem cliente',area:q('#p-area',d).value.trim(),type:q('#p-type',d).value,kpi:q('#p-kpi',d).value,date:q('#p-date',d).value,status:q('#p-status',d).value,objective:q('#p-obj',d).value.trim(),note:q('#p-note',d).value.trim(),createdAt:new Date().toISOString()});save(rows);d.remove();render();home()}
}
function setStatus(id){var r=all(),x=r.filter(function(z){return z.id===id})[0];if(x){x.status='Executada';x.executedAt=new Date().toISOString();save(r);render();home()}}
function del(id){save(all().filter(function(x){return x.id!==id}));render();home()}
function suggestions(){var p=(window.PORTAL_DATA&&window.PORTAL_DATA.territoryProfiles&&window.PORTAL_DATA.territoryProfiles[ba()])||{},hot=(p.hotzones||[]).map(function(x){return x.toLowerCase()});return candidates().map(function(c){var a=String(c.area||'').toLowerCase(),score=hot.some(function(h){return a&&((a.indexOf(h)>=0)||(h.indexOf(a)>=0))})?30:0;return {name:c.name,area:c.area,score:score}}).sort(function(a,b){return b.score-a.score}).slice(0,8)}
function onepage(){
 var st=monday(),en=add(st,6),r=scoped().filter(function(x){return x.date>=st&&x.date<=en}).sort(function(a,b){return a.date.localeCompare(b.date)}),html='<div class="onepage"><p class="eyebrow orange">JÄGERMEISTER · ON-TRADE</p><h2>PRIORIDADES DA SEMANA</h2><p><b>'+esc(ba())+'</b> · '+fmt(st)+'–'+fmt(en)+'</p><div class="onepage-summary"><span>'+r.length+' planejadas</span><span>'+r.filter(function(x){return x.status==='Executada'}).length+' executadas</span></div>';
 for(var i=0;i<7;i++){var dt=add(st,i),list=r.filter(function(x){return x.date===dt});html+='<section><h3>'+esc(day(dt))+' · '+fmt(dt)+'</h3>'+(list.length?list.map(function(x){return '<article><strong>'+esc(x.client)+'</strong><span>'+esc(x.area)+'</span><b>'+esc(x.type)+'</b><p>'+esc(x.objective||x.kpi)+'</p></article>'}).join(''):'<p>Sem ações.</p>')+'</section>'}
 html+='</div><button class="planner-primary" onclick="window.print()">Imprimir / salvar PDF</button>';modal(html)
}
function render(){
 var view=q('#acoes');if(!view)return;var root=q('#weekly-planner');if(!root){root=document.createElement('section');root.id='weekly-planner';root.className='weekly-planner';var intro=q('.page-intro',view);if(intro)intro.after(root)}
 var st=monday(),en=add(st,6),rows=scoped(),cur=rows.filter(function(x){return x.date>=st&&x.date<=en}),pst=add(st,-7),pen=add(st,-1),prev=rows.filter(function(x){return x.date>=pst&&x.date<=pen}),sug=suggestions();
 root.innerHTML='<div class="planner-head"><div><p class="eyebrow orange">GESTOR + BA · Q3 2026</p><h2>Planner semanal</h2><p>Leitura → prioridade → rota → execução → revisão.</p></div><div class="planner-head-actions"><button id="p-manual">+ Tarefa manual</button><button id="p-exec">+ Imputar ação</button><button id="p-one">Gerar one-page</button></div></div>'+
 '<div class="planner-review"><article><small>SEMANA ANTERIOR</small><strong>'+prev.length+'</strong><span>planejadas</span></article><article><small>EXECUTADO</small><strong>'+prev.filter(function(x){return x.status==='Executada'}).length+'</strong><span>concluídas</span></article><article><small>SEMANA ATUAL</small><strong>'+cur.length+'</strong><span>'+fmt(st)+'–'+fmt(en)+'</span></article><article><small>CONCLUÍDAS</small><strong>'+cur.filter(function(x){return x.status==='Executada'}).length+'</strong><span>registros</span></article></div>'+
 '<div class="planner-columns"><section><div class="planner-subhead"><p class="eyebrow">SUGESTÕES</p><h3>Clientes para discutir</h3></div><div class="planner-suggestions">'+(sug.length?sug.map(function(c,i){return '<article><b>'+String(i+1).padStart(2,'0')+'</b><div><strong>'+esc(c.name)+'</strong><small>'+esc(c.area||'carteira')+'</small><span>'+(c.score?'Hotzone / proximidade':'Carteira disponível')+'</span></div><button data-add="'+esc(c.name)+'">Adicionar</button></article>'}).join(''):'<p>Sem sugestões nesta camada.</p>')+'</div></section>'+
 '<section><div class="planner-subhead"><p class="eyebrow">ROTA DA SEMANA</p><h3>'+fmt(st)+'–'+fmt(en)+'</h3></div><div class="planner-days">'+[0,1,2,3,4,5,6].map(function(n){var dt=add(st,n),list=cur.filter(function(x){return x.date===dt});return '<div class="planner-day"><header><strong>'+esc(day(dt))+'</strong><small>'+fmt(dt)+'</small></header>'+(list.length?list.map(function(x){return '<article class="'+(x.status==='Executada'?'done':'')+'"><div><strong>'+esc(x.client)+'</strong><small>'+esc((x.area?x.area+' · ':'')+x.type)+'</small><span>'+esc(x.objective||x.kpi)+'</span></div><div class="planner-task-actions">'+(x.status==='Executada'?'<em>feito</em>':'<button data-done="'+x.id+'">✓</button>')+'<button data-del="'+x.id+'">×</button></div></article>'}).join(''):'<p>Sem visitas</p>')+'</div>'}).join('')+'</div></section></div>';
 q('#p-manual',root).onclick=function(){addTask({type:'Visita comercial',kpi:'Cobertura / visita'})};q('#p-exec',root).onclick=function(){addTask({exec:true,type:'Ativação de consumo',kpi:'Ativação de consumo'})};q('#p-one',root).onclick=onepage;
 qa('[data-add]',root).forEach(function(bt){bt.onclick=function(){var c=sug.filter(function(x){return x.name===bt.dataset.add})[0];addTask({client:c.name,area:c.area,type:'Visita comercial',kpi:'Cobertura / visita'})}});
 qa('[data-done]',root).forEach(function(bt){bt.onclick=function(){setStatus(bt.dataset.done)}});qa('[data-del]',root).forEach(function(bt){bt.onclick=function(){del(bt.dataset.del)}})
}
function home(){
 var v=q('#inicio');if(!v)return;var b=q('#quarter-control-center');if(!b){b=document.createElement('section');b.id='quarter-control-center';b.className='quarter-control-center';var m=q('.metric-grid',v);if(m)m.after(b)}
 var st=monday(),en=add(st,6),r=scoped(),cs=candidates(),novisit=cs.filter(function(c){return !r.some(function(x){return x.client===c.name&&x.date>=st&&x.date<=en})}).length,late=r.filter(function(x){return x.status==='Planejada'&&x.date<now()}).length;
 b.innerHTML='<div class="qcc-head"><div><p class="eyebrow orange">CONTROLE DO QUARTER</p><h2>Prioridades e alertas</h2></div><button id="open-planner">Abrir Planner semanal</button></div><div class="qcc-filters"><button data-f="pending">KPIs pendentes</button><button data-f="stalled">KPIs parados</button><button data-f="five">Contas 5/6</button><button data-f="training">Sem treinamento validado</button><button data-f="novisit">Sem visita na semana</button></div><div class="qcc-alerts"><article><strong>'+novisit+'</strong><span>sem visita programada</span></article><article><strong>'+late+'</strong><span>planejados vencidos</span></article><article><strong>'+(trainCount()===null?'!':trainCount())+'</strong><span>treinamentos validados no Q3</span></article></div><p class="qcc-note">Treinamento válido = Bar Staff Training = Yes + data dentro do Q3. Sem data conciliada, o app não força nova contagem.</p>';
 q('#open-planner',b).onclick=function(){var bt=qa('[data-view="acoes"]')[0];if(bt)bt.click();setTimeout(function(){var x=q('#weekly-planner');if(x)x.scrollIntoView({behavior:'smooth'})},80)};
 patchTraining()
}
function init(){home();render();patchTraining();var s=q('#ba-select');if(s)s.addEventListener('change',function(){setTimeout(function(){home();render();patchTraining()},80)});document.addEventListener('click',function(e){if(e.target.closest('[data-view="inicio"]'))setTimeout(home,80);if(e.target.closest('[data-view="acoes"]'))setTimeout(render,80)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();