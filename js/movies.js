/**
 * movies.js
 * Xử lý trang danh sách phim
 */

let allMovies = [];

document.addEventListener('DOMContentLoaded', function() {
    loadAllMovies();

    document.getElementById('movie-search').addEventListener('input', function() {
        filterMovies();
    });

    document.getElementById('genre-filter').addEventListener('change', function() {
        filterMovies();
    });

    document.getElementById('price-filter').addEventListener('change', function() {
        filterMovies();
    });

    document.getElementById('grid-view-btn').addEventListener('click', function() {
        changeView('grid');
    });

    document.getElementById('list-view-btn').addEventListener('click', function() {
        changeView('list');
    });
});

// Lấy toàn bộ phim từ file JSON
async function loadAllMovies() {
    const container = document.getElementById('movies-container');

    try {
        const response = await fetch('data/movies.json');
        allMovies = await response.json();

        renderMovies(allMovies);

        const urlParams = new URLSearchParams(window.location.search);
        const searchKeyword = urlParams.get('search');

        if (searchKeyword) {
            document.getElementById('movie-search').value = searchKeyword;
            filterMovies();
        }
    } catch (error) {
        container.innerHTML = '<p class="error-msg">Lỗi tải dữ liệu.</p>';
    }
}

// Hiển thị danh sách phim ra màn hình
function renderMovies(movieList) {
    const container = document.getElementById('movies-container');
    container.innerHTML = '';

    if (movieList.length === 0) {
        container.innerHTML = '<p>Không tìm thấy bộ phim nào phù hợp.</p>';
        return;
    }

    for (let i = 0; i < movieList.length; i++) {
        const movie = movieList[i];
        let hotText = '';

        if (movie.isHot) {
            hotText = '<span class="hot">HOT</span>';
        }

        const html =
            '<div class="gallery-item view-card">' +
                hotText +
                '<img src="' + movie.image + '" alt="' + movie.title + '" onClick="window.location.href=\'detail.html?id=' + movie.id + '\'">' +
                '<div class="card-info">' +
                    '<p class="movie-title">' + movie.title + '</p>' +
                    '<p class="genre-text">' + movie.genre + '</p>' +
                    '<p class="price-lbl">' + formatCurrency(movie.price) + '</p>' +
                    '<a href="detail.html?id=' + movie.id + '" class="datve-btn-small">Chi Tiết / Đặt Vé</a>' +
                '</div>' +
            '</div>';

        container.innerHTML = container.innerHTML + html;
    }
}

// Lọc phim theo tên, thể loại và giá
function filterMovies() {
    const searchValue = document.getElementById('movie-search').value.toLowerCase();
    const genreValue = document.getElementById('genre-filter').value;
    const priceValue = document.getElementById('price-filter').value;

    let result = [];

    for (let i = 0; i < allMovies.length; i++) {
        const movie = allMovies[i];
//lọc tên
        const matchSearch = movie.title.toLowerCase().includes(searchValue);
//lọc thể loại
        let matchGenre = false;
        if (genreValue === '') {
            matchGenre = true;
        } else {
            matchGenre = movie.genre.includes(genreValue);
        }
//lọc giá
        let matchPrice = true;
        if (priceValue === 'low') {
            matchPrice = movie.price < 90000;
        }
        if (priceValue === 'high') {
            matchPrice = movie.price >= 90000;
        }

        if (matchSearch && matchGenre && matchPrice) {
            result.push(movie);
        }
    }

    renderMovies(result);
}

// Đổi giữa dạng lưới và dạng danh sách
function changeView(mode) {
    const container = document.getElementById('movies-container');
    const gridButton = document.getElementById('grid-view-btn');
    const listButton = document.getElementById('list-view-btn');

    if (mode === 'grid') {
        container.classList.add('grid-view');
        container.classList.remove('list-view');

        gridButton.classList.add('active');
        listButton.classList.remove('active');
    } else {
        container.classList.add('list-view');
        container.classList.remove('grid-view');

        listButton.classList.add('active');
        gridButton.classList.remove('active');
    }
}
