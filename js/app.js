/* =========================================================
   ENTRE NÓS — APP.JS
   Funcionalidades principais da página inicial
   ========================================================= */

"use strict";

/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */

const STORAGE_KEYS = {
    savedPosts: "entreNos_savedPosts",
    reactions: "entreNos_reactions",
    hiddenPosts: "entreNos_hiddenPosts",
    theme: "entreNos_theme"
};


/* =========================================================
   UTILIDADES
   ========================================================= */

function getStorage(key, fallback = []) {
    try {
        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        return JSON.parse(value);
    } catch (error) {
        console.warn("Erro ao ler localStorage:", error);
        return fallback;
    }
}


function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn("Erro ao salvar no localStorage:", error);
    }
}


function showToast(message, icon = "♥") {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    const toastIcon = document.querySelector(".toast-icon");

    if (!toast || !toastMessage) {
        return;
    }

    toastMessage.textContent = message;

    if (toastIcon) {
        toastIcon.textContent = icon;
    }

    toast.classList.add("show");

    clearTimeout(window.toastTimeout);

    window.toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}


/* =========================================================
   ESTADO
   ========================================================= */

let savedPosts = getStorage(STORAGE_KEYS.savedPosts, []);
let reactions = getStorage(STORAGE_KEYS.reactions, {});
let hiddenPosts = getStorage(STORAGE_KEYS.hiddenPosts, []);


/* =========================================================
   SALVAR PUBLICAÇÕES
   ========================================================= */

function updateSaveButtons() {
    const buttons = document.querySelectorAll(".save-button");

    buttons.forEach(button => {
        const postId = String(button.dataset.postId);

        if (savedPosts.includes(postId)) {
            button.classList.add("saved");
            button.textContent = "♥";
            button.setAttribute("aria-label", "Remover dos salvos");
            button.title = "Remover dos salvos";
        } else {
            button.classList.remove("saved");
            button.textContent = "♡";
            button.setAttribute("aria-label", "Salvar publicação");
            button.title = "Salvar publicação";
        }
    });
}


