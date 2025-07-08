import { useEffect, useState } from 'react';
import styles from './Calculator.module.scss';

const formatNumber = (num: number | string) => {
if (num === 'Error') return 'Error';
if (num === '∞') return '∞';
const [int, dec] = num.toString().split('.');
const formatted = parseInt(int).toLocaleString();
return dec ? `${formatted}.${dec}` : formatted;
};

const Calculator = () => {
const [input, setInput] = useState('0');
const [operator, setOperator] = useState<string | null>(null);
const [operand, setOperand] = useState<string | null>(null);
const [theme, setTheme] = useState<'light' | 'dark'>('light');
const [activeKey, setActiveKey] = useState<string | null>(null);
const [expression, setExpression] = useState<string>('');
const [result, setResult] = useState<string | null>(null);

const clear = () => {
    setInput('0');
    setOperator(null);
    setOperand(null);
    setExpression('');
    setResult(null);
};

const calculate = () => {
if (!operator || operand === null) return;
const a = parseFloat(operand);
const b = parseFloat(input);
let res: number | string = 0;

switch (operator) {
    case '+': res = a + b; break;
    case '-': res = a - b; break;
    case 'x': res = a * b; break;
    case '÷': res = b === 0 ? 'Error' : a / b; break;
}

const resultStr = String(res);
setResult(resultStr);
setInput(resultStr);
setOperand(null);
setOperator(null);
setExpression(`${operand}${operator}${input}=`);
};


const handleInput = (value: string) => {
if (/\d/.test(value)) {
const base = result !== null && operator === null ? '' : input;
const newInput = base === '0' ? value : base + value;
setInput(newInput);
setResult(null);

if (operator) {
    setExpression(`${operand}${operator}${newInput}`);
} else {
    setExpression(newInput);
}
} else if (value === '.') {
    if (!input.includes('.')) {
        const newInput = input + '.';
        setInput(newInput);
        if (operator && operand !== null) {
        setExpression(`${operand}${operator}${newInput}`);
        } else {
        setExpression(newInput);
        }
    }
} else if (['+', '-', 'x', '÷'].includes(value)) {
if (operator && operand !== null) {
    calculate();
}
const newOperand = result !== null ? result : input;
setOperator(value);
setOperand(newOperand);
setInput('0');
setResult(null); // сбросить старый результат
setExpression(`${newOperand}${value}`);
} else if (value === '=') {
    calculate();
    } else if (value === 'AC') {
    clear();
    } else if (value === '+/-') {
    const newInput = (parseFloat(input) * -1).toString();
    setInput(newInput);
    if (operator && operand !== null) {
        setExpression(`${operand}${operator}${newInput}`);
    } else {
        setExpression(newInput);
    }
    } else if (value === '%') {
  let newInput: string;

  if (operator && operand !== null) {
    const base = parseFloat(operand);
    const percent = (base * parseFloat(input)) / 100;
    newInput = percent.toString();
  } else {
    const percent = parseFloat(input) / 100;
    newInput = percent.toString();
  }

  setInput(newInput);
  if (operator && operand !== null) {
    setExpression(`${operand}${operator}${newInput}`);
  } else {
    setExpression(newInput);
  }
}

};

const handleKey = (e: KeyboardEvent) => {
    const keyMap: Record<string, string> = {
    Enter: '=',
    Escape: 'AC',
    '*': 'x',
    '/': '÷',
    '+': '+',
    '-': '-',
    '.': '.',
    };
    const val = keyMap[e.key] || e.key;
    if (/\d|[+\-×÷=.]|Enter|Escape/.test(val)) {
    setActiveKey(val);
    handleInput(val);
    }
};

useEffect(() => {
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', () => setActiveKey(null));
    return () => {
    window.removeEventListener('keydown', handleKey);
    window.removeEventListener('keyup', () => setActiveKey(null));
    };
}, [input, operator, operand, result]);

const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
};

const buttons = [
    'AC', '+/-', '%', '÷',
    '7', '8', '9', 'x',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
];

return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.dark : ''}`}>
    <div className={styles.calculator}>
        <button onClick={toggleTheme} className={styles.themeToggle}>
        {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className={styles.display}>
        <div className={styles.expression}>{expression}</div>
        <div className={styles.result}>
            {formatNumber(result !== null ? result : input)}
        </div>
        </div>
        <div className={styles.buttons}>
        {buttons.map((btn) => (
            <button
            key={btn}
            className={`
                ${styles.button} 
                ${['+', '-', 'x', '÷', '='].includes(btn) ? styles.operator : ''}
                ${['AC', '+/-', '%'].includes(btn) ? styles.gray : ''}
                ${btn === '0' ? styles.zero : ''}
                ${activeKey === btn ? 'active' : ''}
            `}
            onClick={() => handleInput(btn)}
            >
            {btn}
            </button>
        ))}
        </div>
    </div>
    </div>
);
};

export default Calculator;
