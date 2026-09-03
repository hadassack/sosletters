// ========================================
// ENTRE NÓS — SCRIPT.JS
// ========================================


// ========================================
// POSTS INICIAIS
// ========================================

const postsIniciais = [
    {
        id: 1,
        categoria: "Ele gosta de mim?",
        emoji: "🤷",
        avatar: "🌸",
        nome: "Anônima",
        tempo: "há 2 horas",
        titulo: "Eu não consigo entender os sinais dele...",
        texto: "Gente, preciso MUITO de uma opinião. Às vezes parece que ele gosta de mim, mas em outros momentos parece que eu estou simplesmente imaginando tudo. Vocês já passaram por isso?",
        curtidas: 128,
        comentarios: 34,
        autor: false
    },
    {
        id: 2,
        categoria: "Paixão",
        emoji: "🩷",
        avatar: "💌",
        nome: "Coração Confuso",
        tempo: "há 4 horas",
        titulo: "Acho que estou gostando dele de verdade...",
        texto: "Eu tentei fingir que não era nada, mas ultimamente penso nele o tempo inteiro. Tenho medo de estragar nossa amizade, mas também tenho medo de nunca descobrir o que poderia acontecer.",
        curtidas: 96,
        comentarios: 21,
        autor: false
    },
    {
        id: 3,
        categoria: "Término",
        emoji: "💔",
        avatar: "🌙",
        nome: "Lua Perdida",
        tempo: "ontem",
        titulo: "Como vocês conseguiram superar alguém?",
        texto: "Eu sei que terminar foi a decisão certa, mas ainda sinto falta de várias coisas. Parece estranho tentar seguir em frente quando uma pessoa fez parte da sua rotina por tanto tempo.",
        curtidas: 203,
        comentarios: 58,
        autor: false
    }
];


// ========================================
// CARREGAR POSTS
// ========================================

let postsSalvos = JSON.parse(
    localStorage.getItem("posts")
);

if (!postsSalvos) {
    postsSalvos = postsIniciais;
}


// ========================================
// SALVAR POSTS
// ========================================

function salvarPosts() {

    localStorage.setItem(
        "posts",
        JSON.stringify(postsSalvos)
    );

}


// ========================================
// POSTS SALVOS / CURTIDOS
// ========================================

let postsFavoritos = JSON.parse(
    localStorage.getItem("postsFavoritos")
) || [];


let postsCurtidos = JSON.parse(
    localStorage.getItem("postsCurtidos")
) || [];


// ========================================
// SALVAR LISTAS
// ========================================

function salvarFavoritos() {

    localStorage.setItem(
        "postsFavoritos",
        JSON.stringify(postsFavoritos)
    );

}


function salvarCurtidos() {

    localStorage.setItem(
        "postsCurtidos",
        JSON.stringify(postsCurtidos)
    );

}


// ========================================
// ELEMENTOS PRINCIPAIS
// ========================================

const areaPosts =
    document.getElementById("posts");

const botoesCategoria =
    document.querySelectorAll(".categoria");


// ========================================
// MOSTRAR POSTS
// ========================================

function mostrarPosts(
    categoriaSelecionada = "Tudo"
) {

    if (!areaPosts) return;


    areaPosts.innerHTML = "";


    let postsParaMostrar =
        postsSalvos;


    if (
        categoriaSelecionada !== "Tudo"
    ) {

        postsParaMostrar =
            postsSalvos.filter(
                post =>
                    post.categoria ===
                    categoriaSelecionada
            );

    }


    if (
        postsParaMostrar.length === 0
    ) {

        areaPosts.innerHTML = `
            <div class="sem-posts">
                <h3>Ainda não existem posts aqui ♡</h3>
                <p>
                    Que tal ser a primeira pessoa
                    a compartilhar algo?
                </p>
            </div>
        `;

        return;

    }


    postsParaMostrar.forEach(
        post => {

            const card =
                criarCardPost(post);

            areaPosts.appendChild(
                card
            );

        }
    );

}


// ========================================
// CRIAR CARD
// ========================================

