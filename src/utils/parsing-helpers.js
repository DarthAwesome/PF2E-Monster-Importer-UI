const parseActionCost = function(actionStr, defaultCost = "passive"){
    const possibleActionCosts = [
        {1: ['single action', 'single-action', 'one-action', 'one action']}, 
        {2: ['two action', 'two-action']}, 
        {3: ['three action', 'three-action']},
        {freeAction: ['free action', 'free-action']},
        {reaction: ['reaction']}
    ];
    let actionCostObj = possibleActionCosts.find(costObj => 
        costObj[Object.keys(costObj)[0]]
            .some(search => actionStr.toLowerCase().includes(search)))

    if(actionCostObj) return Object.keys(actionCostObj)[0]
    else return defaultCost
}

/**
 * 
 * @param {string} attackStr 
 * @returns Strike object {name, modifier, traits?, damageRolls, attackEffects?}
 */
export const parseSingleAttack = function(attackStr){
    const damageIndex = attackStr.indexOf(', Damage');
    const effectIndex = attackStr.indexOf(', Effect');
    const weaponAttackString = attackStr.slice(0, damageIndex !== -1 ? damageIndex : effectIndex);
    const attackCost = parseActionCost(attackStr,"1")
    const wepAtkRegEx = /(?:(?:Melee|Ranged) *)?(.+) ([\+-]\d+)(?: \((.+)\))*/gi;
    const isRanged = attackStr.includes("Ranged")
    let wepAtkMatch = wepAtkRegEx.exec(weaponAttackString);
    let wepTraits, weaponName, weaponMod
    try{
    weaponName = wepAtkMatch[1].replace(/\[?(?:one|two|single|three)[ -]?actions?\]?/i,"").trim();
    weaponMod = wepAtkMatch[2];
    wepTraits = wepAtkMatch[3];
    }catch(error){ throw new Error(`Couldn't parse strike: ${attackStr}\n<br> Is it missing an attack modifier? \n<br>${error}`)}

    let wepTraitsArr
    if(wepTraits) wepTraitsArr = wepTraits.split(/,\s+(?![^\(]+\))/g).map(s => s.trim());
    const damageString = attackStr.slice((damageIndex !== -1 ? damageIndex+8 : effectIndex+8)).replace(/"/g,'').replace(/\n/g,'').trim();
    const dmgRegEx = /(?: ?plus ?|, ?|,? ?and ?)+/g;
    const damageArray = damageString.split(dmgRegEx);
    let processedDmgArray = [];
    let attackEffects = [];
    for (let dmgIndx=0; dmgIndx < damageArray.length; dmgIndx++){
        if(damageArray[dmgIndx].length!==0){
            let lookForNum = /\d/g;
            if(lookForNum.test(damageArray[dmgIndx])){
                processedDmgArray.push(damageArray[dmgIndx]);
            } else attackEffects.push(damageArray[dmgIndx]);
        } 
    }
    let attackAction = {
        'name': weaponName,
        'modifier': weaponMod,
        'traits': wepTraitsArr,
        'damageRolls': processedDmgArray,
        'attackEffects': attackEffects,
        'actionCost': attackCost,
        isRanged: isRanged
    }
    if(!attackAction.traits)
        delete attackAction.traits
    if(attackAction.attackEffects.length === 0)
        delete attackAction.attackEffects
    return attackAction;
}

/**
 * 
 * @param {string} abilityText 
 * @returns {string} formattedAbilityText
 */
export const formatAbilityText = function(abilityText){
    return abilityText
        .replace(/(?<=[^\.]$)\n/gm," ") // join lines that don't end in a period.
        .replace(/(?<=^.+?)(Saving Throw|Maximum Duration|Stage 1|Stage 2|Stage 3|Stage 4|Stage 5|Stage 6|Trigger|Effect|Critical Success|(?<!Critical )Success|(?<!Critical )Failure|Critical Failure|Requirements|Requirement|Frequency|\(1st\)|\(2nd\)|\(3rd\)|\(4th\)|\(5th\)|\(6th\)|\(7th\)|\(8th\)|\(9th\)|\(10th\))/gm,'\n$&')
        .replace(/(Saving Throw|Maximum Duration|Stage 1|Stage 2|Stage 3|Stage 4|Stage 5|Stage 6|Trigger|Effect|Critical Success|(?!Critical )Success|(?!Critical )Failure|Critical Failure|Requirements|Requirement|Frequency|\(1st\)|\(2nd\)|\(3rd\)|\(4th\)|\(5th\)|\(6th\)|\(7th\)|\(8th\)|\(9th\)|\(10th\))/g, '<b>$&</b>')
        .replace(/\n/gm,"<br>\n")
}

export const transformAbilityString = function(abilityString){
    const namematch = `${abilityString}\n`.match(/(^.+?)(?=\[|\n|\()([\s\S]*)/i)
    let ability = { name: namematch[1].trim() }
    let restOfAbility = namematch?.[2]
    let traitsMatch = restOfAbility?.match(/\(((?:\w+(?:,\s)?)+)\)/i)
    const abilityTraits = traitsMatch?.[1]?.replace(/\n+/," ")?.split(/,\s+(?![^\(]+\))/g)?.map(s => s?.trim())
    if(abilityTraits) ability.traits = abilityTraits
    ability.actionCost = parseActionCost(abilityString,"passive")
    
    ability.actionText = formatAbilityText(restOfAbility
        .replace(ability.name,"")
        .replace(/\[?(?:one|single|two|three|free|re)(?:-| )?actions?\]?/i,"")
        .replace(traitsMatch?.[0],"")
        .trim())
    return ability
}

export const parseSpeedString = function(speedStr){
    const dropSpeedFromStr = speedStr.replace(/\n+/," ").replace(/^Speed /i,"")
    const matchRegEx = /(.+?(?=[,;])?)(?:[,;] (.+))/i
    let match = dropSpeedFromStr.match(matchRegEx)
    let speedObj = {}
    if(match){
        speedObj.speed = match[1]
        speedObj.otherSpeeds = {}
        let newMatch = match[2]?.match(matchRegEx)
        let lastApply = newMatch?.[2]
        while(newMatch){
            let result = newMatch[1]
            const parseResult = result.match(/(.+(?!(?:\d+ feet)))(?: (\d+ feet))/i)
            if(parseResult?.[1]){
                speedObj.otherSpeeds[parseResult?.[1] ?? result] = parseResult?.[2] ?? ""
            }
            lastApply = newMatch?.[2]
            newMatch = newMatch[2].match(matchRegEx)
        }
        const parseResult = (lastApply ?? match?.[2])?.match(/(.+(?!(?:\d+ feet)))(?: (\d+ feet))/i)
        speedObj.otherSpeeds[parseResult?.[1] ?? lastApply ?? match?.[2]] = parseResult?.[2] ?? ""
        return speedObj
    }
    else{
        speedObj.speed = dropSpeedFromStr
        return speedObj
    }
}

export const splitMultipleSpellStringToArray = function(spellListStr){
    return spellListStr.split(/^(?=(?:.*?(?:Spells|Rituals).* DC \d+))/im).map(s => s.replace(/\s*\n\s*/g," ").trim())
}

/**
 * 
 * @param {string} spell 
 */
export const spellNameAndDetailToSpellObj = function(spell){
    let spellObj = {spellName: spell.trim()}
    let detailMatch = spell.match(/\(.+\)/)
    if(detailMatch?.[0]){
        spellObj.detailText = detailMatch[0]
        spellObj.spellName = spellObj.spellName.replace(detailMatch[0],"").trim()
    }
    return spellObj
}

/**
 * 
 * @param {any[]} spellsArray 
 */
export const countExtraCastsInSpellArray = function(spellsArray){
    if(!spellsArray || !Array.isArray(spellsArray) || spellsArray.length===0) return undefined
    let casts = 0
    for(let i=0;i<spellsArray.length;i++){
        if(spellsArray[i]?.detailText){
            const countSpells = parseInt(spellsArray[i].detailText.match(/\((?:x|×)(\d+)\)/)?.[1] ?? 1,10)
            casts += (countSpells - 1) // 1 already counted because of its entry
        }
    }
    return casts
}

export const parseSpellEntry = function(spellEntryStr){
    const entryName = spellEntryStr.match(/(^.*?(?:Spells?|Rituals?))/i)[1]
    const lstr = spellEntryStr.toLowerCase();
    let tradition = ['arcane','primal','divine','occult'].find(t => lstr.match(/\w+/i)[0].includes(t));
    let spellCastType = ['spontaneous','innate','prepared'].find(t => lstr.includes(`${t} spells`));
    let isFocus = false
    let isRituals = false
    let numFocusPoints = 0
    if(!spellCastType){
        if(lstr.includes('focus point')){

            spellCastType = 'focus';
            isFocus = true
            numFocusPoints = parseInt(lstr.match(/(\d+) focus point/i)?.[1] ?? 0,10)
        }
        else if(lstr.includes('ritual')) spellCastType = 'ritual';
        else spellCastType = 'innate';
    }
    let isSpontaneous = spellCastType === 'spontaneous'
    let [,dc,attackMod, spellList] = [...spellEntryStr.match(/DC (\d+)(?:[,; ]*(?:attack) ?(\+?\d+)*)?[,;\s]*([\s\S]+)/i)];
    spellList = spellList.trim();
    let constantSpellList = undefined;
    let constantSpellListMatch = spellList.match(/([\s\S]*?)(?:[;\s]*Constant (\((?:[\s\S])+))/i);
    if(constantSpellListMatch){
        [,spellList,constantSpellList] = [...constantSpellListMatch];
    }
    const spellLevels = [{key: 'cantrip', value: 0}, {key: '1st', value: 1}, {key: '2nd', value: 2}, {key: '3rd', value: 3}, 
                            {key: '4th', value: 4}, {key: '5th', value: 5}, {key: '6th', value: 6}, {key: '7th', value: 7}, 
                            {key: '8th', value: 8}, {key: '9th', value: 9}, {key: '10th', value: 10}]
    let spellListRegEx = /(1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th|Cantrips \(1st\)|Cantrips \(2nd\)|Cantrips \(3rd\)|Cantrips \(4th\)|Cantrips \(5th\)|Cantrips \(6th\)|Cantrips \(7th\)|Cantrips \(8th\)|Cantrips \(9th\)|Cantrips \(10th\))(?:[\s]+\((\d+)[\s]+(?:focus points?|slots?)\))?([^;]+?(?:(?![,; ]+1st|[,; ]+2nd|[,; ]+3rd|[,; ]+4th|[,; ]+5th|[,; ]+6th|[,; ]+7th|[,; ]+8th|[,; ]+9th|[,; ]+10th|[,; ]+Cantrips \(1st\)|[,; ]+Cantrips \(2nd\)|[,; ]+Cantrips \(3rd\)|[,; ]+Cantrips \(4th\)|[,; ]+Cantrips \(5th\)|[,; ]+Cantrips \(6th\)|[,; ]+Cantrips \(7th\)|[,; ]+Cantrips \(8th\)|[,; ]+Cantrips \(9th\)|[,; ]+Cantrips \(10th\))[\s\S])*)/gi;
    let spellsArr = Array.from(spellList.matchAll(spellListRegEx)).map(arr => {
                        let [,spellLvlStr,numSlots,spellListStr] = [...arr]; 
                        let spells = spellListStr.split(/,\s+(?![^\(]+\))/g).map(s => s.replace(/\s*\n\s*/g," ").trim()).filter(s => s!=="")
                        if(numSlots === undefined){
                            numSlots = spells.length
                        }
                        const spellLvlObj = spellLevels.find(s => spellLvlStr.toLowerCase().includes(s.key));
                        let spellLvl = (spellLvlObj?.value) ?? 0;
                        spells = spells.map(spell => spellNameAndDetailToSpellObj(spell))

                        // if(spellListStr.toLowerCase().includes('focus point')) spellLvl = 11;
                        return {
                            spellLvl: spellLvl,
                            level: spellLvlStr,
                            numUses: parseInt(numSlots,10) + countExtraCastsInSpellArray(spells),
                            spells: spells
                        }
                    });
    if(constantSpellList){
        let constSpellListRegEx = /(\(1st\)|\(2nd\)|\(3rd\)|\(4th\)|\(5th\)|\(6th\)|\(7th\)|\(8th\)|\(9th\)|\(10th\)|Constant \(1st\)|Constant \(2nd\)|Constant \(3rd\)|Constant \(4th\)|Constant \(5th\)|Constant \(6th\)|Constant \(7th\)|Constant \(8th\)|Constant \(9th\)|Constant \(10th\))([^\(;]+?(?:(?![,; ]+\(1st\)|[,; ]+\(2nd\)|[,; ]+\(3rd\)|[,; ]+\(4th\)|[,; ]+\(5th\)|[,; ]+\(6th\)|[,; ]+\(7th\)|[,; ]+\(8th\)|[,; ]+\(9th\)|[,; ]+\(10th\)|[,; ]+Constant \(1st\)|[,; ]+Constant \(2nd\)|[,; ]+Constant \(3rd\)|[,; ]+Constant \(4th\)|[,; ]+Constant \(5th\)|[,; ]+Constant \(6th\)|[,; ]+Constant \(7th\)|[,; ]+Constant \(8th\)|[,; ]+Constant \(9th\)|[,; ]+Constant \(10th\))[\s\S])*)/gi;
        spellsArr = spellsArr.concat(Array.from(constantSpellList.matchAll(constSpellListRegEx)).map(arr => {
                            let [,spellLvlStr,spellListStr] = [...arr]; 
                            let spells = spellListStr.split(/,\s+(?![^\(]+\))/g).map(s => s.replace(/\s*\n\s*/g," ").trim()).filter(s => s!=="")
                            let numSlots = spells.length
                            const spellLvlObj = spellLevels.find(s => spellLvlStr.toLowerCase().includes(s.key));
                            let spellLvl = (spellLvlObj?.value) ?? 0;
                            spells = spells.map(spell => spellNameAndDetailToSpellObj(spell))
                            // if(spellListStr.toLowerCase().includes('focus point')) spellLvl = 11;
                            return {
                                spellLvl: spellLvl,
                                level: `Constant ${spellLvlStr}`,
                                numUses: parseInt(numSlots,10) + countExtraCastsInSpellArray(spells),
                                spells: spells
                            }
                        }))
    }

    if(spellsArr.length === 0 && spellCastType === 'ritual'){
        isRituals = true
        spellsArr = [{spellLvl: undefined, level: "1st", numUses: undefined, spells: spellList.split(/,\s+(?![^\(]+\))/g).map(s => s.trim()).filter(s => s!=="").map(spell => spellNameAndDetailToSpellObj(spell))}];
    }
    return {
        name: entryName, 
        isFocus: isFocus, 
        isRituals: isRituals, 
        isSpontaneous: isSpontaneous,
        numFocusPoints: numFocusPoints, 
        tradition: tradition, 
        DC: dc, 
        attackMod: attackMod, 
        spellCastType: spellCastType, 
        spellLevels: spellsArr
    };
}