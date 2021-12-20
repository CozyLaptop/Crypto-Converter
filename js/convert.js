const url = "https://api.coingecko.com/api/v3/";
let coinArray = [];
let selectedInputPriceInUsd;
let selectedOutputPriceInUsd;
let inputSelectedCryptoId = "bitcoin";
let outputSelectedCryptoId;

//Wanted features:
//-When the middle arrows button is clicked, the selects and quantities will be swapped from input to output
//and vice-versa
//-A history of converts(will have to be done when clicking the convert button)
//-Add favicon
//-Add logo to top-left of page

//Refreshes the coin price whenever selects are changed
function refreshCoinPrice() {
    fetch(url + "/coins/" + inputSelectedCryptoId).then(response => {
        response.json().then(object => {
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
//Upon clicking convert button, will calculate the conversion
$(".convertButton").click(()=>{
    refreshCoinPrice();
    // let inputNum = document.getElementById("inputQuantity").value;
    // document.getElementById("outputCryptoValue").value = Number(selectedInputPriceInUsd * inputNum).toFixed(2);
});
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
//Init
loadTop100CG();
onLoadDefaultValues("bitcoin");
