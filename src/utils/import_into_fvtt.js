
const createPF2eMonsters = function(jsonFile, monsterModuleName="pf2e_updatednpcsheet", monstersPackCollection="world.bestiaryv0506", spellsPackCollection="pf2e.spells-srd"){
		
	let fullPathName = "modules\\pf2e_beastiary1\\importJSON\\"+jsonFile;
	fetch(fullPathName).then(r => r.json()).then(async records => {
        for ( let data of records ) {
			await processMonster(data, monstersPackCollection, spellsPackCollection, monsterModuleName);
        }
	})

};

const importPF2eMonsters = function(monstersPackCollection="world.bestiary-v0530"){
	let monstersPack = game.packs.find(p => p.collection === monstersPackCollection);
	
	game.actors.entities.forEach(async a => {
		await monstersPack.importEntity(a);
		console.log("importing: ", a.name);
	});

};

const embedItems = async function(actor, spells, spellcastingentryOptions, spellcastingType) {
	
	// add spells
	console.log(`PF2E | Create ${spells.length} spell(s) for ${actor.name}: `, spells);
	let createdSpells = await actor.createEmbeddedEntity('OwnedItem', spells, {temporary:false});	

	console.log(`Entry type: ${spellcastingType},  Created spells: `, createdSpells);
	

	if (spellcastingType === "prepared") {
		let preparedObject = {};
		let levelIndex = {};
		createdSpells.forEach(spell => {
			const preparedLevel = spell.data.level.preparedValue ?? spell.data.level.value
			preparedObject[`slot${preparedLevel}`] = preparedObject[`slot${preparedLevel}`] || {"prepared": {}};
			levelIndex[preparedLevel] = levelIndex[preparedLevel] || 0;
			preparedObject[`slot${preparedLevel}`].prepared[levelIndex[preparedLevel]] = {"id": spell._id};
			preparedObject[`slot${preparedLevel}`].max = (levelIndex[preparedLevel] + 1);
			levelIndex[preparedLevel]++
		});
		//console.log("preparedObject: ", preparedObject);
		let updatedSlots = {"slots": {}};
		updatedSlots.slots = preparedObject;
		//console.log("updatedSlots: ", updatedSlots);
		spellcastingentryOptions["data"] = updatedSlots;
		//console.log(`Options: `, spellcastingentryOptions);
		await actor.updateEmbeddedEntity('OwnedItem', spellcastingentryOptions);
	} else {
		//console.log(`Options: `, spellcastingentryOptions);
		await actor.updateEmbeddedEntity('OwnedItem', spellcastingentryOptions);
	}
		
}

/**
 * @param {string} name 
 */
const processNameToImageFilename = function(name){
	return `${name.toLowerCase().replace(/[^a-z0-9]/g,"")}.png`
}

/**
 * @param {string} name 
 */
const processNameToPNGImagePath = function(name){
	const imagePath = "systems\\pf2e\\icons\\bestiary\\"
	return `${imagePath}${processNameToImageFilename(name)}`
}

