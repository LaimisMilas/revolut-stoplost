export var trade_pares = {
    "SOL":{
        "name": "SOL-USD",
        "price": 123,
        "stopLost": -1,
        "takeProf": 5,
        "takeProfRsi": 70,
        "quantity": "25%"
    },
    "RSI":{
        "name": "RSI-USD",
        "price": 123,
        "stopLost": -1,
        "takeProf": 5,
        "takeProfRsi": 70,
        "quantity": "25%"
    }
};

export var lc_user_cfg = {
    "uid":0,
    "cfg":{
        "linkedInLike":{
            "ignoredActor": [
                {"firstName": "followers", "id": 0}
            ],
            "friendActor": [
                {"firstName": "lighthouse hub", "id": 0}
            ],
            "currentIntent": "it_sector",
            "root":{
                "logPrefix":"LI_1 def",
                "run":false,
                "log":true,
                "range":[
                    22000,
                    22540
                ],
                "counter":9,
                "counterClear":20,
                "key":"root",
                "randomize":{
                    "interval":5000,
                    "begin":5000,
                    "middle":6000,
                    "end":10000
                }
            },
            "click":{
                "enable":true
            },
            "like":{
                "postIdXPath":"",
                "postsXPath":"//div[contains(@data-id, 'urn:li:activity')]",
                "postTextXPath":"/div/*/button[contains(string(), \"Like\")]",
                "buttonXPath":"//div/*/button[contains(string(), \"Like\")]",
                "validateElXPath":"/span/*/*",
                "validateValue":"svg",
                "likeCounterValue": 100,
                "enable":true,
                "run":true,
                "log":false,
                "path":"",
                "key":"like",
                "value":0,
                "validate":true,
                "range":[
                    9056,
                    10055
                ],
                "counter":0,
                "wit":{
                    "run":true,
                    "ruleSet":{
                        "id":1,
                        "key":"like",
                        "rules":[
                            {
                                "id":1,
                                "action":"Like",
                                "actionKey":"like",
                                "conjunction":"if",
                                "ruleTarget":"description",
                                "ruleOperator":"is",
                                "ruleIntent":"it_sector",
                                "confidence":0.98
                            },
                            {
                                "id":2,
                                "action":"Like",
                                "actionKey":"like",
                                "conjunction":"if",
                                "ruleTarget":"description",
                                "ruleOperator":"is",
                                "ruleIntent":"business_owner",
                                "confidence":0.98
                            }
                        ]
                    }
                },
                "paths":{
                    "name":"/../../../..//div[contains(@class, 'update-components-actor')]/div/div/a/span[1]/span/span",
                    "description":"/../../../..//div[contains(@class, 'update-components-actor')]/div/div/a/span[2]/span",
                    "text":"/../../../..//div[contains(@class, 'update-components-actor')]/div/div/a/span[2]/span",
                    "href":"/../../../..//a",
                    "dataUrn":"/../../../../../../.."
                },
                "interacted":[
                    "Senior Software Developer"
                ]
            },
            "repost":{
                "run":false,
                "log":false,
                "path":"//div[contains(@data-id, 'urn:li:activity')]",
                "postTextXPath":"/div/*/button[contains(string(), \"Like\")]",
                "buttonXPath":"//div/*/button[contains(string(), \"Like\")]",
                "postsXPath":"//div[contains(@data-id, 'urn:li:activity')]",
                "key":"repost",
                "validate":false,
                "likeCounterValue": 100,
                "value":"SOL-USD",
                "range":[
                    2215,
                    3215
                ],
                "counter":0,
                "wit":{
                    "run":true,
                    "ruleSet":{
                        "id":6,
                        "key":"repost",
                        "rules":[
                            {
                                "id":1,
                                "action":"Repost",
                                "actionKey":"repost",
                                "conjunction":"if",
                                "ruleTarget":"description",
                                "ruleOperator":"is",
                                "ruleIntent":"it_sector",
                                "confidence":0.99
                            },
                            {
                                "id":2,
                                "action":"Repost",
                                "actionKey":"repost",
                                "conjunction":"if",
                                "ruleTarget":"description",
                                "ruleOperator":"is",
                                "ruleIntent":"business_owner",
                                "confidence":0.99
                            }
                        ]
                    },
                },
                "paths":{
                    "name":"/../../../..//div[contains(@class, 'update-components-actor')]/div/div/a/span[1]/span/span",
                    "description":"/../../../..//div[contains(@class, 'update-components-actor')]/div/div/a/span[2]/span",
                    "text":"/../../../..//div[contains(@class, 'update-components-actor')]/div/div/a/span[2]/span",
                    "href":"/../../../..//a",
                    "dataUrn":"/../../../../../../.."
                },
            },
            "newPoster":{
                "run":true,
                "log":false,
                "path":"//button/div/span[contains(string(), \"New posts\")]/../..",
                "key":"newPoster",
                "validate":false,
                "range":[
                    2215,
                    3215
                ],
                "counter":0,
                "wit":{
                    "run":false,
                    "ruleSet":null,
                    "href":"/../../..//a"
                }
            },
            "follower":{
                "run":true,
                "log":false,
                "path":"//button//span[text() = \"Follow\"]",
                "key":"follower",
                "validate":false,
                "value":-1,
                "range":[
                    9056,
                    10055
                ],
                "counter":0,
                "wit":{
                    "run":true,
                    "ruleSet":{
                        "id":2,
                        "key":"follower",
                        "rules":[
                            {
                                "id":1,
                                "action":"Follow",
                                "actionKey":"follower",
                                "conjunction":"if",
                                "ruleTarget":"description",
                                "ruleOperator":"is",
                                "ruleIntent":"it_sector",
                                "confidence":0.99
                            },
                            {
                                "id":2,
                                "action":"Follow",
                                "actionKey":"follower",
                                "conjunction":"if",
                                "ruleTarget":"description",
                                "ruleOperator":"is",
                                "ruleIntent":"business_owner",
                                "confidence":0.99
                            }
                        ]
                    }
                },
                "pathName":"",
                "pathDescription":"",
                "pathText":"",
                "paths":{
                    "name":"/../../..//span[contains(@class, 'discover-person-follow-card__name')]",
                    "description":"/../../..//span[contains(@class, 'discover-person-follow-card__occupation')]",
                    "name2":"/../../../../../a/div/div[2]/p",
                    "description2":"/../../../../../a/div/div[2]/p[2]",
                    "text":null,
                    "href":"/../../..//a",
                    "dataUrn":null,
                    "company":{
                        "name":"/../../..//span[contains(@class, 'discover-company-card__name')]",
                        "description":"/../../..//span[contains(@class, 'discover-company-card__name')]",
                        "text":null,
                        "href":"/../../..//a"
                    }
                },
                "interacted":[

                ]
            },
            "quantity":{
                "run":true,
                "log":false,
                "path":"//button/span[text() = \"Subscribe\"]",
                "key":"quantity",
                "validate":false,
                "value":5,
                "range":[
                    9056,
                    10055
                ],
                "counter":0
            },
            "accepter":{
                "run":false,
                "log":false,
                "path":"//button//span[text() = \"Accept\"]",
                "key":"accepter",
                "value":5,
                "validate":false,
                "range":[
                    2456,
                    3875
                ],
                "counter":0,
                "wit":{
                    "run":false,
                    "ruleSet":{
                        "id":4,
                        "key":"accepter",
                        "rules":[
                            {
                                "id":1,
                                "action":"Accept",
                                "actionKey":"accepter",
                                "conjunction":"if",
                                "ruleTarget":"description",
                                "ruleOperator":"is",
                                "ruleIntent":"it_sector",
                                "confidence":0.99
                            },
                            {
                                "id":2,
                                "action":"Accept",
                                "actionKey":"accepter",
                                "conjunction":"if",
                                "ruleTarget":"description",
                                "ruleOperator":"is",
                                "ruleIntent":"business_owner",
                                "confidence":0.99
                            }
                        ]
                    }
                },
                "paths":{
                    "name":null,
                    "description":"/../../../../div",
                    "text":null,
                    "href":"/../../..//a"
                },
                "interacted":[

                ]
            },
            "connector":{
                "run":false,
                "log":false,
                "path":"//button/span[text() = \"Connect\"]",
                "key":"connector",
                "validate":false,
                "value":70,
                "range":[
                    12465,
                    16123
                ],
                "counter":0,
                "wit":{
                    "run":true,
                    "ruleSet":{
                        "id":5,
                        "key":"connector",
                        "rules":[
                            {
                                "id":1,
                                "action":"Connect",
                                "actionKey":"connector",
                                "conjunction":"if",
                                "ruleTarget":"description",
                                "ruleOperator":"is",
                                "ruleIntent":"it_sector",
                                "confidence":0.99
                            },
                            {
                                "id":2,
                                "action":"Connect",
                                "actionKey":"connector",
                                "conjunction":"if",
                                "ruleTarget":"description",
                                "ruleOperator":"is",
                                "ruleIntent":"business_owner",
                                "confidence":0.99
                            }
                        ]
                    }
                },
                "paths":{
                    "name":"/../../../..//span[contains(@class, 'discover-person-card__name')]",
                    "name2":"/../../../../../a/div/div[2]/p",
                    "description":"/../../../..//span[contains(@class, 'discover-person-card__occupation')]",
                    "description2":"/../../../../../a/div/div[2]/p[2]",
                    "text":null,
                    "href":"/../../../..//a"
                },
                "interacted":[

                ]
            },
            "withdraw":{
                "run":false,
                "log":false,
                "path":"//button/span[text() = \"Withdraw\"]",
                "key":"withdraw",
                "validate":false,
                "range":[
                    5465,
                    7523
                ],
                "counter":0,
                "wit":{
                    "run":false,
                    "ruleSet":null
                },
                "paths":{
                    "name":null,
                    "description":null,
                    "text":null,
                    "href":null
                },
                "interacted":[

                ]
            },
            "welcome":{
                "run":false,
                "log":false,
                "path":"//button/span/span[@class = \"conversations-quick-replies__reply-content\"]/..",
                "validateElXPath":"//li[@class = 'msg-s-message-list__typing-indicator-container--without-seen-receipt']",
                "key":"welcome",
                "validate":false,
                "range":[
                    4465,
                    9523
                ],
                "counter":0
            },
            "scroll":{
                "counter":0
            },
            "rootTimeout":5000,
            "rootInterval":481
        },
        "panel":{
            "consoleOutId":"console_out_id",
            "consoleOutTabId":"console_out_tab_id",
            "cfgTabId":"cfg_tab_id",
            "viewCfgTabId":"view_cfg_tab_id",
            "cfgTextareaId":"cfg_textarea_id",
            "menuButtonsId":"menu_buttons_id"
        },
        "autoClick":{
            "enable":true
        }
    }
};