function toggleSave(postId) {
function toggleSave(postId) {
    postId = String(postId);

    const buttons = document.querySelectorAll(
        `.save-button[data-post-id="${postId}"]`
    );

    const wasSaved = savedPosts.includes(postId);

    if (wasSaved) {
        savedPosts = savedPosts.filter(id => id !== postId);

        buttons.forEach(button => {
            button.classList.remove("saved", "save-pop");

            button.textContent = "♡";

            button.animate(
                [
                    { transform: "scale(1)" },
                    { transform: "scale(.82)" },
                    { transform: "scale(1)" }
                ],
                {
                    duration: 280,
                    easing: "cubic-bezier(.34,1.56,.64,1)"
                }
            );
        });

        showToast("Removido dos salvos", "♡");

    } else {
        savedPosts.push(postId);

        buttons.forEach(button => {
            button.classList.add("saved", "save-pop");

            button.textContent = "♥";

            button.animate(
                [
                    { transform: "scale(1)" },
                    { transform: "scale(1.35)" },
                    { transform: "scale(.92)" },
                    { transform: "scale(1.08)" },
                    { transform: "scale(1)" }
                ],
                {
                    duration: 500,
                    easing: "cubic-bezier(.34,1.56,.64,1)"
                }
            );

            setTimeout(() => {
                button.classList.remove("save-pop");
            }, 550);
        });

        showToast("Publicação salva ♥", "♥");
    }

    setStorage(STORAGE_KEYS.savedPosts, savedPosts);
    updateSaveButtons();
}


/* =========================================================
   REAÇÕES
   ========================================================= */

function updateReactionButton(button) {
    const postId = String(
        button.closest(".post-card")?.dataset.postId || ""
    );

    const isReacted = reactions[postId] === true;

    const icon = button.querySelector("span:first-child");
    const count = button.querySelector(".reaction-count");

    if (isReacted) {
        button.classList.add("reacted");

        if (icon) {
            icon.textContent = "♥";
        }

        if (count) {
            const originalCount =
                parseInt(count.dataset.originalCount || count.textContent, 10);

            count.textContent = originalCount + 1;
        }
    } else {
        button.classList.remove("reacted");

        if (icon) {
            icon.textContent = "♥";
        }

        if (count) {
            const originalCount =
                parseInt(count.dataset.originalCount || count.textContent, 10);

            count.textContent = originalCount;
        }
    }
}


function initializeReactionCounts() {
    document.querySelectorAll(".reaction-count").forEach(count => {
        if (!count.dataset.originalCount) {
            count.dataset.originalCount = count.textContent;
        }
    });
}


function toggleReaction(button) {
    const card = button.closest(".post-card");

    if (!card) return;

    const postId = String(card.dataset.postId);
    const icon = button.querySelector("span:first-child");
    const count = button.querySelector(".reaction-count");

    const wasReacted = reactions[postId] === true;

    reactions[postId] = !wasReacted;

    setStorage(STORAGE_KEYS.reactions, reactions);

    const originalCount = parseInt(
        count?.dataset.originalCount || "0",
        10
    );

    if (!wasReacted) {

        button.classList.add("reacted");

        if (icon) {
            icon.textContent = "❤️";
        }

        if (count) {
            count.textContent = originalCount + 1;
        }

        /* ANIMAÇÃO DO CORAÇÃO */

        button.animate(
            [
                {
                    transform: "scale(1)",
                },
                {
                    transform: "scale(.88)",
                },
                {
                    transform: "scale(1.35)",
                },
                {
                    transform: "scale(.95)",
                },
                {
                    transform: "scale(1.08)",
                },
                {
                    transform: "scale(1)",
                }
            ],
            {
                duration: 600,
                easing: "cubic-bezier(.34,1.56,.64,1)"
            }
        );

        /* Pequenos corações */

        createFloatingHeart(button);

        showToast(
            "Você apoiou essa história ❤️",
            "♥"
        );

    } else {

        button.classList.remove("reacted");

        if (icon) {
            icon.textContent = "♥";
        }

        if (count) {
            count.textContent = originalCount;
        }

        button.animate(
            [
                { transform: "scale(1)" },
                { transform: "scale(.85)" },
                { transform: "scale(1)" }
            ],
            {
                duration: 300,
                easing: "ease-out"
            }
        );

        showToast(
            "Apoio removido",
            "♡"
        );
    }
}
    const card = button.closest(".post-card");

    if (!card) {
        return;
    }

    const postId = String(card.dataset.postId);

    reactions[postId] = !reactions[postId];

    setStorage(STORAGE_KEYS.reactions, reactions);

    const count = button.querySelector(".reaction-count");

    if (reactions[postId]) {
        button.classList.add("reacted");

        const icon = button.querySelector("span:first-child");

        if (icon) {
            icon.textContent = "❤️";
        }

        if (count) {
            const originalCount =
                parseInt(count.dataset.originalCount, 10);

            count.textContent = originalCount + 1;
        }

        showToast("Você apoiou essa história ❤️", "♥");

        button.animate(
            [
                {
                    transform: "scale(1)"
                },
                {
                    transform: "scale(1.2)"
                },
                {
                    transform: "scale(1)"
                }
            ],
            {
                duration: 350,
                easing: "ease-out"
            }
        );

    } else {
        button.classList.remove("reacted");

        const icon = button.querySelector("span:first-child");

        if (icon) {
            icon.textContent = "♥";
        }

        if (count) {
            const originalCount =
                parseInt(count.dataset.originalCount, 10);

            count.textContent = originalCount;
        }

        showToast("Apoio removido", "♡");
    }
}


/* =========================================================
   COMPARTILHAR
   ========================================================= */

