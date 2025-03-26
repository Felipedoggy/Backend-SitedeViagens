const URL_BASE = 'http://localhost:3000/cadastro';
const formCadPacote = document.getElementById("cadastro-pacote");

// Botões do formulário (supondo que estes IDs existam no HTML)
const btnCadastrar = document.querySelector('button.btn-primary');
const btnAtualizar = document.querySelector('button.btn-warning');
const btnExcluir   = document.querySelector('button.btn-danger');
const btnConsultar = document.querySelector('button.btn-info');
const btnLimpar = document.getElementById("btnLimpar");


// Evento de envio do formulário
formCadPacote.onsubmit = ManipularEnvio;

function ManipularEnvio(evento) {
    evento.preventDefault();
    evento.stopPropagation();

    if (formCadPacote.checkValidity()) {
        // Se o botão cadastrar estiver ativo, é uma operação POST (novo cadastro)
        if (!btnCadastrar.disabled) {
            adicionarPacote();
        } else if (!btnAtualizar.disabled) {
            atualizarPacote();
        } else if (!btnConsultar.disabled) {
            consultarPacote(document.getElementById("id").value);
        }
        formCadPacote.reset();
        formCadPacote.classList.remove('was-validated');
        // Reativa o estado padrão dos botões
        btnCadastrar.disabled = false;
        btnAtualizar.disabled = true;
        btnExcluir.disabled = true;
        btnConsultar.disabled = true;
        mostrarTabelaPacotes();
    }
    formCadPacote.classList.add('was-validated');
}

function PegarDadosPacote() {
    return {
        id: document.getElementById("id") ? document.getElementById("id").value : undefined,
        name: document.getElementById("name").value,
        departure: document.getElementById("departure").value,
        destination: document.getElementById("destination").value,
        price: parseFloat(document.getElementById("price").value),
        description: document.getElementById("description").value,
        duration: parseInt(document.getElementById("duration").value),
        departureLocation: document.getElementById("departureLocation").value,
        availableSpots: parseInt(document.getElementById("availableSpots").value),
        image: document.getElementById("image").value
    };
}

function adicionarPacote() {
    const dadosPacote = PegarDadosPacote();
    fetch(URL_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosPacote)
    })
    .then(resposta => resposta.json())
    .then(dadosRecebidos => {
       mostrarMensagem(dadosRecebidos.mensagem, dadosRecebidos.status ? "success" : "danger");
       mostrarTabelaPacotes();
    })
    .catch(erro => mostrarMensagem(erro.message, "danger"));
}

function atualizarPacote() {
    const dadosPacote = PegarDadosPacote();
    if (!dadosPacote.id) {
        return mostrarMensagem("ID do pacote não definido para atualização.", "danger");
    }
    fetch(URL_BASE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosPacote)
    })
    .then(resposta => resposta.json())
    .then(dadosRecebidos => {
        mostrarMensagem(dadosRecebidos.mensagem, dadosRecebidos.status ? "success" : "danger");
        mostrarTabelaPacotes();
    })
    .catch(erro => mostrarMensagem(erro.message, "danger"));
}

