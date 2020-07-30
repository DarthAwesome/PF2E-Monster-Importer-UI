import * as regex from './monster-string-regex.js'
import * as parsingHelper from './parsing-helpers.js'

if(!String.prototype.titleCase){
    // @ts-ignore
    String.prototype.titleCase = function() {
        if (!this.length) return this;
        return this.toLowerCase().split(' ').map(function (word) {
            return word.replace(word[0], word[0].toUpperCase());
        }).join(' ');
    };
}

/**
 * 
 * @param {function} searchFunction - The regex function to search against
 * @param {string} monString - Monster String
 * @param {boolean} isMandatory - Is this field considered mandatory for a valid monster?
 * @param {boolean} returnDirectly - Just give me the value directly instead of an array; needs numMatchesExpected === 1
 * @param {string} errorIfMatchNotFound - Error string if we couldn't find this
 * @param {number} numMatchesExpected - Number of elements expected in value array
 * @param {function} transform - Some function to transform the value before returning it
 */
const helperSearchAndError = function(searchFunction, monString, isMandatory, returnDirectly = false, errorIfMatchNotFound=`Couldn't find result for mandatory result`, numMatchesExpected = 1, transform = undefined){
    const result = searchFunction(monString)
    if((!result?.[0] || !result?.[1]) && isMandatory){
        throw new Error(errorIfMatchNotFound)
    }
    let value = []
    for(let i=1;i<=numMatchesExpected;i++){
        if(result?.[i]){
            value[i] = result[i]
        }
    }
    let transformedValue
    if(transform){
        if(numMatchesExpected === 1){
            transformedValue = value?.[1] ? transform(value[1]) : undefined
        }
        else{
            transformedValue = value.length>0 ? transform(value) : undefined
        }
    }
    return result?.[0] ? {match: result?.[0], value: transform ? transformedValue : returnDirectly && numMatchesExpected === 1 ? value[1] : value} : undefined
}


/**
 * 
 * @param {function} searchFunction 
 * @param {string} monString 
 * @returns .value = array of abilities, properly formatted
 */
const abstractAbilitySearch = function(searchFunction, monString){
    const result = helperSearchAndError(searchFunction,monString,false,false)
    if(result){
        let abilitiesArr = result?.value?.[1]?.split(/(?:\n\n|\n^(?=.+\[(?:one|single|two|three)[ -]?actions?\]))+/gim)?.map(s => s.trim())?.filter(s => s!=="")
        abilitiesArr = abilitiesArr.map(s => parsingHelper.transformAbilityString(s))
        return {match: result.match, value: abilitiesArr}
    }
    else return undefined
}

/**
 * 
 * @param {string} monString 
 * @returns .value = name directly
 */
const parseName = (monString) => helperSearchAndError(regex.searchForName,monString,true,true,`Couldn't find monster name based on lack of "CREATURE #" in first line`)
/**
 * 
 * @param {string} monString 
 * @returns .value (as string) = level directly
 */
const parseLevel = (monString) => helperSearchAndError(regex.searchForLevel,monString,true,true,"Couldn't find level after CREATURE")
/**
 * 
 * @param {string} monString 
 * @returns .value = traits array directly (but includes rarity, size and alignment traits still)
 */
const parseTraits = (monString) => {
    const result = helperSearchAndError(regex.searchForTraits,monString,true,false,`Couldn't find traits after level line`)
    const traitString = result?.value?.[1]
    return result?.match ? {match: result.match, value: traitString?.split(/\s+/g).map(trait => {return {traitName: trait.trim()} })} : undefined
}
/**
 * 
 * @param {string} monString 
 * @returns .value = {perceptionMod: "+4", perceptionText?: "Any extra senses"}
 */
const parsePerceptionAndSenses = (monString) => helperSearchAndError(regex.searchForPerceptionAndSenses,monString,true,false,`Couldn't find Perception data`,2,perceptionArr => {
    let out = {perceptionMod: perceptionArr[1] }
    if (perceptionArr?.[2]) out.perceptionText = perceptionArr?.[2]?.replace(/\s*\n\s*/g," ").trim()
    return out
})
/**
 * 
 * @param {string} monString 
 * @returns .value = languages list
 */
const parseLanguages = (monString) => helperSearchAndError(regex.searchForLanguages,monString,false,false,undefined,1,languageList => languageList.replace(/\s*\n\s*/g," ").trim())
/**
 * 
 * @param {string} monString 
 * @returns .value = skills array directly
 */
