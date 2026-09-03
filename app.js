const MASTER = "https://docs.google.com/spreadsheets/d/1ZfyRiL4b_ou_r-9dZD-7Eb_dNCl2a4TlsOukeVZdBjg/edit";

const metrics = {
  TODOS: [
    { label: "Base BAM", value: 205, foot: "contas SP + RJ", icon: "◎" },
    { label: "PO hoje", value: 71, foot: "meta do time: 176", icon: "✓" },
    { label: "Gap crítico", value: 74, foot: "contas 0/6–1/6", icon: "!", critical: true },
    { label: "Casas foco", value: 88, foot: "36 dentro do BAM", icon: "◆" }
  ],
  "Jerry Whilem": [
    { label: "Base BAM", value: 44, foot: "carteira atual", icon: "◎" },
    { label: "PO hoje", value: 13, foot: "meta: 46", icon: "✓" },
    { label: "Gap crítico", value: 11, foot: "contas 0/6–1/6", icon: "!", critical: true },
    { label: "Casas foco", value: 20, foot: "14 dentro do BAM", icon: "◆" }
  ],
  "Julia Gutvilen": [
    { label: "Base BAM", value: 11, foot: "carteira atual", icon: "◎" },
    { label: "PO hoje", value: 0, foot: "meta: 10", icon: "✓" },
    { label: "Gap crítico", value: 9, foot: "contas 0/6–1/6", icon: "!", critical: true },
    { label: "Casas foco", value: 2, foot: "1 dentro do BAM", icon: "◆" }
  ],
  "João Pedro Marques": [
    { label: "Base BAM", value: 46, foot: "carteira atual", icon: "◎" },
    { label: "PO hoje", value: 39, foot: "meta: 60", icon: "✓" },
    { label: "Gap crítico", value: 0, foot: "contas 0/6–1/6", icon: "!", critical: true },
    { label: "Casas foco", value: 17, foot: "12 dentro do BAM", icon: "◆" }
  ],
  "Maria Clarentino": [
    { label: "Base BAM", value: 17, foot: "carteira atual", icon: "◎" },
    { label: "PO hoje", value: 0, foot: "meta: 10", icon: "✓" },
    { label: "Gap crítico", value: 17, foot: "contas 0/6–1/6", icon: "!", critical: true },
    { label: "Casas foco", value: 17, foot: "3 dentro do BAM", icon: "◆" }
  ],
  "Mani Filardi": [
    { label: "Base BAM", value: 35, foot: "carteira atual", icon: "◎" },
    { label: "PO hoje", value: 1, foot: "meta: 10", icon: "✓" },
    { label: "Gap crítico", value: 32, foot: "contas 0/6–1/6", icon: "!", critical: true },
    { label: "Casas foco", value: 10, foot: "3 dentro do BAM", icon: "◆" }
  ],
  "Marcelo Martins": [
    { label: "Base BAM", value: 45, foot: "carteira atual", icon: "◎" },
    { label: "PO hoje", value: 18, foot: "meta: 30", icon: "✓" },
    { label: "Gap crítico", value: 0, foot: "contas 0/6–1/6", icon: "!", critical: true },
    { label: "Casas foco", value: 1, foot: "1 dentro do BAM", icon: "◆" }
  ],
  "Richard Cordeiro": [
    { label: "Base BAM", value: 7, foot: "carteira atual", icon: "◎" },
    { label: "PO hoje", value: 0, foot: "meta: 10", icon: "✓" },
    { label: "Gap crítico", value: 5, foot: "contas 0/6–1/6", icon: "!", critical: true },
    { label: "Casas foco", value: 11, foot: "2 dentro do BAM", icon: "◆" }
  ],
  "Gustavo Viana": [
    { label: "Base BAM", value: 0, foot: "sem contas atribuídas", icon: "◎" },
    { label: "PO hoje", value: 0, foot: "meta pendente", icon: "✓" },
    { label: "Gap crítico", value: 0, foot: "contas 0/6–1/6", icon: "!", critical: true },
    { label: "Casas foco", value: 0, foot: "0 dentro do BAM", icon: "◆" }
  ]
};

const pendingMetrics = [
  { label: "Base BAM", value: "—", foot: "consultar Master", icon: "◎" },
  { label: "PO hoje", value: "—", foot: "consultar Master", icon: "✓" },
  { label: "Gap crítico", value: "—", foot: "consultar Master", icon: "!", critical: true },
  { label: "Casas foco", value: "—", foot: "consultar Master", icon: "◆" }
];