async function sharePost(postId) {
    const url =
        window.location.origin +
        window.location.pathname.replace("index.html", "post.html") +
        "?id=" +
        encodeURIComponent(postId);

    const shareData = {
        title: "Entre Nós ♡",
        text: "Olha essa história no Entre Nós.",
        url: url
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);

            showToast("Compartilhado ♥", "↗");
            return;
        }

        await navigator.clipboard.writeText(url);

        showToast("Link copiado para a área de transferência", "🔗");

    } catch (error) {

        if (error.name === "AbortError") {
            return;
        }

        try {
            await navigator.clipboard.writeText(url);

            showToast("Link copiado ♥", "🔗");

        } catch {
            showToast("Não foi possível compartilhar", "!");
        }
    }
}


/* =========================================================
   MODAL DE OPÇÕES
   ========================================================= */

const modal = document.getElementById("post-options-modal");
const closeModalButton = document.getElementById("close-post-modal");

let selectedPostId = null;


function openPostModal(postId) {
    if (!modal) {
        return;
    }

    selectedPostId = String(postId);

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}


function closePostModal() {
    if (!modal) {
        return;
    }

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    selectedPostId = null;
}


if (closeModalButton) {
    closeModalButton.addEventListener("click", closePostModal);
}


if (modal) {
    modal.addEventListener("click", event => {

        if (event.target === modal) {
            closePostModal();
        }

    });
}


document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closePostModal();
    }

});


/* =========================================================
   OCULTAR PUBLICAÇÃO
   ========================================================= */

function hidePost(postId) {
    postId = String(postId);

    if (!hiddenPosts.includes(postId)) {
        hiddenPosts.push(postId);
    }

    setStorage(STORAGE_KEYS.hiddenPosts, hiddenPosts);

    const card = document.querySelector(
        `.post-card[data-post-id="${postId}"]`
    );

    if (card) {

        card.style.transition = "0.3s ease";
        card.style.opacity = "0";
        card.style.transform = "translateY(-10px)";

        setTimeout(() => {
            card.remove();
        }, 300);
    }

    showToast("Publicação ocultada", "♡");

    closePostModal();
}


/* =========================================================
   DENÚNCIA
   ========================================================= */

function reportPost() {

    showToast(
        "Obrigado. Vamos analisar essa publicação.",
        "⚠"
    );

    closePostModal();
}


/* =========================================================
   COPIAR LINK
   ========================================================= */

async function copyPostLink(postId) {

    const url =
        window.location.origin +
        window.location.pathname.replace("index.html", "post.html") +
        "?id=" +
        encodeURIComponent(postId);

    try {

        await navigator.clipboard.writeText(url);

        showToast("Link copiado ♥", "🔗");

    } catch {

        showToast("Não foi possível copiar o link", "!");

    }

    closePostModal();
}


/* =========================================================
   MENU DE OPÇÕES
   ========================================================= */

function setupPostMenus() {

    document.querySelectorAll(".post-menu-button").forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            const card = button.closest(".post-card");

            if (!card) {
                return;
            }

            openPostModal(card.dataset.postId);
        });

    });


    document.querySelectorAll(".modal-option").forEach(option => {

        option.addEventListener("click", () => {

            if (!selectedPostId) {
                return;
            }

            const text = option.textContent.toLowerCase();

            if (text.includes("salvar")) {

                toggleSave(selectedPostId);
                closePostModal();

            } else if (text.includes("copiar")) {

                copyPostLink(selectedPostId);

            } else if (text.includes("ocultar")) {

                hidePost(selectedPostId);

            } else if (text.includes("denunciar")) {

                reportPost();

            }

        });

    });
}


/* =========================================================
   FILTRO POR CATEGORIA
   ========================================================= */

function setupCategoryFilters() {

    const chips = document.querySelectorAll(".category-chip");
    const posts = document.querySelectorAll(".post-card");

    chips.forEach(chip => {

        chip.addEventListener("click", () => {

            const category = chip.dataset.category;

            chips.forEach(item => {
                item.classList.remove("active");
            });

            chip.classList.add("active");

            let visiblePosts = 0;

            posts.forEach(post => {

                const postCategory = post.dataset.category;

                if (
                    category === "Tudo" ||
                    postCategory === category
                ) {

                    post.style.display = "";
                    visiblePosts++;

                } else {

                    post.style.display = "none";

                }

            });

            if (category === "Tudo") {
                showToast("Mostrando todas as histórias", "♡");
            } else {
                showToast(
                    `Mostrando histórias de ${category}`,
                    "♥"
                );
            }

            if (visiblePosts === 0) {
                showToast("Ainda não há histórias nessa categoria", "♡");
            }

        });

    });
}


