/* Retrieve the list of all the intents of your app
$ curl -XGET 'https://api.wit.ai/intents?v=20230215' \
  -H "Authorization: Bearer $TOKEN"
Example response
  [
    {
      "id": "2690212494559269",
      "name": "buy_car"
    },
    {
      "id": "233273197778131",
      "name": "make_call"
    },
    {
      "id": "708611983192814",
      "name": "wit$get_weather"
    },
    {
      "id": "854486315384573",
      "name": "wit$play_music"
    }
  ]
*/

import {witCfg} from "./callWit";

export const getIntents = (body, witCallBack, rootCfg) => {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', witCfg.witUrl.intents, true);
    xhttp.setRequestHeader('Authorization', witCfg.witAuth);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.onreadystatechange = function () {
        witCallBack(xhttp, "", rootCfg);
    };
    xhttp.send(null);
}
export const postIntents = (body, witCallBack, rootCfg) => {
    console.log(body);
    if (!body || body.length === 0 || !witCfg.doCallWit) {
        return "empty";
    }
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', witCfg.witUrl.intents, true);
    xhttp.setRequestHeader('Authorization', witCfg.witAuth);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.onreadystatechange = function () {
        witCallBack(xhttp, "", rootCfg);
    };
    xhttp.send(body);
}

export const intentsCallBack = (xhttp, myElement, rootCfg) => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.responseText);
    }
}

/*
"[
   {
      "id": "676455903988458",
      "name": "RytinisPasisveikinimas"
   },
   {
      "id": "1408626119704944",
      "name": "VakarinisPasiskveikinimas"
   },
   {
      "id": "451580340197509",
      "name": "atstumasTarp"
   },
   {
      "id": "847563466747678",
      "name": "bankas"
   },
   {
      "id": "704661741479899",
      "name": "geri__mones"
   },
   {
      "id": "205288198998753",
      "name": "indian_name"
   },
   {
      "id": "328186916313630",
      "name": "lietuviskas_vardas"
   },
   {
      "id": "593261192209593",
      "name": "ru_army_go_home"
   },
   {
      "id": "835747714077035",
      "name": "susipazinti"
   },
   {
      "id": "722345782199023",
      "name": "vietosLaikas"
   },
   {
      "id": "3674357129488416",
      "name": "weather"
   },
   {
      "id": "1263331851038736",
      "name": "wit_get_sunrise"
   }
]"
*/