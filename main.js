document.addEventListener("DOMContentLoaded", function() {
    const burger = document.querySelector(".header__burger");
    const nav = document.querySelector(".header__nav");

    burger.addEventListener("click", function() {
        nav.classList.toggle("active");
    });
});
    // Добавляем функциональность для слайдера
    let slideIndex = 0;

    function showSlides(index) {
        let slides = document.getElementsByClassName("slide");
        if (index >= slides.length) { slideIndex = 0 }
        if (index < 0) { slideIndex = slides.length - 1 }
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex].style.display = "block";
    }

    function nextSlide() {
        showSlides(++slideIndex);
    }

    function startAutoplay() {
        setInterval(nextSlide, 3000); // Смена слайдов каждые 3 секунды
    }

    showSlides(slideIndex);
    startAutoplay();

    document.querySelector(".prev").addEventListener("click", function() {
        showSlides(--slideIndex);
    });

    document.querySelector(".next").addEventListener("click", function() {
        showSlides(++slideIndex);
    });


  // Глобальные переменные для пагинации
const itemsPerPage = 5; // Количество новостей на странице
let currentPage = 1; // Текущая страница
let allNewsItems = []; // Полный массив новостей, неизменяемый
let newsItems = []; // Массив новостей для отображения

// Элементы фильтров
const allButton = document.getElementById("all");
const latestButton = document.getElementById("latest");

// Контейнер для новостей
const newsContainer = document.getElementById("news-container");

// Функция для загрузки новостей из JSON
async function loadNews() {
  try {
    const response = await fetch("news.json");
    const data = await response.json();
    allNewsItems = data.map(news => ({
      ...news,
      date: new Date(news.date),
    }));
    newsItems = [...allNewsItems]; // Копируем все новости
    showAllNews();
  } catch (error) {
    console.error("Ошибка при загрузке новостей:", error);
  }
}

// Функция для отображения новостей с учетом пагинации
function showNewsPage(page) {
  currentPage = page;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageNews = newsItems.slice(start, end);

  // Очищаем контейнер новостей
  newsContainer.innerHTML = "";

  pageNews.forEach(news => {
    const newsItem = createNewsItem(news);
    newsContainer.appendChild(newsItem);
  });

  // Обновляем пагинацию
  updatePagination();
}

// Функция для обновления кнопок пагинации
function updatePagination() {
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = ""; // Очищаем старые кнопки

  // Кнопка "Предыдущая"
  const prevButton = document.createElement("button");
  prevButton.textContent = "«";
  prevButton.disabled = currentPage === 1;
  prevButton.classList.toggle("disabled", currentPage === 1);
  prevButton.onclick = () => showNewsPage(currentPage - 1);
  paginationContainer.appendChild(prevButton);

  // Кнопки с номерами страниц
  for (let page = 1; page <= totalPages; page++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = page;
    pageButton.classList.toggle("active", page === currentPage);
    pageButton.onclick = () => showNewsPage(page);
    paginationContainer.appendChild(pageButton);
  }

  // Кнопка "Следующая"
  const nextButton = document.createElement("button");
  nextButton.textContent = "»";
  nextButton.disabled = currentPage === totalPages;
  nextButton.classList.toggle("disabled", currentPage === totalPages);
  nextButton.onclick = () => showNewsPage(currentPage + 1);
  paginationContainer.appendChild(nextButton);
}

// Функция для отображения всех новостей
function showAllNews() {
  newsItems = [...allNewsItems];
  newsItems.sort((a, b) => b.date - a.date);
  currentPage = 1; // Сбрасываем текущую страницу на первую
  showNewsPage(currentPage);
  setActiveButton(allButton);
}

// Функция для отображения новостей за последние три месяца
function showLatestNews() {
  const currentDate = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

  newsItems = allNewsItems.filter(news => news.date >= threeMonthsAgo);
  newsItems.sort((a, b) => b.date - a.date);
  currentPage = 1; // Сбрасываем текущую страницу на первую
  showNewsPage(currentPage);
  setActiveButton(latestButton);
}

// Функция для создания элемента новости
function createNewsItem(news) {
  const newsItem = document.createElement("div");
  newsItem.classList.add("news-item");

  const newsImage = document.createElement("img");
  newsImage.classList.add("news-image");
  newsImage.src = news.image || "";

  const newsTitle = document.createElement("h3");
  newsTitle.classList.add("news-title");
  newsTitle.textContent = news.title;

  const newsDate = document.createElement("p");
  newsDate.classList.add("news-date");
  newsDate.textContent = news.date.toLocaleDateString();

  const newsPreview = document.createElement("p");
  newsPreview.classList.add("news-preview");
  newsPreview.textContent = news.preview;

  const readMoreLink = document.createElement("span");
  readMoreLink.classList.add("read-more");
  readMoreLink.textContent = "Читать далее";
  readMoreLink.onclick = function () {
    openModal(news.title, news.date.toLocaleDateString(), news.fullText, news.image);
  };

  newsItem.appendChild(newsImage);
  newsItem.appendChild(newsTitle);
  newsItem.appendChild(newsDate);
  newsItem.appendChild(newsPreview);
  newsItem.appendChild(readMoreLink);

  return newsItem;
}

// Обновление активного состояния кнопки
function setActiveButton(button) {
  const buttons = document.querySelectorAll(".filter-button");
  buttons.forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
}

// Функция для открытия модального окна
function openModal(title, date, fullText, image) {
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  document.querySelector(".modal-title").textContent = title;
  document.querySelector(".modal-date").textContent = date;
  document.querySelector(".modal-text").textContent = fullText;
  document.querySelector(".modal-image").src = image;
}

// Функция для закрытия модального окна
document.getElementById("close").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

// Добавляем события для фильтра
allButton.addEventListener("click", showAllNews);
latestButton.addEventListener("click", showLatestNews);

// Загружаем новости при старте страницы
loadNews();
