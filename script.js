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
        comentarios: 34
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
        comentarios: 21
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
        comentarios: 58
    }
];


// ========================================
// PEGAR POSTS SALVOS
// ========================================

let postsSalvos = JSON.parse(
    localStorage.getItem("posts")
) || postsIniciais;


// Salva os posts

function salvarPosts() {

    localStorage.setItem(
        "posts",
        JSON.stringify(postsSalvos)
    );

}


// ========================================
// PEGAR ELEMENTOS DA PÁGINA
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


    // FILTRAR

    if (
        categoriaSelecionada !== "Tudo"
    ) {

        postsParaMostrar =
            postsSalvos.filter(
                (post) =>
                    post.categoria ===
                    categoriaSelecionada
            );

    }


    // SE NÃO HOUVER POSTS

    if (
        postsParaMostrar.length === 0
    ) {

        areaPosts.innerHTML = `
            <div class="sem-posts">
                <h3>
                    Ainda não existem posts aqui ♡
                </h3>

                <p>
                    Que tal ser a primeira pessoa
                    a compartilhar algo?
                </p>
            </div>
        `;

        return;

    }


    // CRIAR CARDS

    postsParaMostrar.forEach(
        (post) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "post-card";


            card.dataset.id =
                post.id;


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

                    <button
                        class="acao curtir"
                    >
                        ♡
                        <span>
                            ${post.curtidas}
                        </span>
                    </button>


                    <button
                        class="acao comentar"
                    >
                        💬
                        <span>
                            ${post.comentarios}
                        </span>
                    </button>


                    <button
                        class="acao salvar"
                    >
                        🔖 Salvar
                    </button>

                </div>

            `;


            // =================================
            // ABRIR POST AO CLICAR NO CARD
            // =================================

            card.addEventListener(
                "click",
                (evento) => {

                    // Não abre se clicar em botão

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


            // =================================
            // CURTIR
            // =================================

            const botaoCurtir =
                card.querySelector(
                    ".curtir"
                );


            botaoCurtir.addEventListener(
                "click",
                (evento) => {

                    evento.stopPropagation();


                    const index =
                        postsSalvos.findIndex(
                            (p) =>
                                p.id ===
                                post.id
                        );


                    postsSalvos[
                        index
                    ].curtidas++;


                    salvarPosts();


                    mostrarPosts(
                        categoriaSelecionada
                    );

                }
            );


            // =================================
            // COMENTAR
            // =================================

            const botaoComentar =
                card.querySelector(
                    ".comentar"
                );


            botaoComentar.addEventListener(
                "click",
                (evento) => {

                    evento.stopPropagation();


                    abrirPost(
                        post.id
                    );

                }
            );


            // =================================
            // SALVAR
            // =================================

            const botaoSalvar =
                card.querySelector(
                    ".salvar"
                );


            botaoSalvar.addEventListener(
                "click",
                (evento) => {

                    evento.stopPropagation();


                    if (
                        botaoSalvar.classList.contains(
                            "salvo"
                        )
                    ) {

                        botaoSalvar.classList.remove(
                            "salvo"
                        );


                        botaoSalvar.innerHTML =
                            "🔖 Salvar";

                    } else {

                        botaoSalvar.classList.add(
                            "salvo"
                        );


                        botaoSalvar.innerHTML =
                            "📌 Salvo";

                    }

                }
            );


            areaPosts.appendChild(
                card
            );

        }
    );

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
    (botao) => {

        botao.addEventListener(
            "click",
            () => {

                // Remove seleção anterior

                botoesCategoria.forEach(
                    (categoria) => {

                        categoria.classList.remove(
                            "ativa"
                        );

                    }
                );


                // Seleciona botão

                botao.classList.add(
                    "ativa"
                );


                const categoria =
                    botao.dataset.categoria;


                mostrarPosts(
                    categoria
                );


                // Vai até os posts

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
                    .getElementById(
                        "titulo"
                    )
                    .value
                    .trim();


            const texto =
                document
                    .getElementById(
                        "texto"
                    )
                    .value
                    .trim();


            const categoria =
                document
                    .getElementById(
                        "categoria-post"
                    )
                    .value;


            // VERIFICAÇÃO

            if (
                titulo === "" ||
                texto === "" ||
                categoria === ""
            ) {

                alert(
                    "Preencha o título, a história e a categoria ♡"
                );

                return;

            }


            // NOVO ID

            const novoId =
                Date.now();


            // NOVO POST

            const novoPost = {

                id: novoId,

                categoria: categoria,

                emoji: pegarEmojiCategoria(
                    categoria
                ),

                avatar: "🩷",

                nome: "Você",

                tempo: "agora mesmo",

                titulo: titulo,

                texto: texto,

                curtidas: 0,

                comentarios: 0

            };


            // ADICIONA

            postsSalvos.unshift(
                novoPost
            );


            salvarPosts();


            // LIMPA OS CAMPOS

            document.getElementById(
                "titulo"
            ).value = "";


            document.getElementById(
                "texto"
            ).value = "";


            document.getElementById(
                "categoria-post"
            ).value = "";


            // MOSTRA TODOS

            mostrarPosts(
                "Tudo"
            );


            // ATIVA "TUDO"

            botoesCategoria.forEach(
                (botao) => {

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


            alert(
                "Seu post foi publicado! ♡"
            );

        }
    );

}


// ========================================
// EMOJIS DAS CATEGORIAS
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

        "Relacionamento complicado": "🕸️"

    };


    return emojis[categoria] || "💌";

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


    // PEGA ID DA URL

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        parametros.get("id");


    // PROCURA O POST

    const post =
        postsSalvos.find(
            (p) =>
                String(p.id) ===
                String(id)
        );


    // SE NÃO ENCONTRAR

    if (!post) {

        document.getElementById(
            "titulo-post"
        ).textContent =
            "Post não encontrado";

        return;

    }


    // PREENCHE INFORMAÇÕES

    document.getElementById(
        "titulo-post"
    ).textContent =
        post.titulo;


    document.getElementById(
        "texto-post"
    ).textContent =
        post.texto;


    const categoriaElemento =
        paginaPost.querySelector(
            ".post-categoria"
        );


    if (categoriaElemento) {

        categoriaElemento.textContent =
            `${post.emoji} ${post.categoria}`;

    }


    const nomeElemento =
        paginaPost.querySelector(
            ".nome-usuario"
        );


    if (nomeElemento) {

        nomeElemento.textContent =
            post.nome;

    }


    const tempoElemento =
        paginaPost.querySelector(
            ".tempo-post"
        );


    if (tempoElemento) {

        tempoElemento.textContent =
            post.tempo;

    }


    const avatarElemento =
        paginaPost.querySelector(
            ".avatar"
        );


    if (avatarElemento) {

        avatarElemento.textContent =
            post.avatar;

    }


    // CURTIDAS

    const botaoCurtir =
        paginaPost.querySelector(
            ".curtir"
        );


    if (botaoCurtir) {

        botaoCurtir.innerHTML =
            `♡ <span>${post.curtidas}</span>`;


        botaoCurtir.addEventListener(
            "click",
            () => {

                post.curtidas++;


                salvarPosts();


                botaoCurtir.innerHTML =
                    `♥ <span>${post.curtidas}</span>`;

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
