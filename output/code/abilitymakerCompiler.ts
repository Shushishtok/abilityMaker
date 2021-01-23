import * as fs from 'fs';
import { KVObject, serialize } from 'valve-kv';
import { AbilityBehavior, AbilityKV, AbilitySpecialBlock, DifferentlyNamedAbilityKVs, PrecacheKV, PrecacheType, SpellDispellableTypes, SpellImmunityTypes, UnitTargetTeam, UnitTargetType, VarTypes } from "./abilitymakerInterfaces"

class AbilityCompiler
{
    filepath = "../npc_abilities_custom.txt";
    Abilities: Array<AbilityKV> = new Array();
    ability_objects: KVObject = {};

    constructor()
    {
        this.CleanAbilityCustomFile();
        this.GetAbilityData();
        this.CompileAbilitiesKV();
        this.WriteToFile(this.ability_objects);
    }

    CleanAbilityCustomFile()
    {        
        const fd = fs.openSync(this.filepath, 'w');
        fs.closeSync(fd);        
    }

    GetAbilityData()
    {
        this.Abilities.push({
            Name: "shard_explosion",
            ManaCost: [50, 100, 150, 200],
            Cooldown: [25, 22, 19, 16],
            MaxLevel: 4,
            ScriptFile: "abilities/heroes/sven/shard_explosion",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.PASSIVE, AbilityBehavior.CHANNELLED],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            CastRange: 1000,
            HasScepterUpgrade: true,
            CastPoint: 0.1,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            Charges: 2,
            Precache:
            [
                {
                    PrecacheType: PrecacheType.MODEL,
                    path: "models/props/skulls_and_bones.vmdl"
                },

                this.AddPrecacheObject(PrecacheType.PARTICLE, "particles/heroes/sven/great_cleave.vcfp")
            ],

            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 50
                },

                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_range",
                    Values: [75, 100, 125, 150]
                },

