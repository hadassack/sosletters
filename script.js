// =========================================
// ENTRE NÓS — SCRIPT.JS
// =========================================


// =========================================
// 1. PEGAR OS ELEMENTOS
// =========================================

const botoesCategoria = document.querySelectorAll(".categoria");
const areaPosts = document.querySelector(".posts");


// =========================================
// 2. SELEÇÃO DE CATEGORIAS
// =========================================

botoesCategoria.forEach((botao) => {

    botao.addEventListener("click", () => {

        botoesCategoria.forEach((categoria) => {
            categoria.classList.remove("ativa");
        });

        botao.classList.add("ativa");

    });

});


// =========================================
// 3. ABRIR UM POST
// =========================================

function abrirPost(post) {

    const tituloElemento = post.querySelector("h3");
    const textoElemento = post.querySelector("p");
    const categoriaElemento = post.querySelector(".post-categoria");
    const nomeElemento = post.querySelector(".nome-usuario");
    const tempoElemento = post.querySelector(".tempo-post");
    const avatarElemento = post.querySelector(".avatar");

    const titulo = tituloElemento
        ? tituloElemento.textContent.trim()
        : "";

    const texto = textoElemento
        ? textoElemento.textContent.trim()
        : "";

    const categoria = categoriaElemento
        ? categoriaElemento.textContent.trim()
        : "";

    const nome = nomeElemento
        ? nomeElemento.textContent.trim()
        : "Anônima";

    const tempo = tempoElemento
        ? tempoElemento.textContent.trim()
        : "agora mesmo";

    const avatar = avatarElemento
        ? avatarElemento.textContent.trim()
        : "🌸";


    // Salva as informações do post
    localStorage.setItem("postTitulo", titulo);
    localStorage.setItem("postTexto", texto);
    localStorage.setItem("postCategoria", categoria);
    localStorage.setItem("postNome", nome);
    localStorage.setItem("postTempo", tempo);
    localStorage.setItem("postAvatar", avatar);


    // Abre a página do post
    window.location.href = "post.html";

}


// =========================================
// 4. FAZER OS CARDS CLICÁVEIS
// =========================================

function adicionarCliqueNoCard(post) {

    post.addEventListener("click", (evento) => {

        // Não abre o post se clicar em um botão
        if (evento.target.closest("button")) {
            return;
        }

        abrirPost(post);

    });


    // Cursor de clique
    post.style.cursor = "pointer";

}


// Adiciona aos posts que já existem

document.querySelectorAll(".post-card").forEach((post) => {

    // Só adiciona o clique se NÃO estiver
    // na página post.html

    if (!post.classList.contains("post-detalhe")) {

        adicionarCliqueNoCard(post);

    }

});


// =========================================
// 5. CURTIR POSTS
// =========================================

function configurarCurtir(post) {

    const botoes = post.querySelectorAll(".acao");

    botoes.forEach((botao) => {

        if (
            botao.textContent.includes("♡") ||
            botao.classList.contains("curtir")
        ) {

            botao.addEventListener("click", (evento) => {

                evento.stopPropagation();

                let texto = botao.textContent.trim();

                let numero = parseInt(
                    texto.replace(/[^\d]/g, "")
                );

                if (isNaN(numero)) {
                    numero = 0;
                }


                if (botao.classList.contains("curtido")) {

                    numero--;

                    botao.classList.remove("curtido");

                    botao.innerHTML = `♡ ${numero}`;

                } else {

                    numero++;

                    botao.classList.add("curtido");

                    botao.innerHTML = `♥ ${numero}`;

                }

            });

        }

    });

}


// =========================================
// 6. SALVAR POSTS
// =========================================

function configurarSalvar(post) {

    const botoes = post.querySelectorAll(".acao");

    botoes.forEach((botao) => {

        if (
            botao.textContent.includes("Salvar") ||
            botao.classList.contains("salvar")
        ) {

            botao.addEventListener("click", (evento) => {

                evento.stopPropagation();


                if (botao.classList.contains("salvo")) {

                    botao.classList.remove("salvo");

                    botao.innerHTML = "🔖 Salvar";

                } else {

                    botao.classList.add("salvo");

                    botao.innerHTML = "📌 Salvo";

                }

            });

        }

    });

}


// =========================================
// 7. CONFIGURAR POSTS EXISTENTES
// =========================================

document.querySelectorAll(".post-card").forEach((post) => {

    configurarCurtir(post);
    configurarSalvar(post);

});


// =========================================
// 8. PUBLICAR NOVO POST
// =========================================

