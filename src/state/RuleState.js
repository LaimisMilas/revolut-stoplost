import {makeAutoObservable} from 'mobx';
import {lc_rule_cfg} from "clicker-common/src/staticData/lc_rules_set";
import {lc_rule} from "clicker-common/src/staticData/lc_rule";

export class RuleState {

    rootStore = null;
    ruleSets = [];
    stopAllAction = false;
    editRuleSet = null;
    currentIntent = "it_sector";

    constructor() {
        makeAutoObservable(this);
    }
    
    setup(rootStore) {
        this.rootStore = rootStore;
        this.initialize();
    }
    
    initialize() {
        this.setRuleSets(lc_rule_cfg);
        this.editRuleSet = lc_rule;
    }
    
    setRuleSets(ruleSets, caller){
        this.ruleSets = ruleSets;
    }

    //html elemento select reiksmes
    ruleTarget = [
        {value: "name", label: "Name"},
        {value: "description", label: "Description"},
        {value: "text", label: "Text"}
    ];
    //html elemento select reiksmes
    ruleOperator = [
        {value: "not", label: "NOT"},
        {value: "is", label: "IS"}
    ];
    //html elemento select reiksmes
    //{value: "indian_name", label: "UnFriendly Name", id: 205288198998753},
    ruleIntent = [
        {value: "it_sector", label: "IT Sector Intent", id: 686099342948469},
        {value: "business_owner", label: "Business Owner Intent", id: 1402925466926079},
        {value: "marketing", label: "Marketing Intent", id: 1275117844194718},
    ];

    currentRuleKey = "like";
    openRuleDialog = true;

    setShowRuleDialog(value, ruleKey) {
        this.editRuleSet = this.findRuleSet(ruleKey);
        this.openRuleDialog = value;
    }

    saveEditRuleSet() {
        if(this.editRuleSet){
            this.updateRuleSet(this.editRuleSet);
        }
        this.openRuleDialog = true;
    }

    updateRuleByActionKey(actionKey, newRuleData) {
        for (let i = 0; i < this.ruleSets.length; i++) {
            for (let j = 0; j < this.ruleSets[i].rules.length; j++) {
                if (this.ruleSets[i].rules[j].actionKey === actionKey) {
                    // Atnaujiname narį pagal actionKey
                    this.ruleSets[i].rules[j] = {...this.ruleSets[i].rules[j], ...newRuleData};
                }
            }
        }
    }

    addRule(rule) {
        this.findRuleSet(rule.actionKey).rules.push(rule);
    }

    findRule(rule) {
        let result = null;
        let ruleSet = this.findRuleSet(rule.actionKey);
        ruleSet.rules.forEach((rule) => {
            if (rule.id === rule.id) {
                result = ruleSet;
            }
        });
        return result;
    }

    getRuleByKey(key) {
        return this.findRuleSet(key);
    }

    findRuleSet(ruleKey) {
        let result = null;
        this.ruleSets.forEach((ruleSet) => {
            if (ruleSet.key === ruleKey) {
                result = ruleSet;
            }
        });
        return result;
    }

    findRuleSetByIntent(key, ruleIntent) {
        let result = null;
        this.ruleSets.forEach((ruleSet) => {
            if (ruleSet.key === key) {
                ruleSet.rules.forEach((rule) => {
                    if (rule.ruleIntent === ruleIntent) {
                        result = rule;
                    }
                });
            }
        });
        return result;
    }

    findCurrentRuleSetByKey(key) {
        return this.findRuleSetByIntent(key, this.currentIntent);
    }
    
    removeRule(ruleName) {

    }

    getCurrentRule(currentRuleKey) {
        return this.findRuleSet(currentRuleKey);
    }
    
    updateRuleSet(editRuleSet) {
        for (let i = 0; i < this.ruleSets.length; i++) {
            if (this.ruleSets[i].key === editRuleSet.key) {
                // Atnaujiname pagrindinį objektą
                this.ruleSets[i] = {...this.ruleSets[i], ...editRuleSet};

                // Atnaujiname taisyklių masyvą
                for (let j = 0; j < this.ruleSets[i].rules.length; j++) {
                    const mergeRule = editRuleSet.rules.find(r => r.id === this.ruleSets[i].rules[j].id);
                    if (mergeRule) {
                        this.ruleSets[i].rules[j] = {...this.ruleSets[i].rules[j], ...mergeRule};
                    }
                }
                // Pridėti naujas taisykles, kurios nėra esamame masyve
                editRuleSet.rules.forEach(mergeRule => {
                    if (!this.ruleSets[i].rules.some(rule => rule.id === mergeRule.id)) {
                        this.ruleSets[i].rules.push(mergeRule);
                    }
                });
            }
        }
    }
    
    setCurrentIntent(intent){
        this.currentIntent = intent;
        this.rootStore.cfgState.userCfg.cfg.linkedInLike.currentIntent = intent;
    }

    resetLocalState(){
        this.setup(this.rootStore);
    }

}