let calculatorCreationCount = 0;
const calculatorTemplate = document.querySelector('#calculator-template')

const operations = {
    multiply(num1, num2){
        if(num1 === '' || num2 === ''){
            return 0;
        }else{
            return num1 * num2
        }
    },
    divide(num1, num2){
        if (num2 === 0){
            return "divByZero"
        }else{
            return num1 / num2;
        }
    },
    add(num1, num2){
        return num1 + num2;
    },
    subtract(num1, num2){
        return num1 - num2;
    },
}

class Calculator {
    constructor(container) {
        this.firstOperand = '';
        this.secondOperand = '';
        this.operator = '';
        this.container = container;
        this.upperDisplay = this.container.querySelector('.upper-display');
        this.lowerDisplay = this.container.querySelector('.lower-display');
    }

    initializeDisplay(){
        this.upperDisplay.textContent = '';
        this.lowerDisplay.textContent = '';
    }
    
}

function createCalculator(){
    // Initialize calculator counter + ID generation.
    calculatorCreationCount++;
    let thisCalculatorId = 'calculator-' + calculatorCreationCount;
    
    // Save calculator instance to variable and set properties.
    const newCalculator = calculatorTemplate.cloneNode(true);
    newCalculator.id = thisCalculatorId;
    newCalculator.className = 'calculator-container'

    document.body.appendChild(newCalculator);
    const calculatorInstance = new Calculator(newCalculator);
    newCalculator.calculatorInstance = calculatorInstance;
    newCalculator.thisCalculatorId = thisCalculatorId;
    calculatorInstance.initializeDisplay();

    newCalculator.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
            console.log(`${this.thisCalculatorId}  ${e.target.textContent}`);
            const calculator = this.calculatorInstance;
            switch(e.target.className) {
                case 'clear':
                    this.firstOperand = '';
                    this.secondOperand = '';
                    this.operator = '';
                    calculator.lowerDisplay.textContent = '';
                    calculator.upperDisplay.textContent = '';
                    break;
                case 'decimal':
                    break;
                case 'delete':
                    calculator.lowerDisplay.textContent = calculator.lowerDisplay.textContent.slice(0, -1);
                    break;
                case 'equals':
                    if (calculator.firstOperand === '' && calculator.operator === '' && calculator.lowerDisplay.textContent === ''){
                        calculator.upperDisplay.textContent = 0;
                    }else if(calculator.firstOperand === '' && calculator.operator === '' && calculator.lowerDisplay.textContent !== ''){
                        calculator.upperDisplay.textContent = calculator.lowerDisplay.textContent
                    }
                    break;
                case 'operator':
                    
                    break;
                default:
                    calculator.lowerDisplay.textContent += e.target.textContent;
            }
        }
    });
}

createCalculator();
