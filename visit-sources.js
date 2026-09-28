(() => {
  const D = window.VISIT_SOURCES;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number = n => n.toLocaleString('pt-BR');
  const date = d => `${d.slice(8,10)}/${d.slice(5,7)}${d.includes('T') ? ' '+d.slice(11) : ''}`;
  let month = 'all';
  function render() {
    const host = document.getElementById('visit-sources');
    if (!host || !D) return;
    const scope = document.getElementById('ba-select')?.value || 'BRASIL';
    const quarter = document.getElementById('quarter-select')?.value || localStorage.getItem('jager_quarter_view_v1') || '2026Q3';
    const team = window.QUARTER_V2?.t?.[scope];
    const scoped = rows => rows.filter(r => ['BRASIL','TODOS'].includes(scope) || (team ? team.includes(r.ba) : r.ba === scope));
    host.innerHTML = `<div class="vs-heading"><div><small>ATUALIZAÇÃO · 27/09/2026</small><h2>Registros BAM e LUNA</h2></div><label>Período<select id="vs-month"><option value="all">Julho a setembro</option><option value="07">Julho</option><option value="08">Agosto</option><option value="09">Setembro</option></select></label></div>`;
    host.querySelector('#vs-month').value = month;
    host.querySelector('#vs-month').addEventListener('change', event => { month = event.target.value; render(); });
    if (quarter !== '2026Q3') {
      host.insertAdjacentHTML('beforeend', '<p>Esta atualização contém registros de julho a setembro de 2026. Selecione Q3 no filtro de trimestre para consultá-los. Não há dados desta importação para o trimestre selecionado.</p>');
      return;
    }
    const allBam = scoped(D.bam), allLuna = scoped(D.luna);
    const period = rows => rows.filter(r => month === 'all' || r.date.slice(5,7) === month);
    const bam = period(allBam), luna = period(allLuna);
    const complete = luna.filter(r => r.status === 'completed').length;
    const lunaAvailable = month === 'all' || month === '09';
    const names = [...new Set([...allBam,...allLuna].map(r => r.ba))].sort((a,b) => a.localeCompare(b,'pt-BR'));
    const count = (rows, name, m) => rows.filter(r => r.ba === name && (!m || r.date.slice(5,7) === m)).length;
    host.insertAdjacentHTML('beforeend', `
      <p class="vs-note">BAM: Report (9), de 01/07 a 27/09. LUNA: 48 registros transcritos da lista e dos prints de setembro. O filtro de equipe acima se aplica às duas fontes.</p>
      <div class="vs-cards"><article><h3>BAM</h3><strong>${number(bam.length)}</strong><span>registros no período e equipe</span><small>Julho ${number(allBam.filter(r=>r.date.slice(5,7)==='07').length)} · Agosto ${number(allBam.filter(r=>r.date.slice(5,7)==='08').length)} · Setembro ${number(allBam.filter(r=>r.date.slice(5,7)==='09').length)}</small></article>
      <article><h3>LUNA</h3><strong>${lunaAvailable ? number(luna.length) : '—'}</strong><span>${lunaAvailable ? 'registros no recorte de setembro' : 'Julho e agosto não fornecidos'}</span><small>${lunaAvailable ? `${complete} concluídos · ${luna.length-complete} em andamento` : 'Sem informação para este período'}</small></article></div>
      <p class="vs-note">As fontes não são somadas. Registros podem representar retornos à mesma casa. O arquivo BAM nacional contém ${D.duplicates} repetições exatas, mantidas para conferência; os totais não representam visitas únicas. Ausência na LUNA não comprova ausência de atividade.</p>
      <details><summary>Comparativo mensal por embaixador</summary><div class="vs-scroll"><table><caption>BAM por mês · LUNA em setembro (independente do filtro de mês)</caption><thead><tr><th>Embaixador</th><th>BAM jul</th><th>BAM ago</th><th>BAM set</th><th>LUNA concluídos</th><th>LUNA em andamento</th></tr></thead><tbody>${names.map(name=>`<tr><th>${esc(name)}</th>${['07','08','09'].map(m=>`<td>${count(allBam,name,m)}</td>`).join('')}<td>${count(allLuna,name) ? allLuna.filter(r=>r.ba===name&&r.status==='completed').length : '—'}</td><td>${count(allLuna,name) ? allLuna.filter(r=>r.ba===name&&r.status==='progress').length : '—'}</td></tr>`).join('') || '<tr><td colspan="6">Sem registros para este filtro.</td></tr>'}</tbody></table></div></details>
      <details><summary>LUNA · consultar registros e pilares (${luna.length})</summary><p class="vs-note">✓ = marcação positiva; ✕ = negativa; — = não informado/indefinido. Marcações conferidas nos prints das 48 visitas. Símbolos cinza permanecem indefinidos. “Concluído” é o status do registro, não significa seis pilares atendidos.</p><div class="vs-scroll"><table><thead><tr><th>Data</th><th>Casa</th><th>Embaixador</th><th>Status</th>${['PS','TR','VI','ML','RP','AC'].map(p=>`<th>${p}</th>`).join('')}</tr></thead><tbody>${luna.map(r=>`<tr><td>${date(r.date)}</td><th>${esc(r.venue)}</th><td>${esc(r.ba)}</td><td>${r.status==='completed'?'Concluído':'Em andamento'}</td>${r.pillars.map(v=>`<td class="vs-${v===null?'unknown':v?'yes':'no'}" title="${v===null?'Não informado / indefinido':v?'Positivo':'Negativo'}">${v===null?'—':v?'✓':'✕'}</td>`).join('')}</tr>`).join('') || '<tr><td colspan="10">Sem registros fornecidos para este filtro.</td></tr>'}</tbody></table></div></details>
      <details><summary>BAM · consultar registros (${number(bam.length)})</summary><p class="vs-note">Eficiência preservada como informada no relatório original. Datas sem horário.</p><div class="vs-scroll vs-records"><table><thead><tr><th>Data</th><th>Casa</th><th>Embaixador</th><th>Eficiência</th></tr></thead><tbody>${[...bam].sort((a,b)=>b.date.localeCompare(a.date)).map(r=>`<tr><td>${date(r.date)}</td><th>${esc(r.venue)}</th><td>${esc(r.ba)}</td><td>${esc(r.efficiency)||'—'}</td></tr>`).join('') || '<tr><td colspan="4">Sem registros para este filtro.</td></tr>'}</tbody></table></div></details>`);
  }
  document.addEventListener('change', e => { if (['ba-select','quarter-select'].includes(e.target.id)) render(); });
  document.addEventListener('DOMContentLoaded', () => setTimeout(render, 350));
  render();
})();
