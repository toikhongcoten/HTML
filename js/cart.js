/**
 * cart.js
 * Xử lý trang giỏ hàng
 */

document.addEventListener('DOMContentLoaded', function() {
    renderCart();

    const checkoutButton = document.getElementById('checkout-btn');

    checkoutButton.addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.cart-item-checkbox');
        let hasChecked = false;
        
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                hasChecked = true;
                break;
            }
        }
        
        if (!hasChecked) {
            alert('Vui lòng chọn ít nhất 1 phim để thanh toán.');
            return;
        }

        alert('Thanh toán thành công. Cảm ơn bạn!');
        
        let cart = getCartFromStorage();
        let newCart = [];
        
        for (let j = 0; j < cart.length; j++) {
            let keepItem = true;
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked && parseInt(checkboxes[i].getAttribute('data-id')) === cart[j].id) {
                    keepItem = false;
                    break;
                }
            }
            if (keepItem) {
                newCart.push(cart[j]);
            }
        }

        localStorage.setItem('cinema_cart', JSON.stringify(newCart));
        renderCart();
        updateGlobalCartCount();
    });
});

// Hiển thị toàn bộ sản phẩm trong giỏ hàng
function renderCart() {
    const cartBody = document.getElementById('cart-body');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCartMessage = document.getElementById('empty-cart-msg');
    const cart = getCartFromStorage();

    if (cart.length === 0) {
        cartBody.innerHTML = '';
        cartSummary.classList.add('hide');
        emptyCartMessage.classList.remove('hide');
        return;
    }

    // Lưu lại trạng thái checkbox trước khi render lại
    const oldCheckboxes = document.querySelectorAll('.cart-item-checkbox');
    const checkedMap = {};
    for (let i = 0; i < oldCheckboxes.length; i++) {
        const id = oldCheckboxes[i].getAttribute('data-id');
        checkedMap[id] = oldCheckboxes[i].checked;
    }

    cartSummary.classList.remove('hide');
    emptyCartMessage.classList.add('hide');

    cartBody.innerHTML = '';

    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const rowTotal = item.price * item.quantity;

        // Nếu mới thêm chưa có trong map thì mặc định là checked
        let isChecked = true;
        if (checkedMap.hasOwnProperty(item.id)) {
            isChecked = checkedMap[item.id];
        }
        const checkedAttr = isChecked ? 'checked' : '';

        const tr = document.createElement('tr');

        tr.innerHTML =
            '<td><input type="checkbox" class="cart-item-checkbox" data-id="' + item.id + '" onchange="calculateCartTotal()" ' + checkedAttr + '></td>' +
            '<td>' +
                '<div class="cart-item-info">' +
                    '<img src="' + item.image + '" alt="">' +
                    '<span>' + item.title + '</span>' +
                '</div>' +
            '</td>' +
            '<td>' + formatCurrency(item.price) + '</td>' +
            '<td>' +
                '<div class="qty-control">' +
                    '<button onclick="updateQuantity(' + item.id + ', -1)">-</button>' +
                    '<input type="text" value="' + item.quantity + '" readonly>' +
                    '<button onclick="updateQuantity(' + item.id + ', 1)">+</button>' +
                '</div>' +
            '</td>' +
            '<td class="font-bold">' + formatCurrency(rowTotal) + '</td>' +
            '<td>' +
                '<button class="remove-btn" onclick="removeItem(' + item.id + ')">Xóa</button>' +
            '</td>';

        cartBody.appendChild(tr);
    }

    calculateCartTotal();
}

// Tính tổng tiền dựa trên các mục được chọn
function calculateCartTotal() {
    const checkboxes = document.querySelectorAll('.cart-item-checkbox');
    let cart = getCartFromStorage();
    let totalMoney = 0;

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            const id = parseInt(checkboxes[i].getAttribute('data-id'));
            for (let j = 0; j < cart.length; j++) {
                if (cart[j].id === id) {
                    totalMoney = totalMoney + (cart[j].price * cart[j].quantity);
                    break;
                }
            }
        }
    }

    document.getElementById('cart-total-price').innerText = formatCurrency(totalMoney);
}

// Tăng hoặc giảm số lượng sản phẩm
function updateQuantity(id, change) {
    let cart = getCartFromStorage();

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity = cart[i].quantity + change;

            if (cart[i].quantity <= 0) {
                cart.splice(i, 1);
            }

            break;
        }
    }

    localStorage.setItem('cinema_cart', JSON.stringify(cart));
    renderCart();
    updateGlobalCartCount();
}

// Xóa một sản phẩm khỏi giỏ hàng
function removeItem(id) {
    const oldCart = getCartFromStorage();
    let newCart = [];

    for (let i = 0; i < oldCart.length; i++) {
        if (oldCart[i].id !== id) {
            newCart.push(oldCart[i]);
        }
    }

    localStorage.setItem('cinema_cart', JSON.stringify(newCart));
    renderCart();
    updateGlobalCartCount();
}
