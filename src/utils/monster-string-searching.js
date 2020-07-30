export {splitMonsterString}

const traitsSearch = function(strSource, indicesObj){
    let lvlAndTraits = strSource.substring(indicesObj.level, indicesObj.perception);
    let match = lvlAndTraits.match(/\d+/i);
    let traits = lvlAndTraits.substring(match.index + match[0].length).trim();
    indicesObj.traits = strSource.indexOf(traits);
    return indicesObj;
}

const abilitiesSearch = function(strMonster, indexBeforeAbil, indexAfterAbil, abilityType, indicesObj){
	indicesObj[abilityType] = strMonster.substring(strMonster.indexOf('\n',indexBeforeAbil),indexAfterAbil).trim()
		.match(/((?:.+\n?)+)\n?/g)
		.map(s => strMonster.indexOf(s));
	return indicesObj;
}

// const lineAtIndex = function(str, index){
// 	let nextLine = str.indexOf('\n',index);
// 	if(nextLine !== -1)
// 		return str.substring(index,nextLine);
// 	return str.substring(index);
// }

const splitMonsterString = function(strMonster){
	let sm = strMonster.toLowerCase();
	let lastSearchIndex = 0;
	let lastSearch = "";
	const stringSearch = function(strTarget, strSource, indicesObj, overrideTargetKey = undefined, targetIsArray = false){
		const index = strSource.indexOf(strTarget);
		const targetKey = overrideTargetKey || strTarget;
		if(index !== -1){
			if(targetIsArray)
				indicesObj[targetKey].push(index+lastSearchIndex+lastSearch.length);
			else
				indicesObj[targetKey] = index+lastSearchIndex+lastSearch.length;
			lastSearchIndex = index+lastSearchIndex+lastSearch.length;
			lastSearch = strTarget;
			return [strSource.substring(index+strTarget.length), indicesObj];
		}
		return [strSource, indicesObj];
	}

	let indices = {
		name: 0
	};
	[sm, indices] = stringSearch('creature',sm,indices,'level');
	[sm, indices] = stringSearch('perception',sm,indices);
	[sm, indices] = stringSearch('languages',sm,indices);
	[sm, indices] = stringSearch('skills',sm,indices);
	[sm, indices] = stringSearch('str',sm,indices);
	[sm, indices] = stringSearch('dex',sm,indices);
	[sm, indices] = stringSearch('con',sm,indices);
	[sm, indices] = stringSearch('int',sm,indices);
	[sm, indices] = stringSearch('wis',sm,indices);
	[sm, indices] = stringSearch('cha',sm,indices);
	[sm, indices] = stringSearch('items',sm,indices);
	[sm, indices] = stringSearch('ac',sm,indices);
	[sm, indices] = stringSearch('fort',sm,indices,'fortitude');
	[sm, indices] = stringSearch('ref',sm,indices,'reflex');
	[sm, indices] = stringSearch('will',sm,indices);
	[sm, indices] = stringSearch('hp',sm,indices);
	[sm, indices] = stringSearch('immunities',sm,indices);
	[sm, indices] = stringSearch('weaknesses',sm,indices);
	[sm, indices] = stringSearch('resistances',sm,indices);
	[sm, indices] = stringSearch('speed',sm,indices);

	let meleeI = 0;
	while(sm.indexOf('melee') !== -1){
		if(!indices.melee) indices.melee = [];
		[sm, indices] = stringSearch('melee',sm,indices,'melee', true);
		meleeI++;
	}
	let rangedI = 0;
	while(sm.indexOf('ranged') !== -1){
		if(!indices.ranged) indices.ranged = [];
		[sm, indices] = stringSearch('ranged',sm,indices,'ranged', true);
		rangedI++;
	}

    let spellMatch = sm.match(/(.+spells|rituals) (DC|attack)/i);
	while(spellMatch){
		if(!indices.spells) indices.spells = [];
		const index = spellMatch.index;
		indices.spells.push(index+lastSearchIndex+lastSearch.length);
		lastSearchIndex = index+lastSearchIndex+lastSearch.length;
		lastSearch = spellMatch[1];
		[sm, indices] = [sm.substring(spellMatch[1].length+index), indices];
		spellMatch = sm.match(/(.+spells|.+rituals) (DC|attack)/i);
	}

	indices = traitsSearch(strMonster.toLowerCase(), indices);

	//Interaction Abilities
	indices = abilitiesSearch(strMonster, indices.items || indices.cha, indices.ac, 'interactionAbilities', indices);

	//Defensive Abilities
	indices = abilitiesSearch(strMonster, indices.resistances || indices.weaknesses || indices.immunities || indices.hp, indices.speed, 'defensiveAbilities', indices);

	//Offensive Abilities
	indices = abilitiesSearch(strMonster, (indices.spells && indices.spells.reduce((acc, curr) => curr > acc ? curr : acc, 0)) || 
		(indices.ranged && indices.ranged.reduce((acc, curr) => curr > acc ? curr : acc, 0)) ||
		(indices.melee && indices.melee.reduce((acc, curr) => curr > acc ? curr : acc, 0)) ||
		indices.speed, strMonster.length, 'offensiveAbilities', indices);

	let arrIndices = [];
	Object.keys(indices).forEach(key => arrIndices.push({key: key, index: indices[key]}));
	// @ts-ignore
	arrIndices = arrIndices.flat().sort(
		(a,b) => {
			let aN = Array.isArray(a.index) ? a.index[0] : a.index;
			let bN = Array.isArray(b.index) ? b.index[0] : b.index;
			return (aN <= bN ? -1 : 1);
			});

	const rawStrings = splitToStringArray(strMonster,arrIndices)
	arrIndices = attachRawStringsToIndicesArray(rawStrings,arrIndices)
	return arrIndices;

}

