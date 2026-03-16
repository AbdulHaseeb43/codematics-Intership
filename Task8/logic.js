
let currentImage = 0;
const slides = document.querySelectorAll('#slideContainer > div');
const dots = document.querySelectorAll('.dot');

function updateCarousel() {
    document.getElementById('slideContainer').style.transform = `translateX(-${currentImage * 100}%)`;

    dots.forEach((dot, i) => {
        if(i === currentImage) {
            dot.style.backgroundColor = 'white';
        } else {
            dot.style.backgroundColor = 'rgba(255,255,255,0.5)';
        }
    });
}

function goNext() {
    currentImage = (currentImage + 1) % slides.length;
    updateCarousel();
}

function goPrev() {
    currentImage = (currentImage - 1 + slides.length) % slides.length;
    updateCarousel();
}

function goToSlide(n) {
    currentImage = n;
    updateCarousel();
}


setInterval(goNext, 4000);


function updateSimpleClock() {
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();

    if(h < 10) h = '0' + h;
    if(m < 10) m = '0' + m;
    if(s < 10) s = '0' + s;
    
    document.getElementById('clock').innerHTML = h + ':' + m + ':' + s;
}

setInterval(updateSimpleClock, 1000);
updateSimpleClock();


function showTab(tabName) {
    
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    document.getElementById(tabName).classList.remove('hidden');
}


let myTasks = [];

function loadTasks() {
    let saved = localStorage.getItem('myTasks');
    if(saved) {
        myTasks = JSON.parse(saved);
    } else {
        myTasks = [];
    }
    showTasks();
}

function saveTasks() {
    localStorage.setItem('myTasks', JSON.stringify(myTasks));
    showTasks();
}


function showTasks() {
    let list = document.getElementById('taskList');
    let counter = document.getElementById('taskCounter');
    
    if(myTasks.length === 0) {
        list.innerHTML = '<li class="text-gray-500 text-center p-3">No tasks yet</li>';
        counter.innerHTML = '0 pending';
        return;
    }
    
    let html = '';
    let pending = 0;
    
    for(let i = 0; i < myTasks.length; i++) {
        let task = myTasks[i];
        if(!task.done) pending++;
        
        html += '<li class="flex items-center gap-2 bg-black/20 p-3 rounded-xl">';
        html += '<input type="checkbox" ' + (task.done ? 'checked' : '') + ' onclick="toggleTask(' + i + ')">';
        html += '<span class="flex-1 ' + (task.done ? 'line-through opacity-50' : '') + '">' + task.text + '</span>';
        html += '<button onclick="editTask(' + i + ')" class="text-blue-400 hover:text-blue-300">✎</button>';
        html += '<button onclick="deleteTask(' + i + ')" class="text-red-400 hover:text-red-300">✖</button>';
        html += '</li>';
    }
    
    list.innerHTML = html;
    counter.innerHTML = pending + ' pending';
}


function addNewTask() {
    let input = document.getElementById('taskInput');
    if(input.value.trim() === '') return;
    
    myTasks.push({
        text: input.value,
        done: false
    });
    
    input.value = '';
    saveTasks();
}


function toggleTask(index) {
    myTasks[index].done = !myTasks[index].done;
    saveTasks();
}


function editTask(index) {
    let newText = prompt('Edit task:', myTasks[index].text);
    if(newText !== null && newText.trim() !== '') {
        myTasks[index].text = newText;
        saveTasks();
    }
}


function deleteTask(index) {
    if(confirm('Delete this task?')) {
        myTasks.splice(index, 1);
        saveTasks();
    }
}
let calcValue = '';
let oldValue = '';
let lastOp = '';

function addToCalc(val) {

    if(val === '+' || val === '-' || val === '*' || val === '/') {
        if(calcValue !== '') {
            oldValue = calcValue;
            lastOp = val;
            calcValue = '';
            document.getElementById('oldCalc').innerHTML = oldValue + ' ' + val;
        }
    } else {
        calcValue += val;
    }
    document.getElementById('calcDisplay').innerHTML = calcValue || '0';
}

function getResult() {
    if(oldValue !== '' && calcValue !== '' && lastOp !== '') {
        let num1 = parseFloat(oldValue);
        let num2 = parseFloat(calcValue);
        let result = 0;
        
        if(lastOp === '+') result = num1 + num2;
        if(lastOp === '-') result = num1 - num2;
        if(lastOp === '*') result = num1 * num2;
        if(lastOp === '/') result = num2 !== 0 ? num1 / num2 : 'Error';
        
        document.getElementById('calcDisplay').innerHTML = result;
        calcValue = result.toString();
        oldValue = '';
        lastOp = '';
        document.getElementById('oldCalc').innerHTML = '';
    }
}

function clearAll() {
    calcValue = '';
    oldValue = '';
    lastOp = '';
    document.getElementById('calcDisplay').innerHTML = '0';
    document.getElementById('oldCalc').innerHTML = '';
}

function backspace() {
    calcValue = calcValue.slice(0, -1);
    document.getElementById('calcDisplay').innerHTML = calcValue || '0';
}


function updateLen() {
    let val = document.getElementById('passLength').value;
    document.getElementById('lenValue').innerHTML = val;
}

function makePassword() {
    let len = document.getElementById('passLength').value;
    let useUpper = document.getElementById('upper').checked;
    let useLower = document.getElementById('lower').checked;
    let useNums = document.getElementById('nums').checked;
    let useSyms = document.getElementById('syms').checked;
    
    let upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    let numChars = '0123456789';
    let symChars = '!@#$%^&*()_+';
    
    let allChars = '';
    if(useUpper) allChars += upperChars;
    if(useLower) allChars += lowerChars;
    if(useNums) allChars += numChars;
    if(useSyms) allChars += symChars;
    
    if(allChars === '') {
        alert('Select at least one option!');
        return;
    }
    
    let password = '';
    for(let i = 0; i < len; i++) {
        let randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }
    
    document.getElementById('passDisplay').value = password;
}

function copyPass() {
    let pass = document.getElementById('passDisplay');
    if(pass.value === '') return;
    
    pass.select();
    navigator.clipboard.writeText(pass.value);
    alert('Password copied!');
}


function cToF() {
    let c = document.getElementById('celsiusInput').value;
    if(c !== '') {
        let f = (parseFloat(c) * 9/5) + 32;
        document.getElementById('fahrenheitInput').value = f.toFixed(1);
    } else {
        document.getElementById('fahrenheitInput').value = '';
    }
}

function fToC() {
    let f = document.getElementById('fahrenheitInput').value;
    if(f !== '') {
        let c = (parseFloat(f) - 32) * 5/9;
        document.getElementById('celsiusInput').value = c.toFixed(1);
    } else {
        document.getElementById('celsiusInput').value = '';
    }
}


loadTasks();