    const url = "https://api.coingecko.com/api/v3/";
    var coinArray = [];

    let currentBnbPrice;
    function refreshBNBPrice(id) {
    fetch(url + "/coins/" + id).then(response => {
        response.json().then(object => {
            currentBnbPrice = object.market_data.current_price.usd;
            console.log(currentBnbPrice)
            $(".currentCryptoPrice").text(currentBnbPrice);
        });
    });
}
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
    function onLoadDefaultValues(id){
    fetch(url + "/coins/" + id).then(response=>{response.json().then(object=>{
        currentBnbPrice = object.market_data.current_price.usd;
        $(".currentCryptoPrice").text(currentBnbPrice);
        //Left input
        document.getElementById("inputCryptoValue").value = 1;
        //Right output
        document.getElementById("outputCryptoValue").value = currentBnbPrice;
    });
    });
}
    onLoadDefaultValues("binancecoin");

    //10 second interval refresh
    setInterval(refreshBNBPrice, 5 * 1000, id = "binancecoin");

    //Events
    $(".convertButton").click(()=>{
    let inputNum = document.getElementById("inputCryptoValue").value;
    document.getElementById("outputCryptoValue").value = Number(currentBnbPrice * inputNum).toFixed(2);
});

    loadTop100CG();