const scorecardLabels = ["Perfect Outlet / ON6", "Contratos foco", "Cardápios novos no Q3", "Treinamentos no Q3", "Não visitados no Q3"];
const scorecardWeights = [30, 25, 25, 10, 10];
const quarterScorecards = {
  TODOS: { owner: "Visão consolidada do time", targets: [176, 28, 42, 148, 0], actuals: [71, 0, null, null, 0] },
  "Jerry Whilem": { owner: "Jerry · Senior Brand Ambassador · RJ", targets: [46, 6, 10, 36, 0], actuals: [13, 0, null, null, 0] },
  "Julia Gutvilen": { owner: "Julia · Student Brand Ambassador · RJ", targets: [10, 1, 3, 10, 0], actuals: [0, 0, null, null, 0] },
  "João Pedro Marques": { owner: "João · Brand Ambassador · SP", targets: [60, 8, 10, 36, null], actuals: [39, 0, null, null, 0] },
  "Maria Clarentino": { owner: "Maria · Brand Ambassador · SP", targets: [10, 2, 3, 10, 0], actuals: [0, 0, null, null, 0] },
  "Mani Filardi": { owner: "Mani · Brand Ambassador · SP", targets: [10, 2, 3, 10, 0], actuals: [1, 0, null, null, 0] },
  "Marcelo Martins": { owner: "Marcelo · Brand Ambassador · SP", targets: [30, 8, 10, 36, null], actuals: [18, 0, null, null, 0] },
  "Richard Cordeiro": { owner: "Richard · Embaixador · Campinas", targets: [10, 1, 3, 10, 0], actuals: [0, 0, null, null, 0] },
  "Gustavo Viana": { owner: "Gustavo · metas numéricas pendentes", targets: [null, null, null, null, null], actuals: [0, 0, null, null, 0] }
};

const actions = [
  { ba: "Jerry Whilem", short: "Jerry", route: "Botafogo", client: "Macuna", action: "Executar treinamento e reauditar", kpi: "ON6 + Treinamento", impact: "+1 PO +1 treinamento", deadline: "Esta semana", status: "A fazer" },
  { ba: "Jerry Whilem", short: "Jerry", route: "Lagoa", client: "Aldeia + Caza Lagoa", action: "Resolver ativação e preço nas duas contas na mesma rota", kpi: "ON6", impact: "Até +2 PO", deadline: "1–2 semanas", status: "A fazer" },
  { ba: "Jerry Whilem", short: "Jerry", route: "Centro / Lapa", client: "Portal", action: "Ativação e treinamento na mesma visita", kpi: "ON6 + Treinamento", impact: "+1 PO +1 treinamento", deadline: "1–2 semanas", status: "A fazer" },
  { ba: "Jerry Whilem", short: "Jerry", route: "Botafogo", client: "Canastra Rosé", action: "Transformar negociação em data de fechamento", kpi: "Contrato foco", impact: "+1 contrato potencial", deadline: "Esta semana", status: "A fazer" },
  { ba: "Julia Gutvilen", short: "Julia", route: "Barra / Olegário", client: "Boteco Rio's", action: "Corrigir Perfect Serve, ativação e reauditar", kpi: "ON6", impact: "+1 PO", deadline: "1–2 semanas", status: "A fazer" },
  { ba: "João Pedro Marques", short: "João", route: "Visita obrigatória", client: "Manifesto", action: "Fazer baseline BAM, ritual e plano de execução", kpi: "Cobertura", impact: "Diagnóstico acionável", deadline: "Próxima quinta", status: "A fazer" },
  { ba: "João Pedro Marques", short: "João", route: "Pinheiros", client: "Odecasa + Pracinha", action: "Ativação e treinamento em rota combinada", kpi: "ON6 + Treinamento", impact: "Até +2 PO", deadline: "1–2 semanas", status: "A fazer" },
  { ba: "João Pedro Marques", short: "João", route: "Pinheiros", client: "Penicilina", action: "Resolver listing, cardápio e treinamento", kpi: "Cardápio", impact: "+1 cardápio", deadline: "2–3 semanas", status: "A fazer" },
  { ba: "João Pedro Marques", short: "João", route: "Comercial", client: "AMATA", action: "Levar proposta revisada de R$ 30 mil e avançar decisão", kpi: "Contrato foco", impact: "Avanço comercial", deadline: "Esta semana", status: "A fazer" },
  { ba: "Maria Clarentino", short: "Maria", route: "Centro / República", client: "Formosa + Cortina + Balsa", action: "Priorizar listing, cardápio e treinamento", kpi: "Cardápio + Treinamento", impact: "Até +3 cardápios", deadline: "2–3 semanas", status: "A fazer" },
  { ba: "Mani Filardi", short: "Mani", route: "Pinheiros / Vila Madalena", client: "Galo + Guarita", action: "Atacar listing, cardápio, treinamento e serve gelado", kpi: "Cardápio", impact: "Preparar PO", deadline: "Esta semana", status: "Planejada" }
];