const parseSkills = (monString) => helperSearchAndError(regex.searchForSkills,monString,false,false,undefined,1,skillStr => skillStr.trim().replace(/\s*\n\s*/g," ").split(',').map(skill => {
    const skillMatch = skill.match(/(\w+) (\+\d+)\s*(?:\((.+)\))?\s*/)
    if(!skillMatch) console.log("Bad skill?",skill)
    if(skillMatch?.[3]) return {name: skillMatch[1], mod: skillMatch[2], skillDetails: skillMatch[3]}
    else return {name: skillMatch[1], mod: skillMatch[2]}
}))
/**
 * 
 * @param {string} monString 
 * @returns .value = {str: , dex:, con:, int:, wis:, cha: }
 */
const parseAttributes = (monString) => {
    const result = helperSearchAndError(regex.searchForAttributes,monString,true,false,`Couldn't find creature attributes (i.e. Str +4, Dex +3) -- expecting them to be comma separated on a single line`,6)
    return {match: result.match, value: {str: result.value[1], dex: result.value[2], con: result.value[3], int: result.value[4], wis: result.value[5], cha: result.value[6]}}
}
/**
 * 
 * @param {string} monString 
 * @returns Could be undefined; otherwise return array of items [ {name: , itemDetails?: } ]
 */
const parseItems = (monString) => helperSearchAndError(regex.searchForItems,monString,false,false,"Couldn't find items",1,itemsString => {
    return itemsString.split(/,\s+(?![^\(]+\))/g)
        .map(itemStr => {
            let itemMatch = itemStr.match( /(.+)\s*?(\(.+\))?/ )
            let out = { name: itemMatch[1]}
            if(itemMatch?.[2]) out.itemDetails = itemMatch[2]
            return out
        })
})

/**
 * 
 * @param {string} monString 
 * @returns could be undefined; otherwise returns .value = array of abilities, properly formatted
 */
const parseInteractionAbilities = (monString) => abstractAbilitySearch(regex.searchForInteractionAbilities, monString)

/**
 * 
 * @param {string} monString 
 * @returns .value = {AC: , ACDetails?: }
 */
const parseAC = (monString) => helperSearchAndError(regex.searchForAC, monString, true, false, "Couldn't find AC value",2,valArr => {

    let out = {AC: valArr[1] }
    if(valArr[2]) out.ACDetails = valArr[2].replace(/\s*\n\s*/g," ")
    return out
})

/**
 * 
 * @param {string} monString 
 * @returns .value = {name: Fort, mod: saveDetail?: }
 */
const parseFortitude = (monString) => helperSearchAndError(regex.searchForFort, monString, true, false, "Couldn't find Fort value",2,valArr => {
    let out = {name: "Fort", mod: valArr[1]}
    if(valArr[2] && valArr[2].replace(/\s*\n\s*/g," ").trim() !== "") out.saveDetail = valArr[2].replace(/\s*\n\s*/g," ").trim()
    return out
})
/**
 * 
 * @param {string} monString 
 * @returns .value = {name: Ref, mod: saveDetail?: }
 */
const parseReflex = (monString) => helperSearchAndError(regex.searchForRef, monString, true, false, "Couldn't find Ref value",2,valArr => {
    let out = {name: "Ref", mod: valArr[1]}
    if(valArr[2] && valArr[2].replace(/\s*\n\s*/g," ").trim() !== "") out.saveDetail = valArr[2].replace(/\s*\n\s*/g," ").trim()
    return out
})
/**
 * 
 * @param {string} monString 
 * @returns .value = {name: Will, mod: saveDetail?: }
 */
const parseWill = (monString) => helperSearchAndError(regex.searchForWill, monString, true, false, "Couldn't find Will value",2,valArr => {
    let out = {name: "Will", mod: valArr[1]}
    if(valArr[2] && valArr[2].replace(/\s*\n\s*/g," ").trim() !== "") out.saveDetail = valArr[2].replace(/\s*\n\s*/g," ").trim()
    return out
})

/**
 * 
 * @param {string} monString 
 * @returns .value = {name: all, saveDetail: }
 */
const parseAllSaveDetail = (monString) => helperSearchAndError(regex.searchForAllSaveDetail, monString, false, false, "Couldn't find All Save Detail value",1,allSaveDetailStr => {return {name: "all", saveDetail: allSaveDetailStr.replace(/\s*\n\s*/," ").trim()}})

/**
 * 
 * @param {string} monString 
 * @returns .value = {HP: , HPDetails?:}
 */
const parseHP = (monString) => helperSearchAndError(regex.searchForHP, monString, true, false, "Couldn't find HP value",2,valArr => {
    let out = {HP: valArr[1] }
    if(valArr[2] && valArr[2].replace(/\s*\n\s*/g," ").trim() !== "") out.HPDetails = valArr[2].replace(/\s*\n\s*/g," ").trim()
    return out
})

