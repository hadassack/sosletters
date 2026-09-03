/* =========================================================
   ENTRE NÓS — APP.JS
   Funcionalidades principais
   ========================================================= */

"use strict";

/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */

const STORAGE_KEYS = {
    savedPosts: "entreNos_savedPosts",
    reactions: "entreNos_reactions",
    hiddenPosts: "entreNos_hiddenPosts",
    userPosts: "entreNos_userPosts",
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
        console.warn("Erro ao salvar localStorage:", error);
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

let savedPosts = getStorage(
    STORAGE_KEYS.savedPosts,
    []
);

let reactions = getStorage(
    STORAGE_KEYS.reactions,
    {}
);

let hiddenPosts = getStorage(
    STORAGE_KEYS.hiddenPosts,
    []
);


/* =========================================================
   SALVAR PUBLICAÇÕES
   ========================================================= */

function updateSaveButtons() {

    document.querySelectorAll(".save-button").forEach(button => {

        const postId = String(
            button.dataset.postId
        );

        if (savedPosts.includes(postId)) {

            button.classList.add("saved");

            button.textContent = "♥";

            button.setAttribute(
                "aria-label",
                "Remover dos salvos"
            );

            button.title = "Remover dos salvos";

        } else {

            button.classList.remove("saved");

            button.textContent = "♡";

            button.setAttribute(
                "aria-label",
                "Salvar publicação"
            );

            button.title = "Salvar publicação";
        }

    });
}


function toggleSave(postId) {

    postId = String(postId);

    const buttons = document.querySelectorAll(
        `.save-button[data-post-id="${postId}"]`
    );

    const alreadySaved =
        savedPosts.includes(postId);


    if (alreadySaved) {

        savedPosts = savedPosts.filter(
            id => id !== postId
        );

        buttons.forEach(button => {

            button.classList.remove(
                "saved",
                "save-pop"
            );

            button.textContent = "♡";

            button.animate(
                [
                    { transform: "scale(1)" },
                    { transform: "scale(.82)" },
                    { transform: "scale(1)" }
                ],
                {
                    duration: 280,
                    easing:
                        "cubic-bezier(.34,1.56,.64,1)"
                }
            );

        });

        showToast(
            "Removido dos salvos",
            "♡"
        );

    } else {

        savedPosts.push(postId);

        buttons.forEach(button => {

            button.classList.add(
                "saved",
                "save-pop"
            );

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
                    easing:
                        "cubic-bezier(.34,1.56,.64,1)"
                }
            );

            setTimeout(() => {
                button.classList.remove(
                    "save-pop"
                );
            }, 550);

        });

        showToast(
            "Publicação salva ♥",
            "♥"
        );
    }

    setStorage(
        STORAGE_KEYS.savedPosts,
        savedPosts
    );

    updateSaveButtons();
}


/* =========================================================
   REAÇÕES
   ========================================================= */

function initializeReactionCounts() {

    document.querySelectorAll(
        ".reaction-count"
    ).forEach(count => {

        if (!count.dataset.originalCount) {

            count.dataset.originalCount =
                count.textContent.trim() || "0";
        }

    });
}


function createFloatingHeart(button) {

    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent = "♥";

    heart.style.position = "absolute";
    heart.style.pointerEvents = "none";
    heart.style.fontSize = "18px";
    heart.style.left = "50%";
    heart.style.top = "50%";
    heart.style.zIndex = "20";

    const parent = button.parentElement;

    if (!parent) {
        return;
    }

    if (
        getComputedStyle(parent).position ===
        "static"
    ) {
        parent.style.position = "relative";
    }

    parent.appendChild(heart);

    heart.animate(
        [
            {
                transform:
                    "translate(-50%, -20%) scale(.7)",
                opacity: 1
            },
            {
                transform:
                    "translate(-50%, -65px) scale(1.2)",
                opacity: 0
            }
        ],
        {
            duration: 850,
            easing: "ease-out"
        }
    ).onfinish = () => {
        heart.remove();
    };
}


