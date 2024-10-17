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

        this.operateFunction = new Map([
            ['*', operations.multiply],
            ['/', operations.divide],
            ['+', operations.add],
            ['-', operations.subtract],
        ]);
    }

    calculate(){
        // Store the first and second operand in new variables while parsing them as floats.
        let num1 = parseFloat(this.firstOperand);
        let num2 = parseFloat(this.secondOperand);
        let solution = '';
        let currentOperator = this.operator;

        // Verify that the contents are numbers
        if (isNaN(num1) || isNaN(num2)){
            return 'NaN';
        }else if (this.operateFunction.has(currentOperator)){
            solution = this.operateFunction.get(currentOperator)(num1, num2);
        }else{
            return 'null'
        }

        return solution;
    }

    clear(){
        this.firstOperand = '';
        this.secondOperand = '';
        this.operator = '';
        this.updateUpperDisplay();
        this.lowerDisplay.textContent = '';
    }

    clearLowerDisplay(){
        this.lowerDisplay.textContent = '';
    }

    delete(){
        this.lowerDisplay.textContent = this.lowerDisplay.textContent.slice(0, -1);
    }

    initializeDisplay(){
        this.upperDisplay.textContent = '';
        this.lowerDisplay.textContent = '';
    }

    updateUpperDisplay() {
        this.upperDisplay.textContent = `${this.firstOperand} ${this.operator} ${this.secondOperand}`;
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

    // Attach new calculator to html body, and initialize the new instance
    document.body.appendChild(newCalculator);
    const calculatorInstance = new Calculator(newCalculator);
    newCalculator.calculatorInstance = calculatorInstance;
    newCalculator.thisCalculatorId = thisCalculatorId;

    // Initialize the display
    calculatorInstance.initializeDisplay();

    // Listen for clicks on the calculator buttons
    newCalculator.addEventListener('click', function (e) {
        // Filter out click within the calculator that aren't on buttons.
        if (e.target.tagName === 'BUTTON') {
            // Assign a variable to the calculatorInstance to ease accessing of it's contents.
            const calculator = this.calculatorInstance;
            switch(e.target.className) {
                // Clears all operands, the operator, and the displays.
                case 'clear':
                    calculator.clear();
                    break;
                case 'delete':
                    // Refuse delete press if error displayed on screen
                    if(calculator.lowerDisplay.textContent === 'NaN' || calculator.lowerDisplay.textContent === 'divByZero' || calculator.lowerDisplay.textContent === 'null'){
                        break;
                    // Refuse to delete the last digit of a calculated result
                    }else if (calculator.firstOperand !== '' && calculator.secondOperand !== '' && calculator.operator !== '' && calculator.lowerDisplay.textContent !== ''){
                        break;
                    }else {
                    // Delete the last digit in the string.
                        calculator.delete();
                    };
                    break;
                case 'equals':
                    // Refuse equals press if error displayed on screen
                    if(calculator.lowerDisplay.textContent === 'NaN' || calculator.lowerDisplay.textContent === 'divByZero' || calculator.lowerDisplay.textContent === 'null'){
                        break;
                    // Equals pressed before any other entries, display 0
                    }else if (calculator.firstOperand === '' && calculator.operator === '' && calculator.lowerDisplay.textContent === ''){
                        calculator.upperDisplay.textContent = 0;
                        console.log('Equals pressed before any other entries, display 0')
                    // Equals pressed after first entry, display current entry as answer (a = a)
                    }else if(calculator.firstOperand === '' && calculator.operator === '' && calculator.lowerDisplay.textContent !== ''){
                        calculator.upperDisplay.textContent = calculator.lowerDisplay.textContent;
                        console.log('Equals pressed after first entry, display current entry as answer (a = a)')
                    // Equals pressed after a first operand, an operator, and a second operand
                    }else if(calculator.firstOperand !== '' && calculator.operator !== '' && calculator.lowerDisplay.textContent !== '' && calculator.secondOperand === ''){
                        calculator.secondOperand = calculator.lowerDisplay.textContent;
                        calculator.updateUpperDisplay();
                        calculator.lowerDisplay.textContent = calculator.calculate();
                        console.log('Equals pressed after a first operand, an operator, and a second operator')
                    // Equals pressed again immediate after completing an operation
                    }else if(calculator.firstOperand !=='' && calculator.operator !== '' && calculator.secondOperand !== ''){
                        calculator.firstOperand = calculator.lowerDisplay.textContent;
                        calculator.secondOperand = calculator.secondOperand;
                        calculator.lowerDisplay.textContent = calculator.calculate();
                        calculator.updateUpperDisplay();
                        console.log('Equals pressed again immediate after completing an operation')
                    }
                    break;
                case 'operator':
                    // Refuse operator press if error displayed on screen                      
                    if(calculator.lowerDisplay.textContent === 'NaN' || calculator.lowerDisplay.textContent === 'divByZero' || calculator.lowerDisplay.textContent === 'null'){
                        break;
                    // Operator pressed before entering an operand, treat firstOperand as 0.
                    }else if (calculator.firstOperand === '' && calculator.lowerDisplay.textContent === '') {
                        calculator.firstOperand = 0;
                        calculator.operator = e.target.textContent;
                        calculator.updateUpperDisplay();

                    // First operand entered, assign to firstOperand variable and assign operator to variable
                    } else if (calculator.firstOperand === '' && calculator.lowerDisplay.textContent !== '') {
                        calculator.firstOperand = calculator.lowerDisplay.textContent;
                        calculator.operator = e.target.textContent;
                        calculator.lowerDisplay.textContent = '';
                        calculator.updateUpperDisplay();

                    // Operator button pressed immediately after another operator, change operator.
                    } else if (calculator.firstOperand !== '' && calculator.lowerDisplay.textContent === '') {
                        calculator.operator = e.target.textContent;
                        calculator.updateUpperDisplay();

                    // Another operand entered before the previous calculation completed
                    }else if(calculator.firstOperand !== '' && calculator.operator !== '' && calculator.secondOperand === ''){

                        
                        // Assign current entry to secondOperand
                        calculator.secondOperand = calculator.lowerDisplay.textContent;
                        
                        // Complete the calculation and move the result into the first operand.
                        calculator.firstOperand = calculator.calculate();
                        
                        // Clear the secondOperand and set the new operator
                        calculator.secondOperand = '';
                        calculator.operator = e.target.textContent;

                        // Clear the lower display to prepare for a new entry and update upperDisplay
                        calculator.clearLowerDisplay();
                        calculator.updateUpperDisplay();
                    // Operator pressed after another operation completed by pressing equals.
                    }else if(calculator.firstOperand !== '' && calculator.secondOperand !== '' && calculator.operator !== '' && calculator.lowerDisplay.textContent !== ''){
                        calculator.firstOperand = calculator.lowerDisplay.textContent;
                        calculator.operator = e.target.textContent;
                        calculator.secondOperand = '';
                        calculator.updateUpperDisplay();
                        calculator.clearLowerDisplay(); 
                    } 
                    break;
                default:
                    if(calculator.firstOperand !=='' && calculator.operator!=='' && calculator.secondOperand!=='' && calculator.lowerDisplay.textContent!==''){
                        calculator.clear();
                    }
                    if (e.target.textContent === '.' && calculator.lowerDisplay.textContent.includes('.')) {
                        break;
                    } else {
                        calculator.lowerDisplay.textContent += e.target.textContent;
                    }
            }
        }
    });
}

createCalculator();