// Array com os dados de exemplo (Requisito B)
let eventos = [
  { id: 1, titulo: "Workshop de Git e GitHub", tipo: "Workshop", data: "2026-09-25", local: "Lab 2", descricao: "Treinamento de Git.", status: "Agendado" },
  { id: 2, titulo: "Palestra de IA", tipo: "Palestra", data: "2026-10-10", local: "Auditório", descricao: "Palestra sobre IA.", status: "Agendado" },
  { id: 3, titulo: "Minicurso de Python", tipo: "Minicurso", data: "2026-08-15", local: "Lab 5", descricao: "Aprenda Python.", status: "Realizado" }
];

// Quando a página carrega
window.onload = function() {
  atualizarDashboard();
};

// 1. NAVEGAÇÃO SPA (Requisito A)
function mudarTela(nomeTela) {
  // Esconde todas as telas
  document.getElementById("tela-dashboard").style.display = "none";
  document.getElementById("tela-novo").style.display = "none";
  document.getElementById("tela-eventos").style.display = "none";

  // Mostra apenas a tela que foi clicada
  if (nomeTela === "dashboard") {
    document.getElementById("tela-dashboard").style.display = "block";
    atualizarDashboard();
  } else if (nomeTela === "novo") {
    document.getElementById("tela-novo").style.display = "block";
  } else if (nomeTela === "eventos") {
    document.getElementById("tela-eventos").style.display = "block";
    desenharLista();
  }
}

// 2. DASHBOARD (Requisito C)
function atualizarDashboard() {
  let agendados = 0;
  let realizados = 0;

  for (let i = 0; i < eventos.length; i++) {
    if (eventos[i].status === "Agendado") {
      agendados = agendados + 1;
    } else if (eventos[i].status === "Realizado") {
      realizados = realizados + 1;
    }
  }

  document.getElementById("total-eventos").innerText = eventos.length;
  document.getElementById("total-agendados").innerText = agendados;
  document.getElementById("total-realizados").innerText = realizados;
}

// 3. CADASTRAR EVENTO (Requisito D)
function salvarEvento(event) {
  event.preventDefault(); // Não recarrega a página

  let novo = {
    id: Date.now(),
    titulo: document.getElementById("campo-titulo").value.trim(),
    tipo: document.getElementById("campo-tipo").value,
    data: document.getElementById("campo-data").value,
    local: document.getElementById("campo-local").value.trim(),
    descricao: document.getElementById("campo-descricao").value.trim(),
    status: "Agendado"
  };

  eventos.push(novo);

  document.getElementById("mensagem").innerHTML = '<div class="alert alert-success">Cadastrado com sucesso!</div>';
  
  // Limpa os campos
  document.getElementById("campo-titulo").value = "";
  document.getElementById("campo-local").value = "";
  document.getElementById("campo-descricao").value = "";
}

// 4. LISTAR E FILTRAR (Requisito E e G)
function desenharLista() {
  let texto = document.getElementById("filtro-texto").value.toLowerCase();
  let status = document.getElementById("filtro-status").value;
  let area = document.getElementById("area-cards");

  area.innerHTML = ""; // Limpa a lista antes de desenhar

  for (let i = 0; i < eventos.length; i++) {
    let e = eventos[i];

    // Verifica se atende os filtros
    let bateuTexto = e.titulo.toLowerCase().includes(texto);
    let bateuStatus = (status === "Todos") || (e.status === status);

    if (bateuTexto && bateuStatus) {
      let corBadge = e.status === "Agendado" ? "bg-warning text-dark" : "bg-danger";
      
      let botaoRealizar = "";
      if (e.status === "Agendado") {
        botaoRealizar = `<button onclick="marcarRealizado(${e.id})" class="btn btn-sm btn-outline-success me-2">Concluir</button>`;
      }

      area.innerHTML += `
        <div class="col-md-4">
          <div class="card p-3">
            <div>
              <span class="badge ${corBadge}">${e.status}</span>
              <span class="badge bg-secondary">${e.tipo}</span>
            </div>
            <h5 class="mt-2">${e.titulo}</h5>
            <p class="mb-1 small">Data: ${e.data}</p>
            <p class="mb-1 small">Local: ${e.local}</p>
            <p class="small text-muted">${e.descricao}</p>
            <div>
              ${botaoRealizar}
              <button onclick="excluir(${e.id})" class="btn btn-sm btn-outline-danger">Excluir</button>
            </div>
          </div>
        </div>
      `;
    }
  }
}

// 5. AÇÕES (Requisito F)
function marcarRealizado(id) {
  for (let i = 0; i < eventos.length; i++) {
    if (eventos[i].id === id) {
      eventos[i].status = "Realizado";
    }
  }
  desenharLista();
}

function excluir(id) {
  let listaNova = [];
  for (let i = 0; i < eventos.length; i++) {
    if (eventos[i].id !== id) {
      listaNova.push(eventos[i]);
    }
  }
  eventos = listaNova;
  desenharLista();
}