function criarCardPost(post) {

    const card =
        document.createElement("article");


    card.className =
        "post-card";


    card.dataset.id =
        post.id;


    const estaSalvo =
        postsFavoritos.includes(
            post.id
        );


    const estaCurtido =
        postsCurtidos.includes(
            post.id
        );


    card.innerHTML = `

        <div class="post-topo">

            <div class="usuario">

                <div class="avatar">
                    ${post.avatar}
                </div>

                <div>

                    <div class="nome-usuario">
                        ${post.nome}
                    </div>

                    <div class="tempo-post">
                        ${post.tempo}
                    </div>

                </div>

            </div>

        </div>


        <div class="post-categoria">

            ${post.emoji}
            ${post.categoria}

        </div>


        <h3>
            ${post.titulo}
        </h3>


        <p>
            ${post.texto}
        </p>


        <div class="post-acoes">

            <button class="acao curtir">

                ${estaCurtido ? "♥" : "♡"}

                <span>
                    ${post.curtidas}
                </span>

            </button>


            <button class="acao comentar">

                💬

                <span>
                    ${post.comentarios}
                </span>

            </button>


            <button class="acao salvar">

                ${
                    estaSalvo
                    ? "📌 Salvo"
                    : "🔖 Salvar"
                }

            </button>

        </div>

    `;


    // ====================================
    // ABRIR POST
    // ====================================

    card.addEventListener(
        "click",
        evento => {

            if (
                evento.target.closest(
                    "button"
                )
            ) {

                return;

            }


            abrirPost(
                post.id
            );

        }
    );


    card.style.cursor =
        "pointer";


    // ====================================
    // CURTIR
    // ====================================

    const botaoCurtir =
        card.querySelector(
            ".curtir"
        );


    botaoCurtir.addEventListener(
        "click",
        evento => {

            evento.stopPropagation();


            const index =
                postsCurtidos.indexOf(
                    post.id
                );


            if (index === -1) {

                postsCurtidos.push(
                    post.id
                );


                post.curtidas++;

            } else {

                postsCurtidos.splice(
                    index,
                    1
                );


                post.curtidas = Math.max(
                    0,
                    post.curtidas - 1
                );

            }


            salvarPosts();

            salvarCurtidos();


            const categoriaAtiva =
                document
                    .querySelector(
                        ".categoria.ativa"
                    )
                    ?.dataset.categoria
                    || "Tudo";


            mostrarPosts(
                categoriaAtiva
            );

        }
    );


    // ====================================
    // COMENTAR
    // ====================================

    const botaoComentar =
        card.querySelector(
            ".comentar"
        );


    botaoComentar.addEventListener(
        "click",
        evento => {

            evento.stopPropagation();

            abrirPost(
                post.id
            );

        }
    );


    // ====================================
    // SALVAR
    // ====================================

    const botaoSalvar =
        card.querySelector(
            ".salvar"
        );


    botaoSalvar.addEventListener(
        "click",
        evento => {

            evento.stopPropagation();


            const index =
                postsFavoritos.indexOf(
                    post.id
                );


            if (index === -1) {

                postsFavoritos.push(
                    post.id
                );

            } else {

                postsFavoritos.splice(
                    index,
                    1
                );

            }


            salvarFavoritos();


            const categoriaAtiva =
                document
                    .querySelector(
                        ".categoria.ativa"
                    )
                    ?.dataset.categoria
                    || "Tudo";


            mostrarPosts(
                categoriaAtiva
            );


            atualizarPerfil();

        }
    );


    return card;

}


// ========================================
// ABRIR POST
// ========================================

function abrirPost(id) {

    window.location.href =
        `post.html?id=${id}`;

}


// ========================================
// CATEGORIAS
// ========================================

botoesCategoria.forEach(
    botao => {

        botao.addEventListener(
            "click",
            () => {

                botoesCategoria.forEach(
                    categoria => {

                        categoria.classList.remove(
                            "ativa"
                        );

                    }
                );


                botao.classList.add(
                    "ativa"
                );


                const categoria =
                    botao.dataset.categoria;


                mostrarPosts(
                    categoria
                );


                document
                    .getElementById("posts")
                    ?.scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });

            }
        );

    }
);


// ========================================
// PUBLICAR POST
// ========================================

const botaoPublicar =
    document.getElementById(
        "publicar-post"
    );


if (botaoPublicar) {

    botaoPublicar.addEventListener(
        "click",
        () => {

            const titulo =
                document
                    .getElementById("titulo")
                    .value
                    .trim();


            const texto =
                document
                    .getElementById("texto")
                    .value
                    .trim();


            const categoria =
                document
                    .getElementById(
                        "categoria-post"
                    )
                    .value;


            if (
                !titulo ||
                !texto ||
                !categoria
            ) {

                alert(
                    "Preencha todas as informações ♡"
                );

                return;

            }


            const perfil =
                carregarPerfil();


            const novoPost = {

                id: Date.now(),

                categoria: categoria,

                emoji:
                    pegarEmojiCategoria(
                        categoria
                    ),

                avatar:
                    perfil.avatar,

                nome:
                    perfil.nome,

                tempo:
                    "agora mesmo",

                titulo: titulo,

                texto: texto,

                curtidas: 0,

                comentarios: 0,

                autor: true

            };


            postsSalvos.unshift(
                novoPost
            );


            salvarPosts();


            document.getElementById(
                "titulo"
            ).value = "";


            document.getElementById(
                "texto"
            ).value = "";


            document.getElementById(
                "categoria-post"
            ).value = "";


            botoesCategoria.forEach(
                botao => {

                    botao.classList.remove(
                        "ativa"
                    );


                    if (
                        botao.dataset.categoria ===
                        "Tudo"
                    ) {

                        botao.classList.add(
                            "ativa"
                        );

                    }

                }
            );


            mostrarPosts(
                "Tudo"
            );


            alert(
                "Seu post foi publicado! ♡"
            );

        }
    );

}