                this.AddAbilitySpecialFloat("spell_amp", [5, 10, 15, 20])
            ]
        });

        this.Abilities.push({
            Name: "imba_dazzle_poison_touch",
            TextureName: "dazzle_poison_touch",
            ScriptFile: "components/abilities/heroes/hero_dazzle.lua",
            Behavior: AbilityBehavior.UNIT_TARGET,
            FightRecapLevel: 1,
            Precache:
            [
                this.AddPrecacheObject(PrecacheType.SOUNDFILE, "soundevents/game_sounds_heroes/game_sounds_dazzle.vsndevts"),
                this.AddPrecacheObject(PrecacheType.PARTICLE, "particles/units/heroes/hero_dazzle/dazzle_poison_touch.vpcf"),
                this.AddPrecacheObject(PrecacheType.PARTICLE, "particles/units/heroes/hero_dazzle/dazzle_poison_debuff.vpcf"),
                this.AddPrecacheObject(PrecacheType.PARTICLE, "particles/status_fx/status_effect_poison_dazzle.vpcf")
            ],

            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            CastPoint: 0.3,
            ManaCost: [110, 120, 130, 140],
            AbilitySpecials:
            [
                this.AddAbilitySpecialInteger("cooldown", [15, 13, 11, 7]),
                this.AddAbilitySpecialInteger("set_in_time", 3),
                this.AddAbilitySpecialInteger("minimum_slow", 33),
                this.AddAbilitySpecialInteger("maximum_slow", 66),                
                this.AddAbilitySpecialInteger("poison_duration", 7),
                this.AddAbilitySpecialInteger("poison_base_damage", [18, 30, 42, 54]),
                this.AddAbilitySpecialFloat("poison_stack_damage", [1.0, 3.0, 5.0, 7.0]),
                this.AddAbilitySpecialFloat("stack_armor_reduction", 1.0),
                this.AddAbilitySpecialInteger("projectile_speed", 1300),
                this.AddAbilitySpecialInteger("cast_range", [600, 700, 800, 900]),
                {
                    VarType: VarTypes.INTEGER,
                    Name: "talent_slow_per_damage",
                    Values: 3,
                    CalculateSpellDamageTooltip: false
                },
                this.AddAbilitySpecialInteger("talent_slow_max", 80),
                {
                    VarType: VarTypes.INTEGER,
                    Name: "talent_damage_for_slow_proc",
                    Values: 3,
                    CalculateSpellDamageTooltip: false
                }
            ]
        });
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

                let actual_key = this.GetExpectedKVFromString(key) != undefined ? this.GetExpectedKVFromString(key) : key;                
                let actual_value: any = value;

                // Booleans are expected to be shown in a 1/0 pattern for true/false
                if (typeof value === "boolean")
                {
                    actual_value = value ? "1" : "0";                    
                }                

                else if (Array.isArray(value))
                {
                    console.log(`${key} is an array`)
                    // Numeric arrays
                    if (typeof value[0] === 'number')
                    {
                        actual_value = this.FillNumericKVValues(value);                        
                    }

                    // Arrays of objects
                    else if (typeof value[0] === `object`)
                    {                        
                        if (this.IsAbilitySpecialBlock(value[0]))
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
                                    token[ability_block_data.Name] = this.FillNumericKVValues(ability_block_data.Values);
                                }

                                if (ability_block_data.CalculateSpellDamageTooltip)
                                {
                                    token["CalculateSpellDamageTooltip"] = ability_block_data.CalculateSpellDamageTooltip;
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
                        else if (this.IsPrecacheKV(value[0]))
                        {
                            // Create precache token                            
                            const precache_token = actual_value["precache"] = {};

                            for (const precache of value)
                            {
                                const precacheKV = precache as PrecacheKV;
                                precache_token[precacheKV.PrecacheType] = precacheKV.path;
                            }
                        }
                    }

                    // One of the custom enum arrays
                    else
                    {
                        console.log(`${key} is a custom enum array`)
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
                console.log(ability_tokens[actual_key]);
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
        fs.writeFile(this.filepath, serialized_kv, ()=>{console.log(`Wrote ${Object.keys(this.ability_objects).length} abilities to ${this.filepath} successfully.`)});
    }

    AddAbilitySpecialInteger(name: string, values: number | Array<number>): AbilitySpecialBlock
    {
        const ability_special_block: AbilitySpecialBlock =
        {
            VarType: VarTypes.INTEGER,
            Name: name,
            Values: values
        }

        return ability_special_block;
    }

    AddAbilitySpecialFloat(name: string, values: number | Array<number>): AbilitySpecialBlock
    {
        const ability_special_block: AbilitySpecialBlock =
        {
            VarType: VarTypes.FLOAT,
            Name: name,
            Values: values
        }

        return ability_special_block;
    }

    AddPrecacheObject(precache_type: PrecacheType, path: string): PrecacheKV
    {
        const precache_object: PrecacheKV =
        {
            PrecacheType: precache_type,
            path: path
        }

        return precache_object;
    }

    GetExpectedKVFromString(name: any): string | undefined
    {
        for (const key in DifferentlyNamedAbilityKVs)
        {
            if (key === name)
            {
                return DifferentlyNamedAbilityKVs[key];
            }
        }
        return undefined;
    }

    IsAbilitySpecialBlock(object: any): object is AbilitySpecialBlock
    {        
        return (<AbilitySpecialBlock>object).VarType !== undefined;
    }

    IsPrecacheKV(object: any): object is PrecacheKV
    {
        return (<PrecacheKV>object).PrecacheType !== undefined;
    }

    FillNumericKVValues(value: Array<number>): string
    {
        let values = "";

        for (let index = 0; index < value.length; index++)
        {
            // Add a space after each index that isn't the first index
            if (index > 0)
            {
                values += " ";
            }

            // Add value
            values += value[index];
        }

        return values;
    }
}

new AbilityCompiler();
