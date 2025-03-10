export const witCfg = {
    logPrefix: "CW_1",
    run: true,
    log: true,
    range: [15000, 26000],
    counter: 0,
    counterClear: 20,
    key: 'root',
    witAuth: 'Bearer SHY752S3LLKEKWN6IZIB5WSYZWXLU4N2',
    witUrl: {
        message: 'https://api.wit.ai/message?v=20230901&q=',
        utterances: 'https://api.wit.ai/utterances?v=20230215',
        entities: 'https://api.wit.ai/entities?v=20230215',
        intents: 'https://api.wit.ai/intents?v=20230215',
    },
    witProxyUrl: 'http://localhost:3000/wit-proxy/',
    doCallWit: true
};

let confidence = 0.98;

export const proxyWitCall = (myElement, witCallBack, rootCfg) => {
    var textContent = myElement.innerText;
    if (!textContent || textContent.length === 0 || !witCfg.doCallWit) {
        return "empty";
    }
    const q = encodeURIComponent(textContent);
    var url = witCfg.witProxyUrl + q;
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url);
    xhttp.onreadystatechange = function () {
        witCallBack(xhttp, "", rootCfg);
    };
    xhttp.send(null);
}

export const directWitCall = (textContent, witCallBack, element, rootCfg, callback, parentId, childId) => {
    if (!textContent || textContent.length === 0 || !witCfg.doCallWit) {
        return "empty";
    }
    const q = encodeURIComponent(textContent.substring(0, 280));
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", witCfg.witUrl.message + q);
    xhttp.setRequestHeader('Authorization', witCfg.witAuth);
    xhttp.onreadystatechange = function () {
        witCallBack(xhttp, element, rootCfg, callback, parentId, childId);
    };
    xhttp.send(null);
}

export const witCallBack = (xhttp, myElement, rootCfg) => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        var entities = JSON.parse(xhttp.responseText).entities;
        if (entities && entities['go_home:go_home'] && entities['go_home:go_home'].length > 0) {
            JSON.parse(xhttp.responseText).entities['go_home:go_home'].forEach(
                function (key) {
                    console.log(key.confidence);
                    if (key.confidence >= confidence) {
                        console.log("Message '");
                    }
                }
            );
        }
    }
}


const fbMessage = (id, text) => {
    const body = JSON.stringify({
        recipient: { id },
        message: { text },
    });
    const qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);
    return fetch('https://graph.facebook.com/me/messages?' + qs, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body,
    })
        .then(rsp => rsp.json())
        .then(json => {
            if (json.error && json.error.message) {
                throw new Error(json.error.message);
            }
            return json;
        });
};

/*
Definition Creates a new entity with the given attributes.
  POST https://api.wit.ai/entities
Example request
  $ curl -XPOST 'https://api.wit.ai/entities?v=20230215' \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"favorite_city",
       "roles":[]}'
Example response
{
  "id": "5418abc7-cc68-4073-ae9e-3a5c3c81d965",
  "name": "favorite_city",
  "roles": ["favorite_city"],
  "lookups": ["free-text", "keywords"],
  "keywords": []
}
*/


/*
Definition Retrieve the language of a text message
q	required	string	User's query, between 0 and 280 characters.
n	optional	integer	The maximum number of top detected locales you want to get back. The default is 1, and the maximum is 8.
  GET https://api.wit.ai/language
Example request
  $ curl -XGET 'https://api.wit.ai/language?v=20230215&q=bonjour%20les%20amis&n=2' \
  -H "Authorization: Bearer $TOKEN"
Example response
{
  "detected_locales": [
    {
      "locale": "fr_XX",
      "confidence": 0.9986
    },
    {
      "locale": "ar_AR",
      "confidence": 0.0014
    }
  ]
}
*/

/*
"{
"entities": {
    "vardas_lietuviskas:vardas_lietuviskas": [
        {
            "body": "Laimonas",
            "confidence": 0.9995,
            "end": 8,
            "entities": {},
            "id": "2582974801854502",
            "name": "vardas_lietuviskas",
            "role": "vardas_lietuviskas",
            "start": 0,
            "type": "value",
            "value": "Laimonas"
        }
    ]
},
"intents": [
    {
        "confidence": 0.9987451108346802,
        "id": "328186916313630",
        "name": "lietuviskas_vardas"
    }
],
    "text": "Laimonas",
    "traits": {}
}"
*/

/*
* "{
  "entities": {
    "developer:developer": [
      {
        "body": ",",
        "confidence": 1,
        "end": 93,
        "entities": {},
        "id": "630891979026133",
        "name": "developer",
        "role": "developer",
        "start": 92,
        "type": "value",
        "value": ","
      },
      {
        "body": ",",
        "confidence": 1,
        "end": 113,
        "entities": {},
        "id": "630891979026133",
        "name": "developer",
        "role": "developer",
        "start": 112,
        "type": "value",
        "value": ","
      }
    ]
  },
  "intents": [
    {
      "confidence": 0.6314451636267906,
      "id": "686099342948469",
      "name": "it_sector"
    }
  ],
  "text": "Immerse yourself in the forefront of life sciences innovations at Life Sciences Baltics 2023, on September 20-21, in Vilnius.",
  "traits": {}
}"
* */
