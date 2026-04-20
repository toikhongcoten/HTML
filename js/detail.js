/**
 * detail.js
 * Xử lý trang chi tiết phim
 */

let currentMovie = null;

document.addEventListener('DOMContentLoaded', function() {
    loadMovieDetail();
});

// Lấy ID phim trên URL và hiển thị thông tin chi tiết
async function loadMovieDetail() {
    const container = document.getElementById('movie-detail-container');
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if (!idParam) {
        container.innerHTML = '<p class="error-msg">Không tìm thấy mã phim!</p>';
        return;
    }

    try {
        const response = await fetch('data/movies.json');
        const movies = await response.json();

        for (let i = 0; i < movies.length; i++) {
            if (movies[i].id === parseInt(idParam)) {
                currentMovie = movies[i];
                break;
            }
        }

        if (currentMovie) {
            container.innerHTML =
                '<div class="detail-wrapper">' +
                    '<div class="detail-img">' +
                        '<img src="' + currentMovie.image + '" alt="' + currentMovie.title + '">' +
                    '</div>' +
                    '<div class="detail-info">' +
                        '<h1>' + currentMovie.title + '</h1>' +
                        '<p class="genre-lbl">Thể loại: ' + currentMovie.genre + '</p>' +
                        '<p class="release-lbl">Ngày chiếu: ' + currentMovie.releaseDate + '</p>' +
                        '<h2 class="price-lbl">' + formatCurrency(currentMovie.price) + '</h2>' +
                        '<div class="buy-section">' +
                            '<label>Số lượng vé:</label>' +
                            '<input type="number" id="ticket-qty" value="1" min="1" max="10">' +
                            '<button class="datve-btn" onclick="buyNow()">Đặt Ngay</button>' +
                            '<button class="datve-btn" style="background: #333;" onclick="addToCart()">Thêm Vào Giỏ</button>' +
                        '</div>' +
                        '<div id="add-success"></div>' +
                    '</div>' +
                '</div>';
        } else {
            container.innerHTML = '<p class="error-msg">Phim không tồn tại!</p>';
        }
    } catch (error) {
        container.innerHTML = '<p class="error-msg">Lỗi tải dữ liệu phim.</p>';
    }
}

// Thêm phim vào giỏ hàng
function addToCart() {
    if (!currentMovie) {
        return;
    }

    const qtyValue = document.getElementById('ticket-qty').value;
    const quantity = parseInt(qtyValue);

    if (quantity < 1) {
        alert('Số lượng vé phải lớn hơn 0');
        return;
    }

    let cart = getCartFromStorage();
    let movieExistsInCart = false;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === currentMovie.id) {
            cart[i].quantity = cart[i].quantity + quantity;
            movieExistsInCart = true;
            break;
        }
    }

    if (movieExistsInCart === false) {
        const newCartItem = {
            id: currentMovie.id,
            title: currentMovie.title,
            image: currentMovie.image,
            price: currentMovie.price,
            quantity: quantity
        };

        cart.push(newCartItem);
    }

    localStorage.setItem('cinema_cart', JSON.stringify(cart));

    document.getElementById('add-success').innerHTML =
        '<span style="color: green; font-weight: bold;">Đã thêm vào giỏ!</span>';

    updateGlobalCartCount();
}

// Mua ngay mà không cần thông qua giỏ
function buyNow() {
    if (!currentMovie) {
        return;
    }

    const qtyValue = document.getElementById('ticket-qty').value;
    const quantity = parseInt(qtyValue);

    if (quantity < 1) {
        alert('Số lượng vé phải lớn hơn 0');
        return;
    }

    const confirmBuy = confirm('Bạn có muốn đặt ngay ' + quantity + ' vé phim "' + currentMovie.title + '" không?');
    if (confirmBuy) {
        alert('Đặt mua vé thành công! Mã vé của bạn sẽ được gửi qua email.');
    }
}