/* =========================================================
   FILTRO RECENTES / POPULARES
   ========================================================= */

function setupFeedFilters() {

    const filters =
        document.querySelectorAll(".filter-button");

    const feed =
        document.querySelector(".feed-section");

    if (!feed) {
        return;
    }

    const cards =
        Array.from(feed.querySelectorAll(".post-card"));

    filters.forEach(filter => {

        filter.addEventListener("click", () => {

            filters.forEach(item => {
                item.classList.remove("active");
            });

            filter.classList.add("active");

            const type = filter.dataset.filter;

            if (type === "populares") {

                cards.sort((a, b) => {

                    const aCount =
                        parseInt(
                            a.querySelector(".reaction-count")?.textContent || "0",
                            10
                        );

                    const bCount =
                        parseInt(
                            b.querySelector(".reaction-count")?.textContent || "0",
                            10
                        );

                    return bCount - aCount;
                });

                cards.forEach(card => {
                    feed.insertBefore(
                        card,
                        feed.querySelector(".load-more")
                    );
                });

                showToast("Histórias mais apoiadas primeiro", "♥");

            } else {

                cards.sort((a, b) => {

                    const idA =
                        parseInt(a.dataset.postId || "0", 10);

                    const idB =
                        parseInt(b.dataset.postId || "0", 10);

                    return idA - idB;
                });

                cards.forEach(card => {
                    feed.insertBefore(
                        card,
                        feed.querySelector(".load-more")
                    );
                });

                showToast("Histórias mais recentes primeiro", "♡");
            }

        });

    });
}


/* =========================================================
   PESQUISA
   ========================================================= */

function setupSearch() {

    const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");

    if (!form || !input) {
        return;
    }

    form.addEventListener("submit", event => {

        event.preventDefault();

        const query =
            input.value.trim().toLowerCase();

        if (!query) {
            showToast("Digite algo para pesquisar", "🔍");
            input.focus();
            return;
        }

        const posts =
            document.querySelectorAll(".post-card");

        let found = 0;

        posts.forEach(post => {

            const content =
                post.textContent.toLowerCase();

            if (content.includes(query)) {

                post.style.display = "";

                found++;

                post.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                post.animate(
                    [
                        {
                            transform: "scale(1)"
                        },
                        {
                            transform: "scale(1.02)"
                        },
                        {
                            transform: "scale(1)"
                        }
                    ],
                    {
                        duration: 500
                    }
                );

            } else {

                post.style.display = "none";

            }

        });

        if (found > 0) {

            showToast(
                `${found} história(s) encontrada(s)`,
                "🔍"
            );

        } else {

            showToast(
                "Nenhuma história encontrada",
                "♡"
            );

        }

    });

}


/* =========================================================
   COMPARTILHAMENTO DOS POSTS
   ========================================================= */

function setupShareButtons() {

    document.querySelectorAll(".share-button").forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const postId = button.dataset.postId;

            sharePost(postId);

        });

    });

}


/* =========================================================
   BOTÕES DE SALVAR
   ========================================================= */

function setupSaveButtons() {

    document.querySelectorAll(".save-button").forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            const postId = button.dataset.postId;

            toggleSave(postId);

        });

    });

}


/* =========================================================
   BOTÕES DE REAÇÃO
   ========================================================= */

function setupReactionButtons() {

    document.querySelectorAll(".reaction-button").forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            toggleReaction(button);

        });

    });

}


/* =========================================================
   CARREGAR MAIS
   ========================================================= */