const linkGroups = {
  results: [
    { icon: "↗", title: "Report mensal", note: "Resultados e entregas do mês", type: "Formulário", url: "https://docs.google.com/forms/d/e/1FAIpQLSf81YoXVs_Dfj7vdyCvICGzBhWwne7PfQewtZL947MbVUsZrw/viewform" },
    { icon: "EV", title: "Eventos SP/RJ", note: "Incluir eventos e acompanhar o andamento", type: "Planilha", url: "https://docs.google.com/spreadsheets/d/1X3y1y4Yk8BzZJ4Z874EbIjhbM_ox0i9a/edit?usp=drivesdk&ouid=111432047122403337192&rtpof=true&sd=true" },
    { icon: "+", title: "Novo cliente · Interfood", note: "Cadastrar uma nova conta na Interfood", type: "Formulário", url: "https://docs.google.com/forms/d/e/1FAIpQLSdUSl9LilkInxFbnkYPVOcAG65hppRZrvPCZHHxg8ObVm5DQA/viewform" },
    { icon: "✓", title: "Registros da semana", note: "Ações, entregas e histórico operacional", type: "Planilha", url: `${MASTER}#gid=2109876543` },
    { icon: "◎", title: "Atingimento por BA", note: "Resultados por KPI e responsável", type: "Planilha", url: `${MASTER}#gid=39721450` }
  ],
  execution: [
    { icon: "§", title: "Incluir contrato", note: "Preencher novo contrato ou acordo", type: "Formulário", url: "https://docs.google.com/forms/d/1dc9DMEI-nnbvY6aPB3UF0ayygIooBH0z4q47jPg14VM/viewform" },
    { icon: "CT", title: "Controle de contratos", note: "Acompanhar contratos e projetos League 56", type: "SharePoint", url: "https://mastjaegermeister.sharepoint.com/:x:/r/sites/ORG_SE_BrasilTeam/_layouts/15/Doc.aspx?sourcedoc=%7B30DD36C7-8BB8-4435-A096-54FA0723342A%7D&file=Controle%20de%20Contratos_Versao%20final.xlsx&action=default&mobileredirect=true" },
    { icon: "56", title: "Feierstarters · Ação semanal", note: "Incluir casas para o planejamento da semana", type: "SharePoint", url: "https://mastjaegermeister-my.sharepoint.com/:x:/r/personal/luisa_benvenuto_jaegermeister_com/_layouts/15/Doc.aspx?sourcedoc=%7B5C2034FC-7A98-41D8-9138-3B42933C53F5%7D&file=Acordos%20Night-Outs.xlsx&action=default&mobileredirect=true" },
    { icon: "TM", title: "Tailor Made", note: "Registrar projeto dentro da negociação", type: "Planilha", url: `${MASTER}#gid=848136530` },
    { icon: "M", title: "Comodato e máquinas", note: "Cadastro e acompanhamento operacional", type: "Planilha", url: `${MASTER}#gid=2109876543` },
    { icon: "#", title: "Número da Tap Machine", note: "Solicitar identificação da máquina", type: "Formulário", url: "https://docs.google.com/forms/d/e/1FAIpQLSd4QZ9xHMKhEz3OZw3emZxRYfP_hOs6O1IpM2Fqr6iKmPVV_Q/viewform" }
  ],
  requests: [
    { icon: "▣", title: "Produção de arte e POS", note: "Solicitar peças e materiais de ponto de venda", type: "Formulário", url: "https://forms.gle/VVTNmtGKTwC4pchk6" },
    { icon: "!", title: "Problemas logísticos", note: "Registrar falhas e solicitar suporte", type: "Formulário", url: "https://docs.google.com/forms/d/e/1FAIpQLSeGJmyWoNuq-yuEtQtsfFd4WYxP6e3spk3K70R211j0LucjYg/viewform" },
    { icon: "NF", title: "NF para pagamento direto", note: "Enviar nota fiscal de fornecedor", type: "Formulário", url: "https://docs.google.com/forms/d/e/1FAIpQLScUh2dV8PBALz30DUQ49deWTlBchGuY-k5uRfzmAhgs3ozXXQ/viewform" },
    { icon: "IF", title: "Portal Interfood", note: "Pedidos e processos comerciais", type: "Sistema", url: "https://portal.interfood.com.br/" }
  ],
  bases: [
    { icon: "⌂", title: "Painel operacional", note: "Metas, gaps e prioridades", type: "Master", url: `${MASTER}#gid=1611332193` },
    { icon: "1", title: "Base Única", note: "Cadastro central de clientes", type: "Master", url: `${MASTER}#gid=1267293536` },
    { icon: "B", title: "BAM Latest", note: "Última fotografia oficial do BAM", type: "Master", url: `${MASTER}#gid=400586686` },
    { icon: "◆", title: "Casas Foco", note: "Prioridades estratégicas SP e RJ", type: "Master", url: `${MASTER}#gid=58411104` },
    { icon: "R", title: "Rota Board", note: "Rotas, regiões e Hotzones", type: "Master", url: `${MASTER}#gid=1758712340` },
    { icon: "C", title: "Calendário KSM", note: "Agenda de ações e ativações", type: "Master", url: `${MASTER}#gid=1447478522` },
    { icon: "EV", title: "Eventos SP/RJ", note: "Input e acompanhamento oficial de eventos", type: "Planilha", url: "https://docs.google.com/spreadsheets/d/1X3y1y4Yk8BzZJ4Z874EbIjhbM_ox0i9a/edit?usp=drivesdk&ouid=111432047122403337192&rtpof=true&sd=true" },
    { icon: "✓", title: "TO DO por BA", note: "Plano operacional semanal", type: "Master", url: `${MASTER}#gid=598635112` },
    { icon: "B", title: "BAM — sistema", note: "Acesso ao site do BAM", type: "Sistema", url: "https://bam.wundertec.com/jagersocial_back/" }
  ],
  brand: [
    { icon: "G", title: "Guia da marca", note: "Brand guide oficial", type: "Box", url: "https://jaegermeister.box.com/s/eqyc2efpxonlmsz6xxsjkdg21x0o6tpy" },
    { icon: "J", title: "Logos 2024", note: "Arquivos de logo oficiais", type: "Box", url: "https://jaegermeister.box.com/s/ep8w7iueb2hap0oiclgx04cggjzn5nq8" },
    { icon: "70", title: "Garrafa 700 ml", note: "Imagens oficiais do produto", type: "Box", url: "https://jaegermeister.box.com/s/m9d1bbs8gcmunpztl18lvlcirgsjgk3r" },
    { icon: "@", title: "Redes sociais", note: "Assets para canais sociais", type: "Box", url: "https://jaegermeister.box.com/s/vafs8ya6eca3ko24bp770dwx78ctsroz" },
    { icon: "▣", title: "Fotos de materiais", note: "Referências internas de POS", type: "Box", url: "https://jaegermeister.box.com/s/s6s903utrphi6aytlq1ugasi9yed9buf" },
    { icon: "A", title: "Artes já prontas", note: "Peças disponíveis para uso", type: "Box", url: "https://jaegermeister.box.com/s/swoi1803wud5503wmx44gmu2l6i63b61" }
  ],
  strategy: [
    { icon: "🏆", title: "Copa Brand Ambassadors", note: "Incentivo vigente para o time de BAs", type: "PDF", url: "https://drive.google.com/file/d/1uptKZa7TYbEDJXC7DSoLuUCSb2yDrCeW/view?usp=drivesdk" },
    { icon: "F", title: "Feierstarters · Projeto", note: "Apresentação e diretrizes do projeto", type: "Apresentação", url: "https://docs.google.com/presentation/d/1DuvnR93YTCv9me5UN1qhI5McLUFPlEuAomDIayuD2Vg/edit?usp=drivesdk" },
    { icon: "56", title: "League 56 · Cliente", note: "Apresentação comercial do projeto", type: "Apresentação", url: "https://docs.google.com/presentation/d/1OLJmvEvyU_7v8dYdwAY55LISKHy6qOPedQKFoXEA3c8/edit?usp=drivesdk" },
    { icon: "POS", title: "Book de materiais On-Trade", note: "Materiais Jägermeister e Interfood", type: "PDF", url: "https://drive.google.com/file/d/1MXH_bKKPS9-l99QJQqVrFnE42YBkuCqF/view?usp=drivesdk" },
    { icon: "DR", title: "Drinks Strategy 2026", note: "Estratégia de drinks para o Brasil", type: "Apresentação", url: "https://docs.google.com/presentation/d/1OR-XWmWoGcTZBIzHqqQj-58ZMPA5rI-YLs0EHmHrvN0/edit?usp=drivesdk" },
    { icon: "T", title: "Teremana · Brand Deck", note: "Apresentação da marca para o Brasil", type: "PDF", url: "https://drive.google.com/file/d/1i5LS_7yTDDe2JvSu2imiIYxq6nbcYnyX/view?usp=drivesdk" }
  ],
  training: [
    { icon: "▶", title: "Treinamento Tap Machine", note: "Vídeo de operação da máquina", type: "Vídeo", url: "https://vimeo.com/818415116/9ec1fccaea" },
    { icon: "4G", title: "Manual Tap 4th Gen", note: "Manual técnico em PDF", type: "Manual", url: "https://jaegermeister.box.com/shared/static/u4ivnhc7o2mbb11uz70oyqujl35ij9ok.pdf" },
    { icon: "R", title: "Manual Tap Retrô", note: "Operação do modelo Retrô", type: "Manual", url: "https://jaegermeister.box.com/s/wg3o035t3mmahscaxbubzbezof1ncugx" },
    { icon: "$", title: "Reembolso de despesas", note: "Guia de preenchimento", type: "Guia", url: "https://drive.google.com/file/d/1AlXU0aBF0V-ulGF6KsvufUWO_klrg4-S/view" },
    { icon: "P", title: "Colocando pedidos", note: "Guia do processo de pedidos", type: "Guia", url: "https://drive.google.com/file/d/1LO6iLlGTSzu3Pvc9Vm05-K2RdOjztp_O/view" },
    { icon: "L", title: "Lifestyle", note: "Biblioteca interna de imagens", type: "Box", url: "https://jaegermeister.box.com/s/jbcmhyzo0uui16bcqxu6wil29ndfybx1" }
  ]
};