function toggleReaction(button) {

    const card =
        button.closest(".post-card");

    if (!card) {
        return;
    }

    const postId =
        String(card.dataset.postId);

    const icon =
        button.querySelector(
            "span:first-child"
        );

    const count =
        button.querySelector(
            ".reaction-count"
        );

    const wasReacted =
        reactions[postId] === true;

    reactions[postId] =
        !wasReacted;

    setStorage(
        STORAGE_KEYS.reactions,
        reactions
    );


    const originalCount = parseInt(
        count?.dataset.originalCount || "0",
        10
    );


    if (!wasReacted) {

        button.classList.add(
            "reacted"
        );

        if (icon) {
            icon.textContent = "❤️";
        }

        if (count) {
            count.textContent =
                originalCount + 1;
        }

        button.animate(
            [
                { transform: "scale(1)" },
                { transform: "scale(.88)" },
                { transform: "scale(1.3)" },
                { transform: "scale(.95)" },
                { transform: "scale(1.08)" },
                { transform: "scale(1)" }
            ],
            {
                duration: 600,
                easing:
                    "cubic-bezier(.34,1.56,.64,1)"
            }
        );

        createFloatingHeart(button);

        showToast(
            "Você apoiou essa história ❤️",
            "♥"
        );

    } else {

        button.classList.remove(
            "reacted"
        );

        if (icon) {
            icon.textContent = "♥";
        }

        if (count) {
            count.textContent =
                originalCount;
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


/* =========================================================
   COMPARTILHAR
   ========================================================= */

async function sharePost(postId) {

    const url =
        window.location.origin +
        window.location.pathname
            .replace("index.html", "post.html") +
        "?id=" +
        encodeURIComponent(postId);

    const shareData = {
        title: "Entre Nós ♡",
        text:
            "Olha essa história no Entre Nós.",
        url: url
    };

    try {

        if (navigator.share) {

            await navigator.share(
                shareData
            );

            showToast(
                "Compartilhado ♥",
                "↗"
            );

            return;
        }

        await navigator.clipboard.writeText(
            url
        );

        showToast(
            "Link copiado ♥",
            "🔗"
        );

    } catch (error) {

        if (
            error &&
            error.name === "AbortError"
        ) {
            return;
        }

        try {

            await navigator.clipboard.writeText(
                url
            );

            showToast(
                "Link copiado ♥",
                "🔗"
            );

        } catch {

            showToast(
                "Não foi possível compartilhar",
                "!"
            );
        }
    }
}


/* =========================================================
   MODAL
   ========================================================= */

let selectedPostId = null;


function getPostModal() {
    return document.getElementById(
        "post-options-modal"
    );
}


function openPostModal(postId) {

    const modal = getPostModal();

    if (!modal) {
        return;
    }

    selectedPostId =
        String(postId);

    modal.classList.add(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}


function closePostModal() {

    const modal = getPostModal();

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    selectedPostId = null;
}


/* =========================================================
   OCULTAR PUBLICAÇÃO
   ========================================================= */

function hidePost(postId) {

    postId = String(postId);

    if (!hiddenPosts.includes(postId)) {

        hiddenPosts.push(
            postId
        );
    }

    setStorage(
        STORAGE_KEYS.hiddenPosts,
        hiddenPosts
    );

    const card =
        document.querySelector(
            `.post-card[data-post-id="${postId}"]`
        );

    if (card) {

        card.style.transition =
            "all .3s ease";

        card.style.opacity = "0";

        card.style.transform =
            "translateY(-10px)";

        setTimeout(() => {
            card.remove();
        }, 300);
    }

    showToast(
        "Publicação ocultada",
        "♡"
    );

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
        window.location.pathname
            .replace("index.html", "post.html") +
        "?id=" +
        encodeURIComponent(postId);

    try {

        await navigator.clipboard.writeText(
            url
        );

        showToast(
            "Link copiado ♥",
            "🔗"
        );

    } catch {

        showToast(
            "Não foi possível copiar o link",
            "!"
        );
    }

    closePostModal();
}


/* =========================================================
   MENUS DOS POSTS
   ========================================================= */

function setupPostMenus() {

    document.querySelectorAll(
        ".post-menu-button"
    ).forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                const card =
                    button.closest(
                        ".post-card"
                    );

                if (!card) {
                    return;
                }

                openPostModal(
                    card.dataset.postId
                );
            }
        );
    });


    document.querySelectorAll(
        ".modal-option"
    ).forEach(option => {

        option.addEventListener(
            "click",
            () => {

                if (!selectedPostId) {
                    return;
                }

                const text =
                    option.textContent
                        .toLowerCase();

                if (
                    text.includes("salvar")
                ) {

                    toggleSave(
                        selectedPostId
                    );

                    closePostModal();

                } else if (
                    text.includes("copiar")
                ) {

                    copyPostLink(
                        selectedPostId
                    );

                } else if (
                    text.includes("ocultar")
                ) {

                    hidePost(
                        selectedPostId
                    );

                } else if (
                    text.includes("denunciar")
                ) {

                    reportPost();
                }
            }
        );
    });
}