const botaoPublicar =
    document.querySelector(".criar-post .btn-principal");


const campoTitulo =
    document.querySelector(
        '.criar-post input[type="text"]'
    );


const campoTexto =
    document.querySelector(".criar-post textarea");


const campoCategoria =
    document.querySelector(".criar-post select");


if (
    botaoPublicar &&
    campoTitulo &&
    campoTexto &&
    campoCategoria &&
    areaPosts
) {

    botaoPublicar.addEventListener("click", () => {

        const titulo = campoTitulo.value.trim();

        const texto = campoTexto.value.trim();

        const categoria = campoCategoria.value;


        if (titulo === "" || texto === "") {

            alert(
                "Escreva um título e conte o que está acontecendo ♡"
            );

            return;

        }


        // Cria o novo post

        const novoPost =
            document.createElement("article");


        novoPost.classList.add("post-card");


        novoPost.innerHTML = `

            <div class="post-topo">

                <div class="usuario">

                    <div class="avatar">
                        🩷
                    </div>

                    <div>

                        <div class="nome-usuario">
                            Você
                        </div>

                        <div class="tempo-post">
                            agora mesmo
                        </div>

                    </div>

                </div>

            </div>


            <div class="post-categoria">

                ${categoria}

            </div>


            <h3>

                ${titulo}

            </h3>


            <p>

                ${texto}

            </p>


            <div class="post-acoes">

                <button class="acao curtir">
                    ♡ 0
                </button>


                <button class="acao comentar">
                    💬 0
                </button>


                <button class="acao salvar">
                    🔖 Salvar
                </button>

            </div>

        `;


        // Coloca o novo post no topo

        areaPosts.prepend(novoPost);


        // Adiciona as funcionalidades

        adicionarCliqueNoCard(novoPost);

        configurarCurtir(novoPost);

        configurarSalvar(novoPost);


        // Limpa os campos

        campoTitulo.value = "";

        campoTexto.value = "";

        campoCategoria.selectedIndex = 0;


        alert("Seu post foi publicado ♡");

    });

}


// =========================================
// 9. CARREGAR POST NA PÁGINA POST.HTML
// =========================================

const paginaPost =
    document.querySelector(".post-detalhe");


if (paginaPost) {

    const titulo =
        localStorage.getItem("postTitulo");


    const texto =
        localStorage.getItem("postTexto");


    const categoria =
        localStorage.getItem("postCategoria");


    const nome =
        localStorage.getItem("postNome");


    const tempo =
        localStorage.getItem("postTempo");


    const avatar =
        localStorage.getItem("postAvatar");


    // Coloca as informações na página

    if (titulo) {

        document.getElementById(
            "titulo-post"
        ).textContent = titulo;

    }


    if (texto) {

        document.getElementById(
            "texto-post"
        ).textContent = texto;

    }


    if (categoria) {

        const categoriaPost =
            paginaPost.querySelector(
                ".post-categoria"
            );


        if (categoriaPost) {

            categoriaPost.textContent =
                categoria;

        }

    }


    if (nome) {

        const nomePost =
            paginaPost.querySelector(
                ".nome-usuario"
            );


        if (nomePost) {

            nomePost.textContent =
                nome;

        }

    }


    if (tempo) {

        const tempoPost =
            paginaPost.querySelector(
                ".tempo-post"
            );


        if (tempoPost) {

            tempoPost.textContent =
                tempo;

        }

    }


    if (avatar) {

        const avatarPost =
            paginaPost.querySelector(
                ".avatar"
            );


        if (avatarPost) {

            avatarPost.textContent =
                avatar;

        }

    }

}


// =========================================
// 10. COMENTÁRIOS DA PÁGINA DO POST
// =========================================

const botaoEnviarComentario =
    document.getElementById(
        "enviar-comentario"
    );


const inputComentario =
    document.getElementById(
        "input-comentario"
    );


const listaComentarios =
    document.getElementById(
        "lista-comentarios"
    );


if (
    botaoEnviarComentario &&
    inputComentario &&
    listaComentarios
) {

    botaoEnviarComentario.addEventListener(
        "click",
        () => {

            const texto =
                inputComentario.value.trim();


            if (texto === "") {

                return;

            }


            const comentario =
                document.createElement("div");


            comentario.classList.add(
                "comentario"
            );


            comentario.innerHTML = `

                <strong>
                    🩷 Você
                </strong>

                <p>
                    ${texto}
                </p>

            `;


            listaComentarios.appendChild(
                comentario
            );


            inputComentario.value = "";

        }
    );

}
