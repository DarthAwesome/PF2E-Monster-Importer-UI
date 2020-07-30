const commonMonsterAbilityNameRegex = "^All-Around Vision|^Aquatic Ambush|^Attack of Opportunity|^At-Will Spells|^Aura|^Buck|^Catch Rock|^Change Shape|^Constant Spells|^Constrict|^Coven|^Darkvision|^Disease|^Engulf|^Fast Healing|^Ferocity|^Frightful Presence|^Grab|^Greater Constrict|^Improved Grab|^Improved Knockdown|^Improved Push|^Knockdown|^Lifesense|^Light Blindness|^Low-Light Vision|^Negative Healing|^Poison|^Push|^Regeneration|^Rend|^Retributive Strike|^Scent|^Shield Block|^Sneak Attack|^Swallow Whole|^Swarm Mind|^Telepathy|^Throw Rock|^Trample|^Tremorsense|^Wavesense"

/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = name
 */
export const searchForName = function(monsterStr){
    let match = monsterStr.match(/^\s*(.+)\s+(?=(?:CREATURE|creature) \d+)/i)
    return match
}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = level
 */
export const searchForLevel = function(monsterStr){
    let match = monsterStr.match(/\sCREATURE (\d+)/i)
    return match
}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = Traits
 */
export const searchForTraits = function(monsterStr){
    let match = monsterStr.match(/(?<=CREATURE \d+.*\s*\n)([\s\S]+?)\s(?=(?:Recall Knowledge)|(?:Perception))/i)
    return match
}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = Perception score; matchArray[2] = other senses
 */
export const searchForPerceptionAndSenses = function(monsterStr){
    let match = monsterStr.match(/Perception (\+\d+)(?:; )?([\s\S]+?)(?=Languages|Skills)/i)
    return match

}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = Comma separated languages string
 */
export const searchForLanguages = function(monsterStr){
    let match = monsterStr.match(/Languages ([\s\S]+?)(?=Skills|Str)/i)
    return match
}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = Comma separated skills list; likely needs to have line returns
 * replaced with spaces
 */
export const searchForSkills = function(monsterStr){
    let match = monsterStr.match(/Skills ([\s\S]+?)(?=Str)/i)
    return match
}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = str, matchArray[2] = dex, matchArray[3] = con, 
 * matchArray[4] = int, matchArray[5] = wis, matchArray[6] = cha
 */
export const searchForAttributes = function(monsterStr){
    let match = monsterStr.replace('–','-')
        .match(/Str\s((?:\+|-|–)\d+),\sDex\s((?:\+|-|–)\d+),\sCon\s((?:\+|-|–)\d+),\sInt\s((?:\+|-|–)\d+),\sWis\s((?:\+|-|–)\d+),\sCha\s((?:\+|-|–)\d+)/i)
    return match
}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = Item separated list
 */
//Limitation: must be on one line -- no other way to differentiate these from interactionAbilities
export const searchForItems = function(monsterStr){
    let match = monsterStr.match(/^Items (.+)/mi)
    return match
}

/**
 * This searches for Interaction abilities specifically that have a line of Items before it. Should be checked before
 * searchForInteractionAbilitiesWithoutItems because that would include Items in the result.
 * 
 * I couldn't figure out how to make the Items group be optional without regex including it in the capture group,
 * hence the two functions
 * Limitation: Items must be on one line -- should implement something in the UI to highlight
 * @param {string} monsterStr 
 * @returns matchArray[1] = Interaction Abilities
 */
export const searchForInteractionAbilitiesAfterItems = function(monsterStr){
    let match = monsterStr.match(/(?<=^Items .+\s*)\n([\s\S]+?)(?=^AC \d+)/mi)
    return match
}
/**
 * This searches for Interaction abilities specifically assuming that they DO NOT HAVE an items. Should be checked
 * only after searchForInteractionAbilitiesAfterItems to avoid including Items in the result.
 * 
 * I couldn't figure out how to make the Items group be optional without regex including it in the capture group,
 * hence the two functions
 * @param {string} monsterStr 
 * @returns matchArray[1] = Interaction Abilities
 */
export const searchForInteractionAbilitiesWithoutItems = function(monsterStr){
    let match = monsterStr.match(/(?<=Cha \+\d+\s*?)\n((?!Items )[\s\S]+?)(?=^AC \d+)/mi)
    return match
}
/**
 * This searches for Interaction abilities specifically assuming that any Items (if defined) are all on ONE line.
 * If Items span multiple lines it ends up in this regex.
 * @param {string} monsterStr 
 * @returns matchArray[1] = Interaction Abilities
 */
export const searchForInteractionAbilities = function(monsterStr){
    return searchForInteractionAbilitiesAfterItems(monsterStr) || searchForInteractionAbilitiesWithoutItems(monsterStr)
}

/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = AC, matchArray[2] = AC details
 */
export const searchForAC = function(monsterStr){
    let match = monsterStr.match(/^AC (\d+)(?:\s+(.+))?(?=[;,] Fort \+\d+)/mi)
    return match
}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = Fort, matchArray[2] = Fort details
 */
export const searchForFort = function(monsterStr){
    let match = monsterStr.match(/^(?:AC \d+.+)Fort\s(\+\d+)(?:\s+([\s\S]+?))?(?=[;,]\sRef\s\+\d+)/mi)
    return match
}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = Reflex, matchArray[2] = Reflex details
 */
export const searchForRef = function(monsterStr){
    let match = monsterStr.match(/^(?:AC \d+.+)Ref\s(\+\d+)(?:\s+([\s\S]+?))?(?=[;,]\sWill\s\+\d+)/mi)
    return match}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = Will, matchArray[2] = Will details
 */
