// ------my loading-bar function-----
$body = $("body");

$(document).on({
    ajaxStart: function loadingOn() { $body.addClass("loading"); },
    ajaxStop: function loadingOff() { $body.removeClass("loading"); }    
});

// ------the main data load function--------

const load = () => {
    $.ajax({url:"https://api.coingecko.com/api/v3/coins",
    type: "GET",
        success:response=>{getData(response)},
        error:response=>{console.log(response)},
    })
}

// --------the home page render function--------

const getData = (response)=>{
    console.log(response);
    $("#myTank").remove();
    $("#about").remove();
    $("#chartContainer").remove();
    $('.container').append('<div class="card-columns theTank" id="myTank"></div>');
    build(response);
}

// ---------the control num of card build function----------

const build = (response) =>{
    let myCoins = response.slice(0, 100);
    sessionStorage.setItem("crpytoSlice", JSON.stringify(myCoins));
    num=1;
    myCoins.forEach((element)=> {buildCard(element, num)
    num+=1})}

    // ------------the card structure build function-----------

    const buildCard = (data, num)=>{
        injectVal = "val";
        if( coinArrToggle !== null){
        const found = coinArrToggle.find(element => element == data.symbol);
        if (typeof found !== "undefined") {
            injectVal = "checked";
        }
    }

        $(`<div class="card ${data.id}Card" style="width: 18rem;"> 
        <div class="card-body">
        <div class="row">
            <div class="col-6 card-title">${data.name}</div>

            <div class="col-6 custom-control custom-switch">
            <input type="checkbox" ${injectVal} class="custom-control-input" name="${data.symbol}"
                onclick='toggle(name, id)' id="customSwitch${num}">
            <label class="mycheck custom-control-label" for="customSwitch${num}"></label>

            <div class="${data.id}Body"></div>

            </div>
            </div>
            <p class="card-text">${data.id}</p>
            <btn onclick='moreInfo(id)' id='${data.id}' class="myBtn btn btn-primary">More info</btn>
        </div>
        </div>`).appendTo("#myTank");
    }

// ------the more info btn & toggle btn initial function---------

let coinArr  = [];

$(()=>{ 
    moreInfoCoins();
    toggleSwitchesData();
});

// -----storege function-----

const moreInfoCoins = () =>{
    let sessionData = JSON.parse(sessionStorage.getItem("myCoins"));
    !sessionData == null || !sessionData == 0 ? coinArr = sessionData : console.log("nodataYet");
}
const toggleSwitchesData = () =>{
    let sessionTogglesData = JSON.parse(sessionStorage.getItem("crpytoToggle"));
    !sessionTogglesData == null || !sessionTogglesData == 0 ? coinArrToggle = sessionTogglesData : console.log("nodataYet");
}

// ------the more info btn function---------

const moreInfo = (id) => {
    if(coinArr.length > 0) {

        let existing = coinArr.find(element => element.name == id);

        if(existing == undefined) {
            apiCallDataBuild(id)
        }
        else{

        ($(`#${id}Div`).is(":visible")) ? 
        $(`#${id}Div`).slideToggle() : 

        timeCheck(existing, id)
        }
    } 
    if(coinArr.length == 0){apiCallDataBuild(id)};
}

const apiCallDataBuild = (id) => {
    $.ajax({
        url:`https://api.coingecko.com/api/v3/coins/${id}`,
        success:response=>{coinData(response , id)}
    })
}

const timeCheck = (item, id) =>{

    let myTime = 120000;
    let timeOnClick = new Date().getTime();

    timeOnClick - item.time > myTime ?
        (coinArr.splice(coinArr.indexOf(item),1), 
        apiCallDataBuild(id),
        (timeOnClick - item.time)/1000, item.time, timeOnClick)
    :   
        (checkValue(item, id), 
        (timeOnClick - item.time)/1000, item.time, timeOnClick, coinArr); 
}

// -----my function for value check-------

const checkValue = (item, id) =>{
    if($(`#${id}Div`).val() !== undefined){$(`#${id}Div`).slideToggle()
} else { 
    coinArr.splice(coinArr.indexOf(item),1), 
    apiCallDataBuild(id) }
}

