// ==========the canvas bla bla ===========

let myCoins = [];

const apiAttack = (arr) =>{
    $("#myTank").remove();
    $("#about").remove();
    $(".container").append("<div id='chartContainer' style='height: 600px; max-width: 1000px; margin: 0px auto;'></div>");

    let myCoinsNames = JSON.parse(sessionStorage.getItem("crpytoToggle"));
    myCoins = myCoinsNames;

    $.ajax({
    url:`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${myCoins}&tsyms=USD`,
    success:response=>{every2sec(response, myCoins)}
    });
}

const every2sec = (response, myCoins) =>{
    let coinsNames = myCoins;
    var dataPoints1 = [];
    var dataPoints2 = [];
    var dataPoints3 = [];
    var dataPoints4 = [];
    var dataPoints5 = [];

    var options = {
        title: {
            text: "cryptocurrency Prices In USD"
        },
        axisX: {
            title: "chart updates every 2 secs"
        },
        axisY: {
            suffix: " $"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            fontSize: 22,
            fontColor: "dimGrey",
            itemclick: toggleDataSeries
        },
        data: [{
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00$",
            xValueFormatString: "hh:mm:ss TT",
            showInLegend: true,
            name: coinsNames[0],
            dataPoints: dataPoints1
        },
        {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00$",
            showInLegend: true,
            name: coinsNames[1],
            dataPoints: dataPoints2
        }, {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00$",
            showInLegend: true,
            name: coinsNames[2],
            dataPoints: dataPoints3
            },{
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00$",
            showInLegend: true,
            name: coinsNames[3],
            dataPoints: dataPoints4
            },{
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00$",
            showInLegend: true,
            name: coinsNames[4],
            dataPoints: dataPoints5
            }]
                };
    
    let chart = $("#chartContainer").CanvasJSChart(options);
    
    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

    let updateInterval = 2000;
    
    let time = new Date;
    time.getHours();
    time.getMinutes();
    time.getSeconds();
    time.getMilliseconds();

    function updateChart() {
        $(document).off();
        if($("#chartContainer").val() == undefined ){ clearInterval(myInterval),
            $(document).on({
                ajaxStart: function loadingOn() { $body.addClass("loading"); },
                ajaxStop: function loadingOff() { $body.removeClass("loading"); }    
            });}
        $.ajax({
            url:`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${myCoins}&tsyms=USD`,
            success:response=>{myData(response)}
            });
            function myData(response) {


            time.setTime(time.getTime() + updateInterval);

                let yValueArr = [];

                Object.values(response).forEach(val => yValueArr.push(val.USD));

            // pushing the new values
            dataPoints1.push({
                x: time.getTime(),
                y: yValueArr[0]
            });
            dataPoints2.push({
                x: time.getTime(),
                y: yValueArr[1]
            });
            dataPoints3.push({
                x: time.getTime(),
                y: yValueArr[2]
            });
            dataPoints4.push({
                x: time.getTime(),
                y: yValueArr[3]
            });
            dataPoints5.push({
                x: time.getTime(),
                y: yValueArr[4]
            });
    

        // updating legend text with  updated with y Value 
        options.data[0].legendText = coinsNames[0] +" : " + yValueArr[0] + "$";
        options.data[1].legendText = coinsNames[1] +" : " + yValueArr[1] + "$";
        options.data[2].legendText = coinsNames[2] +" : " + yValueArr[2] + "$";
        options.data[3].legendText = coinsNames[3] +" : " + yValueArr[3] + "$";
        options.data[4].legendText = coinsNames[4] +" : " + yValueArr[4] + "$";

        if($("#chartContainer").val() !== undefined ){
        $("#chartContainer").CanvasJSChart().render();
        }
    }
}

    let myInterval = setInterval(function () { updateChart() }, updateInterval);
    }

