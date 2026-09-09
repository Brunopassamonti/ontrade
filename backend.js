/* Integração protegida Supabase · On-Trade Brasil */
(function backendMain() {
  const SUPABASE_URL = "https://oxgyjcohszzhjcfejsct.supabase.co";
  const SUPABASE_KEY = "sb_publishable_5Xq26DUYoxBwBGqDLwkioA_cmS0_9kl";
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  let currentUser = null;
  let currentStaff = null;

  const byCode = (rows, code) => rows.find(row => row.kpi_code === code);
  const n = value => value === null || value === undefined ? 0 : Number(value);
  const cleanName = name => String(name || "arquivo").replace(/[^\p{L}\p{N}._-]+/gu, "-").slice(0, 120);

  function authShell() {
    if (document.querySelector("#auth-shell")) return document.querySelector("#auth-shell");
    const shell = document.createElement("div");
    shell.id = "auth-shell";
    shell.className = "auth-shell";
    shell.innerHTML = `
      <section class="auth-card" aria-labelledby="auth-title">
        <div class="auth-brand">JÄGERMEISTER <span>ON-TRADE</span></div>
        <p class="eyebrow orange">DADOS PROTEGIDOS</p>
        <h2 id="auth-title">Entre para acessar a base Brasil</h2>
        <p id="auth-copy">Use seu e-mail corporativo. Você receberá um link de acesso e verá apenas a sua carteira ou a sua equipe.</p>
        <form id="auth-form">
          <label>E-mail
            <input id="auth-email" type="email" autocomplete="email" required placeholder="nome@empresa.com" />
          </label>
          <button type="submit" class="auth-primary">Enviar link de acesso</button>
        </form>
        <p id="auth-status" class="auth-status" role="status"></p>
        <button type="button" id="auth-demo" class="auth-secondary">Continuar na versão demonstrativa</button>
      </section>`;
    document.body.appendChild(shell);
    shell.querySelector("#auth-demo").addEventListener("click", () => shell.classList.add("hidden"));
    shell.querySelector("#auth-form").addEventListener("submit", async event => {
      event.preventDefault();
      const email = shell.querySelector("#auth-email").value.trim();
      const status = shell.querySelector("#auth-status");
      status.textContent = "Enviando…";
      const { error } = await client.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${location.origin}${location.pathname}` }
      });
      status.textContent = error
        ? `Não foi possível enviar: ${error.message}`
        : "Link enviado. Abra o e-mail neste aparelho para entrar.";
    });
    return shell;
  }

  function setAuthState(message, pending = false) {
    const shell = authShell();
    shell.classList.remove("hidden");
    shell.querySelector("#auth-title").textContent = pending ? "Acesso aguardando liberação" : "Entre para acessar a base Brasil";
    shell.querySelector("#auth-copy").textContent = message;
    shell.querySelector("#auth-form").hidden = pending;
    shell.querySelector("#auth-demo").textContent = "Continuar na versão demonstrativa";
  }

  function addUserMenu() {
    if (document.querySelector("#user-menu")) return;
    const topbar = document.querySelector(".topbar");
    const menu = document.createElement("div");
    menu.id = "user-menu";
    menu.className = "user-menu";
    menu.innerHTML = `<span id="live-user"></span><button type="button" id="logout-button">Sair</button>`;
    topbar.appendChild(menu);
    menu.querySelector("#logout-button").addEventListener("click", async () => {
      await client.auth.signOut();
      location.reload();
    });
  }

  function setSnapshotLabel() {
    const note = document.querySelector(".snapshot-note");
    if (!note) return;
    note.innerHTML = `<span class="live-dot"></span><strong>Supabase · base oficial Brasil</strong> · B.A Management + Report (8) · atualização 08/09/2026 <span class="secure-pill">ACESSO PROTEGIDO</span>`;
  }

  function targetSet(scoreRows, baId) {
    const rows = scoreRows.filter(row => row.ba_id === baId);
    const get = code => {
      const row = byCode(rows, code);
      return row?.confirmation_status === "confirmed" && row.target_value !== null ? n(row.target_value) : null;
    };
    return {
      po: get("perfect_outlet"),
      contracts: get("focus_contracts"),
      activation: get("impact_menu_activation"),
      trainings: get("trainings")
    };
  }

  function aggregateTargets(scoreRows, baIds) {
    const codes = ["perfect_outlet", "focus_contracts", "impact_menu_activation", "trainings"];
    return codes.map(code => {
      const rows = scoreRows.filter(row => baIds.includes(row.ba_id) && row.kpi_code === code);
      if (!rows.length || rows.some(row => row.confirmation_status !== "confirmed" || row.target_value === null)) return null;
      return rows.reduce((sum, row) => sum + n(row.target_value), 0);
    });
  }

  function registerLiveScope(key, label, evo, week, targets, scoreRowsForBa = null) {
    const base = n(evo.base_total);
    const visited = n(evo.current_visited);
    const po = n(evo.current_perfect_outlets);
    const trainings = n(evo.current_trainings);
    const taps = n(evo.current_tap_equipment);
    metrics[key] = [
      { label: "Base oficial", value: base, foot: "clientes ativos únicos · B.A Management", icon: "◎" },
      { label: "PO hoje", value: po, foot: `evolução: ${n(evo.perfect_outlet_delta) >= 0 ? "+" : ""}${n(evo.perfect_outlet_delta)} desde ${evo.previous_date || "última base"}`, icon: "✓" },
      { label: "Treinamentos Q3", value: trainings, foot: `evolução: ${n(evo.training_delta) >= 0 ? "+" : ""}${n(evo.training_delta)} desde a última base`, icon: "▲" },
      { label: "Taps ativas", value: taps, foot: `evolução: ${n(evo.tap_delta) >= 0 ? "+" : ""}${n(evo.tap_delta)} equipamentos`, icon: "TAP" }
    ];

    weeklyEvolution[key] = {
      owner: label,
      visits: n(week?.registrations),
      newCoverage: n(evo.visited_delta),
      revisits: n(week?.revisits),
      base,
      before: n(evo.previous_visited),
      current: visited,
      po: n(evo.perfect_outlet_delta),
      training: n(evo.training_delta),
      taps: n(evo.tap_delta)
    };

    const targetValues = scoreRowsForBa
      ? [targets.po, targets.contracts, targets.activation, targets.trainings]
      : targets;
    const actualByCode = code => {
      const row = scoreRowsForBa ? byCode(scoreRowsForBa, code) : null;
      return row?.result_value === null || row?.result_value === undefined ? null : n(row.result_value);
    };
    quarterScorecards[key] = {
      owner: label,
      targets: [...targetValues, base],
      actuals: [
        po,
        actualByCode("focus_contracts"),
        actualByCode("impact_menu_activation"),
        trainings,
        visited
      ]
    };

    if (!territoryProfiles[key]) territoryProfiles[key] = { areas: [], hotzones: [], castles: [], city: "Brasil" };
    if (!tapData[key]) tapData[key] = [];
    if (!baInsights[key]) {
      baInsights[key] = {
        observations: [`Cobertura atual: ${visited}/${base} casas (${base ? Math.round(visited / base * 100) : 0}%).`],
        todos: [base > visited ? `Planejar visita para ${base - visited} casas ainda sem cobertura confirmada no Q3.` : "Manter cadência e revisar a qualidade dos registros."],
        suggestions: [n(week?.registrations) ? `Usar as ${n(week.registrations)} visitas da semana para organizar a próxima rota.` : "Revisar rota e registrar as próximas visitas no BAM."]
      };
    }
  }

  async function loadLiveData() {
    const results = await Promise.all([
      client.from("staff_members").select("id,display_name,full_name,role,manager_id,manager_scope,roster_status,active").eq("auth_user_id", currentUser.id).maybeSingle(),
      client.from("v_ba_evolution").select("*"),
      client.from("v_manager_evolution").select("*"),
      client.from("v_national_evolution").select("*"),
      client.from("v_weekly_visit_metrics").select("*"),
      client.from("v_weekly_manager_metrics").select("*"),
      client.from("v_weekly_national_metrics").select("*"),
      client.from("v_q3_scorecard").select("*")
    ]);
    const firstError = results.find(result => result.error)?.error;
    if (firstError) throw firstError;

    currentStaff = results[0].data;
    if (!currentStaff) {
      const claim = await client.rpc("claim_staff_access");
      if (!claim.error && claim.data) {
        const linked = await client.from("staff_members")
          .select("id,display_name,full_name,role,manager_id,manager_scope,roster_status,active")
          .eq("auth_user_id", currentUser.id)
          .maybeSingle();
        currentStaff = linked.data;
      }
    }
    if (!currentStaff) {
      setAuthState("Seu login foi criado, mas este e-mail ainda não consta no cadastro oficial do time. Peça ao gestor para liberar o acesso.", true);
      return;
    }

    const baRows = results[1].data || [];
    const managerRows = results[2].data || [];
    const nationalRows = results[3].data || [];
    const weeklyBa = results[4].data || [];
    const weeklyManager = results[5].data || [];
    const weeklyNational = results[6].data || [];
    const scoreRows = results[7].data || [];
    const options = [];

    if (currentStaff.role === "director" && nationalRows[0]) {
      const evo = nationalRows[0];
      const visibleBaIds = baRows.map(row => row.ba_id);
      registerLiveScope("BRASIL", "Brasil · visão nacional", evo, weeklyNational[0], aggregateTargets(scoreRows, visibleBaIds));
      options.push({ value: "BRASIL", label: "Brasil · visão nacional" });
    }

    managerRows.forEach(row => {
      const key = `GERENTE:${row.manager_id}`;
      const teamIds = baRows.filter(ba => ba.manager_id === row.manager_id).map(ba => ba.ba_id);
      const week = weeklyManager.find(item => item.manager_id === row.manager_id);
      registerLiveScope(key, `${row.manager_name} · visão da equipe`, row, week, aggregateTargets(scoreRows, teamIds));
      options.push({ value: key, label: `Gerente · ${row.manager_name}` });
    });

    baRows.forEach(row => {
      const key = row.ba_name;
      const week = weeklyBa.find(item => item.ba_id === row.ba_id);
      const rows = scoreRows.filter(item => item.ba_id === row.ba_id);
      registerLiveScope(key, `${row.ba_name} · ${row.manager_name}`, row, week, targetSet(scoreRows, row.ba_id), rows);
      options.push({ value: key, label: `BA · ${row.ba_name}` });
    });

    if (!options.length) throw new Error("Nenhuma visão foi liberada para este usuário.");
    baSelect.innerHTML = options.map(option => `<option value="${option.value}">${option.label}</option>`).join("");
    baSelect.value = options[0].value;
    document.querySelector(".ba-filter > span").textContent = currentStaff.role === "ba" ? "SUA CARTEIRA" : "VISÃO · BRASIL, GERENTE OU BA";
    document.querySelector(".topbar .eyebrow").textContent = "JÄGERMEISTER · ON-TRADE BRASIL · Q3 2026";
    document.querySelector("#live-user").textContent = currentStaff.display_name || currentStaff.full_name;
    authShell().classList.add("hidden");
    addUserMenu();
    setSnapshotLabel();
    renderDashboard();
    resetConsultant();
  }

  function classifyDocument(file) {
    const name = file.name.toLowerCase();
    if (name.includes("cnpj")) return "cnpj";
    if (name.includes("cpf") || name.includes("rg") || name.includes("cnh")) return "owner_id";
    if (name.includes("endereco") || name.includes("residencia")) return "address_proof";
    if (name.includes("contrato")) return "company_contract";
    return "supporting_document";
  }

  function findAfter(text, labels) {
    const normalized = text.replace(/\r/g, "\n");
    for (const label of labels) {
      const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const match = normalized.match(new RegExp(`${escaped}\\s*[:\\-]?\\s*([^\\n]{3,120})`, "i"));
      if (match) return match[1].trim();
    }
    return "";
  }

  function parseBusinessText(text) {
    const oneLine = text.replace(/\s+/g, " ");
    const cnpj = oneLine.match(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/)?.[0] || "";
    const cep = oneLine.match(/\b\d{5}-?\d{3}\b/)?.[0] || "";
    const cpf = oneLine.match(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/)?.[0] || "";
    return {
      cnpj,
      legal_name: findAfter(text, ["NOME EMPRESARIAL", "RAZÃO SOCIAL", "RAZAO SOCIAL"]),
      trade_name: findAfter(text, ["TÍTULO DO ESTABELECIMENTO", "NOME DE FANTASIA", "NOME FANTASIA"]),
      address: findAfter(text, ["LOGRADOURO", "ENDEREÇO", "ENDERECO"]),
      city: findAfter(text, ["MUNICÍPIO", "MUNICIPIO"]),
      state: findAfter(text, ["UF"]),
      zip_code: cep,
      representative_name: findAfter(text, ["NOME DO SÓCIO", "NOME DO SOCIO", "REPRESENTANTE LEGAL"]),
      representative_cpf: cpf
    };
  }

  async function extractPdf(file) {
    const pdfjs = await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages = [];
    for (let pageNumber = 1; pageNumber <= Math.min(pdf.numPages, 12); pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map(item => item.str).join("\n"));
    }
    return pages.join("\n");
  }

  function ensureDocumentForm() {
    const registrar = document.querySelector("#registrar");
    if (!registrar || document.querySelector("#smart-document-card")) return;
    const intro = registrar.querySelector(".section-copy");
    const card = document.createElement("section");
    card.id = "smart-document-card";
    card.className = "smart-document-card";
    card.innerHTML = `
      <div class="smart-doc-heading">
        <div><p class="eyebrow orange">CADASTRO AUTOMÁTICO</p><h3>Envie os documentos e apenas confira</h3></div>
        <span class="secure-pill">ARQUIVOS PRIVADOS</span>
      </div>
      <p>Você pode enviar vários arquivos: cartão CNPJ, contrato social, RG/CPF ou CNH dos proprietários, comprovante de endereço e documentos de apoio. PDFs com texto preenchem os campos automaticamente; imagens ficam anexadas para conferência.</p>
      <form id="smart-document-form">
        <label class="document-drop">
          <strong>Selecionar documentos</strong>
          <span>PDF, JPG, PNG, WEBP, HEIC ou DOCX · até 20 MB cada</span>
          <input id="smart-files" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.docx" />
        </label>
        <div id="smart-file-list" class="smart-file-list"></div>
        <div class="smart-fields">
          <label>CNPJ<input name="cnpj" placeholder="00.000.000/0000-00" /></label>
          <label>Razão social<input name="legal_name" /></label>
          <label>Nome fantasia<input name="trade_name" /></label>
          <label>Proprietário / representante<input name="representative_name" /></label>
          <label>CPF do representante<input name="representative_cpf" /></label>
          <label>E-mail do representante<input name="representative_email" type="email" /></label>
          <label class="wide">Endereço<input name="address" /></label>
          <label>Cidade<input name="city" /></label>
          <label>UF<input name="state" maxlength="2" /></label>
          <label>CEP<input name="zip_code" /></label>
        </div>
        <p id="smart-doc-status" class="auth-status" role="status"></p>
        <button class="auth-primary" type="submit">Salvar documentos para conferência</button>
      </form>`;
    intro.insertAdjacentElement("afterend", card);
    const form = card.querySelector("#smart-document-form");
    const input = card.querySelector("#smart-files");
    input.addEventListener("change", async () => {
      const files = [...input.files];
      card.querySelector("#smart-file-list").innerHTML = files.map(file => `<span>${file.name}</span>`).join("");
      const status = card.querySelector("#smart-doc-status");
      status.textContent = files.length ? "Lendo documentos…" : "";
      let combined = "";
      for (const file of files) {
        if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
          try { combined += `\n${await extractPdf(file)}`; } catch (error) { console.warn("PDF sem texto extraível", error); }
        }
      }
      const extracted = parseBusinessText(combined);
      Object.entries(extracted).forEach(([name, value]) => {
        const field = form.elements.namedItem(name);
        if (field && value && !field.value) field.value = value;
      });
      status.textContent = combined.trim()
        ? "Dados localizados. Confira os campos antes de salvar."
        : "Arquivos prontos para anexar. Se forem imagens, confira e complete os campos.";
    });
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const files = [...input.files];
      const status = card.querySelector("#smart-doc-status");
      if (!currentStaff) {
        status.textContent = "Entre com um usuário liberado para salvar documentos.";
        authShell().classList.remove("hidden");
        return;
      }
      if (!files.length) {
        status.textContent = "Selecione pelo menos um documento.";
        return;
      }
      const verified = Object.fromEntries(new FormData(form).entries());
      status.textContent = "Enviando documentos com segurança…";
      const saved = [];
      for (const file of files) {
        const path = `${currentStaff.id}/customer-documents/${new Date().toISOString().slice(0,10)}-${crypto.randomUUID()}-${cleanName(file.name)}`;
        const uploaded = await client.storage.from("ontrade-documents").upload(path, file, { upsert: false, contentType: file.type || undefined });
        if (uploaded.error) throw uploaded.error;
        const inserted = await client.from("documents").insert({
          ba_id: currentStaff.id,
          document_type: classifyDocument(file),
          storage_bucket: "ontrade-documents",
          storage_path: path,
          original_file_name: file.name,
          mime_type: file.type || "application/octet-stream",
          file_size_bytes: file.size,
          extraction_status: "needs_review",
          verified_data: verified,
          created_by: currentStaff.id
        });
        if (inserted.error) throw inserted.error;
        saved.push(file.name);
      }
      status.textContent = `${saved.length} documento(s) salvo(s). Os dados ficaram aguardando conferência.`;
      form.reset();
      card.querySelector("#smart-file-list").innerHTML = "";
    });
  }

  async function boot() {
    ensureDocumentForm();
    const { data: { session } } = await client.auth.getSession();
    if (!session?.user) {
      setAuthState("Use seu e-mail corporativo. Você receberá um link de acesso e verá apenas a sua carteira ou a sua equipe.");
      return;
    }
    currentUser = session.user;
    try {
      await loadLiveData();
    } catch (error) {
      console.error(error);
      setAuthState(`Não foi possível carregar a base: ${error.message}`, true);
    }
  }

  client.auth.onAuthStateChange((_event, session) => {
    if (session?.user && !currentUser) {
      currentUser = session.user;
      loadLiveData().catch(error => setAuthState(`Não foi possível carregar a base: ${error.message}`, true));
    }
  });

  boot();
})();
