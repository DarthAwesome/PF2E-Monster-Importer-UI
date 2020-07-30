export { parse }

const parseAttribute = function(str){
	return str.match(/[\+-]\d+/g)[0];
}

const parseAbility = function(arr){
	return arr.map(abilityStr => {
		let match = abilityStr.match(/(\w+)([\S\s]+)/i);
		let ability = {name: match[1]};
		let traitsMatch = match[2] && match[2].match(/\(((?:\w+(?:, )?)+)\)/i);
		if(traitsMatch){
			ability.traits = traitsMatch[1].split(',').map(s => s.trim());
			ability.actionText = match[2].replace(traitsMatch[0],'').trim();
		}
		else{
			ability.actionText = match[2].trim();
		}
		if(ability.actionText){
			let ld = ability.actionText.toLowerCase();
			let actionCosts = [
				{1: ['single action', 'single-action', 'one-action']}, 
				{2: ['two action', 'two-action']}, 
				{3: ['three action', 'three-actions']},
				{freeAction: ['free action', 'free-action']},
				{reaction: ['reaction']}
			];
			let actionCostObj = actionCosts.find(costObj => 
						costObj[Object.keys(costObj)[0]]
							.some(search => ld.includes(search)));
			if(actionCostObj) ability.actionCost = Object.keys(actionCostObj)[0];
			else ability.actionCost = 'passive';
		}
		return ability;
	});
}