/* =========================================================
   FILTROS DE CATEGORIA
   ========================================================= */

function setupCategoryFilters() {

    const chips =
        document.querySelectorAll(
            ".category-chip"
        );

    chips.forEach(chip => {

        chip.addEventListener(
            "click",
            () => {

                const category =
                    chip.dataset.category;

                chips.forEach(item => {
                    item.classList.remove(
                        "active"
                    );
                });

                chip.classList.add(
                    "active"
                );

                const posts =
                    document.querySelectorAll(
                        ".post-card"
                    );

                let visiblePosts = 0;

                posts.forEach(post => {

                    const postCategory =
                        post.dataset.category;

                    if (
                        category === "Tudo" ||
                        postCategory === category
                    ) {

                        post.style.display =
                            "";

                        visiblePosts++;

                    } else {

                        post.style.display =
                            "none";
                    }
                });


                if (
                    visiblePosts === 0
                ) {

                    showToast(
                        "Ainda não há histórias nessa categoria",
                        "♡"
                    );

                } else if (
                    category === "Tudo"
                ) {

                    showToast(
                        "Mostrando todas as histórias",
                        "♡"
                    );

                } else {

                    showToast(
                        `Mostrando histórias de ${category}`,
                        "♥"
                    );
                }
            }
        );
    });
}


/* =========================================================
   FILTRO RECENTES / POPULARES
   ========================================================= */

function setupFeedFilters() {

    const filters =
        document.querySelectorAll(
            ".filter-button"
        );

    const feed =
        document.querySelector(
            ".feed-section"
        );

    if (!feed) {
        return;
    }

    let cards =
        Array.from(
            feed.querySelectorAll(
                ".post-card"
            )
        );


    filters.forEach(filter => {

        filter.addEventListener(
            "click",
            () => {

                filters.forEach(item => {
                    item.classList.remove(
                        "active"
                    );
                });

                filter.classList.add(
                    "active"
                );

                const type =
                    filter.dataset.filter;


                if (
                    type === "populares"
                ) {

                    cards.sort(
                        (a, b) => {

                            const aCount =
                                parseInt(
                                    a.querySelector(
                                        ".reaction-count"
                                    )?.textContent ||
                                    "0",
                                    10
                                );

                            const bCount =
                                parseInt(
                                    b.querySelector(
                                        ".reaction-count"
                                    )?.textContent ||
                                    "0",
                                    10
                                );

                            return (
                                bCount -
                                aCount
                            );
                        }
                    );

                    cards.forEach(card => {

                        feed.insertBefore(
                            card,
                            feed.querySelector(
                                ".load-more"
                            )
                        );
                    });

                    showToast(
                        "Histórias mais apoiadas primeiro",
                        "♥"
                    );

                } else {

                    cards.sort(
                        (a, b) => {

                            const aId =
                                parseInt(
                                    a.dataset.postId ||
                                    "0",
                                    10
                                );

                            const bId =
                                parseInt(
                                    b.dataset.postId ||
                                    "0",
                                    10
                                );

                            return bId - aId;
                        }
                    );

                    cards.forEach(card => {

                        feed.insertBefore(
                            card,
                            feed.querySelector(
                                ".load-more"
                            )
                        );
                    });

                    showToast(
                        "Histórias mais recentes primeiro",
                        "♡"
                    );
                }
            }
        );
    });
}


/* =========================================================
   PESQUISA
   ========================================================= */