export const processMonster = async function(currentMonster, monstersPackCollection="pf2e_beastiary1.beastiary1", spellsPackCollection="pf2e.spells-srd", monsterModuleName="pf2e_updatednpcsheet", showMonster=false){
	// let monsterModuleName = monstersPackCollection.split('.')[0];

	console.log("PF2E | CurrentMonster: ", currentMonster);

/* 	if (!monstersPack)
		var monstersPack = await game.packs.find(p => p.collection === monstersPackCollection) */
	if(!spellsPack)
		var spellsPack = game.packs.find(p => p.collection === spellsPackCollection);
	if(!spellsContent)
		var spellsContent = await spellsPack.getContent();

	let tempActor = {};
	let newItems = [];

	tempActor.name = currentMonster.name;
	tempActor.type = 'npc';
	tempActor.flags = {};
	tempActor.flags[monsterModuleName] = {};
	const imagePath = processNameToPNGImagePath(tempActor.name)
	const imgResponse = await fetch(imagePath,{method: 'HEAD'})
	if (imgResponse?.ok){ 
		tempActor.img = `systems/pf2e/icons/bestiary/${processNameToImageFilename(tempActor.name)}`
		// console.log(`PF2E importer | Image set to ${tempActor.img}`)
	}


	let tempData = {};
	tempData.abilities = {};
	tempData.abilities.str = {'mod':currentMonster.attributes.str}; //Number(currentMonster.attributes.str)
	tempData.abilities.con = {'mod':Number(currentMonster.attributes.con)};
	tempData.abilities.wis = {'mod':Number(currentMonster.attributes.wis)};
	tempData.abilities.int = {'mod':Number(currentMonster.attributes.int)};
	tempData.abilities.dex = {'mod':Number(currentMonster.attributes.dex)};
	tempData.abilities.cha = {'mod':Number(currentMonster.attributes.cha)};

	tempData.attributes = {};
	tempData.attributes.hp = {'value':currentMonster.HP,'max':currentMonster.HP};
	if(currentMonster.HPDetails) tempData.attributes.hp.details = currentMonster.HPDetails;
	//tempData.attributes.init = {'value':Number(currentMonster.perceptionMod)};
	tempData.attributes.perception = {'value':Number(currentMonster.perceptionMod)};
	tempData.attributes.speed = {'value':currentMonster.speed};
	if(currentMonster.otherSpeeds){
		tempData.attributes.speed.otherSpeeds = [];
		for (const [type, value] of Object.entries(currentMonster.otherSpeeds)) {
			let tempInstance = {}
			tempInstance["type"] = titleCase(type);
			tempInstance["value"] = value;

			//console.log(`currentMonster.otherSpeeds: `, currentMonster.otherSpeeds);
			//console.log(`tempInstance: `, tempInstance);
			tempData.attributes.speed.otherSpeeds.push(tempInstance);
		}
	}
	tempData.attributes.ac = {'value':currentMonster.AC};
	if(currentMonster.ACDetails) tempData.attributes.ac.details = currentMonster.ACDetails;

	tempData.martial = {simple: { value: 0 }};

	tempData.details = {};
	tempData.details.alignment = {'value':currentMonster.alignment.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')};
	tempData.details.level = {'value':currentMonster.level};
	tempData.details.source = {'value':currentMonster.sourceDoc};
	if(currentMonster.creatureType && currentMonster.creatureType !== '—'){
		tempData.details.creatureType = currentMonster.creatureType;
	}
	if(currentMonster.familyName && currentMonster.familyName !== '—'){
		tempData.details.ancestry = {'value':currentMonster.familyName};
	}

	//Bunch of flavour information to store against the actor
	if(currentMonster.flavorText) tempData.details.flavorText = currentMonster.flavorText;
	if(currentMonster.nethysUrl) tempData.details.nethysUrl = currentMonster.nethysUrl;
	if(currentMonster.recallKnowledgeText) tempData.details.recallKnowledgeText = currentMonster.recallKnowledgeText;
	if(currentMonster.sidebarText) tempData.details.sidebarText = currentMonster.sidebarText;

	tempData.saves = {};
	tempData.saves.fortitude = {'value':Number(currentMonster.saves[0].mod)};
	if(currentMonster.saves[0].saveDetail) tempData.saves.fortitude.saveDetail = currentMonster.saves[0].saveDetail;
	tempData.saves.reflex = {'value':Number(currentMonster.saves[1].mod)};
	if(currentMonster.saves[1].saveDetail) tempData.saves.reflex.saveDetail = currentMonster.saves[1].saveDetail;
	tempData.saves.will = {'value':Number(currentMonster.saves[2].mod)};
	if(currentMonster.saves[2].saveDetail) tempData.saves.will.saveDetail = currentMonster.saves[2].saveDetail;
	if(currentMonster.saves[3]) tempData.attributes["allSaves"] = {'value':currentMonster.saves[3].saveDetail};

	tempData.traits = {};
	//{
		tempData.traits.size = {};
		tempData.traits.size.value = ((size) => {
			switch(currentMonster.size){
				case 'Tiny': return 'tiny';
				case 'Small': return 'sm';
				case 'Medium': return 'med';
				case 'Large': return 'lg';
				case 'Huge': return 'huge';
				case 'Gargantuan': return 'grg';
			}
		})(currentMonster.size);
	//}
	if(currentMonster.traits){
		tempData.traits.traits = {'value': []};
		for(let i=0; i<currentMonster.traits.length;i++){
			tempData.traits.traits.value.push(currentMonster.traits[i].traitName.toLowerCase());
		}
	}

	if (currentMonster.rarity)
		tempData.traits.rarity = {'value':currentMonster.rarity};
	else 
		tempData.traits.rarity = {'value': 'common'};

	//console.log(`Monster size: ${currentMonster.size} Character Sheet Size: ${tempData.traits.size.value}`);
		//Update prototype token size
	let tokenSize = 1;
	switch(currentMonster.size){
		case 'Tiny': 
			tokenSize = 0.75;
			break;
		case 'Small':
			tokenSize = 1;
			break;
		case 'Medium':
			tokenSize = 1;
			break;
		case 'Large':
			tokenSize = 2;
			break;
		case 'Huge':
			tokenSize = 3;
			break;
		case 'Gargantuan':
			tokenSize = 4;
			break;
	}
	tempActor.token = {width: tokenSize, height: tokenSize};

	if(currentMonster.perceptionText) tempData.traits.senses = {'value':currentMonster.perceptionText};
	if(currentMonster.languagesList) tempData.traits.languages = {'value': currentMonster.languagesList.split(/[,;]/g).map((txt)=>txt.trim().toLowerCase()) }
	if(currentMonster.immunities) {
		tempData.traits.di = {"value": []};
		let arrayImmunities = currentMonster.immunities.split(/,\s+(?![^\(]+\))/g)
		let tempInstance = []
		for(let i=0; i < arrayImmunities.length; i++) {			
			tempInstance.push(arrayImmunities[i].trim());			
		}
		tempData.traits.di.value = tempInstance;
	}
	if(currentMonster.resistances) {
		tempData.traits.dr = [];
		let arrayResistances = currentMonster.resistances.split(/,\s+(?![^\(]+\))/g)
		for(let i=0; i < arrayResistances.length; i++) {
			let tempInstance = {}
			let resistanceEntry = arrayResistances[i];
			if (resistanceEntry.includes("(except")) {
				let exceptions = resistanceEntry.trim().slice((resistanceEntry.indexOf("(")+1), resistanceEntry.indexOf(")"));
				tempInstance["exceptions"] = exceptions;
				resistanceEntry = resistanceEntry.slice(0, resistanceEntry.indexOf("(")).concat(resistanceEntry.slice((resistanceEntry.indexOf(")") + 1), resistanceEntry.length));
			}
			const currentItem = resistanceEntry.trim().match(/^(.+?)\s*(\d+)?$/)
			tempInstance.type = currentItem[1] === 'cold iron' ? 'coldiron' : currentItem[1] //TODO: Refactor this to separate function that abstracts unsupported types
			if(currentItem[2] && !isNaN(parseInt(currentItem[2]))){
				tempInstance.value = currentItem[2]
			}
			else{
				tempInstance.value = 0
			}
			tempInstance.label = titleCase(currentItem[1])

			// let arrayInstance = resistanceEntry.trim().split(" ");
			// tempInstance["value"] = (arrayInstance.length > 0) ? arrayInstance[arrayInstance.length -1] : "0";
			// arrayInstance.pop();
			// tempInstance["type"] = arrayInstance.join(" ");
			// tempInstance["label"] = titleCase(arrayInstance.join(" "));
			tempData.traits.dr.push(tempInstance);
		}
	}
	if(currentMonster.weaknesses) {
		tempData.traits.dv = [];
		let arrayWeaknesses = currentMonster.weaknesses.split(/,\s+(?![^\(]+\))/g)
		for(let i=0; i < arrayWeaknesses.length; i++) {
			let tempInstance = {}
			const currentItem = arrayWeaknesses[i].trim().match(/^(.+?)\s*(\d+)?$/)
			
			tempInstance.type = currentItem[1] === 'cold iron' ? 'coldiron' : currentItem[1] //TODO: Refactor this to separate function that abstracts unsupported types
			if(currentItem[2] && !isNaN(parseInt(currentItem[2]))){
				tempInstance.value = currentItem[2]
			}
			tempInstance.label = titleCase(currentItem[1])
			
			tempData.traits.dv.push(tempInstance);
		}
	}
	//Items
	if(currentMonster.items){
		for(let i=0;i<currentMonster.items.length;i++){
			let cItem = currentMonster.items[i];
			if (cItem.itemDetails) {
				cItem.name = `${cItem.name} ${cItem.itemDetails}`;
				//const shieldRegEx = /(\bHardness\b) (\d+), (\bHP\b) (\d+), (\bBT\b) (\d+)/gmi;
				const shieldRegEx = '(\\bHardness\\b) (\\d+), (\\bHP\\b) (\\d+), (\\bBT\\b) (\\d+)';
				if (cItem.itemDetails.match(shieldRegEx)) {	
					//console.log('REGEX MATCH: ', cItem.itemDetails.match(shieldRegEx) )	;	
					tempData.attributes.shield = {};
					tempData.attributes.shield.ac = 2;
					tempData.attributes.shield.value = cItem.itemDetails.match(shieldRegEx)[4];
					tempData.attributes.shield.max = cItem.itemDetails.match(shieldRegEx)[4];
					tempData.attributes.shield.brokenThreshold = cItem.itemDetails.match(shieldRegEx)[6];
					tempData.attributes.shield.hardness = cItem.itemDetails.match(shieldRegEx)[2];
				}
			}
			let oItem = {'name': cItem.name, 'type': 'equipment', 'data':{'description': {'type': "String", "label": "Description", "value": cItem.itemDetails || ""} } };
			//await testActor.createOwnedItem(oItem, {displaySheet: false});
			//await testActor.createEmbeddedEntity('OwnedItem', oItem);
			newItems.push(oItem);
		}
		//await testActor.createManyEmbeddedEntity('OwnedItem', newItems);
	}

	tempActor.data = tempData;
	//console.log("tempActor: ", tempActor);


	let testActor = await Actor.create(tempActor,{'temporary':false, 'displaySheet': false})

	if(currentMonster.spellAbilities){

		for(let i=0; i < currentMonster.spellAbilities.length; i++){
			
			const spellcastingEntry = currentMonster.spellAbilities[i];
			let  magicTradition = "Focus";
			if 		(spellcastingEntry.name.includes("Divine")) magicTradition = "divine"
			else if (spellcastingEntry.name.includes("Primal")) magicTradition = "primal"
			else if (spellcastingEntry.name.includes("Occult")) magicTradition = "occult"
			else if (spellcastingEntry.name.includes("Arcane")) magicTradition = "arcane"
			else if (spellcastingEntry.name.includes("Ritual")) magicTradition = "ritual"

			let  spellcastingType = "Innate";
			if 		(spellcastingEntry.name.includes("Prepared")) spellcastingType = "prepared"
			if 		(spellcastingEntry.name.includes("Spontaneous")) spellcastingType = "spontaneous"

			// Define new spellcasting entry
			const spellcastingData = {
				ability: {
					value: '',
				},
				spelldc: {
					value: spellcastingEntry.attackMod ? parseInt(spellcastingEntry.attackMod) : (spellcastingEntry.DC - 10),
					dc: spellcastingEntry.DC
				},
				tradition: {
					value: magicTradition,
				},
				prepared: {
					value: spellcastingType,
				},
			};

			const data = {
				name: spellcastingEntry.name,
				type: 'spellcastingEntry',
				data: spellcastingData,
			};
			//console.log("spellcastingEntry: ", data);
			//let spellcastingItem = await testActor.createEmbeddedEntity('OwnedItem', data)
			await testActor.createEmbeddedEntity('OwnedItem', data, {temporary:false}).then(async spellcastingItem => {
				
				console.log("spellcastingEntry Return Value: ", spellcastingItem);

				let newSpells = [];
				let updateSpellcastingEntryOptions = {
					_id: spellcastingItem._id,
				};
				let spellsLevelsProcessed = 0;
				await spellcastingEntry.spellLevels.forEach(async spellLevel => {
					// Set the spell slots for each spell level
					let levelNumber = spellLevel.level.includes('Cantrip') ? 0 : spellLevel.level.match(/\d+/g)[0];
					if(spellLevel.detailText && spellLevel.detailText.includes('Focus Point')) levelNumber=11;

					if(spellLevel.numUses){
						const max = `data.slots.slot${levelNumber}.max`;
						const value = `data.slots.slot${levelNumber}.value`;
						updateSpellcastingEntryOptions[max] = spellLevel.numUses;
						updateSpellcastingEntryOptions[value] = spellLevel.numUses;
					}

					
					let spellsProcessed = 0;
					await spellLevel.spells.forEach(async (spell, index, array) => {
						

						// Look in the Compendium for a spell with the same nethysUrl
						let compendiumSpell = await spellsContent.find(s => s.data.data.source.value===spell.nethysUrl);

						
						if (!compendiumSpell) {
							//console.log('Spell name: ', spell.spellName.toUpperCase());
							compendiumSpell = await spellsContent.find(s => s.data.name.toUpperCase() === spell.spellName.toUpperCase());
						}

						if(compendiumSpell){
							// Work out how many times to prepare the spell (i need to revist this)
							let numTimes = 1;
							let moreTimes = undefined;
							if(spell.detailText && (moreTimes=((/\((?:x|×)(\d+)\)/g).exec(spell.detailText)))!==undefined )
								if(moreTimes && moreTimes.length===2) numTimes = parseInt(moreTimes[1],10);

							

							// Import the spell
							//let newSpell = await testActor.importItemFromCollection(spellsPackCollection,compendiumSpell.id, spellcastingItem._id);
							
							const pack = game.packs.find((p) => p.collection === spellsPackCollection);
							
							await pack.getEntity(compendiumSpell.id).then(async (ent) => {
								//console.log(`PF2E | Importing Item ${ent.name} from ${spellsPackCollection} (Prepare this ${numTimes} times)`);
								
								// delete the original compendium item id (a new one will be generated on creation of embedded item)
								delete ent.data._id;
								delete ent.data.permission;
								delete ent.data.sort;
								// delete ent.data.img;
								
								

								// update location to be under the spellcasting entry
								if (ent.type === 'spell') ent.data.data.location = {value: spellcastingItem._id};
								
								// format spell name based on AoN data
								if		(spellLevel.level.includes("Constant")) ent.data.name = `${ent.data.name} (Constant)`
								else if 	(spell.detailText && (numTimes === 1)) ent.data.name = `${ent.data.name} ${spell.detailText}`
								else if 	(levelNumber===11||levelNumber===0) ent.data.name = `${ent.data.name} - ${(levelNumber===11 ? ' Focus (':'')}${spellLevel.level}${(levelNumber===11 ? ')':'')}`

								if(ent.data.data.level.value !== Number(levelNumber)){
									if (spellcastingType === "prepared"){
										ent.data.data.level.preparedValue = parseInt(levelNumber,10);
										console.log(`Saving ${ent.data.name} as level ${ent.data.data.level.preparedValue} - spellcastingType: ${spellcastingType}`)
									}
									else {
										ent.data.data.level.value = levelNumber;
										console.log(`Saving ${ent.data.name} as level ${levelNumber} - spellcastingType: ${spellcastingType}`)
									}
								} 

								newSpells.push(ent.data);
								// if this spell should be prepared multiple times then add it to the newSpells array as required.
								if (numTimes > 1) {
									for (i=1; i < numTimes; i++) {
										newSpells.push(ent.data);
									}
								}
								spellsProcessed++;
								//console.log(`spellsProcessed: ${spellsProcessed}, spellLevel.spells.length: ${spellLevel.spells.length}, newSpells: `, newSpells);
								if(spellsProcessed === spellLevel.spells.length) {
									spellsLevelsProcessed++
									//console.log(`Spell Levels Processed: ${spellsLevelsProcessed}, spellcastingEntry.spellLevels.length: ${spellcastingEntry.spellLevels.length}, newSpells: `, newSpells);
									if(spellsLevelsProcessed === spellcastingEntry.spellLevels.length) {
										await embedItems(testActor, newSpells, updateSpellcastingEntryOptions, spellcastingType);

									}
								}

							});
							
						}
						else {					
							// Need to add a new spell using just the name because it couldn't be found in the compendium
							console.log(`*********** ${testActor.name} - ${spell.spellName} NOT IMPORTED FROM COMPENDIUM *************************`)
							let newSpell = {};
							newSpell.name = spell.spellName 
								+ ((levelNumber===11||levelNumber===0) ? ' - '+spellLevel.level + (levelNumber===11 ? ' level':''):'') 
								+ (spellLevel.level.includes("Constant") ? ' (Constant)':'');
							newSpell.type = 'spell';
							newSpell.data = {level: {value: levelNumber}, location: {value: spellcastingItem._id} };
							
							newSpells.push(newSpell);
							spellsProcessed++;
							//console.log(`spellsProcessed: ${spellsProcessed}, spellLevel.spells.length: ${spellLevel.spells.length}, newSpells: `, newSpells);
							if(spellsProcessed === spellLevel.spells.length) {
								spellsLevelsProcessed++
								if(spellsLevelsProcessed === spellcastingEntry.spellLevels.length) {
									//console.log(`Spell Levels Processed: ${spellsLevelsProcessed}, spellcastingEntry.spellLevels.length: ${spellcastingEntry.spellLevels.length}, newSpells: `, newSpells);
									await embedItems(testActor, newSpells, updateSpellcastingEntryOptions, spellcastingType);
								}
							}
						}						

					});

				});			

			});			
			
		}
	}



	//Attacks
	const processAttack = async function(attack,actor,monsterModuleName="pf2e_updatednpcsheet"){
	
		let newItem = {}
		newItem.name = titleCase(attack.name);
		newItem.type = 'melee';
		newItem.data = {};
		newItem.data.bonus = {'value':Number(attack.modifier), total: Number(attack.modifier) }; //attack.modifier
		newItem.flags = {};
		newItem.flags[monsterModuleName] = {};

		const dmgTxtToObject = function(damageText){
			let damageArray = damageText.split(' ');
			let damageDie = '';
			let damageType = '';
			let finishedNum = false;
			let invDmgRegEx = /[^0123456789d+-]/g;
			for(let i=0;i<damageArray.length;i++){
				if(!damageArray[i].match(invDmgRegEx) && !finishedNum){
					damageDie+= damageArray[i];
				}else{
					finishedNum=true;
					damageType+= damageArray[i];
				}
			}
			//console.log('damageDie',damageDie);
			//console.log('damageType',damageType);
			return {'damage': damageDie.trim(), 'damageType': damageType.trim()};

		}
		if(!(attack.damageRolls && attack.damageRolls.length>0)){
			newItem.data.damage = {};
			newItem.data.damageRolls = [];
		}else{
			let primaryDamage = dmgTxtToObject(attack.damageRolls[0]);
			newItem.data.damage = {
				"die":	primaryDamage.damage,
				"damageType": 	primaryDamage.damageType
			};
			newItem.data.damageRolls = [];

			for(let i=0;attack.damageRolls&&i<attack.damageRolls.length;i++){
				let cDamageRoll = attack.damageRolls[i];
				newItem.data.damageRolls.push(dmgTxtToObject(cDamageRoll));
			}
		}


		newItem.data.attackEffects = {value: []};
		for(let i=0;attack.attackEffects&&i<attack.attackEffects.length;i++){
			let cEffect = attack.attackEffects[i];
			if(cEffect!=="")
			newItem.data.attackEffects.value.push(cEffect);
		}

		let attackTraitTxt = '';
		if(attack.traits && attack.traits.length > 0){
			attackTraitTxt+=" (";
		}
		newItem.data.traits = {value: []};
		for(let i=0;attack.traits&&i<attack.traits.length;i++){
			let cTrait = attack.traits[i];
			if(cTrait!==""){
				attackTraitTxt+=cTrait+(i<attack.traits.length-1 ? ', ':'');
				if(!newItem.data.traits.value.includes(cTrait))
					if (cTrait.includes("range") || cTrait.includes("thrown")) newItem.data["weaponType"] = {"value": "ranged"};
					newItem.data.traits.value.push(cTrait);
			}
		}
		if(attack.traits && attack.traits.length > 0){
			attackTraitTxt+=")";
		}	

		// Commented out since NPC sheet has trait buttons now
		// newItem.name+=attackTraitTxt;
		newItem.data.description = {'value': attackTraitTxt.trim()};

		//console.log(JSON.stringify(newItem,null,2));


		//let returnValue = await actor.createOwnedItem(newItem, {'displaySheet':false})
		
		//console.log(returnValue);
		
		return newItem;
		
	};

	

	if(currentMonster.attackActions){		
		for(let i=0;i<currentMonster.attackActions.length;i++){
			let newItem = await processAttack(currentMonster.attackActions[i],testActor,monsterModuleName);
			newItems.push(newItem);
		}
		//await testActor.createManyEmbeddedEntity('OwnedItem', newItems);
	}

	
	//Actions
	//let newActions = [];
	const processAction = async function(action,actionType,actor,monsterModuleName="pf2e_updatednpcsheet"){
		let newAction = {
			'name':action.name,
			'type':'action', 
			'data': {
				'actionType': {'value': 'action'},
				'description': {'value': action.actionText.replace(/(?:((?:\d+d\d+| ?\+ ?|\d+)+)\s*((?:[a-z ]+\s)?damage))/ig,(_,dice,dmgType) => `[[/r ${dice} # ${dmgType}]] ${dmgType}`)},
				'traits': {value: action.traits ?? []}
			}
		};

		newAction.flags = {};
		newAction.flags[monsterModuleName] = {};
		newAction.flags[monsterModuleName].npcActionType = {value: actionType};
		switch (action.actionCost){
			case 1:
			case "1":
			case 2:
			case "2":
			case 3:
			case "3":
				newAction.data.actions = {'value': parseInt(action.actionCost,10)}
				break;
			case 'freeAction':
				newAction.data.actionType.value = 'free';
				break;
			case 'reaction':
				newAction.data.actionType.value = 'reaction'
				break;
			default:
				newAction.data.actionType.value = 'passive'
		}
		let traitRegEx = /(?:Traits.aspx.+?">)(?:<\w+>)*(.+?)(?:<\/\w+>)*(?:<\/a>)/g;
		if (action.actionText) {
			let matchTraits = [...action.actionText.matchAll(traitRegEx)];

			for(let i=0;i<matchTraits.length;i++){
				if(matchTraits[i] && matchTraits[i].length >= 2 && matchTraits[i][1]){
					//console.log("Adding",matchTraits[i][1],"to",newAction.data.traits.value,newAction.data.traits.value.includes(matchTraits[i][1]));
					if(!newAction.data.traits.value.includes(matchTraits[i][1]))
						newAction.data.traits.value.push(matchTraits[i][1]);
				}
			}
		}

		//let returnValue = await actor.createOwnedItem(newAction, {'displaySheet': false});
		//let returnValue = await await testActor.createEmbeddedEntity('OwnedItem', newAction);

		return newAction;
	}

	for(let i=0;currentMonster.interactionAbilities&&i<currentMonster.interactionAbilities.length;i++){
		let newAction = await processAction(currentMonster.interactionAbilities[i],'interaction',testActor,monsterModuleName);
		newItems.push(newAction);
	}
	for(let i=0;currentMonster.defensiveAbilities&&i<currentMonster.defensiveAbilities.length;i++){
		let newAction = await processAction(currentMonster.defensiveAbilities[i],'defensive',testActor,monsterModuleName);
		newItems.push(newAction);
	}
	for(let i=0;currentMonster.offensiveAbilities&&i<currentMonster.offensiveAbilities.length;i++){
		let newAction = await processAction(currentMonster.offensiveAbilities[i],'offensive',testActor,monsterModuleName);
		newItems.push(newAction);
	}
	//await testActor.createManyEmbeddedEntity('OwnedItem', newActions);



	//Skills
	const processSkillAsLore = async function(skill,actor){
		let newAction = {
			'name':skill.name,
			'type':'lore', 
			'data': {
				'mod': { value: Number(skill.mod)},
			}
		};
		if(skill.skillDetails){
			newAction.name+=" ("+skill.skillDetails+")";
		}
		//let returnValue = await actor.createOwnedItem(newAction, {'displaySheet': false});
		//actor.createEmbeddedEntity('OwnedItem', newAction);
		return newAction;
	}

	//let newSkills = [];
	for(let i=0;currentMonster.skills&&i<currentMonster.skills.length;i++){
		let newSkill = await processSkillAsLore(currentMonster.skills[i],testActor);
		newItems.push(newSkill);
	}

	// create all embedded entities at once.
	console.log(`PF2E | Create items for ${testActor.name}: `, newItems);
	setTimeout(async () => {
		const createdItems = await testActor.createEmbeddedEntity('OwnedItem', newItems, {temporary:false});
		console.log("New items in creature -- these are the ones that aren't persisting for some reason?",createdItems)
	}, 120)
	// const createdItems = await testActor.createEmbeddedEntity('OwnedItem', newItems, {temporary:false});
	// console.log("New items in creature -- these are the ones that aren't persisting for some reason?",createdItems)
	if(showMonster){
		await testActor.sheet.render(true)
	}
	//Stuff not in basic pf2eActor
/* 	{
		let updateObj = {'id':testActor.id, 'data': {}};

		// updateObj.data.nethysUrl = {'value':currentMonster.nethysUrl};
		// if(currentMonster.recallKnowledgeText) updateObj.data.recallKnowledgeText = {'value': currentMonster.recallKnowledgeText};
		// if(currentMonster.flavorText) updateObj.data.flavorText = {'value': currentMonster.flavorText};
		// if(currentMonster.sidebarText) updateObj.data.sidebarText = {'value': currentMonster.sidebarText};
		if(currentMonster.ACDetails){
			updateObj.data.attributes = {};
			updateObj.data.attributes.ac = {};
			updateObj.data.attributes.ac.details = currentMonster.ACDetails;
		}
		if(currentMonster.HPDetails){
			if(!updateObj.data.attributes) updateObj.data.attributes = {};
			updateObj.data.attributes.hp = {};
			updateObj.data.attributes.hp.details = currentMonster.HPDetails;
		}

		await testActor.update(updateObj);
	} */
	
	//commented out last step
	//await monstersPack.importEntity(testActor);
	//testActor.delete();
	return testActor
}

function titleCase(str) {
	var splitStr = str.toLowerCase().split(' ');
	for (var i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
	}
	
	return splitStr.join(' '); 
}
