// URL base do JSON Server
const API_URL = 'http://localhost:3000/deuses';

document.addEventListener('DOMContentLoaded', ( ) => {
    const path = window.location.pathname.split("/").pop();

    if (path === 'index.html' || path === '') {
        montarPaginaHome();
    } else if (path === 'detalhes.html') {
        montarPaginaDetalhes();
    } else if (path === 'cadastro_deuses.html') {
        montarPaginaCadastro();
    }
});



async function buscarDados() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha ao buscar dados:", error);
        return null;
    }
}

async function buscarDeusporId(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha ao buscar deus:", error);
        return null;
    }
}

// ============================================
// ✏️ CREATE - Criar novo deus
// ============================================

async function criarDeus(dadosDoFormulario) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosDoFormulario)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const deusCriado = await response.json();
        console.log('Deus criado com sucesso:', deusCriado);
        alert('Deus cadastrado com sucesso!');
        window.location.href = 'index.html';

    } catch (erro) {
        console.error('Falha ao criar deus:', erro);
        alert('Erro ao cadastrar. Verifique o console.');
    }
}

// ============================================
// 🔄 UPDATE - Editar deus existente
// ============================================

async function editarDeus(id, dadosDoFormulario) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosDoFormulario)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const deusEditado = await response.json();
        console.log('Deus editado com sucesso:', deusEditado);
        alert('Deus atualizado com sucesso!');
        window.location.href = `detalhes.html?id=${id}`;

    } catch (erro) {
        console.error('Falha ao editar deus:', erro);
        alert('Erro ao editar. Verifique o console.');
    }
}

// ============================================
// 🗑️ DELETE - Excluir deus
// ============================================