const coinData =(response, id)=>{
    let eur = `${response.market_data.current_price.eur}`;
    let usd = `${response.market_data.current_price.usd}`;
    let ils = `${response.market_data.current_price.ils}`;
    let img = `${response.image.small}`;

    const coinVal = {
        "name":id,
        "eur":eur,
        "usd":usd,
        "ils":ils,
        "img":img,
        "time":new Date().getTime(),
    };
    coinArr.push(coinVal);

    sessionStorage.setItem("myCoins", JSON.stringify(coinArr));
    let create = (id) => {
        $(`.${id}Card`).append(`<div id='${id}Div' class='container coinData'></div>`)
        $(`#${id}Div`).html(`<div class ='row'> <div class='col-7'>EUR: ${eur} &euro; USD: ${usd} &#36; ILS: ${ils} &#8362;</div><div class='col-5'> <img src='${img}'/></div> </div>`);
    }
    $(`#${id}Div`).val() == undefined ? create(id) : $(`#${id}Div`).slideToggle();
}

// --------the toggle btn functions---------

let coinArrToggle = [];
const toggle = (name, id) =>{

    $(`#${id}`).is(":checked") ? addItem(name, id) : itemRemove(name);
    sessionStorage.setItem("crpytoToggle", JSON.stringify(coinArrToggle));
}

// -------my toggle functions---------

const itemRemove = (name) => {
    let myItem = `${name}`

    coinArrToggle.splice($.inArray(myItem, coinArrToggle),1)
}

const addItem = (name, id) => {
    coinArrToggle.length !== 5 ? coinArrToggle.push(name) : reach5Toggle(id);
}

const popWindowToggleBtnFuc = (id) =>{
    $('body').append(`<div id="popWindow" class="popWindow">opps you reached the limit of coins for live report. please toggle of one or more coins and press save to continue : <button class="btn btn-primary" id="exit"> Save</button></div><br/>`);
    
    coinArrToggle.forEach((element)=>{
    $('#popWindow').append(`<hr/><div class="row"><h3 id='h3PopWindow'>${element}</h3>
    <div class="col-6 custom-control custom-switch">
    <input type="checkbox" checked class="custom-control-input" name="${element}"
        onclick='toggle(name, id)' id="${element}">
    <label class="mycheck custom-control-label" for="${element}"></label>
        </div>
    </div></div>`)
})
}

const reach5Toggle = (id) =>{
    $("#myTank").hide();
    popWindowToggleBtnFuc(id);
    toggleSwitchesData();
    $("#exit").on("click",(()=>{
    $(".popWindow").remove();
    load();
    $("#myTank").show();
    }));
}

// ---------the search function----------

const search = () => {
    $("#myTank").remove();
    $("#about").remove();
    $("#chartContainer").remove();
    $('.container').append("<div class='card-columns theTank' id='myTank'></div>");
    let coinName = $("#coinName").val();
    let searchArr = JSON.parse(sessionStorage.getItem("crpytoSlice"));
    let crptoSearch = searchArr.filter((item) => item.id.includes(coinName));
    if(crptoSearch.length <= 0) {alert("coin not found!")
}else{
    num=1;
    crptoSearch.forEach((element)=> {buildCard(element, num)
    num+=1})
}
}

// =======the about function=========

const about = () =>{
    $("#myTank").remove();
    $("#chartContainer").remove();
    $(".container").append("<div id='about'><h1><u>Vladimir Crypto-Project 100% Authentic</u></h1></div>");
    $("#about").append("<h2>name: Vladimir Berdibekov.</h2>");
    $("#about").append("<a target='_blank' href='https://myresume777.herokuapp.com/'>Personal Web-site</a>");
    $("#about").append("<h2>tel:050-4809501</h2>");
    $("#about").append("<img src ='./img/pic.jpeg' style='width:20%' />");
    $("#about").append(`<div class='aboutPage'>Hi! this is my crypto project that i made for johnBryce mission.<br/>the app make api's req for crypto data.<br/>the data then displays in the cards with folowing tech:<br/> Jquery, Bootstrap, Css and Html.<br/> I used fonts from google fonts.<br/>I want to give credit for the image artist : <a href="http://www.freepik.com">Designed by starline / Freepik</a>
    </div>`);

}

// ----my nav collapse open function-----

const navBtn = () =>{
    $("#navbarSupportedContent").slideToggle();
}
