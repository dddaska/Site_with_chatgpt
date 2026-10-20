// ========================================

// STREET FOOD FEST

// Интерактивные элементы сайта

// ========================================

document.addEventListener("DOMContentLoaded", () => {

    initMobileMenu();

    initParticipantFilters();

    initScheduleTabs();

    initFaq();

    initDemoButtons();

    initSmoothScroll();

    initCurrentYear();

});

// ---------- 1. Мобильное меню ----------

function initMobileMenu() {

    const menuToggle = document.querySelector(".menu-toggle");

    const navigation = document.querySelector("#main-nav");

    if (!menuToggle || !navigation) return;

    function closeMenu() {

        navigation.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");

        document.body.classList.remove("menu-open");

    }

    function openMenu() {

        navigation.classList.add("open");

        menuToggle.setAttribute("aria-expanded", "true");

        document.body.classList.add("menu-open");

    }

    menuToggle.addEventListener("click", () => {

        const isExpanded =

            menuToggle.getAttribute("aria-expanded") === "true";

        if (isExpanded) {

            closeMenu();

        } else {

            openMenu();

        }

    });

    // Закрываем меню после перехода по ссылке.

    navigation.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", closeMenu);

    });

    // Закрываем меню клавишей Escape.

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closeMenu();

        }

    });

    // Закрываем меню при переходе к широкому экрану.

    window.addEventListener("resize", () => {

        if (window.innerWidth > 760) {

            closeMenu();

        }

    });

}

// ---------- 2. Фильтрация участников ----------

function initParticipantFilters() {

    const filterButtons = document.querySelectorAll(".filter-button");

    const participantCards = document.querySelectorAll(".participant-card");

    if (!filterButtons.length || !participantCards.length) return;

    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const selectedCategory = button.dataset.filter;

            // Подсвечиваем активную кнопку.

            filterButtons.forEach((item) => {

                const isActive = item === button;

                item.classList.toggle("active", isActive);

                item.setAttribute("aria-pressed", String(isActive));

            });

            let visibleCount = 0;

            participantCards.forEach((card) => {

                const cardCategory = card.dataset.category;

                const shouldShow =

                    selectedCategory === "all" ||

                    cardCategory === selectedCategory;

                card.hidden = !shouldShow;

                if (shouldShow) {

                    visibleCount++;

                }

            });

            // Сообщаем скринридеру, сколько карточек отображается.

            const resultsCounter = document.querySelector(

                "#filter-results"

            );

            if (resultsCounter) {

                resultsCounter.textContent =

                    `Найдено участников: ${visibleCount}`;

            }

        });

    });

}

// ---------- 3. Переключение дней программы ----------

function initScheduleTabs() {

    const dayButtons = document.querySelectorAll(".schedule-day");

    const schedulePanels = document.querySelectorAll(".schedule-panel");

    if (!dayButtons.length || !schedulePanels.length) return;

    function activateDay(button) {

        const selectedDay = button.dataset.day;

        dayButtons.forEach((item) => {

            const isActive = item === button;

            item.classList.toggle("active", isActive);

            item.setAttribute("aria-selected", String(isActive));

            item.setAttribute("tabindex", isActive ? "0" : "-1");

        });

        schedulePanels.forEach((panel) => {

            const shouldShow = panel.dataset.dayPanel === selectedDay;

            panel.hidden = !shouldShow;

        });

    }

    dayButtons.forEach((button, index) => {

        button.addEventListener("click", () => {

            activateDay(button);

        });

        // Поддержка управления вкладками с клавиатуры.

        button.addEventListener("keydown", (event) => {

            if (

                event.key !== "ArrowRight" &&

                event.key !== "ArrowLeft"

            ) {

                return;

            }

            event.preventDefault();

            const direction = event.key === "ArrowRight" ? 1 : -1;

            const nextIndex =

                (index + direction + dayButtons.length) %

                dayButtons.length;

            dayButtons[nextIndex].focus();

            activateDay(dayButtons[nextIndex]);

        });

    });

    // Показываем активный день при загрузке.

    const initialButton =

        document.querySelector(".schedule-day.active") ||

        dayButtons[0];

    activateDay(initialButton);

}

// ---------- 4. FAQ: раскрытие ответов ----------

function initFaq() {

    const faqQuestions = document.querySelectorAll(".faq-question");

    if (!faqQuestions.length) return;

    faqQuestions.forEach((question) => {

        question.addEventListener("click", () => {

            const answerId = question.getAttribute("aria-controls");

            const answer = answerId

                ? document.getElementById(answerId)

                : question.nextElementSibling;

            if (!answer) return;

            const isExpanded =

                question.getAttribute("aria-expanded") === "true";

            question.setAttribute(

                "aria-expanded",

                String(!isExpanded)

            );

            answer.hidden = isExpanded;

        });

    });

}

// ---------- 5. Демонстрационные кнопки ----------

function initDemoButtons() {

    const demoButtons = document.querySelectorAll("[data-demo]");

    demoButtons.forEach((button) => {

        button.addEventListener("click", (event) => {

            const demoType = button.dataset.demo;

            // У кнопок-заглушек нет реальной внешней оплаты

            // или регистрации. Предупреждаем об этом честно.

            if (demoType === "tickets") {

                event.preventDefault();

                showToast(

                    "Это демонстрационный сайт. Покупка билетов пока не подключена."

                );

                return;

            }

            if (demoType === "registration") {

                event.preventDefault();

                showToast(

                    "Демонстрация: форма регистрации пока не подключена."

                );

                return;

            }

            if (demoType === "map") {

                event.preventDefault();

                showToast(

                    "Добавьте реальный адрес фестиваля и ссылку на карту."

                );

            }

        });

    });

    // Кнопки, закрывающие демонстрационный блок.

    document.querySelectorAll("[data-close-demo]").forEach((button) => {

        button.addEventListener("click", () => {

            const target = button.closest("#ticket-info");

            if (target) {

                target.hidden = true;

            }

        });

    });

}

// ---------- 6. Всплывающее уведомление ----------

let toastTimeout;

function showToast(message) {

    let toast = document.querySelector(".toast");

    // Создаём уведомление, если его ещё нет в HTML.

    if (!toast) {

        toast = document.createElement("div");

        toast.className = "toast";

        toast.setAttribute("role", "status");

        toast.setAttribute("aria-live", "polite");

        document.body.appendChild(toast);

    }

    toast.textContent = message;

    toast.classList.add("show");

    window.clearTimeout(toastTimeout);

    toastTimeout = window.setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);

}

// ---------- 7. Плавная прокрутка ----------

function initSmoothScroll() {

    const anchorLinks = document.querySelectorAll(

        'a[href^="#"]'

    );

    anchorLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({

                behavior: window.matchMedia(

                    "(prefers-reduced-motion: reduce)"

                ).matches

                    ? "auto"

                    : "smooth",

                block: "start"

            });

            // Обновляем адресную строку без перезагрузки страницы.

            if (history.replaceState) {

                history.replaceState(null, "", href);

            }

        });

    });

}

// ---------- 8. Актуальный год в подвале ----------

function initCurrentYear() {

    const yearElements = document.querySelectorAll("[data-current-year]");

    yearElements.forEach((element) => {

        element.textContent = new Date().getFullYear();

    });

}