/**
 * 
 * @param {string} monString 
 * @returns .value = string of Immunities
 */
const parseImmunities = (monString) => helperSearchAndError(regex.searchForImmunities, monString, false, false, undefined, 1, str => str.replace(/\s*\n\s*/g," ").trim())
/**
 * 
 * @param {string} monString 
 * @returns .value = string of Weaknesses
 */
const parseWeaknesses = (monString) => helperSearchAndError(regex.searchForWeaknesses, monString, false, false, undefined, 1, str => str.replace(/\s*\n\s*/g," ").trim())
/**
 * 
 * @param {string} monString 
 * @returns .value = string of Resistances
 */
const parseResistances = (monString) => helperSearchAndError(regex.searchForResistances, monString, false, false, undefined, 1, str => str.replace(/\s*\n\s*/g," ").trim())

/**
 * 
 * @param {string} monString 
 * @returns could be undefined; otherwise returns .value = array of abilities, properly formatted
 */
const parseDefensiveAbilities = (monString) => abstractAbilitySearch(regex.searchForDefensiveAbilities,monString)
/**
 * 
 * @param {string} monString 
 * @returns .value = {speed: , otherSpeeds?: {}}
 */
const parseSpeed = (monString) => helperSearchAndError(regex.searchForSpeed, monString, true, false, "Couldn't find speed", 1, speedStr => parsingHelper.parseSpeedString(speedStr))

/**
 * 
 * @param {string} monString 
 * @returns .value = [ {name: string, modifier: string, traits: string[], damageRolls: string[], attackEffects: string[] } ]
 */
const parseAttacks = (monString) => helperSearchAndError(regex.searchForStrikes, monString, true, false, "Couldn't find any strikes (lines starting in Melee or Ranged)", 1, strikeStr => {
    const strikeArr = strikeStr.split(/(?=(?:Melee|Ranged))/m).map(s => s.replace(/\s*\n\s*/g," ").trim())
    return strikeArr.map(attack => parsingHelper.parseSingleAttack(attack))
})
/**
 * 
 * @param {string} monString 
 * @returns .value = [ {name: string, isFocus: boolean, isRituals: boolean, numFocusPoints: number, tradition: string, DC: string, attackMod: string, spellCastType: string, spellLevels: { spellLvl: number, level: string, numUses: number, spells: [ {spellName: string, detailText?: string} ] }[] } ]
 */
const parseSpells = (monString) => helperSearchAndError(regex.searchForSpellLists, monString, false, false, "Couldn't find spells", 1, spellListStr => {
    const spellListStringArray = parsingHelper.splitMultipleSpellStringToArray(spellListStr)
    return spellListStringArray.map(spellEntry => parsingHelper.parseSpellEntry(spellEntry))
})

/**
 * 
 * @param {string} monString 
 * @returns could be undefined; otherwise returns .value = array of abilities, properly formatted
 */
const parseOffensiveAbilities = (monString) => abstractAbilitySearch(regex.searchForOffensiveAbilities,monString)

/**
 * 
 * @param {string} monster 
 * @returns JS object of monster strings for each major field in the monster in import_into_fvtt.js format
 */