function setupSearch() {

    const form =
        document.getElementById(
            "search-form"
        );

    const input =
        document.getElementById(
            "search-input"
        );

    if (!form || !input) {
        return;
    }

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const query =
                input.value
                    .trim()
                    .toLowerCase();

            if (!query) {

                showToast(
                    "Digite algo para pesquisar",
                    "🔍"
                );

                input.focus();

                return;
            }


            const posts =
                document.querySelectorAll(
                    ".post-card"
                );

            let found = 0;

            posts.forEach(post => {

                const content =
                    post.textContent
                        .toLowerCase();

                if (
                    content.includes(query)
                ) {

                    post.style.display =
                        "";

                    found++;

                    post.animate(
                        [
                            {
                                transform:
                                    "scale(1)"
                            },
                            {
                                transform:
                                    "scale(1.02)"
                            },
                            {
                                transform:
                                    "scale(1)"
                            }
                        ],
                        {
                            duration: 500
                        }
                    );

                } else {

                    post.style.display =
                        "none";
                }
            });


            if (found > 0) {

                showToast(
                    `${found} história(s) encontrada(s)`,
                    "🔍"
                );

                const first =
                    document.querySelector(
                        '.post-card:not([style*="display: none"])'
                    );

                if (first) {

                    first.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }

            } else {

                showToast(
                    "Nenhuma história encontrada",
                    "♡"
                );
            }
        }
    );
}


/* =========================================================
   COMPARTILHAR
   ========================================================= */

function setupShareButtons() {

    document.querySelectorAll(
        ".share-button"
    ).forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                sharePost(
                    button.dataset.postId
                );
            }
        );
    });
}


/* =========================================================
   BOTÕES DE SALVAR
   ========================================================= */

function setupSaveButtons() {

    document.querySelectorAll(
        ".save-button"
    ).forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                toggleSave(
                    button.dataset.postId
                );
            }
        );
    });
}


/* =========================================================
   BOTÕES DE REAÇÃO
   ========================================================= */

function setupReactionButtons() {

    document.querySelectorAll(
        ".reaction-button"
    ).forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                toggleReaction(
                    button
                );
            }
        );
    });
}


/* =========================================================
   COMENTÁRIOS
   ========================================================= */

function setupCommentButtons() {

    document.querySelectorAll(
        ".comment-button"
    ).forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const card =
                    button.closest(
                        ".post-card"
                    );

                if (!card) {
                    return;
                }

                const postId =
                    card.dataset.postId;

                window.location.href =
                    `post.html?id=${encodeURIComponent(postId)}#comentarios`;
            }
        );
    });
}


/* =========================================================
   CARREGAR MAIS
   ========================================================= */

function setupLoadMore() {

    const button =
        document.getElementById(
            "load-more-posts"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => {

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
                        transform: "scale(.97)"
                    },
                    {
                        transform: "scale(1)"
                    }
                ],
                {
                    duration: 250
                }
            );
        }
    );
}


/* =========================================================
   POSTS OCULTOS
   ========================================================= */

function applyHiddenPosts() {

    hiddenPosts.forEach(postId => {

        const card =
            document.querySelector(
                `.post-card[data-post-id="${postId}"]`
            );

        if (card) {
            card.remove();
        }
    });
}


/* =========================================================
   RESTAURAR REAÇÕES
   ========================================================= */

