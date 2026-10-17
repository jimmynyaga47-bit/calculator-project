const displayEl = document.getElementById('display');
const keys = document.querySelector('.keys');

let displayValue = '0';

function updateDisplay(){
  displayEl.textContent = displayValue;
}

function inputChar(char){
  const last = displayValue[displayValue.length-1];

  // If starting from 0 and entering a digit or dot -> replace
  if(displayValue === '0' && /[0-9.]/.test(char)){
    displayValue = char === '.' ? '0.' : char;
    updateDisplay();
    return;
  }

  // prevent multiple dots in the current number
  if(char === '.'){
    // find last operator to isolate current number
    const parts = displayValue.split(/[\+\-\×\÷\*\/\(\)]/);
    const current = parts[parts.length-1];
    if(current.includes('.')) return;
  }

  // If last char is an operator and new char is operator -> replace (except '(' and ')')
  const ops = ['+','-','×','÷','*','/'];
  if(ops.includes(last) && ops.includes(char)){
    displayValue = displayValue.slice(0,-1) + char;
  } else {
    displayValue += char;
  }
  updateDisplay();
}

function clearAll(){
  displayValue = '0';
  updateDisplay();
}

function backspace(){
  if(displayValue.length <= 1){
    displayValue = '0';
  } else {
    displayValue = displayValue.slice(0,-1);
  }
  updateDisplay();
}

function calculate(){
  // convert visual operators to JS operators
  let expr = displayValue.replace(/×/g,'*').replace(/÷/g,'/');
  // basic sanitize: allow digits, operators, parentheses, dot and spaces
  if(!/^[0-9+\-*/().\s]+$/.test(expr)){
    displayValue = 'Error';
    updateDisplay();
    return;
  }
  try{
    // Evaluate safely using Function constructor
    let result = Function('"use strict"; return (' + expr + ')')();
    if(typeof result === 'number' && !Number.isFinite(result)){
      displayValue = 'Error';
    } else {
      // limit decimal places for readability
      if(Number.isFinite(result) && !Number.isInteger(result)){
        result = parseFloat(result.toPrecision(12));
      }
      displayValue = String(result);
    }
  }catch(e){
    displayValue = 'Error';
  }
  updateDisplay();
}

// Button clicks
keys.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if(!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  if(action === 'clear') clearAll();
  else if(action === 'back') backspace();
  else if(action === 'calculate') calculate();
  else if(value) inputChar(value);
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  const key = e.key;
  if((/^[0-9]$/).test(key)){
    inputChar(key);
    e.preventDefault();
    return;
  }
  if(key === '.') inputChar('.');
  if(key === '+' || key === '-') inputChar(key);
  if(key === '*' ) inputChar('×'); // show × in display
  if(key === '/') inputChar('÷'); // show ÷ in display
  if(key === 'Enter' || key === '='){ calculate(); e.preventDefault(); return; }
  if(key === 'Backspace'){ backspace(); e.preventDefault(); return; }
  if(key === 'Escape'){ clearAll(); e.preventDefault(); return; }
});
updateDisplay();