// ========================================
// EMOJIS
// ========================================

function pegarEmojiCategoria(
    categoria
) {

    const emojis = {

        "Término": "💔",

        "Paixão": "🩷",

        "Ele gosta de mim?": "🤷",

        "Preciso de conselho": "🫂",

        "Primeiro amor": "🌷",

        "Relacionamento complicado":
            "🕸️"

    };


    return emojis[categoria] || "💌";

}


// ========================================
// PERFIL
// ========================================

function carregarPerfil() {

    return JSON.parse(
        localStorage.getItem(
            "perfil"
        )
    ) || {

        nome:
            "Meu Perfil",

        bio:
            "Conte um pouquinho sobre você ♡",

        avatar:
            "🩷"

    };

}


// ========================================
// ATUALIZAR PERFIL
// ========================================

function atualizarPerfil() {

    const avatarPerfil =
        document.getElementById(
            "avatar-perfil"
        );


    if (!avatarPerfil) return;


    const perfil =
        carregarPerfil();


    document.getElementById(
        "nome-perfil"
    ).textContent =
        perfil.nome;


    document.getElementById(
        "bio-perfil"
    ).textContent =
        perfil.bio;


    avatarPerfil.textContent =
        perfil.avatar;


    // ESTATÍSTICAS

    const meusPosts =
        postsSalvos.filter(
            post =>
                post.autor === true
        );


    const curtidasRecebidas =
        meusPosts.reduce(
            (
                total,
                post
            ) =>
                total +
                post.curtidas,
            0
        );


    document.getElementById(
        "numero-meus-posts"
    ).textContent =
        meusPosts.length;


    document.getElementById(
        "numero-salvos"
    ).textContent =
        postsFavoritos.length;


    document.getElementById(
        "numero-curtidas"
    ).textContent =
        curtidasRecebidas;

}


// ========================================
// EDITAR PERFIL
// ========================================

let avatarSelecionado =
    carregarPerfil().avatar;


const botaoEditarPerfil =
    document.getElementById(
        "editar-perfil"
    );


const areaEditarPerfil =
    document.getElementById(
        "area-editar-perfil"
    );


const botaoCancelarEdicao =
    document.getElementById(
        "cancelar-edicao"
    );


if (botaoEditarPerfil) {

    botaoEditarPerfil.addEventListener(
        "click",
        () => {

            const perfil =
                carregarPerfil();


            document.getElementById(
                "input-nome"
            ).value =
                perfil.nome;


            document.getElementById(
                "input-bio"
            ).value =
                perfil.bio;


            avatarSelecionado =
                perfil.avatar;


            areaEditarPerfil.style.display =
                "block";


            areaEditarPerfil.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "center"

            });

        }
    );

}


// ========================================
// FECHAR EDIÇÃO
// ========================================

if (botaoCancelarEdicao) {

    botaoCancelarEdicao.addEventListener(
        "click",
        () => {

            areaEditarPerfil.style.display =
                "none";

        }
    );

}


// ========================================
// ESCOLHER AVATAR
// ========================================

document
    .querySelectorAll(
        ".avatar-opcao"
    )
    .forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    avatarSelecionado =
                        botao.dataset.avatar;


                    document
                        .querySelectorAll(
                            ".avatar-opcao"
                        )
                        .forEach(
                            opcao => {

                                opcao.classList.remove(
                                    "selecionado"
                                );

                            }
                        );


                    botao.classList.add(
                        "selecionado"
                    );

                }
            );

        }
    );


// ========================================
// SALVAR PERFIL
// ========================================

const botaoSalvarPerfil =
    document.getElementById(
        "salvar-perfil"
    );


if (botaoSalvarPerfil) {

    botaoSalvarPerfil.addEventListener(
        "click",
        () => {

            const nome =
                document
                    .getElementById(
                        "input-nome"
                    )
                    .value
                    .trim();


            const bio =
                document
                    .getElementById(
                        "input-bio"
                    )
                    .value
                    .trim();


            const perfilAtual = {

                nome:
                    nome ||
                    "Meu Perfil",

                bio:
                    bio ||
                    "Conte um pouquinho sobre você ♡",

                avatar:
                    avatarSelecionado

            };


            localStorage.setItem(
                "perfil",
                JSON.stringify(
                    perfilAtual
                )
            );


            areaEditarPerfil.style.display =
                "none";


            atualizarPerfil();


            alert(
                "Perfil atualizado! ♡"
            );

        }
    );

}


