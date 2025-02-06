function showEncryption() {
    document.getElementById('encryption-section').style.display = 'block';
    document.getElementById('decryption-section').style.display = 'none';
}

function showDecryption() {
    document.getElementById('encryption-section').style.display = 'none';
    document.getElementById('decryption-section').style.display = 'block';
}

function showAffineInput() {
    let cipher = document.getElementById('cipher').value;
    let tKeyInput = document.getElementById('t-key');
    tKeyInput.style.display = (cipher === 'affine') ? 'inline' : 'none';
}

function showAffineInputDec() {
    let cipher = document.getElementById('cipher-dec').value;
    let tKeyInput = document.getElementById('t-key-dec');
    tKeyInput.style.display = (cipher === 'affine') ? 'inline' : 'none';
}

function encrypt() {
    let fileInput = document.getElementById('file-input');
    let textInput = document.getElementById('text').value;
    let key = parseInt(document.getElementById('key').value);
    let cipher = document.getElementById('cipher').value;
    let tKey = parseInt(document.getElementById('t-key').value);
    let result = '';

    if (fileInput.files.length > 0) {
        let file = fileInput.files[0];
        let reader = new FileReader();

        reader.onload = function (event) {
            let text = event.target.result;
            result = processText(text, cipher, key, tKey);
            displayResult(result);
        };

        if (file.name.endsWith('.txt')) {
            reader.readAsText(file);
        }
    } else if (textInput.trim() !== "") {
        result = processText(textInput, cipher, key, tKey);
        displayResult(result);
    } else {
        alert("Будь ласка, введіть текст або виберіть файл!");
    }
}

function processText(text, cipher, key, tKey) {
    let result = '';
    if (cipher === 'caesar') {
        result = caesarCipher(text, key);
    } else if (cipher === 'linear') {
        result = linearCipher(text, key);
    } else if (cipher === 'affine') {
        result = affineCipher(text, key, tKey);
    }
    return result;
}

function displayResult(result) {
    document.getElementById('output').innerText = 'Результат: ' + result;
    let downloadLink = document.getElementById('download-link');
    let blob = new Blob([result], { type: 'text/plain' });
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.style.display = 'inline';
}


function caesarCipher(text, key) {
    const alphabet = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ.,?!";
    let result = '';
    text = text.toUpperCase();
    for (let char of text) {
        let index = alphabet.indexOf(char);
        if (index !== -1) {
            let newIndex = (index + key) % alphabet.length;
            result += alphabet[newIndex];
        } else {
            result += char;
        }
    }
    return result;
}
function linearCipher(text, key) {
    const alphabet = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ.,?!";
    let result = '';
    text = text.toUpperCase();

    for (let char of text) {
        let index = alphabet.indexOf(char);
        if (index !== -1) { 
            let newIndex = ((index + 1) * key) % alphabet.length;
            if (newIndex === 0) newIndex = alphabet.length; 
            result += alphabet[newIndex - 1];
        } else {
            result += char;
        }
    }
    return result;
}

function affineCipher(text, key, tKey) {
    const alphabet = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ.,?!";
    let result = '';
    text = text.toUpperCase();

    for (let char of text) {
        let index = alphabet.indexOf(char);
        if (index !== -1) { 
            let newIndex = ((index + 1) * key + tKey) % alphabet.length;
            if (newIndex === 0) newIndex = alphabet.length;
            result += alphabet[newIndex - 1];
        } else {
            result += char; 
        }
    }
    return result;
}

// Тест
console.log(affineCipher("Привіт", 3, 2)); 


function decrypt() {
    let fileInput = document.getElementById('file-input-dec');
    let textInput = document.getElementById('text-dec').value;
    let key = parseInt(document.getElementById('key-dec').value);
    let cipher = document.getElementById('cipher-dec').value;
    let tKey = parseInt(document.getElementById('t-key-dec').value);
    let result = '';

    if (fileInput.files.length > 0) {
        let file = fileInput.files[0];
        let reader = new FileReader();

        reader.onload = function (event) {
            let text = event.target.result;
            result = processDecryption(text, cipher, key, tKey);
            displayDecryptionResult(result);
        };

        if (file.name.endsWith('.txt')) {
            reader.readAsText(file);
        }
    } else if (textInput.trim() !== "") {
        result = processDecryption(textInput, cipher, key, tKey);
        displayDecryptionResult(result);
    } else {
        alert("Будь ласка, введіть зашифрований текст або виберіть файл!");
    }
}
function processDecryption(text, cipher, key, tKey) {
    let result = '';
    if (cipher === 'caesar') {
        result = caesarDecrypt(text, key);
    } else if (cipher === 'linear') {
        result = linearDecrypt(text, key);
    } else if (cipher === 'affine') {
        result = affineDecrypt(text, key, tKey);
    }
    return result;
}

function displayDecryptionResult(result) {
    document.getElementById('output-dec').innerText = 'Розшифрований текст: ' + result;
}

function caesarDecrypt(text, key) {
    const alphabet = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ.,?!";
    let result = '';
    text = text.toUpperCase();
    
    for (let char of text) {
        let index = alphabet.indexOf(char);
        if (index !== -1) {
            let newIndex = (index + alphabet.length - key) % alphabet.length;
            result += alphabet[newIndex];
        } else {
            result += char;
        }
    }
    return result;
}


function modInverse(a, m) {
    a = ((a % m) + m) % m;
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return null; 
}

function linearDecrypt(text, key) {
    const alphabet = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ.,?!";
    let result = '';
    text = text.toUpperCase();

    let invKey = modInverse(key, alphabet.length);
    if (invKey === null) {
        alert("Ключ не має оберненого елемента в даному алфавіті!");
        return text;
    }

    for (let char of text) {
        let index = alphabet.indexOf(char);
        if (index !== -1) {
            let newIndex = ((index+1) * invKey) % alphabet.length;
            result += alphabet[newIndex-1];
        } else {
            result += char;
        }
    }
    return result;
}
function affineDecrypt(text, key, t) {
    const alphabet = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ.,?!"; 
    let result = '';
    text = text.toUpperCase();

    let invKey = modInverse(key, alphabet.length);
    if (invKey === null) {
        alert("Ключ не має оберненого елемента в даному алфавіті!");
        return text;
    }

    for (let char of text) {
        let index = alphabet.indexOf(char);
        if (index !== -1) {
            let newIndex = (invKey * ((index +1)- t + alphabet.length)) % alphabet.length;
            result += alphabet[newIndex-1];
        } else {
            result += char;
        }
    }
    return result;
}
