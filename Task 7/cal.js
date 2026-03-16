
function calculateDays() {
    const dob = document.getElementById("dob").value;
    const resultDiv = document.getElementById("days-result");

    if (!dob) {
        resultDiv.innerHTML = 'Please select your date of birth';
        return;
    }

    const birthDate = new Date(dob);
    const today = new Date();

    if (isNaN(birthDate)) {
        resultDiv.innerHTML = 'Invalid date format';
        return;
    }

    if (birthDate > today) {
        resultDiv.innerHTML = 'Birth date cannot be in the future';
        return;
    }

    const ageInDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    const ageInYears = (ageInDays / 365.25).toFixed(1);

    resultDiv.innerHTML = `Age: ${ageInYears} years | Days: ${ageInDays.toLocaleString()} days`;
}


function convertHours() {
    const hours = document.getElementById("hours").value;
    const resultDiv = document.getElementById("seconds-result");

    if (hours === "") {
        resultDiv.innerHTML = '';
        return;
    }

    const hrs = parseFloat(hours);

    if (isNaN(hrs)) {
        resultDiv.innerHTML = 'Please enter a valid number';
        return;
    }

    if (hrs < 0) {
        resultDiv.innerHTML = 'Hours cannot be negative';
        return;
    }

    const seconds = hrs * 3600;
    resultDiv.innerHTML = `${hrs} hour${hrs !== 1 ? 's' : ''} = ${seconds.toLocaleString()} seconds`;
}


function findNext() {
    const arr = [10, 20, 30, 40, 50];
    const input = document.getElementById("arrayInput").value;
    const resultDiv = document.getElementById("array-result");

    if (input === "") {
        resultDiv.innerHTML = '';
        return;
    }

    const num = parseInt(input);

    if (isNaN(num)) {
        resultDiv.innerHTML = 'Please enter a valid number';
        return;
    }

    const index = arr.indexOf(num);

    if (index === -1) {
        resultDiv.innerHTML = `${num} not found in array [10, 20, 30, 40, 50]`;
    } else if (index === arr.length - 1) {
        resultDiv.innerHTML = `${num} is the last element - no next value`;
    } else {
        resultDiv.innerHTML = `Next after ${num}: ${arr[index + 1]}`;
    }
}


function nextLogic() {
    const input = document.getElementById("logicInput").value;
    const resultDiv = document.getElementById("logic-result");

    if (input === "") {
        resultDiv.innerHTML = '';
        return;
    }

    const num = parseFloat(input);

    if (isNaN(num)) {
        resultDiv.innerHTML = 'Please enter a valid number';
        return;
    }

    if (Number.isInteger(num)) {
        const next = num + 1;
        resultDiv.innerHTML = `Integer: ${num} → Next: ${next} (${num} + 1)`;
    } else {
        const next = Math.ceil(num);
        resultDiv.innerHTML = `Float: ${num} → Next whole: ${next} (rounded up)`;
    }
}


function capitalizeName() {
    const nameInput = document.getElementById("nameInput").value;
    const resultDiv = document.getElementById("name-result");

    if (!nameInput.trim()) {
        resultDiv.innerHTML = '';
        return;
    }

    const lowercaseName = nameInput.toLowerCase().trim();
    const capitalized = lowercaseName.charAt(0).toUpperCase() + lowercaseName.slice(1);

    resultDiv.innerHTML = `Original: ${nameInput} → Capitalized: ${capitalized}`;
}


function calculateBMI() {
    const weight = document.getElementById("weight").value;
    const height = document.getElementById("height").value;
    const resultDiv = document.getElementById("bmi-result");

    if (!weight || !height) {
        resultDiv.innerHTML = 'Please enter both weight and height';
        return;
    }

    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);

    if (isNaN(weightKg) || isNaN(heightCm)) {
        resultDiv.innerHTML = 'Please enter valid numbers';
        return;
    }

    if (weightKg <= 0 || heightCm <= 0) {
        resultDiv.innerHTML = 'Weight and height must be positive';
        return;
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const bmiRounded = bmi.toFixed(1);

    let category;
    if (bmi < 18.5) {
        category = 'Underweight';
    } else if (bmi < 25) {
        category = 'Normal weight';
    } else if (bmi < 30) {
        category = 'Overweight';
    } else {
        category = 'Obese';
    }

    resultDiv.innerHTML = `BMI: ${bmiRounded} (${category}) | Weight: ${weightKg}kg | Height: ${heightCm}cm`;
}


let randomArray = [];

function generateArray() {
    randomArray = Array.from({ length: 6 }, () => Math.floor(Math.random() * 100) + 1);
    document.getElementById("rand-array").innerHTML = `[${randomArray.join(', ')}]`;
    document.getElementById("pick-result").innerHTML = '';
}

function pickElements() {
    const resultDiv = document.getElementById("pick-result");

    if (randomArray.length === 0) {
        resultDiv.innerHTML = 'Generate an array first';
        return;
    }

    const first = randomArray[0];
    const last = randomArray[randomArray.length - 1];

    resultDiv.innerHTML = `First: ${first} | Last: ${last} | Array: [${randomArray.join(', ')}]`;
}


document.addEventListener("DOMContentLoaded", function () {
    const num1 = document.getElementById("num1");
    const num2 = document.getElementById("num2");
    const num3 = document.getElementById("num3");

    function updateAddition() {
        const val1 = num1.value;
        const val2 = num2.value;

        if (val1 === '' && val2 === '') {
            num3.value = '';
            return;
        }

        if (val1 !== '' && val2 === '') {
            num3.value = 'NaN';
            return;
        }

        if (val1 === '' && val2 !== '') {
            num3.value = 'NaN';
            return;
        }

        const n1 = parseFloat(val1);
        const n2 = parseFloat(val2);

        if (isNaN(n1) || isNaN(n2)) {
            num3.value = 'NaN';
            return;
        }

        num3.value = n1 + n2;
    }

    num1.addEventListener('input', updateAddition);
    num2.addEventListener('input', updateAddition);


    generateArray();
});


function resetAll() {
    document.querySelectorAll('input[type="date"], input[type="number"], input[type="text"]').forEach(input => {
        if (input.id !== 'num3') {
            input.value = '';
        }
    });

    document.querySelectorAll('.result').forEach(div => {
        div.innerHTML = '';
    });

    document.getElementById('num3').value = '';
    generateArray();
}