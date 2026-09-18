// Requisito B - Dados Iniciais (Array com pelo menos 3 eventos)
let eventos = [
  {
    id: 1,
    titulo: "Workshop de Git e GitHub",
    tipo: "Workshop",
    data: "2026-09-25",
    local: "Laboratório 2",
    descricao: "Atividade prática sobre versionamento.",
    status: "Agendado"
  },
  {
    id: 2,
    titulo: "Palestra sobre Inteligência Artificial",
    tipo: "Palestra",
    data: "2026-10-10",
    local: "Auditório Principal",
    descricao: "Impactos e futuro da IA no mercado de trabalho.",
    status: "Agendado"
  },
  {
    id: 3,
    titulo: "Minicurso de Introdução ao Python",
    tipo: "Minicurso",
    data: "2026-08-15",
    local: "Laboratório 5",
    descricao: "Conceitos básicos de lógica de programação.",
    status: "Realizado"
  }
];

// Estados Globais de Filtro
let filtroTexto = "";
let filtroStatus = "Todos";

// Inicialização da Aplicação
document.addEventListener("DOMContentLoaded", () => {
  configurarNavegacao();
  carregarTela("dashboard");
});

// Requisito A - Navegação SPA (sem recarregar página)
function configurarNavegacao() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-view]");
    if (link) {
      e.preventDefault();
      
      // Atualiza classe 'active' nos menus
      document.querySelectorAll("[data-view]").forEach(item => item.classList.remove("active"));
      link.classList.add("active");

      const view = link.dataset.view;
      carregarTela(view);
    }
  });
}

// Alternância de Views
function carregarTela(view) {
  const container = document.getElementById("app");
  if (!container) return;

  container.innerHTML = "";

  if (view === "dashboard") {
    renderizarDashboard(container);
  } else if (view === "novo-evento") {
    renderizarFormulario(container);
  } else if (view === "eventos") {
    renderizarEventos(container);
  }
}

