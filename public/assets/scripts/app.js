const apiURL = "http://localhost:3001/deuses";

/* ==============================
   LISTAR DEUSES
================================*/
async function carregarDeuses() {
    try {
        const resposta = await fetch(apiURL);
        const deuses = await resposta.json();

        const lista = document.getElementById("lista-deuses");
        if (!lista) return;

        lista.innerHTML = "";

        deuses.forEach(deus => {
            lista.innerHTML += `
                <div class="col-md-4">
                    <div class="card h-100">
                        <img src="${deus.figura_principal}"
                             onerror="this.src='img/notfound.png'"
                             class="card-img-top" />

                        <div class="card-body">
                            <h5 class="card-title">${deus.titulo}</h5>
                            <p>${deus.resumo?.substring(0, 80) || ""}...</p>

                            <a href="detalhes.html?id=${deus.id}" class="btn btn-secondary">
                                Ver Detalhes
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (erro) {
        console.error("Erro ao carregar:", erro);
    }
}

carregarDeuses();

/* ==============================
   DETALHES
================================*/
async function carregarDetalhes() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    const resposta = await fetch(`${apiURL}/${id}`);
    const deus = await resposta.json();

    const container = document.getElementById("detalhe-deus");

    container.innerHTML = `
        <div class="card">
            <img src="${deus.figura_principal}" class="card-img-top" />

            <div class="card-body">
                <h1>${deus.titulo}</h1>
                <p>${deus.detalhes_completos}</p>

                <button onclick="excluirDeus('${deus.id}')" class="btn btn-danger">Excluir</button>
                <a href="index.html" class="btn btn-secondary">Voltar</a>
            </div>
        </div>
    `;
}

if (window.location.pathname.includes("detalhes.html")) {
    carregarDetalhes();
}

/* ==============================
   CRIAR NOVO DEUS
================================*/
const formCriar = document.getElementById("formCriar");

if (formCriar) {
    formCriar.addEventListener("submit", async (event) => {
        event.preventDefault();

        const novoDeus = {
            titulo: document.getElementById("novoTitulo").value,
            resumo: document.getElementById("novoResumo").value,
            figura_principal: document.getElementById("novaImagem").value,
            detalhes_completos: document.getElementById("novoDetalhes").value
        };

        await fetch(apiURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoDeus)
        });

        alert("Deus criado com sucesso!");
        window.location.reload();
    });
}

/* ==============================
   EXCLUIR
================================*/
async function excluirDeus(id) {
    await fetch(`${apiURL}/${id}`, { method: "DELETE" });
    alert("Deus removido!");
    window.location.href = "index.html";
}
