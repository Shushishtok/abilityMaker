import { AbilityBuilder } from './DotaKVBuilder';
import * as fs from 'fs';
import { KVObject, serialize, createDuplicateKeyArray } from 'valve-kv';

export class AbilityCompiler
{
	filename = "npc_abilities_custom.txt"
	filepath = "node_modules/~kv/" + this.filename;
	Abilities: Array<AbilityKV> = new Array();
	ability_objects: KVObject = {};

	CleanAbilityCustomFile()
	{        
		const fd = fs.openSync(this.filepath, 'w');
		fs.closeSync(fd);        
	}

	OnAbilityDataChanged(allData: {[path: string]: Array<AbilityKV>}) {

		let abilities: Array<AbilityKV> = new Array;
		for (const [key, data] of Object.entries(allData)) {
			Array.prototype.push.apply(abilities, data);
		}
		this.Abilities = abilities;
		this.ability_objects = {};

		this.CleanAbilityCustomFile();
		this.CompileAbilitiesKV();
		this.WriteToFile(this.ability_objects);
	}

	CompileAbilitiesKV()
	{
		for (const ability of this.Abilities)
		{            
			const ability_tokens: KVObject = {}            
			ability_tokens["BaseClass"] = "ability_lua";

			for (const [key, value] of Object.entries(ability))
			{
				if (key === "Name") continue;

				let actual_key = AbilityBuilder.GetExpectedKVFromString(key) != undefined ? AbilityBuilder.GetExpectedKVFromString(key) : key;                
				let actual_value: any = value;

				// Booleans are expected to be shown in a 1/0 pattern for true/false
				if (typeof value === "boolean")
				{
					actual_value = value ? "1" : "0";                    
				}                

				else if (Array.isArray(value))
				{                    
					// Numeric arrays
					if (typeof value[0] === 'number')
					{
						actual_value = AbilityBuilder.FillNumericKVValues(value);                        
					}

					// Arrays of objects
					else if (typeof value[0] === `object`)
					{                        
						if (AbilityBuilder.IsAbilitySpecialBlock(value[0]))
						{                            
							actual_value = {};

							for (let index = 1; index <= value.length; index++)
							{
								// Form the index
								let indexToken = "";
								if (index < 10)
								{
									indexToken = "0";
								}

								indexToken += index;

								// Insert token into object
								const token = actual_value[indexToken] = {};
								const ability_block_data = (value[index - 1] as AbilitySpecialBlock);
								token["var_type"] = ability_block_data.VarType;

								// name-value can either be a single number or an array of numbers
								if (typeof ability_block_data.Values === `number`)
								{
									token[ability_block_data.Name] = ability_block_data.Values;
								}
								else
								{
									token[ability_block_data.Name] = AbilityBuilder.FillNumericKVValues(ability_block_data.Values);
								}

								if (ability_block_data.CalculateSpellDamageTooltip != undefined)
								{
									token["CalculateSpellDamageTooltip"] = ability_block_data.CalculateSpellDamageTooltip ? "1" : "0";
								}

								if (ability_block_data.LinkedSpecialBonus)
								{
									token["LinkedSpecialBonus"] = ability_block_data.LinkedSpecialBonus;
								}

								if (ability_block_data.LinkedSpecialBonusField)
								{
									token["LinkedSpecialBonusField"] = ability_block_data.LinkedSpecialBonusField;
								}

								if (ability_block_data.LinkedSpecialBonusOperation)
								{
									token["LinkedSpecialBonusOperation"] = ability_block_data.LinkedSpecialBonusOperation;
								}
							}
						}
						else if (AbilityBuilder.IsPrecacheKV(value[0]))
						{
							// Create precache token                            
							const precache_token = actual_value = {};
							const precache_types_map: Map<PrecacheType, string[]> = new Map();

							// Register each precache type and its paths
							for (const precache of value)
							{                               
								const precacheKV = precache as PrecacheKV;                                
								if (precache_types_map.has(precacheKV.PrecacheType))
								{                                    
									const precache_type_array = precache_types_map.get(precacheKV.PrecacheType);
									precache_type_array.push(precacheKV.path);
								}
								else
								{
									precache_types_map.set(precacheKV.PrecacheType, [precacheKV.path]);
								}
							}

							// Create duplicate key arrays for each type
							for (const [type, paths] of precache_types_map.entries()) 
							{                                
								precache_token[type] = createDuplicateKeyArray(paths);
							}
						}
					}

					// One of the custom enum arrays
					else
					{                        
						const seperator = " | ";
						let enums = "";
						for (let index = 0; index < value.length; index++)
						{
							if (index > 0)
							{
								enums += seperator;
							}

							enums += value[index];
						}

						actual_value = enums;                        
					}
				}

				ability_tokens[actual_key] = actual_value;                
			}

			// Add the ability token to the ability name            
			this.ability_objects[ability.Name] = ability_tokens;            
		}
	}

	WriteToFile(ability_objects: KVObject)
	{
		// Build the KV
		const kv = { DOTAAbilities: ability_objects };

		// Serializa
		const serialized_kv = serialize(kv);

		// Write to file
		let abilitiesLength = Object.keys(this.ability_objects).length;
		let abilityName = abilitiesLength == 1 ? "ability" : "abilities";
		fs.writeFile(this.filepath, serialized_kv, ()=>{console.log("\x1b[36m%s\x1b[0m", `Wrote ${abilitiesLength} ${abilityName} to ${this.filename} successfully.`)});
	}
}

// new AbilityCompiler();
