/**
 * app.js
 * Chứa các hàm dùng chung cho toàn bộ website
 */

// Định dạng số tiền theo kiểu Việt Nam
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + ' đ';
}

// Đọc giỏ hàng từ localStorage
function getCartFromStorage() {
    const cartString = localStorage.getItem('cinema_cart');

    if (cartString) {
        return JSON.parse(cartString);
    }

    return [];
}

// Cập nhật số lượng vé ở icon giỏ hàng trên header
function updateGlobalCartCount() {
    const cart = getCartFromStorage();
    let totalCount = 0;

    for (let i = 0; i < cart.length; i++) {
        totalCount = totalCount + cart[i].quantity;
    }

    const cartCountElement = document.getElementById('cart-count');

    if (cartCountElement) {
        cartCountElement.innerText = totalCount;
    }
}



// Chuyển sang trang danh sách phim với từ khóa tìm kiếm
function goToSearchPage() {
    const searchInput = document.getElementById('header-search-input');

    if (!searchInput) {
        return;
    }

    const keyword = searchInput.value.trim();

    if (keyword !== '') {
        window.location.href = 'movies.html?search=' + encodeURIComponent(keyword);
    }
}

// Gắn chức năng tìm kiếm ở header
function setupGlobalSearch() {
    const searchInput = document.getElementById('header-search-input');
    const searchButton = document.getElementById('header-search-btn');

    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            goToSearchPage();
        });

        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                goToSearchPage();
            }
        });
    }
}

// Chạy khi trang tải xong
document.addEventListener('DOMContentLoaded', function() {
    updateGlobalCartCount();
    setupGlobalSearch();
});
