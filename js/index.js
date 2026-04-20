/**
 * index.js
 * Xử lý trang chủ
 */

document.addEventListener('DOMContentLoaded', function() {
    loadLatestMovies();
});

// Lấy dữ liệu phim và hiển thị ở trang chủ
async function loadLatestMovies() {
    const container = document.getElementById('latest-movies-container');

    try {
        const response = await fetch('data/movies.json');
        const movies = await response.json();

        container.innerHTML = '';

        for (let i = 0; i < movies.length; i++) {
            const movie = movies[i];
            let hotText = '';

            if (movie.isHot) {
                hotText = '<span class="hot">HOT</span>';
            }

            const movieHTML =
                '<div class="gallery-item" onclick="window.location.href=\'detail.html?id=' + movie.id + '\'">' +
                    hotText +
                    '<img src="' + movie.image + '" alt="' + movie.title + '">' +
                    '<p class="movie-title">' + movie.title + '</p>' +
                    '<div class="movie-meta">' +
                        '<p class="time">Ngày chiếu: ' + movie.releaseDate + '</p>' +
                    '</div>' +
                    '<p class="price-lbl">' + formatCurrency(movie.price) + '</p>' +
                    '<div style="display: flex; gap: 10px; margin-top: auto;">' +
                        '<button class="datve-btn-small" style="flex: 1; padding: 10px 5px;" onclick="buyNowFromHome(event, ' + movie.id + ')">Đặt ngay</button>' +
                        '<button class="datve-btn-small" style="flex: 1; padding: 10px 5px; background: #333;" onclick="addMovieToCartFromHome(event, ' + movie.id + ')">Thêm vào giỏ</button>' +
                    '</div>' +
                '</div>';

            container.innerHTML = container.innerHTML + movieHTML;
        }
    } catch (error) {
        console.error('Lỗi khi tải phim:', error);
        container.innerHTML = '<p class="error-msg">Không thể tải dữ liệu phim. Vui lòng thử lại sau.</p>';
    }
}

// Thêm nhanh phim vào giỏ ngay tại trang chủ
async function addMovieToCartFromHome(event, movieId) {
    event.stopPropagation();

    try {
        const response = await fetch('data/movies.json');
        const movies = await response.json();

        let selectedMovie = null;

        for (let i = 0; i < movies.length; i++) {
            if (movies[i].id === movieId) {
                selectedMovie = movies[i];
                break;
            }
        }

        if (!selectedMovie) {
            return;
        }

        let cart = getCartFromStorage();
        let movieExistsInCart = false;

        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id === selectedMovie.id) {
                cart[i].quantity = cart[i].quantity + 1;
                movieExistsInCart = true;
                break;
            }
        }

        if (movieExistsInCart === false) {
            const newCartItem = {
                id: selectedMovie.id,
                title: selectedMovie.title,
                image: selectedMovie.image,
                price: selectedMovie.price,
                quantity: 1
            };

            cart.push(newCartItem);
        }

        localStorage.setItem('cinema_cart', JSON.stringify(cart));
        updateGlobalCartCount();
        alert('Đã thêm phim vào giỏ!');
    } catch (error) {
        console.error('Lỗi khi thêm vào giỏ:', error);
    }
}

// Đặt ngay phim từ trang chủ (chuyển sang trang chi tiết để chọn số lượng vé)
async function buyNowFromHome(event, movieId) {
    event.stopPropagation();

    // Chuyển hướng người dùng sang trang chi tiết phim
    window.location.href = 'detail.html?id=' + movieId;
}
