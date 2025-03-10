import {makeAutoObservable} from "mobx";
import {Utils} from "html-evaluate-utils/Utils";
import {compareTextLD} from "../utils/Text";

export class ActorState {

    stopAllAction = false;
    sendData = false;
    cfgState = null;
    interactedActors = new Map();

    constructor() {
        makeAutoObservable(this);
    }

    setup( cfgState) {
        this.cfgState = cfgState;
        this.sendData = false;
        this.interactedActors.set("accepter",["labas"]);
        if(window.location.href.includes("http://localhost:8083")) {
            this.interactedActors.set("like",
                [
                    "Aikido Security\nAikido Security\n7,536 followers\n7,536 followers",
                    'Writing the System Design Codex Newsletter',
                    'Early Steps Academy\nEarly Steps Academy\n52,981 followers\n52,981 followers',
                    'Syed Muhammad Saqib\nSyed Muhammad Saqib\n • 3rd+\n • 3rd+\nSoftware Engineer at BlackWood Marketing Pvt Ltd\nSoftware Engineer at BlackWood Marketing Pvt Ltd'
                ]
            );
        }
    }

    saveInteracted = (text, key) => {
        if (typeof (key) === 'string') {
            if (this.interactedActors.has(key)) {
                this.interactedActors.get(key).push(text.substring(0, 280));
            } else {
                this.interactedActors.set(key, [text]);
            }
        } else {
            console.log("key: " + key);
        }
    }

    hasInteracted = (text, key) => {
        let result = false;
        if (this.interactedActors.has(key)) {
            result = this.interactedActors.get(key).includes(text.substring(0, 280));
        }
        return result;
    }

    resetAllInteracted = () => {
        if (this.interactedActors && this.interactedActors.size > 0) {
            this.interactedActors.clear();
        }
    }

    isNameOnIgnoreList = (element, cfg) => {
        let result = false;
        const rootXPath = Utils.getXPathByEl(element);
        let name = this.getActorName(rootXPath, cfg);
        let description = this.getActorDescription(rootXPath, cfg);
        if(name && this.cfgState.userCfg.cfg.linkedInLike.ignoredActor){
            name = name.toLowerCase();
            this.cfgState.userCfg.cfg.linkedInLike.ignoredActor.forEach((actor) => {
                const text = actor.firstName.toLowerCase();
                if (name && actor && compareTextLD(name, text) > 95 || name.includes(text)) {
                    result = true;
                }
            });
        }
        if(description && this.cfgState.userCfg.cfg.linkedInLike.ignoredActor){
            description = description.toLowerCase();
            this.cfgState.userCfg.cfg.linkedInLike.ignoredActor.forEach((actor) => {
                const text = actor.firstName.toLowerCase();
                if (description && actor && compareTextLD(description, text) > 95 || description.includes(text)) {
                    result = true;
                }
            });
        }
        return result;
    }

    isNameOnFriendList = (element, cfg) => {
        let result = false;
        const rootXPath = Utils.getXPathByEl(element);
        let name = this.getActorName(rootXPath, cfg);
        let description = this.getActorDescription(rootXPath, cfg);
        if(name && this.cfgState.userCfg.cfg.linkedInLike.friendActor){
            name = name.toLowerCase();
            this.cfgState.userCfg.cfg.linkedInLike.friendActor.forEach((actor) => {
                const text = actor.firstName.toLowerCase();
                if (name && actor && compareTextLD(name, text) > 95 || name.includes(text)) {
                    result = true;
                }
            });
        }
        if(description && this.cfgState.userCfg.cfg.linkedInLike.friendActor){
            description = description.toLowerCase();
            this.cfgState.userCfg.cfg.linkedInLike.friendActor.forEach((actor) => {
                const text = actor.firstName.toLowerCase();
                if (description && actor && compareTextLD(description, text) > 95 || description.includes(text)) {
                    result = true;
                }
            });
        }
        return result;
    }

    getActorName = (rootXPath, cfg) => {
       let name = null;
        if (cfg.paths && cfg.paths.name && Utils.getElByXPath(rootXPath + cfg.paths.name)) {
            name = Utils.getElByXPath(rootXPath + cfg.paths.name).innerText;
        }
        if (!name && cfg.paths && cfg.paths.name2 && Utils.getElByXPath(rootXPath + cfg.paths.name2)) {
            name = Utils.getElByXPath(rootXPath + cfg.paths.name2).innerText;
        }
        return name;
    }

    getActorDescription = (rootXPath, cfg) => {
        let description = null;
        if (cfg.paths && cfg.paths.description && Utils.getElByXPath(rootXPath + cfg.paths.description)) {
            description = Utils.getElByXPath(rootXPath + cfg.paths.description).innerText;
        }
        if (cfg.paths && cfg.paths.description2 && Utils.getElByXPath(rootXPath + cfg.paths.description2)) {
            description = Utils.getElByXPath(rootXPath + cfg.paths.description2).innerText;
        }
        return description;
    }

    getActorHref = (rootXPath, cfg) => {
        let href = null;
        if (cfg.paths && cfg.paths.href && Utils.getElByXPath(rootXPath + cfg.paths.href)) {
            href = Utils.getElByXPath(rootXPath + cfg.paths.href).href;
        }
        return href;
    }

    getActorDataUrn = (rootXPath, cfg) => {
         let dataUrn = null;
        if (cfg.paths && cfg.paths.dataUrn && Utils.getElByXPath(rootXPath + cfg.paths.dataUrn)) {
            dataUrn = Utils.getElByXPath(rootXPath + cfg.paths.dataUrn).getAttribute("data-urn");
        }
        return dataUrn;
    }

    getActorLikeCounter = (rootXPath, cfg) => {
        let likeCounter = null;
        if (cfg.paths && cfg.paths.likeCounter && Utils.getElByXPath(rootXPath + cfg.paths.likeCounter)) {
            likeCounter = Utils.getElByXPath(rootXPath + cfg.paths.likeCounter).innerText;
        }
        if (likeCounter){
            let numberPattern = /\d+/g;
            likeCounter = likeCounter.replace(",", "");
            let matches = likeCounter.match(numberPattern);
            if(matches.length > 0){
                likeCounter = matches[0];
            }
        }
        return likeCounter ? Number(likeCounter) : 0;
    }

    
    getActorProfileData = () => {
        const xpath = '//code';
        const containsText = '"$type":"com.linkedin.voyager.common.Me"';
        
        const l = $x(xpath);
        let userUid = "";
        let publicIdentifier = "";
        for (let i = 0; i < l.length; i++) {
            if (l[i].innerText.includes(containsText)) {
                const data = JSON.parse(l[i].innerText).data;
                if (data && data.hasOwnProperty("*miniProfile")) {
                    const uidText = data['*miniProfile'];
                    userUid = uidText.split(":")[3];
                }
                const included = JSON.parse(l[i].innerText).included[0];
                if (included && included.hasOwnProperty("publicIdentifier")) {
                    publicIdentifier = included['publicIdentifier'];
                }
            }
        }
        return {"userUid": userUid ,"publicIdentifier" : publicIdentifier};
    }

    $x = xp => {
        const snapshot = document.evaluate(
            xp, document, null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
        );
        return [...Array(snapshot.snapshotLength)]
            .map((_, i) => snapshot.snapshotItem(i));
    }
    
}