/**
 * 
 * @param {string} originalString The original string to be split up
 * @param {object[]} arrIndices An array of indices within the string to split against. Index located at object.index
 * @returns String array split up into arrIndices.length # of elements
 */
export const splitToStringArray = function(originalString, arrIndices){
	let output = []
	if(!Array.isArray(arrIndices) || arrIndices.length === 0) arrIndices = [{key: 'name', index: 0}, {index: originalString.length}]
	if(arrIndices[arrIndices.length-1].index !== originalString.length) arrIndices = [...arrIndices, {index: originalString.length}]
	for(let i=0; i<arrIndices.length-1; i++){
		// output.push(originalString.substring(arrIndices[i].index,arrIndices[i+1].index))
		let thisIndex = arrIndices[i].index
		if(Array.isArray(arrIndices[i].index)){
			let currentArray = arrIndices[i].index
			let k
			for(k=0;k<currentArray.length-1;k++){
				output.push(originalString.substring(currentArray[k],currentArray[k+1]))
			}
			thisIndex = currentArray[k]
		}
		let nextIndex = Array.isArray(arrIndices[i+1].index) ? arrIndices[i+1].index[0] : arrIndices[i+1].index
		output.push(originalString.substring(thisIndex,nextIndex))
	}
	return output
}

/**
 * 
 * @param {string[]} rawStrings 
 * @param {object[]} arrIndices 
 * @returns arrIndices with rawStr property added to each element
 */
export const attachRawStringsToIndicesArray = function(rawStrings, arrIndices){
	let i
	let j
	for(i=0,j=0;i<arrIndices.length,j<rawStrings.length;i++,j++){
		if(Array.isArray(arrIndices[i].index)){
			let innerIndexArray = arrIndices[i].index
			let rawStrArr = []
			for(let k=0;k<innerIndexArray.length;k++){
				rawStrArr.push(rawStrings[j])
				if(k<innerIndexArray.length-1){
					j++
				}
			}
			arrIndices[i].rawStr = rawStrArr
		} else {
			arrIndices[i].rawStr = rawStrings[j]
		}
	}
	return arrIndices
}