function excluirPacote(id) {
    fetch(URL_BASE, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
    .then(resposta => resposta.json())
    .then(dadosRecebidos => {
        mostrarMensagem(dadosRecebidos.mensagem, dadosRecebidos.status ? "success" : "danger");
        formCadPacote.reset();
        mostrarTabelaPacotes();
    })
    .catch(erro => mostrarMensagem(erro.message, "danger"));
}

function consultarPacote(id) {
    fetch(`${URL_BASE}/${id}`, { method: 'GET' })
    .then(resposta => resposta.json())
    .then(dadosRecebidos => {
        if (dadosRecebidos.status) {
            const pacote = dadosRecebidos.pacote;
            preencherFormulario(pacote);
            mostrarMensagem("Consulta realizada com sucesso!", "success");
        } else {
            mostrarMensagem("Consulta realizada com sucesso!", "success");
        }
    })
    .catch(erro => mostrarMensagem(erro.message, "danger"));
}

function mostrarTabelaPacotes() {
    fetch(URL_BASE, { method: 'GET' })
    .then(resposta => resposta.json())
    .then(dadosRecebidos => {
        const espacotabela = document.getElementById("tabela-pacotes");
        espacotabela.innerHTML = "";
        if (dadosRecebidos.status) {
            const pacotes = dadosRecebidos.pacotes;
            if (pacotes.length > 0) {
                const tabela = document.createElement("table");
                tabela.className = "table table-striped table-hover";
                const cabecalho = document.createElement("thead");
                const corpo = document.createElement("tbody");
                cabecalho.innerHTML = `<tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Destino</th>
                    <th scope="col">Preço</th>
                    <th scope="col">Duração</th>
                    <th scope="col">Local de Partida</th>
                    <th scope="col">Vagas Disponíveis</th>
                    <th scope="col">Imagem</th>
                    <th scope="col">Ações</th>
                </tr>`;
                tabela.appendChild(cabecalho);
                pacotes.forEach((pacote) => {
                    const linha = document.createElement("tr");
                    linha.innerHTML = `
                        <td>${pacote.name}</td>
                        <td>${pacote.destination}</td>
                        <td>${pacote.price}</td>
                        <td>${pacote.duration}</td>
                        <td>${pacote.departureLocation}</td>
                        <td>${pacote.availableSpots}</td>
                        <td class="text-truncate" style="max-width: 150px;">${pacote.image}</td>
                        <td>
                          <button type="button" class="btn btn-warning" 
                            onclick="pegarPacote(${pacote.id}, '${pacote.name}', '${pacote.departure}', '${pacote.destination}', ${pacote.price}, '${pacote.description}', ${pacote.duration}, '${pacote.departureLocation}', ${pacote.availableSpots}, '${pacote.image}', 'atualizar')">
                            Atualizar
                          </button>
                          <button type="button" class="btn btn-danger" 
                            onclick="pegarPacote(${pacote.id}, '${pacote.name}', '${pacote.departure}', '${pacote.destination}', ${pacote.price}, '${pacote.description}', ${pacote.duration}, '${pacote.departureLocation}', ${pacote.availableSpots}, '${pacote.image}', 'excluir')">
                            Excluir
                          </button>
                          <button type="button" class="btn btn-info"
                            onclick="pegarPacote(${pacote.id}, '${pacote.name}', '${pacote.departure}', '${pacote.destination}', ${pacote.price}, '${pacote.description}', ${pacote.duration}, '${pacote.departureLocation}', ${pacote.availableSpots}, '${pacote.image}', 'consultar')">
                            Consultar
                          </button>
                        </td>`;
                    corpo.appendChild(linha);
                });
                tabela.appendChild(corpo);
                espacotabela.appendChild(tabela);
            } else {
                mostrarMensagem("Nenhum pacote cadastrado", "warning");
            }
        } else {
            mostrarMensagem("Erro ao buscar pacotes", "danger");
        }
    })
    .catch(erro => mostrarMensagem(erro.message, "danger"));
}

function mostrarMensagem(mensagem, tipo = "success") {
    const espacoMensagem = document.getElementById("mensagem");
    espacoMensagem.innerHTML = `<div class="alert alert-${tipo}" role="alert">${mensagem}</div>`;
    setTimeout(() => {
      espacoMensagem.innerHTML = "";
    }, 5000);
  }
  
// Função para preencher os inputs do formulário com os dados do pacote
function preencherFormulario(pacote) {
    const inputId = obterOuCriarInputId();
    inputId.value = pacote.id;
    document.getElementById("name").value = pacote.name;
  document.getElementById("departure").value = formatarData(pacote.departure);
    document.getElementById("destination").value = pacote.destination;
    document.getElementById("price").value = pacote.price;
    document.getElementById("description").value = pacote.description;
    document.getElementById("duration").value = pacote.duration;
    document.getElementById("departureLocation").value = pacote.departureLocation;
    document.getElementById("availableSpots").value = pacote.availableSpots;
    document.getElementById("image").value = pacote.image;
}

function obterOuCriarInputId() {
    let inputId = document.getElementById("id");
    if (!inputId) {
      inputId = document.createElement("input");
      inputId.type = "hidden";
      inputId.id = "id";
      inputId.name = "id";
      formCadPacote.appendChild(inputId);
    }
    return inputId;
  }

function formatarData(dataString) {
    const data = new Date(dataString);
    // Formata para "yyyy-MM-dd"
    const ano = data.getFullYear();
    const mes = ('0' + (data.getMonth() + 1)).slice(-2);
    const dia = ('0' + data.getDate()).slice(-2);
    return `${ano}-${mes}-${dia}`;
  }
// Função que trata o clique nos botões da tabela para diferentes ações
function pegarPacote(id, name, departure, destination, price, description, duration, departureLocation, availableSpots, image, acao = "atualizar") {
    // Preenche o formulário com os dados recebidos
    preencherFormulario({ id, name, departure, destination, price, description, duration, departureLocation, availableSpots, image });
    
    // Configura os botões conforme a ação
    if (acao === "atualizar") {
        btnAtualizar.disabled = false;
        btnCadastrar.disabled = true;
        btnExcluir.disabled = true;
    } else if (acao === "excluir") {
        btnAtualizar.disabled = true;
        btnCadastrar.disabled = true;
        btnExcluir.disabled = false;
        // Opcional: Chama a exclusão imediatamente ou aguarda confirmação
        // excluirPacote(id);
    } else if (acao === "consultar") {
        btnAtualizar.disabled = false;
        btnCadastrar.disabled = true;
        btnExcluir.disabled = false;
        consultarPacote(id);
    }
}

// Adiciona event listeners aos botões
document.getElementById("att").addEventListener("click", () => {
    if (!document.getElementById("att").disabled) {
        atualizarPacote();
    }
});

document.getElementById("exc").addEventListener("click", () => {
    if (!document.getElementById("exc").disabled) {
        const id = document.getElementById("id").value;
        excluirPacote(id);
    }
    formCadPacote.reset();

});
function limparFormulario() {
    formCadPacote.reset(); // Reseta o formulário
    btnCadastrar.disabled = false; // Ativa o botão de cadastrar
    btnAtualizar.disabled = true; // Desativa o botão de atualizar
    btnExcluir.disabled = true; // Desativa o botão de excluir
}

// Adiciona um evento de clique ao botão de limpar
btnLimpar.addEventListener("click", limparFormulario);
// Inicializa os estados dos botões e carrega a tabela
formCadPacote.onsubmit = ManipularEnvio;
mostrarTabelaPacotes();
