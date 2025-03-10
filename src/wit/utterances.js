/* Train your app
* https://wit.ai/docs/http/20230215/#post__utterances_link
* Definition Train your app
utterances
  POST https://api.wit.ai/utterances
Example request
  $ curl -XPOST 'https://api.wit.ai/utterances?v=20230215' \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[{
        "text": "I want to fly to sfo",
        "intent": "flight_request",
        "entities": [
          {
            "entity": "wit$location:to",
            "start": 17,
            "end": 20,
            "body": "sfo",
            "entities": []
          }
        ],
        "traits": []
      }]'
Example response
{
  "sent": true,
  "n": 1
}
*/

import {witCfg} from "./callWit";

export const body = [{
    text: "I want to fly to sfo",
    intent: "it_sector",
    entities: [],
    traits: []
}];

export const postUtterances = (body, witCallBack, rootCfg) => {
    console.log(body);
    if (!body || body.length === 0 || !witCfg.doCallWit) {
        return "empty";
    }
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', witCfg.witUrl.utterances, true);
    xhttp.setRequestHeader('Authorization', witCfg.witAuth);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.onreadystatechange = function () {
        witCallBack(xhttp, "", rootCfg);
    };
    xhttp.send(body);
}

// '{"text":"Development, architecture of transactional database systems, data integration.\\nTechnologies: SQL, PL/SQL, Oracle Forms /Reports.","intent":"it_sector","entities":[],"traits":[]}'