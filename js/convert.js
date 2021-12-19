const url = "https://api.coingecko.com/api/v3/";
var coinArray = [];
let currentCoinPrice;
let currentSelectedCryptoId;

//Refreshes the coin price on a set interval
function refreshCoinPrice(id) {
    fetch(url + "/coins/" + id).then(response => {
        response.json().then(object => {
            document.getElementById("selected-crypto").innerText = object.symbol.toUpperCase();
            console.log(object);
            currentCoinPrice = object.market_data.current_price.usd;
            let inputNum = document.getElementById("inputCryptoValue").value;
            document.getElementById("outputCryptoValue").value = Number(currentCoinPrice * inputNum).toFixed(2);
            console.log(currentCoinPrice)
            $(".currentCryptoPrice").text(currentCoinPrice);
        });
    });
}
//5 second interval refresh
// setInterval(refreshCoinPrice, 5 * 1000, id = currentSelectedCryptoId);

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
        document.getElementById("selected-crypto").innerText = object.symbol.toUpperCase();
        currentCoinPrice = object.market_data.current_price.usd;
        $(".currentCryptoPrice").text(currentCoinPrice);
        //Left input
        document.getElementById("inputCryptoValue").value = 1;
        //Right output
        document.getElementById("outputCryptoValue").value = currentCoinPrice;
    });
    });
}

//Events
//Upon clicking convert button, will calculate the conversion
$(".convertButton").click(()=>{
    let inputNum = document.getElementById("inputCryptoValue").value;
    document.getElementById("outputCryptoValue").value = Number(currentCoinPrice * inputNum).toFixed(2);
});
//Upon changing select of input, will convert automatically
document.getElementById('inputCurrencySelect').addEventListener('change', function(e) {
    currentSelectedCryptoId = e.target.options[e.target.selectedIndex].getAttribute('id')
    console.log(currentSelectedCryptoId)
    refreshCoinPrice(currentSelectedCryptoId);
});
//Init
loadTop100CG();
onLoadDefaultValues("bitcoin");
