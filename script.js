const inputSlider=document.querySelector('[data-lengthSlider]');
const lengthDisplay=document.querySelector('[data-lengthNumber]');
const passwordDisplay=document.querySelector('[data-password-display]');
const copyBtn=document.querySelector('[data-copy]');
const copyMsg=document.querySelector('[data-copy-msg]');
const uppercase=document.querySelector('#uppercase');
const lowercase=document.querySelector('#lowercase');
const numbersCheck=document.querySelector('#numbers');
const symbolsCheck=document.querySelector('#symbols');
const dataIndicator=document.querySelector('[data-indicator]');
const generateButton=document.querySelector('.generate-button');
const allCheckBoxes=document.querySelectorAll('input[type=checkbox]');
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
//set strength circle color to grey 
setIndicator("#ccc");
//set password length
handleSlider();
function handleSlider(){

    inputSlider.value=passwordLength;
    lengthDisplay.textContent=passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}
function setIndicator(color){
    dataIndicator.style.backgroundColor=color;
    //shadow hw
    if(color=="#f00"){
        dataIndicator.classList.remove("yellow-shadow");
        dataIndicator.classList.remove("green-shadow");
        dataIndicator.classList.remove("grey-shadow");
        dataIndicator.classList.add("red-shadow");
}
if(color=="#0f0"){
    dataIndicator.classList.remove("yellow-shadow");
        dataIndicator.classList.remove("red-shadow");
        dataIndicator.classList.remove("grey-shadow");
        dataIndicator.classList.add("green-shadow");
    }
    if(color=="#ff0"){
        dataIndicator.classList.remove("red-shadow");
        dataIndicator.classList.remove("green-shadow");
        dataIndicator.classList.remove("grey-shadow");
        dataIndicator.classList.add("yellow-shadow");
    }
    if(color=="#ccc"){
        dataIndicator.classList.remove("yellow-shadow");
        dataIndicator.classList.remove("red-shadow");
        dataIndicator.classList.remove("green-shadow");
        dataIndicator.classList.add("grey-shadow");
    }
    
}
function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}
function generateLowerCase(){
    return  String.fromCharCode( getRandomInteger(97,123));
}
function generateUpperCase(){
    return  String.fromCharCode( getRandomInteger(65,91));
}
function generateSymbols(){
    const randomNum=getRandomInteger(0,symbols.length)
    return symbols.charAt(randomNum);
}
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercase.checked) hasUpper = true;
    if (lowercase.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
    
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
    
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.textContent="copied"
    }catch(e){
        copyMsg.innerText="falied";
    }
    copyMsg.classList.add('active');
    setTimeout(()=>{
        copyMsg.classList.remove('active')
    },2000);
}
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)copyContent();
});
function shufflePassword( array){
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      let str = "";
      array.forEach((el) => (str += el));
      return str;

}
function handleCheckBoxChange(){

    checkCount=0;
    allCheckBoxes.forEach((checkbox)=>{
        if(checkbox.checked)checkCount++;
    });
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckBoxes.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
});
//Generate password
generateButton.addEventListener('click',()=>{
    
    //none checkbox is selected
    if(checkCount<=0)return;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    //start finding new passwrod

    //remove old password
    password="";
    //lets put the checkboxes

    // if(uppercase.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercase.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbols();
    // }

    let funcArr=[];
    if(uppercase.checked){
        funcArr.push(generateUpperCase);
    }
        if(lowercase.checked){
        funcArr.push(generateLowerCase);
    }
        if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
        if(symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }
    

    //Compulsary addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    //remaining addition
    
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let idx=getRandomInteger(0,funcArr.length);
        password+=funcArr[idx]();
    }
    
    //Shuffle the password
    password=shufflePassword(Array.from(password));
    //Show in UI
    passwordDisplay.value=password;
    //strength calculation
    calcStrength();
});