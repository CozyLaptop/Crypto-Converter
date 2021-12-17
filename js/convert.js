const url = "https://api.coingecko.com/api/v3/";
var coinArray = [];
let currentCoinPrice;

//Refreshes the coin price on a set interval
function refreshBNBPrice(id) {
    fetch(url + "/coins/" + id).then(response => {
        response.json().then(object => {
            currentCoinPrice = object.market_data.current_price.usd;
            console.log(currentCoinPrice)
            $(".currentCryptoPrice").text(currentCoinPrice);
        });
    });
}
//10 second interval refresh
setInterval(refreshBNBPrice, 5 * 1000, id = "binancecoin");

//Loads the top 100 coins (by marketcap) into the global array
function loadTop100CG(){
    var currency = "vs_currency=usd";
    fetch(url + "/coins/markets?" + currency).then(response=>{response.json().then(object=>{
        object.forEach(coin => {
            coinArray.push(coin);
        });
    }).then(()=>{
        console.log(coinArray);
    });
    });
}

//    This function will load default values on page load
//    Currently is set for BNB
function onLoadDefaultValues(id){
    fetch(url + "/coins/" + id).then(response=>{response.json().then(object=>{
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

//Init
loadTop100CG();
onLoadDefaultValues("binancecoin");

