const formSubmit = document.querySelector('#submitForm');
const quantityInput = document.querySelector('#quantityInput');
const decrementButton = document.querySelector('#decrement');
const incrementButton = document.querySelector('#increment');
const phoneInput = document.querySelector('#phone');
const totalPrice = document.querySelector('#price');
const sizeSelect = document.querySelector('#size');
const modal = document.querySelector('.my-modal');
const modalTitle = document.querySelector('.modal-content-title');
const modalIcon = document.querySelector('.modal-content-icon');
const modalButton = document.querySelector('.my-close-modal');

formSubmit.addEventListener('click', async () => {
    formSubmit.disabled = true;

    phoneInput.value = phoneInput.value.replace(/\D/g, "");

    if (phoneInput.value.length !== 12) {
        alert("Будь ласка, введіть ще 9 цифр після +380");
        return;
    }

    const payload = {
        name: document.querySelector("#name").value,
        phone: phoneInput.value,
        address: document.querySelector("#address").value,
        size: sizeSelect.value,
        quantity: Number(quantityInput.value),
    };

    clearForm();

    const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const { message } = await response.json();

    modal.style.display = 'block';
    modalTitle.innerHTML = message;

    if (response.status === 200) {
        modalIcon.innerHTML = `<div class="circle-container">
                                    <div class="circle success">
                                        <div class="tick"></div>
                                    </div>
                                </div>`;
    } else {
        modalIcon.innerHTML = `<div class="circle-container">
                                    <div class="circle error">
                                        <div class="cross"></div>
                                    </div>
                                </div>`;
    }

    formSubmit.disabled = false;
})

const clearForm = () => {
    document.querySelector("#name").value = '';
    phoneInput.value = '';
    document.querySelector("#address").value = '';
    sizeSelect.value = '155x210';
    quantityInput.value = '1';
    quantity = 1;
    sizePrice = 1250;
    updatePrice();
}

modalButton.addEventListener('click', () => {
    modal.style.display = 'none';
})

phoneInput.addEventListener('focus', () => {
    if (!phoneInput.value) {
        phoneInput.value = "+380";
    }
})

phoneInput.addEventListener("input", () => {
    let value = phoneInput.value.replace(/\D/g, "");

    if (!value.startsWith("380")) {
        value = "380";
    }

    if (value.length > 3) {
        let after380 = value.slice(3);

        if (after380.startsWith("0")) {
            after380 = after380.slice(1);
        }
        if (after380.startsWith("38")) {
            after380 = after380.slice(2);
        }
        if (after380.startsWith("380")) {
            after380 = after380.slice(3);
        }

        value = "380" + after380;
    }

    value = value.substring(0, 12);

    phoneInput.value = "+" + value;
});

phoneInput.addEventListener("keydown", (e) => {
    if ((e.key === "Backspace" || e.key === "Delete") && phoneInput.value.length <= 4) {
        e.preventDefault();
    }
});

let quantity = 1;
let sizePrice = 1250;
let price = sizePrice * quantity;
let size = '155x210';

quantityInput.value = quantity;
totalPrice.innerHTML = sizePrice * quantity + ' грн';

function validateNumber(str) {
    if (typeof str !== "string") return false
    const num = Number(str)
    return !isNaN(num) && Number.isInteger(num) && num > 0
}

function updatePrice() {
    price = sizePrice * quantity;
    totalPrice.innerHTML = price + ' грн';
}

sizeSelect.addEventListener('change', (e) => {
    switch (e.target.value) {
        case '155x210':
            size = '155x210';
            sizePrice = 1250;
            break;
        case '175x210':
            size = '175x210';
            sizePrice = 1350;
            break;
        case '200x220':
            size = '200x220';
            sizePrice = 1500;
            break;
    }

    updatePrice();
})


quantityInput.addEventListener('change', () => {
    const inputedQuantity = quantityInput.value;

    if (validateNumber(inputedQuantity)) {
        quantity = Number(inputedQuantity);
        quantityInput.value = quantity;
    }
    else {
        quantity = 1;
        quantityInput.value = quantity;
    }

    updatePrice();
})

decrementButton.addEventListener('click', () => {
    if (quantity > 1) {
        quantity--;
        quantityInput.value = quantity;

        updatePrice();
    }
})

incrementButton.addEventListener('click', () => {
    quantity++;
    quantityInput.value = quantity;

    updatePrice();
})

const currentYear = new Date().getFullYear();
const allRightsReserved = document.querySelector('#allRightsReserved').innerHTML = `Ковдри 4 сезони @ ${currentYear} Усі права захищено`;
