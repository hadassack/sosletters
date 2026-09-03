```javascript
// =========================================
// ENTRE NÓS — SCRIPT.JS
// Funcionalidades do site
// =========================================


// =========================================
// 1. SELEÇÃO DE CATEGORIAS
// =========================================

const botoesCategoria = document.querySelectorAll(".categoria");

botoesCategoria.forEach((botao) => {

    botao.addEventListener("click", () => {

        // Remove a seleção de todas as categorias
        botoesCategoria.forEach((categoria) => {
            categoria.classList.remove("ativa");
        });

        // Seleciona a categoria clicada
        botao.classList.add("ativa");

    });

});


// =========================================
// 2. CURTIR POSTS
// =========================================

const botoesCurtir = document.querySelectorAll(".acao");

botoesCurtir.forEach((botao) => {

    if (botao.textContent.includes("♡")) {

        botao.addEventListener("click", () => {

            // Pega o número atual
            let texto = botao.textContent.trim();

            let numero = parseInt(
                texto.replace(/[^\d]/g, "")
            );


            // Verifica se já foi curtido
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


// =========================================
// 3. SALVAR POSTS
// =========================================

const botoesSalvar = document.querySelectorAll(".acao");

botoesSalvar.forEach((botao) => {

    if (botao.textContent.includes("Salvar")) {

        botao.addEventListener("click", () => {

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


// =========================================
// 4. COMENTÁRIOS
// =========================================

const botoesComentario = document.querySelectorAll(".acao");

botoesComentario.forEach((botao) => {

    if (botao.textContent.includes("💬")) {

        botao.addEventListener("click", () => {

            const post = botao.closest(".post-card");


            // Verifica se os comentários já estão abertos
            const comentariosExistentes =
                post.querySelector(".comentarios");


            if (comentariosExistentes) {

                comentariosExistentes.remove();

                return;

            }


            // Cria a área de comentários
            const comentarios =
                document.createElement("div");


            comentarios.classList.add("comentarios");


            comentarios.innerHTML = `

                <div class="comentarios-titulo">
                    Comentários ♡
                </div>

                <div class="lista-comentarios">

                    <p>
                        🌸 <strong>Anônima:</strong>
                        Você não está sozinha nisso 🩷
                    </p>

                </div>


                <div class="adicionar-comentario">

                    <input
                        type="text"
                        placeholder="Escreva um comentário..."
                    >

                    <button class="enviar-comentario">
                        Enviar
                    </button>

                </div>

            `;


            // Coloca os comentários no post
            post.appendChild(comentarios);


            // Botão de enviar comentário
            const botaoEnviar =
                comentarios.querySelector(
                    ".enviar-comentario"
                );


            const inputComentario =
                comentarios.querySelector(
                    "input"
                );


            botaoEnviar.addEventListener(
                "click",
                () => {

                    const texto =
                        inputComentario.value.trim();


                    if (texto === "") {

                        return;

                    }


                    const lista =
                        comentarios.querySelector(
                            ".lista-comentarios"
                        );


                    const novoComentario =
                        document.createElement("p");


                    novoComentario.innerHTML = `
                        🩷 <strong>Você:</strong>
                        ${texto}
                    `;


                    lista.appendChild(
                        novoComentario
                    );


                    inputComentario.value = "";

                }
            );

        });

    }

});


// =========================================
// 5. PUBLICAR NOVO POST
// =========================================

const botaoPublicar =
    document.querySelector(
        ".criar-post .btn-principal"
    );


const campoTitulo =
    document.querySelector(
        '.criar-post input[type="text"]'
    );


const campoTexto =
    document.querySelector(
        ".criar-post textarea"
    );


const campoCategoria =
    document.querySelector(
        ".criar-post select"
    );


const areaPosts =
    document.querySelector(
        ".posts"
    );


// Quando clicar em publicar

botaoPublicar.addEventListener(
    "click",
    () => {


        const titulo =
            campoTitulo.value.trim();


        const texto =
            campoTexto.value.trim();


        const categoria =
            campoCategoria.value;


        // Verifica se o usuário escreveu algo
        if (
            titulo === "" ||
            texto === ""
        ) {

            alert(
                "Escreva um título e conte o que está acontecendo ♡"
            );

            return;

        }


        // Cria um novo card
        const novoPost =
            document.createElement(
                "article"
            );


        novoPost.classList.add(
            "post-card"
        );


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


        // Coloca o post no início
        areaPosts.prepend(
            novoPost
        );


        // Limpa os campos
        campoTitulo.value = "";

        campoTexto.value = "";

        campoCategoria.selectedIndex = 0;


        // Mostra confirmação
        alert(
            "Seu post foi publicado ♡"
        );


        // Adiciona funções ao novo post
        adicionarFuncoesAoPost(
            novoPost
        );


    }
);


// =========================================
// 6. FUNÇÃO PARA POSTS NOVOS
// =========================================

function adicionarFuncoesAoPost(
    post
) {


    // BOTÃO DE CURTIR

    const botaoCurtir =
        post.querySelector(
            ".curtir"
        );


    botaoCurtir.addEventListener(
        "click",
        () => {


            let texto =
                botaoCurtir.textContent.trim();


            let numero =
                parseInt(
                    texto.replace(
                        /[^\d]/g,
                        ""
                    )
                );


            if (
                botaoCurtir.classList.contains(
                    "curtido"
                )
            ) {


                numero--;


                botaoCurtir.classList.remove(
                    "curtido"
                );


                botaoCurtir.innerHTML =
                    `♡ ${numero}`;


            } else {


                numero++;


                botaoCurtir.classList.add(
                    "curtido"
                );


                botaoCurtir.innerHTML =
                    `♥ ${numero}`;

            }


        }
    );


    // BOTÃO SALVAR

    const botaoSalvar =
        post.querySelector(
            ".salvar"
        );


    botaoSalvar.addEventListener(
        "click",
        () => {


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


    // BOTÃO COMENTAR

    const botaoComentar =
        post.querySelector(
            ".comentar"
        );


    botaoComentar.addEventListener(
        "click",
        () => {


            const comentariosExistentes =
                post.querySelector(
                    ".comentarios"
                );


            if (
                comentariosExistentes
            ) {


                comentariosExistentes.remove();

                return;

            }


            const comentarios =
                document.createElement(
                    "div"
                );


            comentarios.classList.add(
                "comentarios"
            );


            comentarios.innerHTML = `

                <div class="comentarios-titulo">

                    Comentários ♡

                </div>


                <div class="lista-comentarios">

                </div>


                <div class="adicionar-comentario">

                    <input
                        type="text"
                        placeholder="Escreva um comentário..."
                    >


                    <button class="enviar-comentario">

                        Enviar

                    </button>

                </div>

            `;


            post.appendChild(
                comentarios
            );


            const input =
                comentarios.querySelector(
                    "input"
                );


            const enviar =
                comentarios.querySelector(
                    ".enviar-comentario"
                );


            enviar.addEventListener(
                "click",
                () => {


                    const texto =
                        input.value.trim();


                    if (
                        texto === ""
                    ) {

                        return;

                    }


                    const lista =
                        comentarios.querySelector(
                            ".lista-comentarios"
                        );


                    const comentario =
                        document.createElement(
                            "p"
                        );


                    comentario.innerHTML = `

                        🩷 <strong>Você:</strong>
                        ${texto}

                    `;


                    lista.appendChild(
                        comentario
                    );


                    input.value = "";

                }
            );


        }
    );

}
```