function setupLoadMore() {

    const button =
        document.getElementById("load-more-posts");

    if (!button) {
        return;
    }

    button.addEventListener("click", () => {

        showToast(
            "Novas histórias estarão disponíveis em breve ♥",
            "♥"
        );

        button.animate(
            [
                {
                    transform: "scale(1)"
                },
                {
                    transform: "scale(0.97)"
                },
                {
                    transform: "scale(1)"
                }
            ],
            {
                duration: 250
            }
        );

    });
}


/* =========================================================
   LINKS DE CATEGORIA
   ========================================================= */

function setupCategoryLinks() {

    document.querySelectorAll(
        ".sidebar-category, .sidebar-see-more"
    ).forEach(link => {

        link.addEventListener("click", () => {

            const href = link.getAttribute("href");

            if (
                href &&
                href.includes("explorar.html")
            ) {
                return;
            }

        });

    });
}


/* =========================================================
   POSTS OCULTOS
   ========================================================= */

function applyHiddenPosts() {

    hiddenPosts.forEach(postId => {

        const card = document.querySelector(
            `.post-card[data-post-id="${postId}"]`
        );

        if (card) {
            card.remove();
        }

    });
}


/* =========================================================
   ESTADO DAS REAÇÕES
   ========================================================= */

function restoreReactions() {

    initializeReactionCounts();

    document.querySelectorAll(".reaction-button").forEach(button => {

        const card = button.closest(".post-card");

        if (!card) {
            return;
        }

        const postId = String(card.dataset.postId);

        if (reactions[postId]) {
            button.classList.add("reacted");

            const icon =
                button.querySelector("span:first-child");

            const count =
                button.querySelector(".reaction-count");

            if (icon) {
                icon.textContent = "❤️";
            }

            if (count) {

                const originalCount =
                    parseInt(
                        count.dataset.originalCount,
                        10
                    );

                count.textContent =
                    originalCount + 1;
            }
        }

    });

}


/* =========================================================
   LINKS DOS POSTS
   ========================================================= */

function setupPostLinks() {

    document.querySelectorAll(".post-content").forEach(link => {

        link.addEventListener("click", event => {

            const href =
                link.getAttribute("href");

            if (!href) {
                event.preventDefault();

                showToast(
                    "Abrindo história...",
                    "♡"
                );
            }

        });

    });

}


/* =========================================================
   ANIMAÇÃO DOS CORAÇÕES
   ========================================================= */

function setupHeartHover() {

    document.querySelectorAll(
        ".logo-heart, .heart-decoration, .cta-heart"
    ).forEach(element => {

        element.addEventListener("mouseenter", () => {

            element.animate(
                [
                    {
                        transform: "scale(1)"
                    },
                    {
                        transform: "scale(1.12)"
                    },
                    {
                        transform: "scale(1)"
                    }
                ],
                {
                    duration: 450,
                    easing: "ease-out"
                }
            );

        });

    });

}


/* =========================================================
   CARREGAR PUBLICAÇÕES CRIADAS PELO USUÁRIO
========================================================= */

function getUserPosts() {
    try {
        return JSON.parse(
            localStorage.getItem("entreNos_userPosts") || "[]"
        );
    } catch {
        return [];
    }
}


function escapeUserPostHTML(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
}


