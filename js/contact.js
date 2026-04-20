/**
 * contact.js
 * Kiểm tra dữ liệu form liên hệ
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const formIsValid = validateForm();

            if (formIsValid) {
                document.getElementById('success-msg').classList.remove('hide');
                form.reset();

                setTimeout(function() {
                    document.getElementById('success-msg').classList.add('hide');
                }, 3000);
            }
        });
    }
});

// Kiểm tra dữ liệu trước khi gửi form
function validateForm() {
    let isValid = true;

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    document.getElementById('err-fullname').innerText = '';
    document.getElementById('err-email').innerText = '';
    document.getElementById('err-phone').innerText = '';

    if (fullname === '') {
        document.getElementById('err-fullname').innerText = 'Vui lòng nhập họ tên!';
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '') {
        document.getElementById('err-email').innerText = 'Vui lòng nhập email!';
        isValid = false;
    } else {
        if (!emailRegex.test(email)) {
            document.getElementById('err-email').innerText = 'Email không đúng định dạng!';
            isValid = false;
        }
    }

    const phoneRegex = /^(0)[0-9]{9,10}$/;

    if (phone === '') {
        document.getElementById('err-phone').innerText = 'Vui lòng nhập số điện thoại!';
        isValid = false;
    } else {
        if (!phoneRegex.test(phone)) {
            document.getElementById('err-phone').innerText =
                'Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và dài 10-11 số)!';
            isValid = false;
        }
    }

    return isValid;
}
