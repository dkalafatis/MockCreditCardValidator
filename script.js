function formatCardNumber() {
    const cardNumberInput = document.getElementById('card-number');
    let cardNumber = cardNumberInput.value.replace(/\D/g, ''); // Remove non-digit characters
    if (/^3[47]/.test(cardNumber)) { // AmEx, 15 digits
        cardNumber = cardNumber.slice(0, 15).replace(/(\d{4})(\d{6})(\d+)/, "$1 $2 $3");
    } else { // Other cards, 16 digits
        cardNumber = cardNumber.slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    cardNumberInput.value = cardNumber;
}

function detectCardType(cardNumber) {
    const visaPattern = /^4/;
    const masterCardPattern = /^5[1-5]/;
    const amexPattern = /^3[47]/;
    if (visaPattern.test(cardNumber)) {
        return 'Visa';
    } else if (masterCardPattern.test(cardNumber)) {
        return 'MasterCard';
    } else if (amexPattern.test(cardNumber)) {
        return 'American Express';
    } else {
        return 'Unknown';
    }
}

function detectCardTypeAndUpdateUI(cardNumber) {
    const cardType = detectCardType(cardNumber);
    const cardIconElement = document.getElementById('card-icon');
    cardIconElement.innerText = cardType; // Set the text to the card type
    // Remove previous classes
    cardIconElement.classList.remove('visa-text', 'mastercard-text', 'amex-text');
    // Apply new class based on card type
    switch (cardType) {
        case 'Visa':
            cardIconElement.classList.add('visa-text');
            break;
        case 'MasterCard':
            cardIconElement.classList.add('mastercard-text');
            break;
        case 'American Express':
            cardIconElement.classList.add('amex-text');
            break;
        default:
            cardIconElement.innerText = ''; // Clear text if card type is unknown
            break;
    }
    document.getElementById('result').innerText = cardType !== 'Unknown' ? `Detected card type: ${cardType}` : '';
    validateCard(); // For real-time validation
}


document.getElementById('card-number').addEventListener('input', function() {
    formatCardNumber();
    const cardNumber = this.value.replace(/\D/g, '');
    detectCardTypeAndUpdateUI(cardNumber);
});

function validateCard() {
    const cardNumber = document.getElementById('card-number').value.replace(/\D/g, '');
    const cardType = detectCardType(cardNumber);
    let minLength = cardType === 'American Express' ? 15 : 16;
    if (cardNumber.length < minLength) {
        document.getElementById('result').innerText = "Credit card number is too short.";
        document.getElementById('result').className = 'invalid';
        return;
    }

    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i), 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }

    const isValid = sum % 10 === 0;
    const resultText = isValid ? "Credit card number is valid." : "Credit card number is invalid.";
    const resultElement = document.getElementById('result');
    resultElement.innerText = resultText;
    resultElement.className = isValid ? 'valid' : 'invalid';
}