const parseAttack = function(arr){
	return arr.map(attackStr => {
		const damageIndex = attackStr.indexOf(', Damage');
		const effectIndex = attackStr.indexOf(', Effect');
		const weaponAttackString = attackStr.slice(0, damageIndex !== -1 ? damageIndex : effectIndex);
		const wepAtkRegEx = /(?:(?:Melee|Ranged) *)?(.+) ([\+-]\d+)(?: \((.+)\))*/gi;
		let wepAtkMatch = wepAtkRegEx.exec(weaponAttackString);

		const weaponName = wepAtkMatch[1];
		const weaponMod = wepAtkMatch[2];
        let wepTraits = wepAtkMatch[3];
        let wepTraitsArr
		if(wepTraits) wepTraitsArr = wepTraits.split(',').map(s => s.trim());
		const damageString = attackStr.slice((damageIndex !== -1 ? damageIndex+8 : effectIndex+8)).replace(/"/g,'').replace(/\n/g,'').trim();
		const dmgRegEx = / ?plus ?|, ?| ?and ?/g;
		const damageArray = damageString.split(dmgRegEx);
		let processedDmgArray = [];
        let attackEffects = [];
        for (let dmgIndx=0; dmgIndx < damageArray.length; dmgIndx++){
            if(damageArray[dmgIndx].length!==''){
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
			'attackEffects': attackEffects
		}
		return attackAction;
	});
}

const parseSpells = function(arr){
	const parseSpellEntry = function(spellEntryStr){
		const lstr = spellEntryStr.toLowerCase();
		let tradition = ['arcane','primal','divine','occult'].find(t => lstr.match(/\w+/i)[0].includes(t));
		let spellCastType = ['spontaneous','innate','prepared'].find(t => lstr.includes(`${t} spells`));
		if(!spellCastType){
			if(lstr.includes('focus point')) spellCastType = 'focus';
			else if(lstr.includes('ritual')) spellCastType = 'ritual';
			else spellCastType = 'innate';
		}
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
		let spellListRegEx = /(1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th|Cantrips \(1st\)|Cantrips \(2nd\)|Cantrips \(3rd\)|Cantrips \(4th\)|Cantrips \(5th\)|Cantrips \(6th\)|Cantrips \(7th\)|Cantrips \(8th\)|Cantrips \(9th\)|Cantrips \(10th\))(?:[\s]+\((\d+)[\s]+slots\))?([^;]+)/gi;
		let spellsArr = Array.from(spellList.matchAll(spellListRegEx)).map(arr => {
							let [,spellLvlStr,numSlots,spellListStr] = [...arr]; 
							let spells = spellListStr.split(',').map(s => s.replace(/\n/g," ").trim()).filter(s => s!=="")
							if(numSlots === undefined){
								numSlots = spells.length
							}
							const spellLvlObj = spellLevels.find(s => spellLvlStr.toLowerCase().includes(s.key));
							let spellLvl = (spellLvlObj?.value) ?? 0;
							if(spellListStr.toLowerCase().includes('focus point')) spellLvl = 11;
							return {
								spellLvl: spellLvl,
								spellLvlString: spellLvlStr,
								numberSpellSlotsThisSpellLvl: numSlots,
								spells: spells,
							}
						});
		if(constantSpellList){
			let constSpellListRegEx = /(\(1st\)|\(2nd\)|\(3rd\)|\(4th\)|\(5th\)|\(6th\)|\(7th\)|\(8th\)|\(9th\)|\(10th\)|Constant \(1st\)|Constant \(2nd\)|Constant \(3rd\)|Constant \(4th\)|Constant \(5th\)|Constant \(6th\)|Constant \(7th\)|Constant \(8th\)|Constant \(9th\)|Constant \(10th\))([^\(;]+)/gi;
			spellsArr = spellsArr.concat(Array.from(constantSpellList.matchAll(constSpellListRegEx)).map(arr => {
								let [,spellLvlStr,spellListStr] = [...arr]; 
								let spells = spellListStr.split(',').map(s => s.replace(/\n/g," ").trim()).filter(s => s!=="")
								let numSlots = spells.length
								const spellLvlObj = spellLevels.find(s => spellLvlStr.toLowerCase().includes(s.key));
								let spellLvl = (spellLvlObj?.value) ?? 0;
								if(spellListStr.toLowerCase().includes('focus point')) spellLvl = 11;
								return {
									spellLvl: spellLvl,
									spellLvlString: spellLvlStr,
									numberSpellSlotsThisSpellLvl: numSlots,
									spells: spells
								}
							}))
		}

		if(spellsArr.length === 0 && spellCastType === 'ritual'){
			spellsArr = ['ritual','Ritual',undefined, spellList.split(',').map(s => s.trim()).filter(s => s!==""), false];
		}
		return {originalStr: spellEntryStr, tradition: tradition, DC: dc, attackMod: attackMod, spellCastType: spellCastType, spells: spellsArr};
	}
	return arr.map(entry => parseSpellEntry(entry));
}

const parse = {
	name: function(str){ return str.trim();},
	level: function(str){
		return Number(str.match(/\d+/g));
	},
	traits: function(str){
		return str.match(/\w+/g);
	},
	perception: function(str){
		let match = str.match(/\+(\d+)(?:; ?(.+))*/i);
		return [match[1], match[2]];
	},
	languages: function(str){
		return str.match(/(?:Languages )?(?:(.+),?)+/i)[1];
	},
	skills: function(str){
		return [...str.matchAll(/(?:Skills )?(?:(\w+) \+(\d+)(?: \((.+)\))?,?)+/gi)]
				.map(arr => {
					let skill = {
						name: arr[1], 
						mod: arr[2]}; 
						if(arr[3]) skill.skillDetails = arr[3]; 
						return skill 
						}
					)
	},
	str: parseAttribute,
	dex: parseAttribute,
	con: parseAttribute,
	int: parseAttribute,
	wis: parseAttribute,
	cha: parseAttribute,
	items: function(str){
		return str.match(/(?:Items )?(.+),?/i)[1].split(',').map(a => a.trim())
	},
	interactionAbilities: parseAbility,
	defensiveAbilities: parseAbility,
	offensiveAbilities: parseAbility,
	ac: function(str){
		let match = str.match(/(?:AC )(\d+)(?:.+(\(.+\)))?/i);
		return [match[1], match[2]];
	},
	fortitude: function(str){
		let match = str.match(/(?:Fort )?(\+\d+)(?:.+(\(.+\)))?/i);
		return [match[1], match[2]];
	},
	reflex: function(str){
		let match = str.match(/(?:Ref )?(\+\d+)(?:.+(\(.+\)))?/i);
		return [match[1], match[2]];
	},
	will: function(str){
		let match = str.match(/(?:Will )?(\+\d+)(?:(?![:;]) (\(.+?\)))?(?:[:;](.+))?/i);
		return [match[1], match[2], match[3]];
	},
	hp: function(str){
		let match = str.match(/(?:HP )?(\d+)(?:[, \(])+([^\(\n\r\)]+)\)?/i);
		return [match[1], match[2]];
	},
	immunities: function(str){
		let match = str.match(/(?:Immunities )?([^;\n\r]+)/i);
		return match[1];
	},
	resistances: function(str){
		let match = str.match(/(?:Resistances )?([^;\n\r]+)/i);
		return match[1];
	},
	weaknesses: function(str){
		let match = str.match(/(?:Weaknesses )?([^;\n\r]+)/i);
		return match[1];
	},
	speed: function(str){
		let match = str.match(/(?:Speed )?(\d+) \w+(?:[,;] (.+))*/i);
		return [match[1], match[2]];
	},
	melee: parseAttack,
	ranged: parseAttack,
	spells: parseSpells
}