// Requisito C - Tela Dashboard
function renderizarDashboard(container) {
  const total = eventos.length;
  const agendados = eventos.filter(e => e.status === "Agendado").length;
  const realizados = eventos.filter(e => e.status === "Realizado").length;

  container.innerHTML = `
    <h2 class="mb-4">Dashboard</h2>
    <div class="row g-3">
      <div class="col-md-4">
        <div class="card text-white bg-primary shadow-sm p-3">
          <div class="card-body">
            <h5 class="card-title">Total de Eventos</h5>
            <p class="display-4 fw-bold mb-0">${total}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-white bg-warning shadow-sm p-3">
          <div class="card-body">
            <h5 class="card-title">Eventos Agendados</h5>
            <p class="display-4 fw-bold mb-0">${agendados}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-white bg-success shadow-sm p-3">
          <div class="card-body">
            <h5 class="card-title">Eventos Realizados</h5>
            <p class="display-4 fw-bold mb-0">${realizados}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Requisito D - Cadastro de Evento
function renderizarFormulario(container) {
  container.innerHTML = `
    <h2 class="mb-4">Cadastrar Novo Evento</h2>
    <div id="mensagem-alerta"></div>
    <div class="card p-4 shadow-sm">
      <form id="form-novo-evento">
        <div class="mb-3">
          <label for="titulo" class="form-label">Título *</label>
          <input type="text" class="form-control" id="titulo" required>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="tipo" class="form-label">Tipo *</label>
            <select class="form-select" id="tipo" required>
              <option value="">Selecione...</option>
              <option value="Palestra">Palestra</option>
              <option value="Workshop">Workshop</option>
              <option value="Minicurso">Minicurso</option>
              <option value="Visita Técnica">Visita Técnica</option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="data" class="form-label">Data *</label>
            <input type="date" class="form-control" id="data" required>
          </div>
        </div>
        <div class="mb-3">
          <label for="local" class="form-label">Local *</label>
          <input type="text" class="form-control" id="local" required>
        </div>
        <div class="mb-3">
          <label for="descricao" class="form-label">Descrição *</label>
          <textarea class="form-control" id="descricao" rows="3" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Cadastrar Evento</button>
      </form>
    </div>
  `;

  document.getElementById("form-novo-evento").addEventListener("submit", processarCadastro);
}

function processarCadastro(e) {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const tipo = document.getElementById("tipo").value;
  const data = document.getElementById("data").value;
  const local = document.getElementById("local").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const alerta = document.getElementById("mensagem-alerta");

  if (!titulo || !tipo || !data || !local || !descricao) {
    alerta.innerHTML = `<div class="alert alert-danger">Por favor, preencha todos os campos obrigatórios.</div>`;
    return;
  }

  const novoId = eventos.length > 0 ? Math.max(...eventos.map(ev => ev.id)) + 1 : 1;

  eventos.push({
    id: novoId,
    titulo,
    tipo,
    data,
    local,
    descricao,
    status: "Agendado"
  });

  alerta.innerHTML = `<div class="alert alert-success">Evento cadastrado com sucesso!</div>`;
  document.getElementById("form-novo-evento").reset();
}

// Requisito E, F e G - Listagem, Filtros e Ações
function renderizarEventos(container) {
  container.innerHTML = `
    <h2 class="mb-4">Eventos Cadastrados</h2>
    <div class="row g-3 mb-4">
      <div class="col-md-8">
        <input type="text" id="filtro-texto" class="form-control" placeholder="Pesquisar por título..." value="${filtroTexto}">
      </div>
      <div class="col-md-4">
        <select id="filtro-status" class="form-select">
          <option value="Todos" ${filtroStatus === "Todos" ? "selected" : ""}>Todos os Status</option>
          <option value="Agendado" ${filtroStatus === "Agendado" ? "selected" : ""}>Agendados</option>
          <option value="Realizado" ${filtroStatus === "Realizado" ? "selected" : ""}>Realizados</option>
        </select>
      </div>
    </div>
    <div id="lista-eventos" class="row g-3"></div>
  `;

  document.getElementById("filtro-texto").addEventListener("input", (e) => {
    filtroTexto = e.target.value.toLowerCase();
    atualizarLista();
  });

  document.getElementById("filtro-status").addEventListener("change", (e) => {
    filtroStatus = e.target.value;
    atualizarLista();
  });

  atualizarLista();
}

// Requisito E - Manipulação dinâmica do DOM
function atualizarLista() {
  const container = document.getElementById("lista-eventos");
  if (!container) return;

  container.innerHTML = "";

  const filtrados = eventos.filter(e => {
    const atendeTexto = e.titulo.toLowerCase().includes(filtroTexto);
    const atendeStatus = filtroStatus === "Todos" || e.status === filtroStatus;
    return atendeTexto && atendeStatus;
  });

  if (filtrados.length === 0) {
    container.innerHTML = `<div class="col-12"><p class="text-muted">Nenhum evento encontrado.</p></div>`;
    return;
  }

  filtrados.forEach(evento => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";

    const card = document.createElement("div");
    card.className = "card h-100 shadow-sm";

    const body = document.createElement("div");
    body.className = "card-body d-flex flex-column";

    const statusBadge = document.createElement("span");
    statusBadge.className = `badge ${evento.status === "Agendado" ? "bg-warning text-dark" : "bg-success"} me-2`;
    statusBadge.textContent = evento.status;

    const tipoBadge = document.createElement("span");
    tipoBadge.className = "badge bg-secondary";
    tipoBadge.textContent = evento.tipo;

    const badgesDiv = document.createElement("div");
    badgesDiv.className = "mb-2";
    badgesDiv.appendChild(statusBadge);
    badgesDiv.appendChild(tipoBadge);

    const titulo = document.createElement("h5");
    titulo.className = "card-title";
    titulo.textContent = evento.titulo;

    const data = document.createElement("p");
    data.className = "card-text text-muted small mb-1";
    data.textContent = `📅 Data: ${evento.data}`;

    const local = document.createElement("p");
    local.className = "card-text text-muted small mb-2";
    local.textContent = `📍 Local: ${evento.local}`;

    const desc = document.createElement("p");
    desc.className = "card-text flex-grow-1";
    desc.textContent = evento.descricao;

    // Requisito F - Marcar como Realizado e Excluir
    const acoes = document.createElement("div");
    acoes.className = "mt-3 d-flex gap-2";

    if (evento.status === "Agendado") {
      const btnRealizar = document.createElement("button");
      btnRealizar.className = "btn btn-sm btn-outline-success";
      btnRealizar.textContent = "Marcar como Realizado";
      btnRealizar.onclick = () => {
        evento.status = "Realizado";
        atualizarLista();
      };
      acoes.appendChild(btnRealizar);
    }

    const btnExcluir = document.createElement("button");
    btnExcluir.className = "btn btn-sm btn-outline-danger";
    btnExcluir.textContent = "Excluir";
    btnExcluir.onclick = () => {
      eventos = eventos.filter(ev => ev.id !== evento.id);
      atualizarLista();
    };
    acoes.appendChild(btnExcluir);

    body.appendChild(badgesDiv);
    body.appendChild(titulo);
    body.appendChild(data);
    body.appendChild(local);
    body.appendChild(desc);
    body.appendChild(acoes);

    card.appendChild(body);
    col.appendChild(card);
    container.appendChild(col);
  });
}