export const createMonsterStringObject = function(monster, matches = {}){
    const possibleAlignmentTraits = [
        {name: "CG", alignment: "Chaotic Good"},
        {name: "NG", alignment: "Neutral Good"},
        {name: "LG", alignment: "Lawful Good"},
        {name: "CN", alignment: "Chaotic Neutral"},
        {name: "N", alignment: "Neutral"},
        {name: "LN", alignment: "Lawful Neutral"},
        {name: "CE", alignment: "Chaotic Evil"},
        {name: "NE", alignment: "Neutral Evil"},
        {name: "LE", alignment: "Lawful Evil"}
    ]
    const possibleSizeTraits = [
        {name: "TINY", size: "Tiny"},
        {name: "SMALL", size: "Small"},
        {name: "MEDIUM", size: "Medium"},
        {name: "LARGE", size: "Large"},
        {name: "HUGE", size: "Huge"},
        {name: "GARGANTUAN", size: "Gargantuan"},
    ]
    
    const possibleRarityTraits = [
        {name: "UNCOMMON", rarity: "uncommon"},
        {name: "RARE", rarity: "rare"},
        {name: "UNIQUE", rarity: "unique"}
    ]
    
    let out = {}
    out.name = parseName(monster).value.toString().titleCase()
    matches.name = parseName(monster)?.match
    out.level = parseLevel(monster).value
    matches.level = parseLevel(monster)?.match
    matches.traits = parseTraits(monster)?.match
    const fullTraits = parseTraits(monster).value
    out.traits = []
    let foundRarityTrait = false
    for(let i=0;i<fullTraits.length;i++){
        const findMatchingAlignment = possibleAlignmentTraits.find(possibility => fullTraits[i].traitName.toUpperCase() === possibility.name.toUpperCase())
        const findMatchingSize = possibleSizeTraits.find(possibility => fullTraits[i].traitName.toUpperCase() === possibility.name.toUpperCase())
        const findMatchingRarity = possibleRarityTraits.find(possibility => fullTraits[i].traitName.toUpperCase() === possibility.name.toUpperCase())
        if(findMatchingAlignment){
            out.alignment = findMatchingAlignment.alignment
        } else if (findMatchingSize){
            out.size = findMatchingSize.size
        } else if (findMatchingRarity){
            out.rarity = findMatchingRarity.rarity
            foundRarityTrait = true
        } else {
            out.traits.push(fullTraits[i])
        }
    }
    if(!foundRarityTrait) out.rarity = "common"
    
    const perceptionMatch = parsePerceptionAndSenses(monster)
    out.perceptionMod = perceptionMatch.value.perceptionMod
    matches.perception = perceptionMatch?.match
    if(perceptionMatch.value.perceptionText) out.perceptionText = perceptionMatch.value.perceptionText

    const languagesMatch = parseLanguages(monster)
    if(languagesMatch) out.languagesList = languagesMatch.value
    matches.languages = languagesMatch?.match

    const skillsMatch = parseSkills(monster)
    out.skills = skillsMatch.value
    matches.skills = skillsMatch?.match

    const attributesMatch = parseAttributes(monster)
    out.attributes = attributesMatch.value
    matches.attributes = attributesMatch?.match

    const itemsMatch = parseItems(monster)
    if(itemsMatch?.value) out.items = itemsMatch.value
    matches.items = itemsMatch?.match

    const interactionAbilitiesMatch = parseInteractionAbilities(monster)
    if(interactionAbilitiesMatch) out.interactionAbilities = interactionAbilitiesMatch.value
    matches.interactionAbilities = interactionAbilitiesMatch?.match

    const ACMatch = parseAC(monster)
    out.AC = ACMatch.value.AC
    if(ACMatch.value.ACDetails) out.ACDetails = ACMatch.value.ACDetails
    matches.AC = ACMatch?.match

    const fortMatch = parseFortitude(monster)
    matches.Fort = fortMatch?.match
    const refMatch = parseReflex(monster)
    matches.Ref = refMatch?.match
    const willMatch = parseWill(monster)
    matches.Will = willMatch?.match
    const allSavesMatch = parseAllSaveDetail(monster)
    matches.allSaves = allSavesMatch?.match
    out.saves = [fortMatch.value, refMatch.value, willMatch.value]
    if(allSavesMatch?.value) out.saves.push(allSavesMatch.value)

    const immunitiesMatch = parseImmunities(monster)
    const resistancesMatch = parseResistances(monster)
    const weaknessesMatch = parseWeaknesses(monster)
    if(immunitiesMatch) out.immunities = immunitiesMatch.value
    if(resistancesMatch) out.resistances = resistancesMatch.value
    if(weaknessesMatch) out.weaknesses = weaknessesMatch.value
    matches.immunities = immunitiesMatch?.match
    matches.resistances = resistancesMatch?.match
    matches.weaknesses = weaknessesMatch?.match

    const HPMatch = parseHP(monster)
    out.HP = HPMatch.value.HP
    if(HPMatch.value.HPDetails) out.HPDetails = HPMatch.value.HPDetails
    matches.HP = HPMatch?.match

    const defensiveAbilitiesMatch = parseDefensiveAbilities(monster)
    if(defensiveAbilitiesMatch?.value) out.defensiveAbilities = defensiveAbilitiesMatch.value
    matches.defensiveAbilities = defensiveAbilitiesMatch?.match

    const speedMatch = parseSpeed(monster)
    if(speedMatch.value.speed) out.speed = speedMatch.value.speed
    if(speedMatch.value.otherSpeeds) out.otherSpeeds = speedMatch.value.otherSpeeds
    matches.speed = speedMatch?.match

    const attackMatch = parseAttacks(monster)
    out.attackActions = attackMatch.value
    matches.attacks = attackMatch?.match


    const spellMatch = parseSpells(monster)
    if(spellMatch?.value) out.spellAbilities = spellMatch.value
    matches.spells = spellMatch?.match

    const offensiveAbilitiesMatch = parseOffensiveAbilities(monster)
    if(offensiveAbilitiesMatch?.value) out.offensiveAbilities = offensiveAbilitiesMatch.value
    matches.offensiveAbilities = offensiveAbilitiesMatch?.match

    return out
}