function renderUserPosts() {

    const feed = document.querySelector(".feed-section");

    if (!feed) {
        return;
    }

    const loadMore = feed.querySelector(".load-more");

    if (!loadMore) {
        return;
    }

    const userPosts = getUserPosts();

    if (!userPosts.length) {
        return;
    }


    userPosts.forEach(post => {

        /* Evita duplicar a publicação */

        if (
            feed.querySelector(
                `.post-card[data-post-id="${post.id}"]`
            )
        ) {
            return;
        }


        /* Retira o emoji da categoria para o filtro */

        const categoryText = String(post.categoria || "")
            .replace(
                /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/u,
                ""
            )
            .trim();


        const article = document.createElement("article");

        article.className = "post-card";

        article.dataset.category = categoryText;

        article.dataset.postId = String(post.id);


        article.innerHTML = `

            <div class="post-header">

                <a href="perfil.html" class="post-author">

                    <span class="avatar avatar-flower">
                        ${escapeUserPostHTML(post.avatar || "🌸")}
                    </span>

                    <span class="author-info">

                        <strong>
                            ${escapeUserPostHTML(post.nome || "Anônima")}
                        </strong>

                        <small>
                            ${escapeUserPostHTML(post.tempo || "agora")}
                        </small>

                    </span>

                </a>


                <button
                    type="button"
                    class="post-menu-button"
                    aria-label="Mais opções"
                >
                    ⋯
                </button>

            </div>


            <a
                href="explorar.html?categoria=${encodeURIComponent(categoryText)}"
                class="post-category"
            >
                ${escapeUserPostHTML(post.categoria || "💭 Desabafo")}
            </a>


            <a
                href="post.html?id=${encodeURIComponent(post.id)}"
                class="post-content"
            >

                <h3>
                    ${escapeUserPostHTML(post.titulo)}
                </h3>

                <p>
                    ${escapeUserPostHTML(post.texto)}
                </p>

            </a>


            <div class="hashtags">

                <a href="explorar.html?tag=entre-nos">
                    #entreNós
                </a>

                ${
                    post.askingAdvice
                        ? `
                        <a href="explorar.html?tag=conselho">
                            #conselho
                        </a>
                        `
                        : ""
                }

            </div>


            <div class="post-actions">

                <div class="post-reactions">

                    <button
                        type="button"
                        class="reaction-button"
                        data-reaction="support"
                        aria-label="Apoiar"
                    >

                        <span>♥</span>

                        <span class="reaction-count">
                            0
                        </span>

                    </button>


                    <a
                        href="post.html?id=${encodeURIComponent(post.id)}#comentarios"
                        class="post-action"
                    >

                        <span>♡</span>

                        <span>
                            0
                        </span>

                    </a>


                    <button
                        type="button"
                        class="post-action share-button"
                        data-post-id="${escapeUserPostHTML(post.id)}"
                    >

                        <span>↗</span>

                        <span>
                            Compartilhar
                        </span>

                    </button>

                </div>


                <button
                    type="button"
                    class="save-button"
                    data-post-id="${escapeUserPostHTML(post.id)}"
                    aria-label="Salvar publicação"
                >
                    ♡
                </button>

            </div>

        `;


        /* Coloca o novo post no topo do feed */

        feed.insertBefore(article, feed.firstElementChild);


        /* Configura imediatamente os botões do novo post */

        const saveButton =
            article.querySelector(".save-button");

        const reactionButton =
            article.querySelector(".reaction-button");

        const shareButton =
            article.querySelector(".share-button");

        const menuButton =
            article.querySelector(".post-menu-button");


        if (saveButton) {

            saveButton.addEventListener("click", event => {

                event.preventDefault();
                event.stopPropagation();

                toggleSave(post.id);

            });

        }


        if (reactionButton) {

            reactionButton.addEventListener("click", event => {

                event.preventDefault();

                toggleReaction(reactionButton);

            });

        }


        if (shareButton) {

            shareButton.addEventListener("click", event => {

                event.preventDefault();

                sharePost(post.id);

            });

        }


        if (menuButton) {

            menuButton.addEventListener("click", event => {

                event.preventDefault();
                event.stopPropagation();

                openPostModal(post.id);

            });

        }

    });


    /* Atualiza o estado dos botões */

    updateSaveButtons();

    initializeReactionCounts();

    restoreReactions();

}/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function initializeApp() {

    renderUserPosts();

    applyHiddenPosts();

    initializeReactionCounts();
    restoreReactions();

    updateSaveButtons();

    setupSaveButtons();
    setupReactionButtons();
    setupShareButtons();

    setupPostMenus();

    setupCategoryFilters();
    setupFeedFilters();

    setupSearch();

    setupLoadMore();

    setupCategoryLinks();
    setupPostLinks();

    setupHeartHover();

    console.log("Entre Nós ♡ carregado com sucesso!");
}


/* =========================================================
   INICIAR
   ========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();

}
