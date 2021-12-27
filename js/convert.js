const url = "https://api.coingecko.com/api/v3/";
let today = new Date();
let coinArray = [];
let selectedInputPriceInUsd;
let selectedOutputPriceInUsd;
let inputSelectedCryptoId = "bitcoin";
let outputSelectedCryptoId;
var darkMode = false;

//Wanted features:
//-Add a light/dark mode button to toggle
//-Save date and time on saved conversions
//-Ability to delete saved conversions
//-Add USD to input select
//-Add other currencies (British pound, AUS dollar, etc.)
//-When the middle arrows button is clicked, the selects and quantities will be swapped from input to output
//and vice-versa
//-Add favicon
//-Add logo to top-left of page

//Refreshes the coin price whenever selects are changed
function refreshCoinPrice() {
    fetch(url + "/coins/" + inputSelectedCryptoId).then(response => {
        response.json().then(object => {
            today = new Date();
            document.getElementById("lastUpdatedTime").innerText = `${today.toLocaleString()}`;
            document.getElementById("selected-crypto-header").innerText = object.symbol.toUpperCase();
            selectedInputPriceInUsd = object.market_data.current_price.usd;
            document.getElementById("currentCryptoPrice-header").innerText = selectedInputPriceInUsd;
            if (document.getElementById("outputCurrencySelect").value === "USD"){
                document.getElementById("outputQuantity").value = ((selectedInputPriceInUsd * document.getElementById("inputQuantity").value)).toFixed(2);
            } else{
                fetch(url + "/coins/" + outputSelectedCryptoId).then(response => {
                    response.json().then(object => {
                        selectedOutputPriceInUsd = object.market_data.current_price.usd;
                        document.getElementById("outputQuantity").value = Number((selectedInputPriceInUsd * document.getElementById("inputQuantity").value) / selectedOutputPriceInUsd).toFixed(2);
                    });
                });
            }
        });
    });
}
//5 second interval refresh
setInterval(refreshCoinPrice, 5 * 1000);

//Loads the top 100 coins (by marketcap) into the global array
function loadTop100CG(){
    var currency = "vs_currency=usd";
    fetch(url + "/coins/markets?" + currency).then(response=>{response.json().then(object=>{
        object.forEach(coin => {
            coinArray.push(coin);
        });
    }).then(()=>{
        console.log(coinArray);
        loadSelectOptions();
    });
    });
}
//Loads up the select options of input and output of the top 100 cryptos
function loadSelectOptions(){
    var inputCurrencySelect = document.getElementById("inputCurrencySelect");
    var outputCurrencySelect = document.getElementById("outputCurrencySelect");
    coinArray.forEach(coin=>{
        inputCurrencySelect.innerHTML += `<option id="${coin.id}">${coin.symbol.toUpperCase()}</option>`
        outputCurrencySelect.innerHTML += `<option id="${coin.id}">${coin.symbol.toUpperCase()}</option>`
    });
}

//    This function will load default values on page load
//    Currently is set for BTC
function onLoadDefaultValues(id){

    document.getElementById("lastUpdatedTime").innerText = `${today.toLocaleString()}`;
    fetch(url + "/coins/" + id).then(response=>{response.json().then(object=>{
        document.getElementById("selected-crypto-header").innerText = object.symbol.toUpperCase();
        selectedInputPriceInUsd = object.market_data.current_price.usd;
        document.getElementById("currentCryptoPrice-header").innerText = selectedInputPriceInUsd;
        //Left input
        document.getElementById("inputQuantity").value = 1;
        //Right output
        document.getElementById("outputQuantity").value = Number(selectedInputPriceInUsd).toFixed(2);
    });
    });
}

//Events
//Upon clicking save button, will push into the saved conversions list in reverse order
function saveConversion(){
    var savedConversions = document.getElementById("savedConversions");
    var savedConversionsInnerHTML = savedConversions.innerHTML;
    var inputQuantity = document.getElementById("inputQuantity").value;
    var inputAsset = document.getElementById("inputCurrencySelect").value;
    var outputQuantity = document.getElementById("outputQuantity").value;
    var outputAsset = document.getElementById("outputCurrencySelect").value;
    savedConversions.innerHTML = `<div>${inputQuantity} ${inputAsset} == ${outputQuantity} ${outputAsset} </div>`;
    savedConversions.innerHTML += savedConversionsInnerHTML;
}
//Upon changing select of input, will convert automatically
document.getElementById('inputCurrencySelect').addEventListener('change', function(e) {
    inputSelectedCryptoId = e.target.options[e.target.selectedIndex].getAttribute('id');
    refreshCoinPrice();
});
//Upon changing select of output, will convert automatically
document.getElementById('outputCurrencySelect').addEventListener('change', function() {
    var _outputCurrencySelect = document.getElementById("outputCurrencySelect");
    outputSelectedCryptoId = _outputCurrencySelect[_outputCurrencySelect.selectedIndex].id;
    refreshCoinPrice();
});
document.getElementById('inputQuantity').oninput = function (){
    document.getElementById('outputQuantity').value = (document.getElementById('inputQuantity').value * selectedInputPriceInUsd).toFixed(2);
};
//Light & dark mode change
var darkModeSwitch = document.querySelector(".darkModeSwitch");
var sunIcon = document.getElementById("lightModeIcon");
var moonIcon = document.getElementById("darkModeIcon");

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    darkModeSwitch.checked = true;
    moonIcon.style.display = "block";
    sunIcon.style.display = "none";
    console.log("Dark mode!")
} else {
    moonIcon.style.display = "none";
    sunIcon.style.display = "block";
    console.log("Light mode!")
}

function darkModeSwitchFunction(){
    if (darkModeSwitch.checked){
        moonIcon.style.display = "block";
        sunIcon.style.display = "none";
        console.log("Checked")
    } else {
        moonIcon.style.display = "none";
        sunIcon.style.display = "block";
        console.log("Unchecked")
    }
}
//Init
loadTop100CG();
onLoadDefaultValues("bitcoin");
