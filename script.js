let form = document.getElementById('form');
let routeSelect = document.getElementById('route');
let timeSelect = document.getElementById('time');
let timeReverseSelect = document.querySelector('select.time-reverse');
let numTickets = document.getElementById('num');
let button = document.querySelector('button');
let textInfo = document.getElementById('text');

let price = 700;
let travelTime = 50;
let ticket = ['билет', 'билета', 'билетов'];
let currentDate = new Date();
let localTime, localMoscowTime;

if (currentDate.getHours() === 0) {
    localTime = 24;
} else {
    localTime = currentDate.getHours();
}

if (currentDate.getUTCHours() + 3 === 24) {
    localMoscowTime = 0;
} else {
    localMoscowTime = currentDate.getUTCHours() + 3;
}

let timeDifference = localTime - (localMoscowTime);

let routeAB = [
    ['18:00(из A в B)', `${18 + timeDifference}:00 (из A в B)`], 
    ['18:30(из A в B)', `${18 + timeDifference}:30 (из A в B)`], 
    ['18:45(из A в B)', `${18 + timeDifference}:45 (из A в B)`], 
    ['19:00(из A в B)', `${19 + timeDifference}:00 (из A в B)`], 
    ['19:15(из A в B)', `${19 + timeDifference}:15 (из A в B)`],
    ['21:00(из A в B)', `${21 + timeDifference}:00 (из A в B)`]
];

let routeBA = [
    ['18:30(из B в A)', `${18 + timeDifference}:30 (из B в A)`], 
    ['18:45(из B в A)', `${18 + timeDifference}:45 (из B в A)`], 
    ['19:00(из B в A)', `${19 + timeDifference}:00 (из B в A)`], 
    ['19:15(из B в A)', `${19 + timeDifference}:15 (из B в A)`], 
    ['19:35(из B в A)', `${19 + timeDifference}:35 (из B в A)`],
    ['21:50(из B в A)', `${21 + timeDifference}:50 (из B в A)`],
    ['21:55(из B в A)', `${21 + timeDifference}:55 (из B в A)`]
];

function setRoutes(route, select, style) {
    timeReverseSelect.style.display = style;
    select.length = 0;
    for (let i = 0; i < route.length; i++) {
        let option = document.createElement('option');
        option.setAttribute('value', route[i][0]);
        option.innerText = route[i][1];
        select.append(option); 
    }
}

function numWord(value, words){  
    value = Math.abs(value) % 100; 
    var num = value % 10;
    if(value > 10 && value < 20) return words[2]; 
    if(num > 1 && num < 5) return words[1];
    if(num == 1) return words[0]; 
    return words[2];
}

timeSelect.addEventListener('click', function(event) {
    let target = event.target;
    let arrAB = target.value.slice(0, 5).split(':')
    let sumHourMinutes = arrAB[0]*3.6e+6 + arrAB[1]*60000;
    
    let arrABA = routeBA.map((a) => a[0].slice(0, 5).split(':')).filter(elem => {
        if ((elem[0] * 3.6e+6 + elem[1] * 60000) - sumHourMinutes > 3e+6) {
                return elem;
            } 
    }).map(el => el.join(':'))

    let calcRoute = routeBA.filter(route => {
        for (let j = 0; j <= routeBA.length; j++) {
            if (route[0].includes(arrABA[j])) {
                return route[0];
            }
        }
    })

    setRoutes(calcRoute, timeReverseSelect); 
});

setRoutes(routeAB, timeSelect, 'none');

routeSelect.addEventListener('click', function(event) {
    let target = event.target;
    
    if (target.value === 'из A в B') {
        setRoutes(routeAB, timeSelect, 'none'); 
        price = 700;       
    } else if (target.value === 'из B в A') {
        setRoutes(routeBA, timeSelect, 'none');
        price = 700;
    } else {
        setRoutes(routeAB, timeSelect, 'inline-block');
        price = 1200;
        let arrAB = routeAB.map((a) => a[0].slice(0, 5).split(':')).map(el => el[0] * 3.6e+6 + el[1] * 60000);
        let arrABA = routeBA.map((a) => a[0].slice(0, 5).split(':')).filter(elem => {
            for (let i = 0; i < arrAB.length; i++) {
                if ((elem[0] * 3.6e+6 + elem[1] * 60000) - arrAB[i] < 3e+6) {
                    continue;
                } else {
                    return elem;
                }
            }
        }).map(el => el.join(':'))

        let initialRouteBA = routeBA.filter(route => {
            for (let j = 0; j <= routeBA.length; j++) {
                if (route[0].includes(arrABA[j])) {
                    return route[0];
                }
            }
        })
        setRoutes(initialRouteBA, timeReverseSelect); 
    }
});



form.addEventListener('submit', function(event) {
    event.preventDefault();
    let sumTickets = parseFloat(numTickets.value) * price;
    let RS = routeSelect.value;
    let TS = timeSelect[timeSelect.selectedIndex].innerText.slice(0, 5);
    let TSArray = TS.split(':');
    
    if (RS === 'из A в B' || RS === 'из B в A') {
        travelTime = 50;
        arrival = ((TSArray[0] * 3.6e+6 + TSArray[1] * 60000) + 50 * 60000) * 1 / 60000;
        currentDate.setHours(TSArray[0]);
        currentDate.setMinutes(TSArray[1]);
        currentDate.setMinutes(currentDate.getMinutes() + 50);
    } else {
        let TRS = timeReverseSelect[timeReverseSelect.selectedIndex].innerText.slice(0, 5);
        let TRSArray = TRS.split(':');
        travelTime = ((TRSArray[0] * 3.6e+6 + TRSArray[1] * 60000) - (TSArray[0] * 3.6e+6 + TSArray[1] * 60000)) * 1/60000 + 50;
        currentDate.setHours(TRSArray[0]);
        currentDate.setMinutes(TRSArray[1]);
        currentDate.setMinutes(currentDate.getMinutes() + 50);
    }

    let text =  `Вы выбрали ${numTickets.value} ${numWord(numTickets.value, ticket)} по маршруту ${RS} общей стоимостью ${sumTickets}.
                    Это путешествие займет у вас ${travelTime} минут. 
                    Теплоход отправляется в ${TS}, 
                    а прибудет в ${currentDate.getHours()}:${String(currentDate.getMinutes()).length == 1 ? `0${currentDate.getMinutes()}` : 
                    currentDate.getMinutes()}.`
    textInfo.innerText = text;
})







