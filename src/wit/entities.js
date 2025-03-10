/* Retrieve the list of all the entities in your app
  GET https://api.wit.ai/entities
Example request
  $ curl -XGET 'https://api.wit.ai/entities?v=20230215' \
  -H "Authorization: Bearer $TOKEN"
Example response
[
  {
    "id": "2690212494559269",
    "name": "car"
  },
  {
    "id": "254954985556896",
    "name": "color"
  },
  {
    "id": "535a8110-2ea7-414f-a024-cf928b076d17",
    "name": "wit$amount_of_money",
  },
  {
    "id": "233273197778131",
    "name": "wit$reminder"
  },
  {
    "id": "1701608719981711",
    "name": "wit$datetime",
  },
]
[
  {
    "id": "2690212494559269",
    "name": "car"
  },
  {
    "id": "254954985556896",
    "name": "color"
  },
  {
    "id": "535a8110-2ea7-414f-a024-cf928b076d17",
    "name": "wit$amount_of_money",
  },
  {
    "id": "233273197778131",
    "name": "wit$reminder"
  },
  {
    "id": "1701608719981711",
    "name": "wit$datetime",
  },
]

 $ curl -XGET 'https://api.wit.ai/entities/buy_flowers?v=20230215' \
  -H "Authorization: Bearer $TOKEN"

*/

import {witCfg} from "./callWit";

export const getEntitiesEntity = (entity, witCallBack, rootCfg) => {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'https://api.wit.ai/entities/' + entity + '?v=20230215', true);
    xhttp.setRequestHeader('Authorization', witCfg.witAuth);
    xhttp.onreadystatechange = function () {
        entitiesCallBack(xhttp, "", rootCfg);
    };
    xhttp.send(null);
}

export const getEntities = (body, witCallBack, rootCfg) => {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', witCfg.witUrl.entities, true);
    xhttp.setRequestHeader('Authorization', witCfg.witAuth);
    xhttp.onreadystatechange = function () {
        entitiesCallBack(xhttp, "", rootCfg);
    };
    xhttp.send(null);
}
export const postEntities = (body, witCallBack, rootCfg) => {
    if (!body || body.length === 0 || !witCfg.doCallWit) {
        return "empty";
    }
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', witCfg.witUrl.entities, true);
    xhttp.setRequestHeader('Authorization', witCfg.witAuth);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.onreadystatechange = function () {
        entitiesCallBack(xhttp, "", rootCfg);
    };
    xhttp.send(body);
}

export const entitiesCallBack = (xhttp, myElement, rootCfg) => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.responseText);
    }
}



/*
[
   {
      "id": "2224077427759256",
      "name": "ManoEntity"
   },
   {
      "id": "470256544975391",
      "name": "Pasisveikinimas"
   },
   {
      "id": "649384842722152",
      "name": "go_home"
   },
   {
      "id": "256844643936079",
      "name": "vardas_lietuviskas"
   }
]

{
   "name": "vardas_lietuviskas",
   "roles": [
      {
         "id": "2582974801854502",
         "name": "vardas_lietuviskas"
      }
   ],
   "lookups": [
      "free-text",
      "keywords"
   ],
   "keywords": [
      {
         "keyword": "Laimonas",
         "synonyms": [
            "laimis",
            "laimonas",
            "laimonelis",
            "laimoniukas",
            "laimons",
            "laimuciukas",
            "laimukslis",
            "laimutis",
            "lamis",
            "lamonas",
            "lamunas"
         ]
      },
      {
         "keyword": "Mantas",
         "synonyms": [
            "maciukas",
            "maciuks",
            "man",
            "mantas",
            "mantasi",
            "mantinis",
            "mantovicius",
            "mants",
            "matukas",
            "mutas"
         ]
      },
      {
         "keyword": "Matas",
         "synonyms": [
            "matas"
         ]
      },
      {
         "keyword": "Tomas",
         "synonyms": [
            "tomas"
         ]
      }
   ],
   "id": "256844643936079"
}
*/