const baSelect = document.querySelector("#ba-select");
const searchInput = document.querySelector("#action-search");
const statusFilter = document.querySelector("#status-filter");

function metricCards(items) {
  return items.map(item => `
    <article class="metric-card ${item.critical ? "critical" : ""}">
      <div class="metric-label"><span>${item.label}</span><span class="metric-icon">${item.icon}</span></div>
      <div class="metric-value">${item.value}</div>
      <div class="metric-foot"><strong>${item.foot.split(":")[0]}</strong>${item.foot.includes(":") ? `: ${item.foot.split(":").slice(1).join(":")}` : ""}</div>
    </article>`).join("");
}

function scorecardRows(ba) {
  const card = quarterScorecards[ba] || quarterScorecards.TODOS;
  document.querySelector("#scorecard-owner").textContent = card.owner;
  return scorecardLabels.map((label, index) => {
    const target = card.targets[index];
    const actual = card.actuals[index];
    const isInverse = index === 4;
    const percent = target === null || actual === null
      ? null
      : isInverse && target === 0
        ? (actual === 0 ? 100 : 0)
        : target > 0
          ? Math.min(100, Math.round((actual / target) * 100))
          : 0;
    const currentLabel = actual === null ? "A apurar" : isInverse ? `${actual}%` : actual;
    const targetLabel = target === null ? "A confirmar" : isInverse ? `${target}%` : target;
    return `
      <article class="scorecard-row ${percent === null ? "pending" : ""}">
        <div class="scorecard-kpi"><strong>${label}</strong><small>Peso ${scorecardWeights[index]}%</small></div>
        <div class="scorecard-result"><strong>${currentLabel}</strong><span>/ ${targetLabel}</span></div>
        <div class="scorecard-progress" aria-label="${percent === null ? "Meta a confirmar" : `${percent}% de atingimento`}">
          <span style="width:${percent ?? 0}%"></span>
        </div>
        <strong class="scorecard-percent">${percent === null ? "Pendente" : `${percent}%`}</strong>
      </article>`;
  }).join("");
}