// ========================================
// ABAS DO PERFIL
// ========================================

const abasPerfil =
    document.querySelectorAll(
        ".perfil-aba"
    );


abasPerfil.forEach(
    aba => {

        aba.addEventListener(
            "click",
            () => {

                abasPerfil.forEach(
                    item => {

                        item.classList.remove(
                            "ativa"
                        );

                    }
                );


                aba.classList.add(
                    "ativa"
                );


                mostrarAbaPerfil(
                    aba.dataset.aba
                );

            }
        );

    }
);


// ========================================
// MOSTRAR ABA
// ========================================

function mostrarAbaPerfil(tipo) {

    const conteudo =
        document.getElementById(
            "conteudo-perfil"
        );


    if (!conteudo) return;


    conteudo.innerHTML = "";


    let posts =
        [];


    let mensagem =
        "";


    if (tipo === "meus") {

        posts =
            postsSalvos.filter(
                post =>
                    post.autor === true
            );


        mensagem =
            "Você ainda não publicou nenhum post ♡";

    }


    if (tipo === "salvos") {

        posts =
            postsSalvos.filter(
                post =>
                    postsFavoritos.includes(
                        post.id
                    )
            );


        mensagem =
            "Você ainda não salvou nenhum post ♡";

    }


    if (tipo === "curtidos") {

        posts =
            postsSalvos.filter(
                post =>
                    postsCurtidos.includes(
                        post.id
                    )
            );


        mensagem =
            "Você ainda não curtiu nenhum post ♡";

    }


    if (posts.length === 0) {

        conteudo.innerHTML = `

            <div class="perfil-vazio">

                <span>♡</span>

                <h3>
                    Nada por aqui ainda
                </h3>

                <p>
                    ${mensagem}
                </p>

            </div>

        `;

        return;

    }


    posts.forEach(
        post => {

            const card =
                criarCardPost(post);


            conteudo.appendChild(
                card
            );

        }
    );

}


// ========================================
// CARREGAR PÁGINA DO PERFIL
// ========================================

if (
    document.getElementById(
        "avatar-perfil"
    )
) {

    atualizarPerfil();

    mostrarAbaPerfil(
        "meus"
    );

}


// ========================================
// PÁGINA POST.HTML
// ========================================

function carregarPaginaPost() {

    const paginaPost =
        document.querySelector(
            ".post-detalhe"
        );


    if (!paginaPost) return;


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        parametros.get("id");


    const post =
        postsSalvos.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!post) return;


    document.getElementById(
        "titulo-post"
    ).textContent =
        post.titulo;


    document.getElementById(
        "texto-post"
    ).textContent =
        post.texto;


    const categoria =
        paginaPost.querySelector(
            ".post-categoria"
        );


    if (categoria) {

        categoria.textContent =
            `${post.emoji} ${post.categoria}`;

    }


    const nome =
        paginaPost.querySelector(
            ".nome-usuario"
        );


    if (nome) {

        nome.textContent =
            post.nome;

    }


    const tempo =
        paginaPost.querySelector(
            ".tempo-post"
        );


    if (tempo) {

        tempo.textContent =
            post.tempo;

    }


    const avatar =
        paginaPost.querySelector(
            ".avatar"
        );


    if (avatar) {

        avatar.textContent =
            post.avatar;

    }


    const botaoCurtir =
        paginaPost.querySelector(
            ".curtir"
        );


    if (botaoCurtir) {

        const curtido =
            postsCurtidos.includes(
                post.id
            );


        botaoCurtir.innerHTML = `

            ${curtido ? "♥" : "♡"}

            <span>
                ${post.curtidas}
            </span>

        `;


        botaoCurtir.addEventListener(
            "click",
            () => {

                const index =
                    postsCurtidos.indexOf(
                        post.id
                    );


                if (index === -1) {

                    postsCurtidos.push(
                        post.id
                    );


                    post.curtidas++;

                } else {

                    postsCurtidos.splice(
                        index,
                        1
                    );


                    post.curtidas =
                        Math.max(
                            0,
                            post.curtidas - 1
                        );

                }


                salvarPosts();

                salvarCurtidos();


                carregarPaginaPost();

            }
        );

    }

}


// ========================================
// INICIAR
// ========================================

if (areaPosts) {

    mostrarPosts();

}


carregarPaginaPost();