async function excluirDeus(id) {
    if (!confirm('Tem certeza que deseja excluir este deus?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        console.log('Deus excluído com sucesso');
        alert('Deus removido com sucesso!');
        window.location.href = 'index.html';

    } catch (erro) {
        console.error('Falha ao excluir deus:', erro);
        alert('Erro ao excluir. Verifique o console.');
    }
}

// ============================================
// 🏠 Página Home (index.html)
// ============================================

async function montarPaginaHome() {
    const dados = await buscarDados();
    if (!dados) {
        document.querySelector('main').innerHTML = '<p class="text-danger text-center">Não foi possível carregar os dados. Verifique o console.</p>';
        return;
    }

    montarSlider(dados.filter(item => item.destaque));
    montarLista(dados);
}

function montarSlider(itensDestaque) {
    const sliderContainer = document.querySelector('#slider-destaques');
    if (!sliderContainer) return;

    const indicators = itensDestaque.map((_, index) =>
        `<button type="button" data-bs-target="#slider-destaques" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-current="true" aria-label="Slide ${index + 1}"></button>`
    ).join('');

    const innerItems = itensDestaque.map((item, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <a href="detalhes.html?id=${item.id}">
                <img src="${item.figura_principal}" class="d-block w-100 object-fit: contain" alt="${item.titulo}">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${item.titulo}</h5>
                    <p>${item.resumo}</p>
                </div>
            </a>
        </div>
    `).join('');

    sliderContainer.innerHTML = `
        <div class="carousel-indicators">${indicators}</div>
        <div class="carousel-inner">${innerItems}</div>
        <button class="carousel-control-prev" type="button" data-bs-target="#slider-destaques" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#slider-destaques" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    `;
}

function montarLista(todosOsItens) {
    const listaContainer = document.querySelector('#lista-deuses');
    if (!listaContainer) return;

    listaContainer.innerHTML = todosOsItens.map(item => `
        <div class="col-12 col-md-6 col-lg-3">
            <div class="card h-100">
                <a href="detalhes.html?id=${item.id}">
                    <img src="${item.figura_principal}" class="card-img-top" alt="${item.titulo}">
                </a>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.titulo}</h5>
                    <p class="card-text flex-grow-1">${item.resumo}</p>
                    <a href="detalhes.html?id=${item.id}" class="btn btn-primary mt-auto">Ver Detalhes</a>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// 📄 Página de Detalhes (detalhes.html)
// ============================================

async function montarPaginaDetalhes() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const detalheContainer = document.querySelector('#detalhe-deus');

    if (isNaN(id) || !detalheContainer) {
        detalheContainer.innerHTML = '<p class="text-danger text-center">ID inválido.</p>';
        return;
    }

    const item = await buscarDeusporId(id);

    if (!item) {
        detalheContainer.innerHTML = '<p class="text-danger text-center">Deus não encontrado.</p>';
        return;
    }

    const informacoesGeraisHTML = Object.entries(item.informacoes).map(([chave, valor]) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <strong>${chave}:</strong>
            <span>${valor}</span>
        </li>
    `).join('');

    const galeriaHTML = item.imagens_secundarias.map(imgSrc => `
        <div class="col-4">
            <img src="${imgSrc}" class="img-fluid rounded galeria-imagem-secundaria" alt="Imagem secundária de ${item.titulo}">
        </div>
    `).join('');

    detalheContainer.innerHTML = `
        <div class="row g-5">
            <!-- Coluna da Imagem Principal e Detalhes -->
            <div class="col-lg-8">
                <h1 class="display-4 mb-4">${item.titulo}</h1>
                <img src="${item.figura_principal}" class="img-fluid rounded mb-4" alt="Imagem principal de ${item.titulo}">
                <p class="lead">${item.detalhes_completos}</p>
                
                <!-- Botões de Ação (CRUD) -->
                <div class="mt-4">
                    <a href="cadastro_deuses.html?id=${item.id}" class="btn btn-warning me-2">Editar</a>
                    <button class="btn btn-danger" onclick="excluirDeus(${item.id})">Excluir</button>
                </div>
            </div>

            <!-- Coluna de Informações e Galeria -->
            <div class="col-lg-4">
                <!-- Informações Gerais -->
                <div class="mb-5">
                    <h3 class="h4">Informações Gerais</h3>
                    <ul class="list-group">
                        ${informacoesGeraisHTML}
                    </ul>
                </div>

                <!-- Fotos Associadas -->
                <div>
                    <h3 class="h4">Fotos do Item Associado</h3>
                    <div class="row g-2">
                        ${galeriaHTML}
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center mt-5">
            <a href="index.html" class="btn btn-outline-light btn-lg">Voltar para a Home</a>
        </div>
    `;
}


async function montarPaginaCadastro() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const formulario = document.getElementById('formulario-cadastro');


    if (id) {
        const deus = await buscarDeusporId(id);
        if (deus) {
            document.getElementById('titulo').value = deus.titulo;
            document.getElementById('resumo').value = deus.resumo;
            document.getElementById('detalhes_completos').value = deus.detalhes_completos;
            document.getElementById('figura_principal').value = deus.figura_principal;
            document.getElementById('destaque').checked = deus.destaque;
            
            document.querySelector('h1').textContent = 'Editar Deus';
            document.querySelector('button[type="submit"]').textContent = 'Atualizar Deus';
        }
    }

   
    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();

    
        const dadosDoFormulario = {
            titulo: document.getElementById('titulo').value,
            resumo: document.getElementById('resumo').value,
            detalhes_completos: document.getElementById('detalhes_completos').value,
            figura_principal: document.getElementById('figura_principal').value,
            destaque: document.getElementById('destaque').checked,
            informacoes: {
                "Nome Grego": "",
                "Domínio": "",
                "Símbolos": "",
                "Pai": "",
                "Mãe": ""
            },
            imagens_secundarias: []
        };

        // Se há um ID, estamos editando (PUT). Caso contrário, criando (POST)
        if (id) {
            await editarDeus(id, dadosDoFormulario);
        } else {
            await criarDeus(dadosDoFormulario);
        }
    });
}