function actionRows(items) {
  return items.map(item => `
    <article class="action-row">
      <div class="action-client"><strong>${item.client}</strong><small>${item.short} · ${item.route}</small></div>
      <div class="action-copy"><span>${item.action}</span><small>${item.impact}</small></div>
      <span class="kpi-tag">${item.kpi}</span>
      <span class="status">${item.deadline}</span>
      <span class="action-arrow">→</span>
    </article>`).join("");
}

function linkCards(items) {
  return items.map(item => `
    <a class="link-card" href="${item.url}" target="_blank" rel="noreferrer">
      <span class="link-card-icon">${item.icon}</span>
      <span><strong>${item.title}</strong><small>${item.note}</small><em class="link-type">${item.type}</em></span>
      <span class="link-card-arrow">↗</span>
    </a>`).join("");
}

function selectedActions() {
  const ba = baSelect.value;
  const query = (searchInput?.value || "").trim().toLocaleLowerCase("pt-BR");
  const status = statusFilter?.value || "todos";
  return actions.filter(item => {
    const byBA = ba === "TODOS" || item.ba === ba;
    const haystack = `${item.client} ${item.route} ${item.action} ${item.kpi}`.toLocaleLowerCase("pt-BR");
    const byQuery = !query || haystack.includes(query);
    const byStatus = status === "todos" || item.status === status;
    return byBA && byQuery && byStatus;
  });
}