function restoreReactions() {

    initializeReactionCounts();

    document.querySelectorAll(
        ".reaction-button"
    ).forEach(button => {

        const card =
            button.closest(
                ".post-card"
            );

        if (!card) {
            return;
        }

        const postId =
            String(
                card.dataset.postId
            );

        if (
            reactions[postId]
        ) {

            button.classList.add(
                "reacted"
            );

            const icon =
                button.querySelector(
                    "span:first-child"
                );

            const count =
                button.querySelector(
                    ".reaction-count"
                );

            if (icon) {
                icon.textContent =
                    "❤️";
            }

            if (count) {

                const originalCount =
                    parseInt(
                        count.dataset.originalCount ||
                        "0",
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

    document.querySelectorAll(
        ".post-card"
    ).forEach(card => {

        const postId =
            card.dataset.postId;

        if (!postId) {
            return;
        }

        card.querySelectorAll(
            ".post-title, .post-avatar, .post-author"
        ).forEach(link => {

            if (
                link.tagName === "A"
            ) {
                link.href =
                    `post.html?id=${encodeURIComponent(postId)}`;
            }
        });
    });
}


/* =========================================================
   CORAÇÕES NO HOVER
   ========================================================= */

function setupHeartHover() {

    document.querySelectorAll(
        ".reaction-button, .save-button"
    ).forEach(button => {

        button.addEventListener(
            "mouseenter",
            () => {
                button.classList.add(
                    "heart-hover"
                );
            }
        );

        button.addEventListener(
            "mouseleave",
            () => {
                button.classList.remove(
                    "heart-hover"
                );
            }
        );
    });
}


/* =========================================================
   POSTS CRIADOS PELO USUÁRIO
   ========================================================= */

function escapeUserPostHTML(text) {

    return String(text || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


function getUserPosts() {

    return getStorage(
        STORAGE_KEYS.userPosts,
        []
    );
}


function renderUserPosts() {

    const feed =
        document.querySelector(
            ".feed-section"
        );

    if (!feed) {
        return;
    }

    const userPosts =
        getUserPosts();

    if (!userPosts.length) {
        return;
    }


    const existingIds =
        new Set(
            Array.from(
                feed.querySelectorAll(
                    ".post-card"
                )
            ).map(
                card =>
                    String(
                        card.dataset.postId
                    )
            )
        );


    const loadMore =
        feed.querySelector(
            ".load-more"
        );


    userPosts.forEach(post => {

        const id =
            String(post.id);

        if (existingIds.has(id)) {
            return;
        }


        const card =
            document.createElement(
                "article"
            );

        card.className =
            "post-card";

        card.dataset.postId =
            id;

        card.dataset.category =
            post.categoria ||
            "💭 Desabafo";


        const title =
            escapeUserPostHTML(
                post.titulo ||
                "Sem título"
            );

        const text =
            escapeUserPostHTML(
                post.texto ||
                ""
            );

        const category =
            escapeUserPostHTML(
                post.categoria ||
                "💭 Desabafo"
            );

        const avatar =
            escapeUserPostHTML(
                post.avatar ||
                "🌸"
            );

        const name =
            escapeUserPostHTML(
                post.nome ||
                "Anônima"
            );


        card.innerHTML = `

            <div class="post-header">

                <a
                    class="post-author"
                    href="post.html?id=${encodeURIComponent(id)}"
                >

                    <span class="post-avatar">
                        ${avatar}
                    </span>

                    <span>
                        ${name}
                    </span>

                </a>

                <button
                    class="post-menu-button"
                    type="button"
                    aria-label="Mais opções"
                >
                    ⋯
                </button>

            </div>


            <div class="post-category">
                ${category}
            </div>


            <a
                class="post-title"
                href="post.html?id=${encodeURIComponent(id)}"
            >
                ${title}
            </a>


            <p class="post-text">
                ${text}
            </p>


            <div class="post-meta">
                <span>
                    ${post.tempo || "agora"}
                </span>

                <span>
                    ${post.views || 0} visualizações
                </span>
            </div>


            <div class="post-actions">

                <button
                    class="reaction-button"
                    type="button"
                    data-post-id="${id}"
                >
                    <span>♥</span>
                    <span class="reaction-count"
                          data-original-count="0">
                        0
                    </span>
                    <span>Apoiar</span>
                </button>


                <button
                    class="comment-button"
                    type="button"
                    data-post-id="${id}"
                >
                    💬
                    <span>Comentar</span>
                </button>


                <button
                    class="share-button"
                    type="button"
                    data-post-id="${id}"
                >
                    ↗
                    <span>Compartilhar</span>
                </button>


                <button
                    class="save-button"
                    type="button"
                    data-post-id="${id}"
                    aria-label="Salvar publicação"
                >
                    ♡
                </button>

            </div>
        `;


        if (loadMore) {

            feed.insertBefore(
                card,
                loadMore
            );

        } else {

            feed.appendChild(
                card
            );
        }

    });
}


/* =========================================================
   MODAL
   ========================================================= */

function setupModal() {

    const modal =
        document.getElementById(
            "post-options-modal"
        );

    const closeButton =
        document.getElementById(
            "close-post-modal"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closePostModal
        );
    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closePostModal();
                }
            }
        );
    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closePostModal();
            }
        }
    );
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function initializeApp() {

    renderUserPosts();

    applyHiddenPosts();

    restoreReactions();

    updateSaveButtons();

    setupPostMenus();

    setupCategoryFilters();

    setupFeedFilters();

    setupSearch();

    setupShareButtons();

    setupSaveButtons();

    setupReactionButtons();

    setupCommentButtons();

    setupLoadMore();

    setupPostLinks();

    setupHeartHover();

    setupModal();
}


/* =========================================================
   INICIAR
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();
}