export const searchForWill = function(monsterStr){
    let match = monsterStr.match(/^(?:AC \d+.+)Will\s(\+\d+)(\s+[\s\S]*?)?(?=;|HP)/mi)
    return match}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = All save details
 */
export const searchForAllSaveDetail = function(monsterStr){
    let match = monsterStr.match(/^(?:AC\s\d+.+)Will\s\+\d+.*?[;,]\s([\s\S]+?)^HP \d+/mi)
    return match}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = HP, matchArray[2] = HP details
 */
export const searchForHP = function(monsterStr){
    let match = monsterStr.match(/^HP (\d+)(?:[,;]\s+(?!Immunities|Weaknesses|Resistances)([\s\S]+?))?(?=[;\n])/mi)
    return match
}

/**
 * Probably need to have at least two line returns in a row after Immunities/Resistances/Weaknesses otherwise
 * it'll merge into the Defensive abilities. Do our best effort though to stop the regex at Speed, any line with
 * a period in it for punctuation, any line with a DC listed, or any of the common monster abilities from Bestiary
 * @param {string} monsterStr 
 * @returns matchArray[1] = Immunities
 */
export const searchForImmunities = function(monsterStr){

    const regex = new RegExp(`^HP \\d+.*;\\sImmunities ([\\s\\S]+?)(?=;|\\n\\n|^Speed|.+\\.|.*DC  \\d+|${commonMonsterAbilityNameRegex})`,'mi')
    let match = monsterStr.match(regex)
    return match
}
/**
 * Probably need to have at least two line returns in a row after Immunities/Resistances/Weaknesses otherwise
 * it'll merge into the Defensive abilities. Do our best effort though to stop the regex at Speed, any line with
 * a period in it for punctuation, any line with a DC listed, or any of the common monster abilities from Bestiary
 * @param {string} monsterStr 
 * @returns matchArray[1] = Weaknesses
 */
export const searchForWeaknesses = function(monsterStr){
    const regex = new RegExp(`^HP \\d+[\\s\\S]+?;\\sWeaknesses ([\\s\\S]+?)(?=;|\\n\\n|^Speed|.+\\.|.*DC  \\d+|${commonMonsterAbilityNameRegex})`,'mi')
    let match = monsterStr.match(regex)
    return match
}
/**
 * Probably need to have at least two line returns in a row after Immunities/Resistances/Weaknesses otherwise
 * it'll merge into the Defensive abilities. Do our best effort though to stop the regex at Speed, any line with
 * a period in it for punctuation, any line with a DC listed, or any of the common monster abilities from Bestiary
 * @param {string} monsterStr 
 * @returns matchArray[1] = Resistances
 */
export const searchForResistances = function(monsterStr){
    const regex = new RegExp(`^HP \\d+[\\s\\S]+?;\\sResistances ([\\s\\S]+?)(?=\\n\\n|^Speed|.+\\.|.*DC  \\d+|${commonMonsterAbilityNameRegex})`,'mi')
    let match = monsterStr.match(regex)
    return match
}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = Defensive Abilities
 */
export const searchForDefensiveAbilities = function(monsterStr){
    const regex = new RegExp(/(?<=^HP \d+[\s\S]+?(?:;\sImmunities [\s\S]+?)?(?:;\sWeaknesses [\s\S]+?)?(?:;\sResistances [\s\S]+?)?\n+)(^[A-Z][\s\S]+?)\n^Speed/m)
    let match = monsterStr.match(regex)
    return match
}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = Speed (all of them in one string)
 */
export const searchForSpeed = function(monsterStr){
    const regex = new RegExp(/^Speed (.+)/im)
    let match = monsterStr.match(regex)
    return match
}
/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = All melee/ranged strikes
 */
export const searchForStrikes = function(monsterStr){
    const regex = new RegExp(/((?:(?:^Melee|^Ranged)[\s\S]+?)+)(?<!plus)\n(?=^[A-Z](?!elee|anged|amage))/m)
    let match = `${monsterStr}\nD`.match(regex)
    if(match && match[0]){
        match[0] = match[0].substring(0,match[0].length-2)
    } 
    return match

}

/**
 * @param {string} monsterStr 
 * @returns matchArray[1] = Spell list.
 * If first offensive ability does not have a number of actions listed or a common
 * monster ability from Bestiary appendix then it needs an extra newline before the
 * offensive abilities
 */
export const searchForSpellLists = function(monsterStr){
    const regex = new RegExp(`(?:((?:^Rituals|^[A-Z].+(?:Spells|Rituals))[\\s\\S]+?))\\n(?:\\n|^[A-Z].+(?:one|two|three)-actions?]|${commonMonsterAbilityNameRegex})+(?!(\\n*^[A-Z].+(?:Spells|Rituals)[\\s\\S]+?))`,'m')
    let match = `${monsterStr}\n\n\n`.match(regex)
    return match
}

/**
 * 
 * @param {string} monsterStr 
 * @returns matchArray[1] = Offensive abilities
 * @throws Error if we couldn't find any spells OR any strikes in this monster string
 */
export const searchForOffensiveAbilities = function(monsterStr){
    const before = searchForSpellLists(monsterStr) || searchForStrikes(monsterStr)
    if(!before){
        throw new Error("Invalid monster? Couldn't find any spells or strikes to split the entry and find offensive abilities.")
    }
    const indexOfPreviousSection = monsterStr.trim().lastIndexOf(before[1])+before[1].length
    const remainingString = monsterStr.trim().substring(indexOfPreviousSection)
    if(remainingString.length === 0) return null
    return remainingString.match(/([\s\S]+)/im)
}