function renderDashboard() {
  const ba = baSelect.value;
  const data = metrics[ba] || pendingMetrics;
  document.querySelector("#metric-grid").innerHTML = metricCards(data);
  document.querySelector("#scorecard-grid").innerHTML = scorecardRows(ba);
  const filtered = actions.filter(item => ba === "TODOS" || item.ba === ba);
  document.querySelector("#home-actions").innerHTML = filtered.length ? actionRows(filtered) : `<div class="empty-state"><strong>Sem prioridade registrada para esta visão.</strong><span>Consulte o TO DO por BA na Master.</span></div>`;
  document.querySelector("#focus-title").textContent = ba === "TODOS" ? "Fechar o gap começando pelas contas 5/6 e 4/6." : `Priorizar as entregas de ${ba.split(" ")[0]} nesta semana.`;
  const targets = ba === "Jerry Whilem"
    ? [[7,"PO"],[2,"Contratos"],[2,"Cardápios"],[8,"Treinamentos"]]
    : ba === "TODOS"
      ? [[21,"PO"],[7,"Contratos"],[9,"Cardápios"],[30,"Treinamentos"]]
      : [["—","PO"],["—","Contratos"],["—","Cardápios"],["—","Treinamentos"]];
  document.querySelector("#focus-targets").innerHTML = targets.map(([value,label]) => `<div class="target-pill"><strong>${value}</strong><small>${label}</small></div>`).join("");
  renderActions();
}

function renderActions() {
  const items = selectedActions();
  document.querySelector("#all-actions").innerHTML = actionRows(items);
  document.querySelector("#actions-empty").hidden = items.length !== 0;
}

function changeView(id) {
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === id));
  document.querySelectorAll("[data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === id));
  const view = document.querySelector(`#${id}`);
  document.querySelector("#view-title").textContent = view?.dataset.title || "Time SP–RJ";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => changeView(button.dataset.view)));
baSelect.addEventListener("change", renderDashboard);
searchInput.addEventListener("input", renderActions);
statusFilter.addEventListener("change", renderActions);

document.querySelector("#results-links").innerHTML = linkCards(linkGroups.results);
document.querySelector("#execution-links").innerHTML = linkCards(linkGroups.execution);
document.querySelector("#request-links").innerHTML = linkCards(linkGroups.requests);
document.querySelector("#base-links").innerHTML = linkCards(linkGroups.bases);
document.querySelector("#brand-links").innerHTML = linkCards(linkGroups.brand);
document.querySelector("#strategy-links").innerHTML = linkCards(linkGroups.strategy);
document.querySelector("#training-links").innerHTML = linkCards(linkGroups.training);
renderDashboard();
