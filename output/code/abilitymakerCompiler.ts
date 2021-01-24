import * as fs from 'fs';
import { KVObject, serialize, createDuplicateKeyArray } from 'valve-kv';
import { AbilityBehavior, AbilityCastGestureSlotValue, AbilityKV, AbilitySpecialBlock, AbilityTypes, DamageType, DifferentlyNamedAbilityKVs, GameActivity, LinkedSpecialBonusOperation, PrecacheKV, PrecacheType, SpellDispellableTypes, SpellImmunityTypes, UnitTargetFlags, UnitTargetTeam, UnitTargetType, VarTypes } from "./abilitymakerInterfaces"

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
            CastGestureSlot: AbilityCastGestureSlotValue.ABSOLUTE,            
            Type: AbilityTypes.ULTIMATE,
            ScriptFile: "abilities/heroes/sven/shard_explosion",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.PASSIVE, AbilityBehavior.CHANNELLED],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            UnitTargetFlags: UnitTargetFlags.INVULNERABLE,
            UnitDamageType: DamageType.MAGICAL,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            FightRecapLevel: 2,
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
                    Values: 50,
                    LinkedSpecialBonus: "special_bonus_unique_axe_4",
                    CalculateSpellDamageTooltip: true,
                    LinkedSpecialBonusField: "value2",
                    LinkedSpecialBonusOperation: LinkedSpecialBonusOperation.PERCENTAGE_ADD
                },

                {
                    VarType: VarTypes.INTEGER, 
                    Name: "bonus_attack_range",
                    Values: [75, 100, 125, 150],
                    RequiresScepter: true
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

        this.Abilities.push({
            Name: "ability_aghsfort_capture",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.CHANNELLED, AbilityBehavior.HIDDEN],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            CastAnimation: GameActivity.DOTA_GENERIC_CHANNEL_1,
            MaxLevel: 1,
            CastRange: 300,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "base_capture_time",
                    Values: 6.0,
                },
    
            ],
    
        });

        this.Abilities.push({
            Name: "phased",
            ScriptFile: "abilities/phased",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "story_crystal",
            ScriptFile: "abilities/creatures/story_crystal",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "ability_unselectable",
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "no_vision",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
        });
    
        this.Abilities.push({
            Name: "aghanim_announcer_passive",
            ScriptFile: "abilities/creatures/aghanim_announcer_passive",
            Behavior: AbilityBehavior.PASSIVE,
        });

        this.Abilities.push({
            Name: "dummy_caster_passive",
            ScriptFile: "abilities/creatures/dummy_caster_passive",
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "dummy_target_passive",
            ScriptFile: "abilities/creatures/dummy_target_passive",
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "no_health_bar",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
        });
    
        this.Abilities.push({
            Name: "provides_fow_position",
            TextureName: "terrorblade_reflection",
            ScriptFile: "abilities/provides_fow_position",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_explosive_barrel",
            Behavior: AbilityBehavior.PASSIVE,
            Type: AbilityTypes.BASIC,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            MaxLevel: 19,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [0, 150, 240, 330, 420, 510, 600, 690, 780, 870, 960, 1050, 1140, 1230, 1320, 1410, 1500, 1590, 1680],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 425,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "vision_radius",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "vision_duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "model_scale",
                    Values: [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "detonate_delay",
                    Values: 1.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 0.75,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aggro_on_damage",
            ScriptFile: "abilities/aggro_on_damage",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "ability_absolute_no_cc",
            TextureName: "terrorblade_reflection",
            ScriptFile: "abilities/ability_absolute_no_cc",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
            ],
    
        });

        this.Abilities.push({
            Name: "ability_attack_speed_unslowable",
            TextureName: "terrorblade_reflection",
            ScriptFile: "abilities/ability_attack_speed_unslowable",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "attack_speed_reduction_pct",
                    Values: 0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ability_move_speed_unslowable",
            TextureName: "terrorblade_reflection",
            ScriptFile: "abilities/ability_move_speed_unslowable",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "move_speed_reduction_pct",
                    Values: 20,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ability_ascension",
            ScriptFile: "abilities/ability_ascension",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            MaxLevel: 5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "attack_speed_reduction_pct",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "move_speed_reduction_pct",
                    Values: 70,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "act_1_modifier",
                    Values: [-10, -10, -10, -10, -10, -10],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "act_2_modifier",
                    Values: [-5, -5, -5, -5, -5, -5],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_magic_resist",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "min_bonus_armor",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_bonus_armor",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "crit_chance",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "crit_multiplier",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_attack_speed",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_hp",
                    Values: [-5, 15, 30, 45, 60, 75],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_cooldown",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_outgoing_damage",
                    Values: [-5, 20, 40, 60, 80, 100],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_flicker",
            ScriptFile: "abilities/ascension_flicker",
            Behavior: [AbilityBehavior.IMMEDIATE, AbilityBehavior.NO_TARGET, AbilityBehavior.ROOT_DISABLES],
            MaxLevel: 1,
            TextureName: "antimage_blink",
            Cooldown: 8.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "range",
                    Values: 450,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_magic_resist",
            ScriptFile: "abilities/ascension_magic_resist",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            MaxLevel: 5,
            TextureName: "mudgolem_cloak_aura",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_magic_resist",
                    Values: 40,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_magic_immunity",
            ScriptFile: "abilities/ascension_magic_immunity",
            Behavior: AbilityBehavior.NO_TARGET,
            MaxLevel: 5,
            Cooldown: 20,
            TextureName: "modifier_magicimmune",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "model_scale",
                    Values: 30,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_armor_sapping",
            ScriptFile: "abilities/ascension_armor_sapping",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.UNRESTRICTED],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            MaxLevel: 5,
            TextureName: "phantom_assassin_armor_corruption_debuff",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "armor_reduction_per_stack",
                    Values: [1, 2, 3, 4, 4],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "model_scale_per_stack",
                    Values: 8,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_embiggen",
            ScriptFile: "abilities/ascension_embiggen",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.UNRESTRICTED],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            MaxLevel: 5,
            TextureName: "pudge_eject",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "model_scale_per_stack",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_model_scale_increases",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "turn_rate_slow_pct",
                    Values: 15,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_speed_slow",
                    Values: 20,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_vengeance",
            ScriptFile: "abilities/ascension_vengeance",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.UNRESTRICTED],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            MaxLevel: 5,
            TextureName: "vengefulspirit_command_aura",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 2.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_ascension_invis",
            Behavior: AbilityBehavior.NO_TARGET,
            MaxLevel: 5,
            TextureName: "item_glimmer_cape",
            Cooldown: 16,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "warning_duration",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "invis_duration",
                    Values: 4.0,
                },
    
            ],
    
        });

        this.Abilities.push({
            Name: "ability_aghsfort_capture",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.CHANNELLED, AbilityBehavior.HIDDEN],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            CastAnimation: GameActivity.DOTA_GENERIC_CHANNEL_1,
            MaxLevel: 1,
            CastRange: 300,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "base_capture_time",
                    Values: 6.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "phased",
            ScriptFile: "abilities/phased",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "story_crystal",
            ScriptFile: "abilities/creatures/story_crystal",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "ability_unselectable",
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "no_vision",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
        });
    
        this.Abilities.push({
            Name: "aghanim_announcer_passive",
            ScriptFile: "abilities/creatures/aghanim_announcer_passive",
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "dummy_caster_passive",
            ScriptFile: "abilities/creatures/dummy_caster_passive",
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "dummy_target_passive",
            ScriptFile: "abilities/creatures/dummy_target_passive",
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "no_health_bar",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
        });
    
        this.Abilities.push({
            Name: "provides_fow_position",
            TextureName: "terrorblade_reflection",
            ScriptFile: "abilities/provides_fow_position",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_explosive_barrel",
            Behavior: AbilityBehavior.PASSIVE,
            Type: AbilityTypes.BASIC,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            MaxLevel: 19,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [0, 150, 240, 330, 420, 510, 600, 690, 780, 870, 960, 1050, 1140, 1230, 1320, 1410, 1500, 1590, 1680],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 425,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "vision_radius",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "vision_duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "model_scale",
                    Values: [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "detonate_delay",
                    Values: 1.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 0.75,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aggro_on_damage",
            ScriptFile: "abilities/aggro_on_damage",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "ability_absolute_no_cc",
            TextureName: "terrorblade_reflection",
            ScriptFile: "abilities/ability_absolute_no_cc",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "ability_attack_speed_unslowable",
            TextureName: "terrorblade_reflection",
            ScriptFile: "abilities/ability_attack_speed_unslowable",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "attack_speed_reduction_pct",
                    Values: 0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ability_move_speed_unslowable",
            TextureName: "terrorblade_reflection",
            ScriptFile: "abilities/ability_move_speed_unslowable",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "move_speed_reduction_pct",
                    Values: 20,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ability_ascension",
            ScriptFile: "abilities/ability_ascension",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            MaxLevel: 5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "attack_speed_reduction_pct",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "move_speed_reduction_pct",
                    Values: 70,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "act_1_modifier",
                    Values: [-10, -10, -10, -10, -10, -10],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "act_2_modifier",
                    Values: [-5, -5, -5, -5, -5, -5],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_magic_resist",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "min_bonus_armor",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_bonus_armor",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "crit_chance",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "crit_multiplier",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_attack_speed",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_hp",
                    Values: [-5, 15, 30, 45, 60, 75],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_cooldown",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_outgoing_damage",
                    Values: [-5, 20, 40, 60, 80, 100],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_flicker",
            ScriptFile: "abilities/ascension_flicker",
            Behavior: [AbilityBehavior.IMMEDIATE, AbilityBehavior.NO_TARGET, AbilityBehavior.ROOT_DISABLES],
            MaxLevel: 1,
            TextureName: "antimage_blink",
            Cooldown: 8.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "range",
                    Values: 450,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_magic_resist",
            ScriptFile: "abilities/ascension_magic_resist",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            MaxLevel: 5,
            TextureName: "mudgolem_cloak_aura",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_magic_resist",
                    Values: 40,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_magic_immunity",
            ScriptFile: "abilities/ascension_magic_immunity",
            Behavior: AbilityBehavior.NO_TARGET,
            MaxLevel: 5,
            Cooldown: 20,
            TextureName: "modifier_magicimmune",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "model_scale",
                    Values: 30,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_armor_sapping",
            ScriptFile: "abilities/ascension_armor_sapping",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.UNRESTRICTED],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            MaxLevel: 5,
            TextureName: "phantom_assassin_armor_corruption_debuff",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "armor_reduction_per_stack",
                    Values: [1, 2, 3, 4, 4],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "model_scale_per_stack",
                    Values: 8,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_embiggen",
            ScriptFile: "abilities/ascension_embiggen",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.UNRESTRICTED],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            MaxLevel: 5,
            TextureName: "pudge_eject",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "model_scale_per_stack",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_model_scale_increases",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "turn_rate_slow_pct",
                    Values: 15,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_speed_slow",
                    Values: 20,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_vengeance",
            ScriptFile: "abilities/ascension_vengeance",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.UNRESTRICTED],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            MaxLevel: 5,
            TextureName: "vengefulspirit_command_aura",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 2.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_ascension_invis",
            Behavior: AbilityBehavior.NO_TARGET,
            MaxLevel: 5,
            TextureName: "item_glimmer_cape",
            Cooldown: 16,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "warning_duration",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "invis_duration",
                    Values: 4.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_crit",
            ScriptFile: "abilities/ascension_crit",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            MaxLevel: 5,
            TextureName: "phantom_assassin_coup_de_grace",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "crit_chance",
                    Values: 15,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "crit_multiplier",
                    Values: 300,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_drunken",
            ScriptFile: "abilities/ascension_drunken",
            Behavior: AbilityBehavior.NO_TARGET,
            MaxLevel: 5,
            TextureName: "brewmaster_drunken_brawler",
            Cooldown: 15,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "dodge_chance",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_chance",
                    Values: 80,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_multiplier",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "min_movement",
                    Values: -20,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_movement",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_armor",
            ScriptFile: "abilities/ascension_armor",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            MaxLevel: 5,
            TextureName: "dragon_knight_dragon_tail",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "min_bonus_armor",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_bonus_armor",
                    Values: 20,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_damage",
            ScriptFile: "abilities/ascension_damage",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            MaxLevel: 5,
            TextureName: "ember_spirit_sleight_of_fist",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_outgoing_damage",
                    Values: 35,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_heal_suppression",
            ScriptFile: "abilities/ascension_heal_suppression",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            MaxLevel: 5,
            TextureName: "necrolyte_heartstopper_aura",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "heal_suppression_pct",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 400,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_chilling_touch",
            ScriptFile: "abilities/ascension_chilling_touch",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            MaxLevel: 5,
            TextureName: "ancient_apparition_chilling_touch",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 1.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_extra_fast",
            ScriptFile: "abilities/ascension_extra_fast",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            MaxLevel: 5,
            TextureName: "clinkz_wind_walk",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_move_speed",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_vampiric",
            ScriptFile: "abilities/ascension_vampiric",
            Behavior: AbilityBehavior.NO_TARGET,
            MaxLevel: 5,
            TextureName: "life_stealer_feast",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "lifesteal_pct",
                    Values: 350,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_attack_speed",
            ScriptFile: "abilities/ascension_attack_speed",
            Behavior: AbilityBehavior.NO_TARGET,
            MaxLevel: 5,
            TextureName: "clinkz_strafe",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_speed",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 10,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_ascension_firefly",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            MaxLevel: 5,
            TextureName: "batrider_firefly",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastPoint: 0.0,
            Cooldown: 12,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_pct_per_second",
                    Values: 12,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_speed",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pool_duration",
                    Values: 12,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tick_interval",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tree_radius",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "trail_placement_duration",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_linger_duration",
                    Values: 0.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_ascension_silence",
            Behavior: AbilityBehavior.NO_TARGET,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            Sound: "Hero_DeathProphet.Silence",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            TextureName: "death_prophet_silence",
            Cooldown: 16,
            Duration: 4,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 375,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "windup_time",
                    Values: 2.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_temple_guardian_wrath",
            ScriptFile: "abilities/creatures/temple_guardian_wrath",
            TextureName: "omniknight_guardian_angel",
            MaxLevel: 5,
            Type: AbilityTypes.ULTIMATE,
            Behavior: [AbilityBehavior.CHANNELLED, AbilityBehavior.NO_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 2,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: 12,
            ChannelTime: 4.0,
            CastPoint: 1.0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "effect_radius",
                    Values: 2000,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "delay",
                    Values: 1.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "blast_damage",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "channel_duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "interval",
                    Values: 0.2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "block_cooldown",
                    Values: 0.001,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_timbersaw_chakram_dance",
            TextureName: "shredder_chakram",
            ScriptFile: "abilities/creatures/boss_timbersaw_chakram_dance",
            MaxLevel: 5,
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.CHANNELLED, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            CastPoint: 2.0,
            CastRange: 0,
            Cooldown: 18,
            ChannelTime: 13,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_health_percentage",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "num_chakrams",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "interval",
                    Values: 8.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "short_range",
                    Values: 1500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "long_range",
                    Values: 2500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spawn_interval",
                    Values: 1.2,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spawn_count",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pass_damage",
                    Values: 6,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pass_slow_duration",
                    Values: 1.2,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_plasma_field",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE, AbilityBehavior.UNRESTRICTED],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            Sound: "Ability.PlasmaField",
            MaxLevel: 5,
            TextureName: "razor_plasma_field",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastRange: 0,
            CastPoint: 0,
            Cooldown: 1,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_min",
                    Values: 17,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_max",
                    Values: 34,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 550,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 467,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_min",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_max",
                    Values: 15,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "windup_time",
                    Values: 1.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_bulwark",
            Behavior: AbilityBehavior.PASSIVE,
            MaxLevel: 5,
            TextureName: "mars_bulwark",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "physical_damage_reduction",
                    Values: 75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "forward_angle",
                    Values: 120,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "physical_damage_reduction_side",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "side_angle",
                    Values: 120,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_bomb",
            ScriptFile: "abilities/ascension_bomb",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.UNRESTRICTED],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            UnitDamageType: DamageType.MAGICAL,
            MaxLevel: 5,
            TextureName: "techies_land_mines",
            Cooldown: 10,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 450,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "min_delay_time",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_delay_time",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "is_ascension_ability",
                    Values: 1,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_ascension_magnetic_field",
            Behavior: AbilityBehavior.NO_TARGET,
            SpellImmunityType: SpellImmunityTypes.ALLIES_YES,
            FightRecapLevel: 1,
            Sound: "Hero_ArcWarden.MagneticField.Cast",
            TextureName: "arc_warden_magnetic_field",
            CastAnimation: GameActivity.DOTA_AW_MAGNETIC_FIELD,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastPoint: 0.3,
            Cooldown: 8,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "evasion_chance",
                    Values: 100,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_impatient",
            ScriptFile: "abilities/ascension_impatient",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            MaxLevel: 5,
            TextureName: "granite_golem_hp_aura",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_stacks",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration_per_stack",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "model_scale_per_stack",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_outgoing_damage_pct_per_stack",
                    Values: 1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_health_pct_per_stack",
                    Values: 2,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ascension_meteoric",
            ScriptFile: "abilities/ascension_meteoric",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.UNRESTRICTED],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            UnitDamageType: DamageType.MAGICAL,
            MaxLevel: 5,
            TextureName: "invoker_chaos_meteor",
            CastAnimation: GameActivity.DOTA_AW_MAGNETIC_FIELD,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastPoint: 0.0,
            Cooldown: 10,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "land_time",
                    Values: .5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_radius",
                    Values: 315,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 2.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "impact_pct_damage_units",
                    Values: 25,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "treasure_chest",
            ScriptFile: "abilities/treasure_chest",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "generic_gold_bag_fountain_1000",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "item_hand_of_midas",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "gold_value",
                    Values: 25,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "generic_gold_bag_fountain_2000",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "item_hand_of_midas",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "gold_value",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "generic_gold_bag_fountain_4000",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "item_hand_of_midas",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "gold_value",
                    Values: 100,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "generic_gold_bag_fountain_8000",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "item_hand_of_midas",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "gold_value",
                    Values: 200,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "modifier_no_minimap",
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "modifier_invulnerable",
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "creature_pudge_miniboss_passive",
            ScriptFile: "abilities/creatures/creature_pudge_miniboss_passive",
            TextureName: "phantom_assassin_armor_corruption_debuff",
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "status_resist_50",
            ScriptFile: "abilities/status_resist_50",
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "creature_generic_high_status_resist_passive",
            ScriptFile: "abilities/creatures/creature_generic_high_status_resist_passive",
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "trap_unselectable",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
        });
    
        this.Abilities.push({
            Name: "spike_trap",
            ScriptFile: "abilities/traps/spike_trap",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE],
            CastAnimation: GameActivity.DOTA_ATTACK,
            CastRange: 600,
            CastPoint: 0.45,
            Cooldown: 2,
            Damage: 150,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "light_strike_array_aoe",
                    Values: 160,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "light_strike_array_delay_time",
                    Values: 0.65,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "light_strike_array_stun_duration",
                    Values: 1.6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cast_animation",
                    Values: 12,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "light_strike_array_damage",
                    Values: 600,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "breathe_fire",
            ScriptFile: "abilities/traps/breathe_fire",
            Behavior: [AbilityBehavior.DIRECTIONAL, AbilityBehavior.POINT, AbilityBehavior.UNIT_TARGET],
            UnitDamageType: DamageType.PURE,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            CastRange: 9999,
            CastPoint: 0,
            Cooldown: 0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "start_radius",
                    Values: 60,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "end_radius",
                    Values: 60,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "range",
                    Values: 9999,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 1050,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_hp_pct_damage",
                    Values: [25.0, 34.0, 50.0, 100.0],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "arrow",
            ScriptFile: "abilities/traps/arrow",
            Behavior: [AbilityBehavior.DIRECTIONAL, AbilityBehavior.POINT, AbilityBehavior.UNIT_TARGET],
            CastAnimation: GameActivity.DOTA_ATTACK,
            CastRange: 9999,
            CastPoint: 0,
            Cooldown: 0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "start_radius",
                    Values: 70,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "end_radius",
                    Values: 70,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "range",
                    Values: 9999,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: [850, 950, 950, 1050],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_hp_pct_damage",
                    Values: [50.0, 50.0, 100.0, 100.0],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_techies_land_mine",
            ScriptFile: "abilities/creatures/creature_techies_land_mine",
            TextureName: "techies_land_mines",
            MaxLevel: 10,
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            CastRange: 210,
            CastPoint: 0.0,
            Cooldown: 4,
            ManaCost: 30,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "proximity_threshold",
                    Values: 1.6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_duration",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "building_damage_pct",
                    Values: 25,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "activation_delay",
                    Values: 1.75,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "trap_sun_strike",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.HIDDEN, AbilityBehavior.NOT_LEARNABLE, AbilityBehavior.AOE, AbilityBehavior.IGNORE_BACKSWING],
            MaxLevel: 10,
            HotKeyOverride: "T",
            UnitDamageType: DamageType.PURE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            FightRecapLevel: 1,
            Sound: "Hero_Invoker.SunStrike.Charge",
            CastRange: 0,
            CastPoint: 0.05,
            Cooldown: 0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "delay",
                    Values: 1.7,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "area_of_effect",
                    Values: 175,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage",
                    Values: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "vision_distance",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "vision_duration",
                    Values: 4.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "pendulum_swing",
            ScriptFile: "abilities/traps/pendulum_swing",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            CastAnimation: GameActivity.DOTA_IDLE,
            CastRange: 60000,
            CastPoint: 0,
            ChannelTime: 999999,
            Cooldown: 0,
            ManaCost: 0,
            ModifierSupportValue: 0.0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_hp_pct_damage",
                    Values: [25.0, 34.0, 50.0, 100.0],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 60,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_shadow_wave",
            TextureName: "dazzle_shadow_wave",
            ScriptFile: "abilities/creatures/creature_shadow_wave",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.PHYSICAL,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
            CastRange: 600,
            CastPoint: 1.2,
            Cooldown: 10,
            ManaCost: 0,
            Damage: 100,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bounce_radius",
                    Values: 475,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_radius",
                    Values: 185,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_targets",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 150,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_poison_touch",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.PHYSICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            Sound: "Hero_Dazzle.Poison_Touch",
            CastRange: 500,
            CastPoint: 0.3,
            Cooldown: 10,
            ManaCost: 0,
            ModifierSupportValue: 0.35,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "start_radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "end_radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "end_distance",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "targets",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 45,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow",
                    Values: -25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 800,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 5,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "creature_shallow_grave",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.DONT_RESUME_ATTACK, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: UnitTargetType.HERO,
            SpellImmunityType: SpellImmunityTypes.ALLIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            Sound: "Hero_Dazzle.Shallow_Grave",
            CastAnimation: GameActivity.DOTA_SHALLOW_GRAVE,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastRange: 700,
            CastPoint: 0.4,
            Cooldown: 30,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 5.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_inner_fire",
            Behavior: AbilityBehavior.NO_TARGET,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            Sound: "Hero_Huskar.Inner_Vitality",
            CastRange: 500,
            CastPoint: 0.2,
            Cooldown: 10,
            ManaCost: 0,
            ModifierSupportValue: 0.0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "disarm_duration",
                    Values: 2.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance",
                    Values: 550,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration",
                    Values: 0.6,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "creature_burning_spears",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.AUTOCAST, AbilityBehavior.ATTACK],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            Sound: "Hero_Huskar.Burning_Spear",
            CastRange: 450,
            CastPoint: [0.0, 0.0, 0.0, 0.0],
            Cooldown: [0.0, 0.0, 0.0, 0.0],
            Duration: 8,
            ManaCost: [0, 0, 0, 0],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "health_cost",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "burn_damage",
                    Values: [5, 10, 15, 20],
                    LinkedSpecialBonus: "special_bonus_unique_huskar_2",
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "creature_berserkers_blood",
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "maximum_attack_speed",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "maximum_health_regen",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hp_threshold_max",
                    Values: 20,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "creature_life_break",
            Type: AbilityTypes.ULTIMATE,
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.CREEP],
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 2,
            Sound: "Hero_Huskar.Life_Break",
            HasScepterUpgrade: true,
            CastPoint: 1.0,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: 15,
            ManaCost: [0, 0, 0],
            CastRange: 550,
            Duration: 3,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "health_cost_percent",
                    Values: 0.40,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "health_damage",
                    Values: 0.40,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "charge_speed",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tooltip_health_damage",
                    Values: [32, 38, 44],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tooltip_health_cost_percent",
                    Values: [32, 38, 44],
                    CalculateSpellDamageTooltip: true,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movespeed",
                    Values: -60,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_durtion_tooltip",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "taunt_duration",
                    Values: 2.5,
                    RequiresScepter: true,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "hellbear_smash",
            ScriptFile: "abilities/creatures/hellbear_smash",
            TextureName: "polar_furbolg_ursa_warrior_thunder_clap",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            MaxLevel: 2,
            Behavior: AbilityBehavior.NO_TARGET,
            UnitDamageType: DamageType.MAGICAL,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            CastPoint: 1.0,
            Cooldown: 5.0,
            Damage: 200,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 255,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movespeed_slow",
                    Values: -25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attackspeed_slow",
                    Values: -25,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 200,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ogre_tank_melee_smash",
            ScriptFile: "abilities/creatures/ogre_tank_melee_smash",
            TextureName: "centaur_double_edge",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitDamageType: DamageType.PHYSICAL,
            CastRange: 500,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            AnimationPlaybackRate: 1.0,
            AnimationIgnoresModelScale: true,
            Cooldown: 3,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 0.8,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 1600,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "base_swing_speed",
                    Values: 1.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ogre_tank_jump_smash",
            ScriptFile: "abilities/creatures/ogre_tank_jump_smash",
            TextureName: "centaur_double_edge",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitDamageType: DamageType.MAGICAL,
            CastRange: 150,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            AnimationIgnoresModelScale: true,
            Cooldown: 5.25,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_radius",
                    Values: 290,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 1800,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "jump_speed",
                    Values: 1.8,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ogre_magi_channelled_bloodlust",
            ScriptFile: "abilities/creatures/ogre_magi_channelled_bloodlust",
            TextureName: "ogre_magi_bloodlust",
            CastAnimation: GameActivity.DOTA_VICTORY,
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.CHANNELLED, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: [UnitTargetType.CREEP, UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: UnitTargetFlags.NOT_MAGIC_IMMUNE_ALLIES,
            CastRange: 600,
            CastPoint: 0.56,
            Cooldown: 1.0,
            ChannelTime: 10.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "modelscale",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_movement_speed",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_speed",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "interrupted_cooldown",
                    Values: 4,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ogre_magi_area_ignite",
            ScriptFile: "abilities/creatures/ogre_magi_area_ignite",
            TextureName: "ogre_magi_ignite",
            Behavior: [AbilityBehavior.AOE, AbilityBehavior.POINT],
            UnitDamageType: DamageType.MAGICAL,
            MaxLevel: 1,
            CastRange: 700,
            CastPoint: 0.45,
            Cooldown: 8,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "linger_duration",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "burn_damage",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_movement_speed_pct",
                    Values: -30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 700,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 275,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "area_duration",
                    Values: 2.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "baby_ogre_tank_melee_smash",
            ScriptFile: "abilities/creatures/baby_ogre_tank_melee_smash",
            TextureName: "centaur_double_edge",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitDamageType: DamageType.PHYSICAL,
            CastRange: 350,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            AnimationPlaybackRate: 1.0,
            AnimationIgnoresModelScale: true,
            Cooldown: 3,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_radius",
                    Values: 165,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 0.8,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 350,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "base_swing_speed",
                    Values: 1.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "baby_ogre_tank_jump_smash",
            ScriptFile: "abilities/creatures/baby_ogre_tank_jump_smash",
            TextureName: "centaur_double_edge",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitDamageType: DamageType.MAGICAL,
            CastRange: 150,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            AnimationIgnoresModelScale: true,
            Cooldown: 5.25,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "jump_speed",
                    Values: 1.8,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "baby_ogre_magi_area_ignite",
            ScriptFile: "abilities/creatures/baby_ogre_magi_area_ignite",
            TextureName: "ogre_magi_ignite",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            Behavior: [AbilityBehavior.AOE, AbilityBehavior.POINT],
            UnitDamageType: DamageType.MAGICAL,
            MaxLevel: 1,
            CastRange: 700,
            CastPoint: 0.45,
            Cooldown: 8,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "linger_duration",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "burn_damage",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_movement_speed_pct",
                    Values: -30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 700,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 275,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "area_duration",
                    Values: 3.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ogre_tank_boss_melee_smash",
            ScriptFile: "abilities/creatures/ogre_tank_boss_melee_smash",
            TextureName: "centaur_double_edge",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitDamageType: DamageType.PHYSICAL,
            CastRange: 570,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            AnimationPlaybackRate: 1.0,
            AnimationIgnoresModelScale: true,
            Cooldown: 2.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_radius",
                    Values: 242,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 2000,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "base_swing_speed",
                    Values: 1.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ogre_tank_boss_jump_smash",
            ScriptFile: "abilities/creatures/ogre_tank_boss_jump_smash",
            TextureName: "centaur_double_edge",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitDamageType: DamageType.PHYSICAL,
            CastRange: 150,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            AnimationIgnoresModelScale: true,
            Cooldown: 3.75,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 3000,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "jump_speed",
                    Values: 1.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ogre_seer_area_ignite",
            TextureName: "ogre_magi_ignite",
            ScriptFile: "abilities/creatures/ogre_seer_area_ignite",
            Behavior: [AbilityBehavior.AOE, AbilityBehavior.POINT],
            UnitDamageType: DamageType.MAGICAL,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            MaxLevel: 1,
            CastRange: 800,
            CastPoint: 0.45,
            Cooldown: 10,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "linger_duration",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "burn_damage",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_movement_speed_pct",
                    Values: -30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 700,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 275,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "area_duration",
                    Values: 5.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_flamestrike",
        });
    
        this.Abilities.push({
            Name: "pine_cone_shield_bash",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.NORMAL_WHEN_STOLEN, AbilityBehavior.DONT_CANCEL_CHANNEL],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.PHYSICAL,
            FightRecapLevel: 1,
            Sound: "Hero_Mars.Shield.Cast",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            CastRange: 350,
            CastPoint: 1.0,
            Cooldown: 10,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "anim_playback_speed",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_mult",
                    Values: [500, 600],
                    LinkedSpecialBonus: "special_bonus_unique_mars_gods_rebuke_extra_crit",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "angle",
                    Values: 90,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration",
                    Values: 0.3,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_distance",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_slow",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_slow_duration",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "activity_duration",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "scepter_cooldown",
                    Values: 3.5,
                    RequiresScepter: true,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "assault_captain_sun_ray",
            TextureName: "phoenix_sun_ray",
            Behavior: AbilityBehavior.POINT,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            Sound: "Hero_Phoenix.SunRay.Cast",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
            CastRange: 1300,
            CastPoint: 0.01,
            Cooldown: 5.0,
            Duration: 5.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "turn_rate_initial",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "turn_rate",
                    Values: 25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tooltip_duration",
                    Values: 6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hp_cost_perc_per_second",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "base_damage",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "hp_perc_damage",
                    Values: 5.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "base_heal",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "hp_perc_heal",
                    Values: 5.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 130,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tick_interval",
                    Values: 0.2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "forward_move_speed",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "beam_range",
                    Values: 1300,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "assault_captain_searing_chains",
            TextureName: "ember_spirit_searing_chains",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            Sound: "Hero_EmberSpirit.SearingChains.Target",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            CastRange: 400,
            CastPoint: 1.0,
            AnimationPlaybackRate: 1.0,
            AnimationIgnoresModelScale: true,
            Cooldown: 13.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 4.0,
                    LinkedSpecialBonus: "special_bonus_unique_ember_spirit_2",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "chains_damage",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "total_damage_tooltip",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tick_interval",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "unit_count",
                    Values: 10,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "catapult_attack",
            Behavior: [AbilityBehavior.AOE, AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.MAGICAL,
            CastRange: 2500,
            CastPoint: 0.7,
            Cooldown: 6.0,
            ManaCost: 0,
            ModifierSupportValue: 1.0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 700,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "explosion_radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "collision_radius",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_max_distance",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration",
                    Values: 0.25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "mindistance",
                    Values: 500,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "urn_upheaval",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.CHANNELLED, AbilityBehavior.AOE],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            Sound: "Hero_Warlock.Upheaval",
            CastAnimation: GameActivity.INVALID,
            CastPoint: 0,
            ChannelTime: 8.0,
            Cooldown: 12,
            Damage: [0, 0, 0, 0],
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "aoe",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_rate_duration",
                    Values: 3.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_slow",
                    Values: 84,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_damage",
                    Values: 150,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "upheaval_urn_reincarnation",
            Behavior: AbilityBehavior.PASSIVE,
            Type: AbilityTypes.ULTIMATE,
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: UnitTargetType.HERO,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            HasScepterUpgrade: true,
            Sound: "Hero_SkeletonKing.Reincarnate",
            ManaCost: 0,
            Cooldown: 0.5,
            ModifierSupportValue: 0.2,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "reincarnate_time",
                    Values: 9.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "upheaval_urn_incoming_damage_rules",
            ScriptFile: "abilities/creatures/upheaval_urn_incoming_damage_rules",
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.MAGICAL,
        });
    
        this.Abilities.push({
            Name: "gyrocopter_multi_homing_missile",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            FightRecapLevel: 1,
            CastRange: 1050,
            CastPoint: 0,
            Cooldown: 20,
            ManaCost: 0,
            Damage: 175,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "acceleration",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "enemy_vision_time",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "AbilityCharges",
                    Values: 0,
                    LinkedSpecialBonus: "special_bonus_unique_gyrocopter_1",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "multi_search_radius",
                    Values: 350,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_rockets",
                    Values: 1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hits_to_kill_tooltip",
                    Values: 1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tower_hits_to_kill_tooltip",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 1.8,
                    LinkedSpecialBonus: "special_bonus_unique_gyrocopter_6",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_speed_bonus_pct",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "min_damage",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_distance",
                    Values: 1500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pre_flight_time",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hero_damage",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "speed",
                    Values: 300,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_pangolier_gyroshell",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.ROOT_DISABLES, AbilityBehavior.IGNORE_BACKSWING, AbilityBehavior.HIDDEN],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            Type: AbilityTypes.ULTIMATE,
            FightRecapLevel: 1,
            IsCastableWhileHidden: true,
            CastRange: 0,
            CastPoint: 1.2,
            CastAnimation: GameActivity.DOTA_GENERIC_CHANNEL_1,
            Cooldown: 70,
            ManaCost: 0,
            Damage: [200, 275, 350],
            Precache:
            [
                {
                    PrecacheType: PrecacheType.MODEL,
                    path: "models/heroes/pangolier/pangolier_gyroshell.vmdl",
                },
    
                {
                    PrecacheType: PrecacheType.MODEL,
                    path: "models/heroes/pangolier/pangolier_gyroshell2.vmdl",
                },
    
                {
                    PrecacheType: PrecacheType.PARTICLE,
                    path: "hello/there.vcfp",
                },
    
            ],
    
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_radius",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 40.0,
                    LinkedSpecialBonus: "special_bonus_unique_pangolier_6",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "jump_recover_time",
                    Values: 0.25,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "cast_time_tooltip",
                    Values: 1.2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tick_interval",
                    Values: 0.05,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "forward_move_speed",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "turn_rate_boosted",
                    Values: 165,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "turn_rate",
                    Values: 120,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hit_radius",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bounce_duration",
                    Values: 0.4,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: [1.0, 1.25, 1.5],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "evil_greevil_passive",
            ScriptFile: "abilities/creatures/evil_greevil_passive",
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "aghsfort_drow_ranger_multishot",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.DIRECTIONAL],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.PHYSICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            FightRecapLevel: 1,
            CastPoint: 0.0,
            ChannelTime: 3.5,
            Cooldown: 22,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "arrow_count",
                    Values: 24,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "arrow_damage_pct",
                    Values: 125,
                    LinkedSpecialBonus: "special_bonus_unique_drow_ranger_1",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "arrow_slow_duration",
                    Values: 1.25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "arrow_width",
                    Values: 90,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "arrow_speed",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "arrow_range_multiplier",
                    Values: 1.75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "arrow_angle",
                    Values: 75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "effective_range",
                    Values: 1000,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CHANNEL_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_drow_ranger_wave_of_silence",
            Behavior: AbilityBehavior.POINT,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            Sound: "Hero_DrowRanger.Silence",
            CastRange: 900,
            CastPoint: 0.25,
            Cooldown: 13,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "wave_speed",
                    Values: 800.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "wave_width",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "silence_duration",
                    Values: 5,
                    LinkedSpecialBonus: "special_bonus_unique_drow_ranger_4",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_distance_max",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height",
                    Values: 0,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_shadow_demon_shadow_poison",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            Sound: "Hero_ShadowDemon.ShadowPoison",
            Duration: 7,
            Cooldown: 3.0,
            CastRange: 1050,
            CastPoint: 0.25,
            ManaCost: 0,
            ModifierSupportValue: 0.0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stack_damage",
                    Values: 75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_multiply_stacks",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_stack_damage",
                    Values: 75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "hit_damage",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "release_at_max_stacks",
                    Values: 20,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_shadow_demon_disruption",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitTargetTeam: [UnitTargetTeam.ENEMY, UnitTargetTeam.FRIENDLY],
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: UnitTargetFlags.NOT_MAGIC_IMMUNE_ALLIES,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            Sound: "Hero_ShadowDemon.Disruption",
            Duration: 2.75,
            Cooldown: 15.0,
            CastRange: 1050,
            CastPoint: 0.3,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "disruption_duration",
                    Values: 2.75,
                    LinkedSpecialBonus: "special_bonus_unique_shadow_demon_5",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "illusion_duration",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "illusion_outgoing_damage",
                    Values: -25.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "illusion_outgoing_tooltip",
                    Values: 25.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "illusion_incoming_damage",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tooltip_total_illusion_incoming_damage",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "AbilityCharges",
                    Values: 0,
                    LinkedSpecialBonus: "special_bonus_unique_shadow_demon_7",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "illusion_bounty_base",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "illusion_bounty_growth",
                    Values: 0,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "creature_doom_infernal_blade",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.AUTOCAST, AbilityBehavior.ATTACK],
            UnitDamageType: DamageType.MAGICAL,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            Sound: "Hero_DoomBringer.InfernalBlade.Target",
            HasScepterUpgrade: true,
            Cooldown: 8,
            ManaCost: 0,
            CastRange: 175,
            CastPoint: [0.0, 0.0, 0.0, 0.0],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "burn_damage",
                    Values: 28,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_damage_pct",
                    Values: 5,
                    LinkedSpecialBonus: "special_bonus_unique_doom_1",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "ministun_duration",
                    Values: 1.25,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "ministun_duration_scepter",
                    Values: 1.75,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_duration_scepter",
                    Values: 6.0,
                    RequiresScepter: true,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "creature_doom_bringer_doom",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: [UnitTargetFlags.MAGIC_IMMUNE_ENEMIES, UnitTargetFlags.NOT_ANCIENTS],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            Type: AbilityTypes.ULTIMATE,
            UnitDamageType: DamageType.PURE,
            FightRecapLevel: 2,
            CastPoint: 0.5,
            CastRange: 550,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_6,
            Cooldown: 60.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 10.0,
                    LinkedSpecialBonus: "special_bonus_unique_doom_7",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 25,
                    LinkedSpecialBonus: "special_bonus_unique_doom_5",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "deniable_pct",
                    Values: 0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_shadow_shaman_shackles",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.CHANNELLED],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            FightRecapLevel: 1,
            CastRange: 600,
            CastPoint: 0.3,
            ChannelTime: 8,
            Cooldown: 20,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tick_interval",
                    Values: 0.1,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "total_damage",
                    Values: 1600,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "channel_time",
                    Values: 10,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "mushroom_split",
            ScriptFile: "abilities/creatures/mushroom_split",
            Behavior: AbilityBehavior.PASSIVE,
            TextureName: "dark_seer_wall_of_replica",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "unit_count",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spawn_radius",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration_min",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration_max",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance_min",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance_max",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height_min",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height_max",
                    Values: 200,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_pugna_nether_ward",
            Behavior: AbilityBehavior.POINT,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            Sound: "Hero_Pugna.NetherWard",
            CastPoint: 0.2,
            CastRange: 150,
            Cooldown: [35.0, 35.0, 35.0, 35.0],
            Duration: [18, 22, 26, 30],
            ManaCost: [80, 80, 80, 80],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 1600,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "base_damage",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "mana_multiplier",
                    Values: [1.0, 1.25, 1.50, 1.75],
                    LinkedSpecialBonus: "special_bonus_unique_pugna_3",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "mana_regen",
                    Values: [-0.6, -0.8, -1.0, -1.2],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attacks_to_destroy_tooltip",
                    Values: [4, 4, 4, 4],
                    LinkedSpecialBonus: "special_bonus_unique_pugna_6",
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "ranged_quill_attack",
            Behavior: AbilityBehavior.POINT,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            FightRecapLevel: 1,
            TextureName: "ranged_quill_attack",
            ScriptFile: "abilities/creatures/ranged_quill_attack",
            MaxLevel: 1,
            CastAnimation: GameActivity.DOTA_ATTACK,
            CastRange: 1500,
            CastPoint: 0.5,
            Cooldown: 2.5,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_speed",
                    Values: 650,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_width_initial",
                    Values: 75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_width_end",
                    Values: 75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_distance",
                    Values: 1000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_damage",
                    Values: 250,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "boss_visage_passive",
            ScriptFile: "abilities/creatures/boss_visage_passive",
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "stone_threshold",
                    Values: 6250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "soul_assumption_count",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "soul_assumption_damage",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "soul_assumption_speed",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stone_duration",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "soul_assumption_radius",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "familiar_wake_interval",
                    Values: 6.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "boss_visage_ranged_attack",
            Behavior: AbilityBehavior.POINT,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            FightRecapLevel: 1,
            TextureName: "boss_visage_ranged_attack",
            ScriptFile: "abilities/creatures/boss_visage_ranged_attack",
            MaxLevel: 1,
            CastAnimation: GameActivity.DOTA_ATTACK,
            CastRange: 3000,
            CastPoint: 0.5,
            Cooldown: 1,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_speed",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_width_initial",
                    Values: 75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_width_end",
                    Values: 75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_distance",
                    Values: 3000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_damage",
                    Values: 400,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "boss_visage_grave_chill",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            FightRecapLevel: 1,
            TextureName: "boss_visage_grave_chill",
            ScriptFile: "abilities/creatures/boss_visage_grave_chill",
            MaxLevel: 1,
            CastAnimation: GameActivity.DOTA_ATTACK,
            CastRange: 3000,
            CastPoint: 0.5,
            Cooldown: 15,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "chill_speed",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "chill_radius",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "chill_count",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "chill_duration",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "chill_damage",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movespeed_bonus",
                    Values: 25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attackspeed_bonus",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "boss_visage_familiar_stone_form",
            TextureName: "boss_visage_familiar_stone_form",
            ScriptFile: "abilities/creatures/boss_visage_familiar_stone_form",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.AOE],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            CastRange: 160,
            CastPoint: 0.0,
            MaxLevel: 1,
            Sound: "Visage_Familiar.StoneForm.Cast",
            Cooldown: 5.0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_delay",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 1.0,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "monkey_king_jingu_mastery_aghsfort",
            ScriptFile: "abilities/heroes/monkey_king_jingu_mastery_aghsfort",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            FightRecapLevel: 1,
            Sound: "Hero_MonkeyKing.IronCudgel",
            TextureName: "monkey_king_jingu_mastery_aghsfort",
            CastAnimation: GameActivity.INVALID,
            Cooldown: [26, 22, 18, 14],
            ManaCost: [80, 90, 100, 110],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "required_hits",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "counter_duration",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "charges",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage",
                    Values: [60, 90, 120, 150],
                    LinkedSpecialBonus: "special_bonus_unique_monkey_king_2",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "lifesteal",
                    Values: [15, 30, 45, 60],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_duration",
                    Values: 10,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_brewmaster_thunderclap",
            ScriptFile: "abilities/creatures/aghsfort_brewmaster_thunderclap",
            TextureName: "polar_furbolg_ursa_warrior_thunder_clap",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            MaxLevel: 2,
            Behavior: AbilityBehavior.NO_TARGET,
            UnitDamageType: DamageType.MAGICAL,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            CastPoint: 1.0,
            Cooldown: 15.0,
            Damage: 200,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 255,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movespeed_slow",
                    Values: -25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attackspeed_slow",
                    Values: -25,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "speed",
                    Values: 0.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_brewmaster_primal_split",
            ScriptFile: "abilities/creatures/aghsfort_brewmaster_primal_split",
            Behavior: AbilityBehavior.NO_TARGET,
            Type: AbilityTypes.ULTIMATE,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 2,
            Sound: "Hero_Brewmaster.PrimalSplit.Spawn",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            HasScepterUpgrade: true,
            Cooldown: 140,
            CastPoint: 0.65,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: [16, 18, 20],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "split_duration",
                    Values: 0.6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "scepter_movementspeed",
                    Values: 100,
                    RequiresScepter: true,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_brewmaster_fire_permanent_immolation",
            TextureName: "brewmaster_fire_permanent_immolation",
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 220,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "brewmaster_unit_passive",
            ScriptFile: "abilities/creatures/brewmaster_unit_passive",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "aghsfort_naga_siren_mirror_image",
            ScriptFile: "abilities/creatures/aghsfort_naga_siren_mirror_image",
            Behavior: AbilityBehavior.NO_TARGET,
            Sound: "Hero_NagaSiren.MirrorImage",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            Cooldown: 30,
            CastPoint: 0.65,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "illusion_duration",
                    Values: 26,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "outgoing_damage",
                    Values: [-75, -70, -65, -60],
                    LinkedSpecialBonus: "special_bonus_unique_naga_siren_4",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "outgoing_damage_tooltip",
                    Values: [25, 30, 35, 40],
                    LinkedSpecialBonus: "special_bonus_unique_naga_siren_4",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "incoming_damage",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tooltip_incoming_damage_total_pct",
                    Values: 350,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "images_count",
                    Values: [3, 3, 3, 3],
                    LinkedSpecialBonus: "special_bonus_unique_naga_siren",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "invuln_duration",
                    Values: 0.3,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "tidehunter_passive",
            ScriptFile: "abilities/creatures/tidehunter_passive",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_counter_duration",
                    Values: 5.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_threshold",
                    Values: 3000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_counter_tiers",
                    Values: 6,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "time_before_reduction",
                    Values: 1.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "tidehunter_mini_ravage",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            FightRecapLevel: 2,
            Sound: "Ability.Ravage",
            CastRange: 0,
            CastPoint: [0.3, 0.3, 0.3],
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: 60.0,
            Damage: 600,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 800,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 725,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 1.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_luna_lucent_beam",
            TextureName: "aghsfort_luna_lucent_beam",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            FightRecapLevel: 1,
            Sound: "Hero_Luna.LucentBeam.Target",
            CastRange: 800,
            CastPoint: 0.4,
            Cooldown: 6.0,
            ManaCost: [90, 100, 110, 120],
            ModifierSupportValue: 0.5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 0.8,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "beam_damage",
                    Values: [75, 150, 225, 300],
                    LinkedSpecialBonus: "special_bonus_unique_luna_1",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 225,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_luna_eclipse",
            TextureName: "luna_eclipse",
            Behavior: AbilityBehavior.NO_TARGET,
            Type: AbilityTypes.ULTIMATE,
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 2,
            Sound: "Hero_Luna.Eclipse.Cast",
            CastPoint: [0.6, 0.6, 0.6],
            CastRange: 0,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: 140.0,
            ManaCost: [150, 200, 250],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cast_range_tooltip_scepter",
                    Values: 2500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "lucent_beam_radius",
                    Values: 225,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "beams",
                    Values: [8, 11, 14],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hit_count",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "beam_interval",
                    Values: [0.6, 0.6, 0.6],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "beam_interval_scepter",
                    Values: 0.3,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration_tooltip",
                    Values: [2.4, 4.2, 6.0],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: [675, 675, 675],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "beams_scepter",
                    Values: [10, 15, 20],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hit_count_scepter",
                    Values: [10, 15, 20],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration_tooltip_scepter",
                    Values: [1.8, 3.6, 5.4],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_omniknight_degen_aura",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.AURA],
            UnitTargetTeam: UnitTargetTeam.CUSTOM,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            TextureName: "omniknight_degen_aura",
            CastRange: [400, 500, 600, 700],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "move_speed_bonus",
                    Values: [10, 15, 20, 25],
                    LinkedSpecialBonus: "special_bonus_unique_omniknight_2",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_speed_bonus",
                    Values: [10, 15, 20, 25],
                    LinkedSpecialBonus: "special_bonus_unique_omniknight_2",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 300,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_omniknight_repel",
            TextureName: "omniknight_repel",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellImmunityType: SpellImmunityTypes.ALLIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            Sound: "Hero_Omniknight.Repel",
            CastRange: 500,
            CastPoint: 0.25,
            Cooldown: [21, 19, 17, 16],
            ManaCost: 75,
            ModifierSupportValue: 3.0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_reduction",
                    Values: [-8, -12, -16, -20],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_str",
                    Values: [7, 14, 21, 28],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hp_regen",
                    Values: [6, 9, 12, 15],
                    LinkedSpecialBonus: "special_bonus_unique_omniknight_5",
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_aura_reward_hp",
            TextureName: "granite_golem_hp_aura",
            MaxLevel: 5,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_hp",
                    Values: [10, 25, 40, 60, 100],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 5000,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_aura_reward_armor",
            TextureName: "pangolier_shield_crash",
            MaxLevel: 5,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_armor",
                    Values: [3, 6, 12, 24, 32],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 5000,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_aura_reward_crit_chance",
            TextureName: "juggernaut_blade_dance",
            MaxLevel: 5,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_chance",
                    Values: 15,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_multiplier",
                    Values: [140, 175, 225, 325, 450],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_aura_reward_magic_resist",
            MaxLevel: 5,
            Behavior: AbilityBehavior.PASSIVE,
            TextureName: "mudgolem_cloak_aura",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_magical_armor",
                    Values: [15, 25, 35, 55, 75],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_magical_armor_creeps",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 5000,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_tempbuff_corpse_explosion",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            TextureName: "pudge_flesh_heap",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 5000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "corpse_explosion_chance_pct",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "corpse_explosion_damage_pct",
                    Values: 25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "corpse_explosion_radius",
                    Values: 400,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "undead_tusk_mage_tombstone",
            TextureName: "undead_tusk_mage_tombstone",
            ScriptFile: "abilities/creatures/undead_tusk_mage_tombstone",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING],
            FightRecapLevel: 1,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            Sound: "Hero_Undying.Tombstone",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
            AnimationPlaybackRate: 0.5,
            CastRange: 600,
            CastPoint: 2.0,
            Cooldown: 10,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 40.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 800,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "skeleton_interval",
                    Values: 2.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "skeletons_per_tick",
                    Values: 1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_skeletons",
                    Values: 10,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_dark_seer_vacuum",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            FightRecapLevel: 1,
            Sound: "Hero_Dark_Seer.Vacuum",
            HasScepterUpgrade: true,
            CastRange: 600,
            CastPoint: 0.4,
            Cooldown: 15,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 550,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 0.6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius_tree",
                    Values: 275,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "scepter_cooldown",
                    Values: 12,
                    RequiresScepter: true,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "creature_dark_seer_wall_of_replica",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.VECTOR_TARGETING],
            Type: AbilityTypes.ULTIMATE,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            FightRecapLevel: 2,
            Sound: "Hero_Dark_Seer.Wall_of_Replica_Start",
            HasScepterUpgrade: true,
            CastRange: 700,
            CastPoint: 0.2,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: 15.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "scepter_length_multiplier",
                    Values: 2,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 15.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "replica_damage_outgoing",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tooltip_outgoing",
                    Values: [70, 85, 100],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "replica_damage_incoming",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tooltip_replica_total_damage_incoming",
                    Values: 200,
                    CalculateSpellDamageTooltip: false,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "width",
                    Values: 1300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "replica_scale",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_slow",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 0.75,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_lich_sinister_gaze",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.CHANNELLED, AbilityBehavior.DONT_CANCEL_CHANNEL],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            HasScepterUpgrade: true,
            ChannelTime: 3.0,
            Cooldown: 10,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "destination",
                    Values: 65,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "mana_drain",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cast_range",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "aoe_scepter",
                    Values: 400,
                    RequiresScepter: true,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "creature_lich_chain_frost",
            Type: AbilityTypes.ULTIMATE,
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            UnitDamageType: DamageType.MAGICAL,
            FightRecapLevel: 2,
            Sound: "Hero_Lich.ChainFrost",
            CastRange: 750,
            CastPoint: 0.3,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_6,
            Cooldown: 15,
            ManaCost: 0,
            ModifierSupportValue: 0.0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "jumps",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "jump_range",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_movement_speed",
                    Values: -65,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_attack_speed",
                    Values: -65,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 2.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "vision_radius",
                    Values: 800,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_jump_damage",
                    Values: 0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_tusk_mage_freezing_blast",
            ScriptFile: "abilities/creatures/tusk_mage_freezing_blast",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            CastRange: 750,
            CastPoint: 1.2,
            Cooldown: 8.0,
            ManaCost: 0,
            ModifierSupportValue: 0.5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "impact_damage",
                    Values: 125,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "projectile_speed",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "projectile_radius",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "projectile_distance",
                    Values: 1000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movespeed_slow",
                    Values: -15,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attackspeed_slow",
                    Values: -125,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 1.3,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ogreseal_flop",
            ScriptFile: "abilities/creatures/ogreseal_flop",
            TextureName: "ogreseal_flop",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE, AbilityBehavior.NORMAL_WHEN_STOLEN],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            UnitDamageType: DamageType.PHYSICAL,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            MaxLevel: 2,
            CastRange: 1000,
            CastPoint: 0.4,
            Cooldown: 6,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 275,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 475,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 0.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "friendly_ogreseal_flop",
            ScriptFile: "abilities/creatures/friendly_ogreseal_flop",
            TextureName: "ogreseal_flop",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE, AbilityBehavior.NORMAL_WHEN_STOLEN],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            UnitDamageType: DamageType.MAGICAL,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            MaxLevel: 2,
            CastRange: 1000,
            CastPoint: 0.4,
            Cooldown: 6,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 275,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 130,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 0.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "bomber_death_explosion",
            ScriptFile: "abilities/creatures/bomber_death_explosion",
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.MAGICAL,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "min_delay_time",
                    Values: 1.25,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_delay_time",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "is_ascension_ability",
                    Values: 0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "bomber_suicide_on_attack",
            ScriptFile: "abilities/creatures/bomber_suicide_on_attack",
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.MAGICAL,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "suicide_chance",
                    Values: 15,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_pudge_miniboss_hateful_strike",
            Behavior: AbilityBehavior.PASSIVE,
            Type: AbilityTypes.ULTIMATE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            Sound: "Hero_PhantomAssassin.CoupDeGrace",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "maxhp_percent_damage",
                    Values: 70,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "every_n_attacks",
                    Values: 3,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_pudge_dismember",
            Type: AbilityTypes.ULTIMATE,
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.CHANNELLED, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            UnitDamageType: DamageType.MAGICAL,
            FightRecapLevel: 2,
            HasScepterUpgrade: true,
            AbilityDraftUltScepterAbility: "pudge_eject",
            CastRange: 300,
            CastPoint: [0.3, 0.3, 0.3],
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            ChannelAnimation: GameActivity.DOTA_CHANNEL_ABILITY_4,
            ChannelTime: 999999,
            Cooldown: 20,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "order_lock_duration",
                    Values: 3,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "scepter_cooldown",
                    Values: 11,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "dismember_damage",
                    Values: 350,
                    LinkedSpecialBonus: "special_bonus_unique_pudge_3",
                    LinkedSpecialBonusField: "value",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "strength_damage",
                    Values: 0,
                    LinkedSpecialBonus: "special_bonus_unique_pudge_3",
                    LinkedSpecialBonusField: "value2",
                    CalculateSpellDamageTooltip: false,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "ticks",
                    Values: 999999,
                    LinkedSpecialBonus: "special_bonus_unique_pudge_6",
                    LinkedSpecialBonusField: "value2",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pull_units_per_second",
                    Values: 75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pull_distance_limit",
                    Values: 125,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "animation_rate",
                    Values: 1.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "abilitychanneltime",
                    Values: 0,
                    LinkedSpecialBonus: "special_bonus_unique_pudge_6",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "creep_dismember_duration_tooltip",
                    Values: [6.0, 6.0, 6.0],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "scepter_regen_pct",
                    Values: 4,
                    RequiresScepter: true,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_pudge_miniboss_flesh_heap",
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "health_regen",
                    Values: [0, 8, 16, 32],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "flesh_heap_strength_buff_amount",
                    Values: [0, 0, 0, 0],
                    LinkedSpecialBonus: "special_bonus_unique_pudge_1",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "flesh_heap_range",
                    Values: 1200,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "creature_pudge_miniboss_armor_corruption",
            Behavior: AbilityBehavior.PASSIVE,
            Type: AbilityTypes.ULTIMATE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            Cooldown: 3,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "armor_reduction_per_stack",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stack_duration",
                    Values: 10,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_wave_blast",
            Behavior: AbilityBehavior.POINT,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            UnitDamageType: DamageType.MAGICAL,
            Sound: "Hero_Invoker.DeafeningBlast",
            CastRange: 1200,
            CastPoint: 0.7,
            CastAnimation: GameActivity.INVALID,
            ManaCost: 0,
            Cooldown: 0,
            Charges: 1,
            ChargeRestoreTime: 2,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "playback_rate",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "travel_distance",
                    Values: 1200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "travel_speed",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius_start",
                    Values: 120,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius_end",
                    Values: 120,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration",
                    Values: 0.2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "disarm_duration",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "wave_cooldown",
                    Values: 5.75,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "animation_fade_in",
                    Values: 0.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_waveblaster_leap",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING, AbilityBehavior.ROOT_DISABLES],
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            Sound: "Ability.Leap",
            TextureName: "sandking_caustic_finale",
            Cooldown: 6.5,
            Charges: 1,
            ChargeRestoreTime: 6.5,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "min_range",
                    Values: 950,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "range",
                    Values: 1650,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "leap_speed",
                    Values: 1300.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "leap_acceleration",
                    Values: 6000.0,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_waveblaster_summon_ghost",
            TextureName: "kunkka_torrent",
            ScriptFile: "abilities/creatures/aghsfort_waveblaster_summon_ghost",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE, AbilityBehavior.IGNORE_CHANNEL],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            CastRange: 0,
            CastPoint: 0.0,
            Cooldown: 0,
            Damage: 0,
            ManaCost: 0,
            ModifierSupportValue: 0.5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spawn_count",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spawn_distance",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "spawn_delay",
                    Values: 1.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "kunkka_torrent_dm",
            TextureName: "kunkka_torrent",
            ScriptFile: "abilities/creatures/kunkka_torrent_dm",
            Behavior: [AbilityBehavior.AOE, AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            CastRange: 1500,
            CastPoint: 0.4,
            Cooldown: [16, 14, 12, 10],
            Damage: [75, 150, 225, 300],
            ManaCost: 0,
            ModifierSupportValue: 0.5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 225,
                    LinkedSpecialBonus: "special_bonus_unique_kunkka",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movespeed_bonus",
                    Values: -35,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: [1.75, 2.5, 3.25, 4.0],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 1.6,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "delay",
                    Values: [1.6, 1.6, 1.6, 1.6],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_kraken_shell",
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_reduction",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_cleanse",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_reset_interval",
                    Values: [6.0, 6.0, 6.0, 6.0],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_tidehunter_gush",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            HasScepterUpgrade: true,
            CastRange: 800,
            CastPoint: 0.6,
            Cooldown: 20,
            Duration: 2.0,
            Damage: 800,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "duration",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 800,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_speed",
                    Values: -25,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "negative_armor",
                    Values: 10,
                    LinkedSpecialBonus: "special_bonus_unique_tidehunter",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed_scepter",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "aoe_scepter",
                    Values: 240,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cooldown_scepter",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cast_range_scepter",
                    Values: 800,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_duration",
                    Values: 0.25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_max_distance",
                    Values: 200,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_blink_strike",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.IGNORE_BACKSWING, AbilityBehavior.ROOT_DISABLES],
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            UnitTargetTeam: UnitTargetTeam.CUSTOM,
            UnitTargetType: UnitTargetType.CUSTOM,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            Sound: "Hero_Riki.Blink_Strike",
            CastRange: 800,
            CastPoint: 0.4,
            Cooldown: 10,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tooltip_range",
                    Values: 700,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage",
                    Values: 400,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "bandit_stifling_dagger",
            ScriptFile: "abilities/creatures/bandit_stifling_dagger",
            TextureName: "phantom_assassin_stifling_dagger",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Behavior: [AbilityBehavior.CHANNELLED, AbilityBehavior.POINT],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            FightRecapLevel: 1,
            CastRange: 10000,
            CastPoint: 1.1,
            ChannelTime: 0.9,
            Duration: 4,
            Cooldown: 14,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "dagger_range",
                    Values: 1200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "move_slow",
                    Values: -50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "dagger_speed",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "base_damage",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_factor",
                    Values: -30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_factor_tooltip",
                    Values: 70,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "dagger_count",
                    Values: 12,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "dagger_offset",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "dagger_rate",
                    Values: 0.14,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "bandit_archer_arrow",
            ScriptFile: "abilities/creatures/bandit_archer_arrow",
            TextureName: "mirana_arrow",
            Behavior: AbilityBehavior.POINT,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.PURE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            MaxLevel: 1,
            CastAnimation: GameActivity.DOTA_ATTACK,
            CastRange: 4000,
            CastPoint: 1.2,
            AnimationPlaybackRate: 0.7,
            AnimationIgnoresModelScale: true,
            Cooldown: 6,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_speed",
                    Values: 650,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_width_initial",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_width_end",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_distance",
                    Values: 4000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_damage",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "break_duration",
                    Values: 3.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_juggernaut_blade_fury",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE, AbilityBehavior.IGNORE_CHANNEL],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            CastRange: 0,
            CastPoint: 0,
            Cooldown: 17,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "blade_fury_damage_tick",
                    Values: 0.2,
                    CalculateSpellDamageTooltip: false,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "blade_fury_radius",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "blade_fury_damage",
                    Values: 300,
                    LinkedSpecialBonus: "special_bonus_unique_juggernaut_3",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 5.0,
                    LinkedSpecialBonus: "special_bonus_unique_juggernaut",
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "creature_juggernaut_omnislash",
            Type: AbilityTypes.ULTIMATE,
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: [UnitTargetFlags.MAGIC_IMMUNE_ENEMIES, UnitTargetFlags.NOT_ANCIENTS],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            UnitDamageType: DamageType.PHYSICAL,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 2,
            CastRange: 350,
            CastPoint: 0.3,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: 25,
            ManaCost: 0,
            ModifierSupportValue: 0.0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "attack_rate_multiplier",
                    Values: 1.7,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage",
                    Values: 250,
                    CalculateSpellDamageTooltip: false,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "omni_slash_radius",
                    Values: 425,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "sand_king_boss_passive",
            TextureName: "sandking_caustic_finale",
            ScriptFile: "abilities/creatures/sand_king_boss_passive",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "caustic_armor_reduction_pct",
                    Values: 33,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "caustic_duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "caustic_radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "caustic_damage",
                    Values: 1500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "accuracy_pct",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "sand_king_claw_attack",
            TextureName: "bloodseeker_bloodrage",
            ScriptFile: "abilities/creatures/sand_king_claw_attack",
            CastAnimation: GameActivity.DOTA_ATTACK,
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            UnitDamageType: DamageType.PHYSICAL,
            AnimationIgnoresModelScale: true,
            CastRange: 450,
            CastPoint: 1.1,
            Cooldown: 1.00,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 2500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_radius",
                    Values: 110,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "animation_time",
                    Values: 1.00,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "initial_delay",
                    Values: 0.85,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "forward_movement",
                    Values: 60,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "sand_king_tail_swipe_left",
            TextureName: "bloodseeker_bloodrage",
            ScriptFile: "abilities/creatures/sand_king_tail_swipe_left",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_5,
            Behavior: AbilityBehavior.NO_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            UnitDamageType: DamageType.PHYSICAL,
            AnimationIgnoresModelScale: true,
            CastRange: 450,
            CastPoint: 1.98,
            Cooldown: 10.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 3500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_radius",
                    Values: 110,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "animation_time",
                    Values: 1.98,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "initial_delay",
                    Values: 1.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movespeed_slow",
                    Values: -100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attackspeed_slow",
                    Values: -100,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "sand_king_tail_swipe_right",
            TextureName: "bloodseeker_bloodrage",
            ScriptFile: "abilities/creatures/sand_king_tail_swipe_right",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_5,
            Behavior: AbilityBehavior.NO_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            UnitDamageType: DamageType.PHYSICAL,
            AnimationIgnoresModelScale: true,
            CastRange: 450,
            CastPoint: 1.98,
            Cooldown: 10,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 3500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_radius",
                    Values: 110,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "animation_time",
                    Values: 1.98,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "initial_delay",
                    Values: 1.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance",
                    Values: 800,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movespeed_slow",
                    Values: -100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attackspeed_slow",
                    Values: -100,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "sand_king_burrowed_forward_strike",
            TextureName: "bloodseeker_bloodrage",
            ScriptFile: "abilities/creatures/sand_king_burrowed_forward_strike",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_7,
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            UnitDamageType: DamageType.PHYSICAL,
            AnimationIgnoresModelScale: true,
            CastRange: 450,
            CastPoint: 2.75,
            Cooldown: 4.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 4000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_radius",
                    Values: 125,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "animation_time",
                    Values: 3.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "initial_delay",
                    Values: 2.4,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height",
                    Values: 0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "sand_king_burrowed_backward_strike",
            TextureName: "bloodseeker_bloodrage",
            ScriptFile: "abilities/creatures/sand_king_burrowed_backward_strike",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_ROT,
            Behavior: AbilityBehavior.NO_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            UnitDamageType: DamageType.PHYSICAL,
            AnimationIgnoresModelScale: true,
            CastRange: 450,
            CastPoint: 2.75,
            Cooldown: 4.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 3500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_radius",
                    Values: 125,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "animation_time",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "initial_delay",
                    Values: 2.4,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 2.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height",
                    Values: 0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "sand_king_boss_burrow",
            ScriptFile: "abilities/creatures/sand_king_boss_burrow",
            TextureName: "nyx_assassin_burrow",
            Behavior: AbilityBehavior.NO_TARGET,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            MaxLevel: 1,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_RAZE_1,
            CastPoint: 2.0,
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "sand_king_boss_burrowstrike",
            TextureName: "sandking_burrowstrike",
            ScriptFile: "abilities/creatures/sand_king_boss_burrowstrike",
            CastAnimation: GameActivity.DOTA_SAND_KING_BURROW_IN,
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE],
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            CastPoint: 0.8,
            CastRange: 3000,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 1000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 1500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "delay",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "scaling_speed",
                    Values: 900,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "sand_king_boss_sandstorm",
            TextureName: "sandking_sand_storm",
            ScriptFile: "abilities/creatures/sand_king_boss_sandstorm",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.CHANNELLED, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            Sound: "Ability.SandKing_SandStorm.start",
            CastAnimation: GameActivity.DOTA_SPAWN,
            CastPoint: 2.0,
            CastRange: 0,
            Duration: 50,
            Cooldown: 34,
            ChannelTime: 15,
            Damage: 500,
            ManaCost: [60, 50, 40, 30],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "sand_storm_invis_delay",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "sand_storm_radius",
                    Values: 700,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "channel_time",
                    Values: 15.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "storm_count_per_player",
                    Values: 1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "storm_angle_step",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "storm_speed",
                    Values: 325,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "storm_speed_step",
                    Values: 40,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spiral_storm_count",
                    Values: 12,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "sand_king_boss_sandstorm_storm_passive",
            TextureName: "sandking_sand_storm",
            ScriptFile: "abilities/creatures/sand_king_boss_sandstorm_storm_passive",
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "sand_storm_radius",
                    Values: 165,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 800,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movespeed_pct",
                    Values: 33,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "storm_move_speed",
                    Values: 325,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "blind_duration",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "storm_decreased_turn_rate",
                    Values: 150,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "sand_king_boss_epicenter",
            TextureName: "sandking_epicenter",
            ScriptFile: "abilities/creatures/sand_king_boss_epicenter",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.CHANNELLED, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            CastPoint: 2.0,
            CastRange: 0,
            Cooldown: 34,
            ChannelTime: 15,
            ManaCost: 60,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed_step",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pulse_end_width",
                    Values: 110,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "random_pulses_step",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "interval",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pulse_width",
                    Values: 110,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pulse_distance",
                    Values: 5000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "min_pulse_speed",
                    Values: 450,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "blocker_radius",
                    Values: 225,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "min_random_pulses",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_random_pulses",
                    Values: 15,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_pulse_speed",
                    Values: 1150,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "sand_king_boss_unburrow",
            ScriptFile: "abilities/creatures/sand_king_boss_unburrow",
            TextureName: "nyx_assassin_unburrow",
            Behavior: AbilityBehavior.NO_TARGET,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            MaxLevel: 1,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_RAZE_2,
            CastPoint: 2.0,
            Cooldown: 0.0,
            ManaCost: 0,
        });
    
        this.Abilities.push({
            Name: "sand_king_boss_move_left",
            TextureName: "bloodseeker_bloodrage",
            ScriptFile: "abilities/creatures/sand_king_boss_move_left",
            CastAnimation: GameActivity.DOTA_RUN,
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            UnitDamageType: DamageType.PHYSICAL,
            AnimationIgnoresModelScale: true,
            CastRange: 550,
            CastPoint: 10,
            Cooldown: 5,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "minimum_duration",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "maximum_duration",
                    Values: 1.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "sand_king_boss_move_right",
            TextureName: "bloodseeker_bloodrage",
            ScriptFile: "abilities/creatures/sand_king_boss_move_right",
            CastAnimation: GameActivity.DOTA_RUN,
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            UnitDamageType: DamageType.PHYSICAL,
            AnimationIgnoresModelScale: true,
            CastRange: 550,
            CastPoint: 10,
            Cooldown: 5,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "minimum_duration",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "maximum_duration",
                    Values: 1.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "sand_king_boss_move_back",
            TextureName: "bloodseeker_bloodrage",
            ScriptFile: "abilities/creatures/sand_king_boss_move_back",
            CastAnimation: GameActivity.DOTA_RUN,
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            UnitDamageType: DamageType.PHYSICAL,
            AnimationIgnoresModelScale: true,
            CastRange: 300,
            CastPoint: 10,
            Cooldown: 5,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "minimum_duration",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "maximum_duration",
                    Values: 1.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "nyx_suicide_heal",
            ScriptFile: "abilities/creatures/nyx_suicide_heal",
            TextureName: "nyx_assassin_unburrow",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.BOTH,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: UnitTargetFlags.NOT_MAGIC_IMMUNE_ALLIES,
            UnitDamageType: DamageType.PURE,
            CastRange: 200,
            CastPoint: 0.0,
            Cooldown: 15.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "heal",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 350,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "burrower_big_explosion",
            ScriptFile: "abilities/creatures/burrower_big_explosion",
            TextureName: "polar_furbolg_ursa_warrior_thunder_clap",
            MaxLevel: 1,
            Behavior: AbilityBehavior.NO_TARGET,
            UnitDamageType: DamageType.MAGICAL,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            CastPoint: 0.67,
            Cooldown: 10,
            Damage: 400,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 1250,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ability_storegga_rock",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
        });
    
        this.Abilities.push({
            Name: "storegga_arm_slam",
            ScriptFile: "abilities/creatures/storegga_arm_slam",
            TextureName: "bloodseeker_bloodrage",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_7,
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            UnitTargetFlags: [UnitTargetFlags.MAGIC_IMMUNE_ENEMIES, UnitTargetFlags.INVULNERABLE],
            UnitDamageType: DamageType.PHYSICAL,
            AnimationIgnoresModelScale: true,
            MaxLevel: 5,
            CastRange: 450,
            CastPoint: [2.20, 2.05, 1.90, 1.75, 1.6],
            AnimationPlaybackRate: [1.0, 1.0732, 1.1579, 1.2571, 1.375],
            Cooldown: 2.2,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [2250, 2700, 3150, 3600, 4050],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_radius",
                    Values: [200, 210, 220, 230, 240],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "animation_time",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "initial_delay",
                    Values: 1.2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: [1.5, 1.75, 2.0, 2.25, 2.5],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "storegga_grab",
            TextureName: "bloodseeker_bloodrage",
            ScriptFile: "abilities/creatures/storegga_grab",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_6,
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.BOTH,
            UnitTargetType: UnitTargetType.ALL,
            UnitTargetFlags: [UnitTargetFlags.MAGIC_IMMUNE_ENEMIES, UnitTargetFlags.INVULNERABLE],
            UnitDamageType: DamageType.PHYSICAL,
            MaxLevel: 5,
            AnimationIgnoresModelScale: true,
            CastRange: 450,
            CastPoint: 2.0,
            AnimationPlaybackRate: 0.35,
            Cooldown: 20.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "grab_radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "animation_time",
                    Values: 2.00,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "initial_delay",
                    Values: 1.2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "min_hold_time",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_hold_time",
                    Values: 4.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "storegga_grab_throw",
            TextureName: "storegga_grab_throw",
            ScriptFile: "abilities/creatures/storegga_grab_throw",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_5,
            Behavior: [AbilityBehavior.AOE, AbilityBehavior.POINT],
            UnitDamageType: DamageType.MAGICAL,
            MaxLevel: 5,
            CastRange: 1500,
            CastPoint: 1.25,
            AnimationPlaybackRate: 0.7,
            Cooldown: 0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "throw_speed",
                    Values: 1600,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_radius",
                    Values: [235, 240, 245, 250, 255],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: [2.0, 2.2, 2.4, 2.6, 2.8],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_duration",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance",
                    Values: 275,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_damage",
                    Values: [2100, 2520, 2940, 3360, 3780],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height",
                    Values: 150,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "storegga_ground_pound",
            ScriptFile: "abilities/creatures/storegga_ground_pound",
            TextureName: "omniknight_guardian_angel",
            Type: AbilityTypes.ULTIMATE,
            Behavior: [AbilityBehavior.CHANNELLED, AbilityBehavior.NO_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 2,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            AnimationIgnoresModelScale: true,
            MaxLevel: 5,
            Cooldown: [15.0, 13.0, 11.0, 9.0, 7.0],
            ChannelTime: 2.8,
            CastPoint: [1.6, 1.45, 1.3, 1.15, 1.0],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pound_interval",
                    Values: 1.1161,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: [0.3, 0.6, 0.9, 1.2, 1.5],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [1600, 1920, 2240, 2560, 2880],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movespeed_slow",
                    Values: -75,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "cast_point_playback_rate",
                    Values: [1.5625, 1.7241, 1.9231, 2.1739, 2.5391],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "channel_playback_rate",
                    Values: 0.8929,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "storegga_avalanche",
            ScriptFile: "abilities/creatures/storegga_avalanche",
            TextureName: "omniknight_guardian_angel",
            Type: AbilityTypes.ULTIMATE,
            Behavior: [AbilityBehavior.CHANNELLED, AbilityBehavior.NO_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 2,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            AnimationIgnoresModelScale: true,
            MaxLevel: 5,
            Cooldown: [35, 34, 33, 30, 29],
            ChannelTime: 10.0,
            CastPoint: [2.0, 1.75, 1.5, 1.25, 1.0],
            AnimationPlaybackRate: [1.0, 1.1429, 1.3333, 1.6000, 1.75],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "interval",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [400, 480, 560, 640, 720],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 225,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement",
                    Values: [300, 320, 340, 360, 380],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "storegga_passive",
            ScriptFile: "abilities/creatures/storegga_passive",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "temple_guardian_hammer_smash",
            ScriptFile: "abilities/creatures/temple_guardian_hammer_smash",
            TextureName: "centaur_double_edge",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitDamageType: DamageType.PHYSICAL,
            CastRange: 350,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_6,
            AnimationIgnoresModelScale: true,
            CastPoint: [1.05, 1.00, 0.95, 0.9, 0.85],
            Cooldown: [2.0, 1.85, 1.7, 1.55, 1.4],
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "playback_rate",
                    Values: [0.4238, 0.4450, 0.4684, 0.4944, 0.54],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_radius",
                    Values: [230, 238, 246, 254, 262],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: [0.8, 0.9, 1.0, 1.1, 1.2],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [800, 960, 1120, 1280, 1440],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "temple_guardian_rage_hammer_smash",
            ScriptFile: "abilities/creatures/temple_guardian_rage_hammer_smash",
            TextureName: "centaur_double_edge",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitDamageType: DamageType.PHYSICAL,
            CastRange: 350,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_6,
            AnimationIgnoresModelScale: true,
            CastPoint: [0.65, 0.6, 0.55, 0.5, 0.45],
            Cooldown: [1.30, 1.25, 1.20, 1.15, 1.1],
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "playback_rate",
                    Values: [0.6840, 0.7410, 0.8084, 0.8892, 0.988],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_radius",
                    Values: [230, 238, 246, 254, 262],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: [0.8, 0.9, 1.0, 1.1, 1.2],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [900, 1080, 1260, 1440, 1620],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "temple_guardian_purification",
            ScriptFile: "abilities/creatures/temple_guardian_purification",
            TextureName: "omniknight_purification",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.AOE],
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.PURE,
            UnitTargetFlags: UnitTargetFlags.NOT_MAGIC_IMMUNE_ALLIES,
            SpellImmunityType: SpellImmunityTypes.ALLIES_NO,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            FightRecapLevel: 1,
            CastRange: 800,
            CastPoint: [1.2, 1.1, 1.0, 0.9, 0.8],
            Cooldown: [23, 22, 21, 20, 19],
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "playback_rate",
                    Values: [0.4000, 0.4364, 0.4800, 0.5333, 0.6],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "heal",
                    Values: [600, 720, 840, 960, 1080],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 300,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "temple_guardian_wrath",
            ScriptFile: "abilities/creatures/temple_guardian_wrath",
            TextureName: "omniknight_guardian_angel",
            Type: AbilityTypes.ULTIMATE,
            Behavior: [AbilityBehavior.CHANNELLED, AbilityBehavior.NO_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.PURE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 2,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: [30, 29, 28, 27, 26],
            ChannelTime: 8.0,
            CastPoint: 1.0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "effect_radius",
                    Values: 2000,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "delay",
                    Values: [1.5, 1.45, 1.4, 1.35, 1.3],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "blast_damage",
                    Values: [400, 480, 560, 640, 720],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "channel_duration",
                    Values: 8.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "interval",
                    Values: 0.06,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "block_cooldown",
                    Values: 0.001,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "temple_guardian_hammer_throw",
            ScriptFile: "abilities/creatures/temple_guardian_hammer_throw",
            TextureName: "sven_storm_bolt",
            Behavior: AbilityBehavior.POINT,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.PHYSICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_REFRACTION,
            CastRange: 1300,
            CastPoint: [1.3, 1.2, 1.1, 1.0, 0.9],
            Cooldown: 10,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "playback_rate",
                    Values: [0.4615, 0.5000, 0.5455, 0.6000, 0.6666],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: [200, 210, 220, 230, 240],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "throw_duration",
                    Values: [2.4, 2.2, 2.0, 1.8, 1.6],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hammer_damage",
                    Values: [600, 720, 840, 960, 1080],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "temple_guardian_passive",
            ScriptFile: "abilities/creatures/temple_guardian_passive",
            TextureName: "temple_guardian_passive",
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "nonrage_status_resistance",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "rage_move_speed_bonus",
                    Values: [40, 40, 40, 40, 60],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "rage_model_scale_bonus",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "rage_turn_rate_bonus_pct",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_warlock_shadow_word",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.BOTH,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            CastPoint: 0.5,
            Cooldown: 25,
            Damage: 30,
            ManaCost: 0,
            CastRange: 700,
            ModifierSupportValue: 0.0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 8.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tick_interval",
                    Values: 1.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "warlock_hp_aura",
            ScriptFile: "abilities/creatures/warlock_hp_aura",
            TextureName: "granite_golem_hp_aura",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            UnitTargetType: UnitTargetType.CREEP,
            UnitTargetFlags: UnitTargetFlags.NOT_ANCIENTS,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_hp_multiplier",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 750,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "lifestealer_passive",
            ScriptFile: "abilities/creatures/lifestealer_passive",
            TextureName: "life_stealer_rage",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_counter_duration",
                    Values: 5.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_threshold_pct_of_max",
                    Values: 25.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_counter_tiers",
                    Values: 6,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "enrage_duration",
                    Values: 6.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "enrage_movespeed_bonus",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "enrage_attack_speed_bonus",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "enrage_model_scale_bonus",
                    Values: 40,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "time_before_reduction",
                    Values: 1.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_lifestealer_enraged_pulse",
            Behavior: [AbilityBehavior.IMMEDIATE, AbilityBehavior.NO_TARGET],
            UnitDamageType: DamageType.MAGICAL,
            Cooldown: 0.0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "range",
                    Values: 350,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "angle",
                    Values: 360,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration",
                    Values: 0.3,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_distance",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 350,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_grimstroke_spirit_walk",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            Sound: "Hero_ObsidianDestroyer.AstralImprisonment",
            FightRecapLevel: 1,
            Cooldown: 16,
            CastRange: 700,
            CastPoint: 0.15,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "buff_duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movespeed_bonus_pct",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_damage",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_stun",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_per_tick",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tick_rate",
                    Values: 0.2,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tick_dps_tooltip",
                    Values: 50,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
        });
    
        this.Abilities.push({
            Name: "aghsfort_spectre_active_dispersion",
            Behavior: AbilityBehavior.NO_TARGET,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            Cooldown: 16,
            CastPoint: 1.2,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_reflection_pct",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 700,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 450,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_tower_blast_wave",
            Behavior: AbilityBehavior.NO_TARGET,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            Cooldown: 14,
            CastPoint: 1.2,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_pct",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 1200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 250,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_morphling_waveform",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING, AbilityBehavior.ROOT_DISABLES],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            FightRecapLevel: 1,
            Sound: "Hero_Morphling.Waveform",
            CastRange: 1000,
            CastPoint: 0.7,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            Cooldown: 15,
            Damage: 475,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "width",
                    Values: 200,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_creature_impale",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            FightRecapLevel: 1,
            CastRange: 1500,
            CastPoint: 1.0,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            Cooldown: 6.0,
            ManaCost: 0,
            Damage: 275,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "width",
                    Values: 125,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 0.3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "length",
                    Values: 1500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cooldown_upgrade",
                    Values: 7,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_creature_spiked_carapace",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitDamageType: DamageType.PURE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            TextureName: "nyx_assassin_spiked_carapace",
            Cooldown: 9,
            CastPoint: 0.4,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "reflect_duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage",
                    Values: 225,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_armor",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_intellect",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "burrow_aoe",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_reflect_pct",
                    Values: 0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "scarab_priest_summon_zealots",
            ScriptFile: "abilities/creatures/scarab_priest_summon_zealots",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            CastRange: 0,
            CastPoint: 0.69,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            Cooldown: 6.0,
            Duration: 14,
            Damage: 0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "mound_duration",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spawn_count",
                    Values: 1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spawn_distance",
                    Values: 350,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_count",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_summons",
                    Values: 3,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "phoenix_passive",
            ScriptFile: "abilities/creatures/phoenix_passive",
            Behavior: AbilityBehavior.PASSIVE,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_phoenix_icarus_dive",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING, AbilityBehavior.ROOT_DISABLES],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            Sound: "Hero_Phoenix.IcarusDive.Cast",
            CastPoint: 0.2,
            Cooldown: 17,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hp_cost_perc",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "dash_length",
                    Values: 1400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "dash_width",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hit_radius",
                    Values: 230,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_duration",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_per_second",
                    Values: 350,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_tick_interval",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_movement_speed_pct",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "dive_duration",
                    Values: 4.0,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_phoenix_icarus_dive_stop",
            Behavior: [AbilityBehavior.IMMEDIATE, AbilityBehavior.NO_TARGET, AbilityBehavior.NOT_LEARNABLE, AbilityBehavior.HIDDEN, AbilityBehavior.DONT_RESUME_ATTACK],
            CastPoint: 0.0,
            CastAnimation: GameActivity.INVALID,
        });
    
        this.Abilities.push({
            Name: "aghsfort_phoenix_fire_spirits",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            Sound: "Hero_Phoenix.FireSpirits.Cast",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastRange: 1400,
            Cooldown: 10,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hp_cost_perc",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "spirit_duration",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spirit_speed",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 175,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attackspeed_slow",
                    Values: -100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_per_second",
                    Values: 450,
                    LinkedSpecialBonus: "special_bonus_unique_phoenix_3",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spirit_count",
                    Values: 1,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tick_interval",
                    Values: 1.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_phoenix_launch_fire_spirit",
            Type: AbilityTypes.BASIC,
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE, AbilityBehavior.IGNORE_BACKSWING, AbilityBehavior.HIDDEN],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            Sound: "Hero_Phoenix.FireSpirits.Launch",
            CastRange: 1400,
            CastAnimation: GameActivity.INVALID,
            Cooldown: 0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hp_cost_perc",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "spirit_duration",
                    Values: 20.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spirit_speed",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 175,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attackspeed_slow",
                    Values: -100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_per_second",
                    Values: 110,
                    LinkedSpecialBonus: "special_bonus_unique_phoenix_3",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spirit_count",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tick_interval",
                    Values: 1.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_phoenix_supernova",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            UnitTargetFlags: UnitTargetFlags.NOT_CREEP_HERO,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 2,
            Sound: "Hero_Phoenix.SuperNova.Begin",
            CastRange: 600,
            CastPoint: 1.7,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_5,
            Cooldown: 40,
            Duration: 6.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "aura_radius",
                    Values: 1300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_per_sec",
                    Values: 350,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_hero_attacks",
                    Values: 13,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "caster_life_pct",
                    Values: 40.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "ember_spirit_fireball",
            ScriptFile: "abilities/creatures/ember_spirit_fireball",
            TextureName: "item_heavens_halberd",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            FightRecapLevel: 1,
            MaxLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
            CastRange: 1200,
            CastPoint: 1.0,
            AnimationIgnoresModelScale: true,
            Cooldown: 10,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 700,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_width_initial",
                    Values: 125,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_width_end",
                    Values: 125,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_distance",
                    Values: 1500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "disarm_duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_damage",
                    Values: 1200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "preview_fx_radius",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_dragon_knight_breathe_fire",
            Behavior: [AbilityBehavior.DIRECTIONAL, AbilityBehavior.POINT, AbilityBehavior.UNIT_TARGET],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            UnitDamageType: DamageType.MAGICAL,
            FightRecapLevel: 1,
            Sound: "Hero_DragonKnight.BreathFire",
            CastRange: 600,
            CastPoint: 0.8,
            Cooldown: 13,
            Damage: 600,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "start_radius",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "end_radius",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "range",
                    Values: 750,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 800,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "debuff_duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "anim_playback_speed",
                    Values: 0.5,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_dragon_knight_dragon_tail",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            FightRecapLevel: 1,
            Sound: "Hero_DragonKnight.DragonTail.Target",
            CastRange: 150,
            CastPoint: 0.0,
            Cooldown: 16,
            Damage: 300,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 1.5,
                    LinkedSpecialBonus: "special_bonus_unique_dragon_knight_2",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "dragon_cast_range",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 800,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_dragon_knight_elder_dragon_form",
            Behavior: AbilityBehavior.NO_TARGET,
            Type: AbilityTypes.ULTIMATE,
            SpellImmunityType: SpellImmunityTypes.ALLIES_YES_ENEMIES_NO,
            UnitDamageType: DamageType.MAGICAL,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 2,
            Sound: "Hero_DragonKnight.ElderDragonForm",
            HasScepterUpgrade: true,
            MaxLevel: 3,
            CastAnimation: GameActivity.INVALID,
            Cooldown: 115,
            ManaCost: 0,
            ModifierSupportValue: 0.35,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "frost_bonus_attack_speed",
                    Values: -30,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "frost_duration",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "frost_aoe",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "magic_resistance",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "model_scale",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: -1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_movement_speed",
                    Values: 25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_range",
                    Values: 450,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_damage",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "corrosive_breath_damage",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "corrosive_breath_duration",
                    Values: 5.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "splash_radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "splash_damage_percent",
                    Values: 70,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "frost_bonus_movement_speed",
                    Values: -30,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "underlord_channelled_buff",
            ScriptFile: "abilities/creatures/underlord_channelled_buff",
            TextureName: "ogre_magi_bloodlust",
            CastAnimation: GameActivity.DOTA_VICTORY,
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.CHANNELLED, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: [UnitTargetType.CREEP, UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: UnitTargetFlags.NOT_MAGIC_IMMUNE_ALLIES,
            CastRange: 600,
            CastPoint: 0.56,
            Cooldown: 1.0,
            ChannelTime: 10.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "modelscale",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_movement_speed",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_speed",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "interrupted_cooldown",
                    Values: 4,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_underlord_firestorm",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            CastRange: 750,
            CastPoint: 0.6,
            FightRecapLevel: 1,
            Cooldown: 12.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "building_damage",
                    Values: 33,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "wave_duration",
                    Values: 3.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "wave_count",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "wave_damage",
                    Values: 240,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "wave_interval",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_damage",
                    Values: 0.0,
                    CalculateSpellDamageTooltip: false,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_interval",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_duration",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "first_wave_delay",
                    Values: 0.0,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "spider_egg_sack",
            ScriptFile: "abilities/creatures/spider_egg_sack",
            TextureName: "venomancer_venomous_gale",
            Behavior: AbilityBehavior.PASSIVE,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 275,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spider_min",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spider_max",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "trigger_radius",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 3.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "mini_spider_slow_attack",
            ScriptFile: "abilities/creatures/mini_spider_slow_attack",
            TextureName: "broodmother_poison_sting",
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            ModifierSupportBonus: 15,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_speed_slow",
                    Values: -3,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 1.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "broodmother_accrue_children",
            ScriptFile: "abilities/creatures/broodmother_accrue_children",
            TextureName: "broodmother_spawn_spiderlings",
            Behavior: AbilityBehavior.PASSIVE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "babies_to_spawn",
                    Values: 4,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "huge_brood_passive",
            ScriptFile: "abilities/creatures/huge_brood_passive",
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "status_resistance",
                    Values: 97,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "huge_broodmother_accrue_children",
            ScriptFile: "abilities/creatures/huge_broodmother_accrue_children",
            TextureName: "broodmother_spawn_spiderlings",
            Behavior: AbilityBehavior.PASSIVE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "babies_to_spawn",
                    Values: 8,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "broodmother_generate_children",
            ScriptFile: "abilities/creatures/broodmother_generate_children",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            CastRange: 0,
            CastPoint: 0.69,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            Cooldown: 5.0,
            Duration: 14,
            Damage: 0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "totem_damage_percentage",
                    Values: [100, 200, 300, 400],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tooltip_duration",
                    Values: 14.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "distance_scepter",
                    Values: 1100,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "aftershock_range",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "spawn_interval",
                    Values: 0.09,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "huge_broodmother_generate_children",
            ScriptFile: "abilities/creatures/huge_broodmother_generate_children",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            CastRange: 0,
            CastPoint: 0.69,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            Cooldown: 5.0,
            Duration: 14,
            Damage: 0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "totem_damage_percentage",
                    Values: [100, 200, 300, 400],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tooltip_duration",
                    Values: 14.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "distance_scepter",
                    Values: 1100,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "aftershock_range",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "spawn_interval",
                    Values: 0.075,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "huge_brood_summon_eggs",
            ScriptFile: "abilities/creatures/huge_brood_summon_eggs",
            TextureName: "broodmother_spawn_spiderlings",
            Behavior: AbilityBehavior.NO_TARGET,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            CastPoint: 1.0,
            Cooldown: 16.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "egg_spawns",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spider_spawns",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_summoned_units",
                    Values: 12,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "summon_radius",
                    Values: 475,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "kidnap_spider_summon_eggs",
            ScriptFile: "abilities/creatures/kidnap_spider_summon_eggs",
            TextureName: "broodmother_spawn_spiderlings",
            Behavior: AbilityBehavior.NO_TARGET,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            CastPoint: 0.75,
            Cooldown: 15.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "egg_spawns",
                    Values: 1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spider_spawns",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_summoned_units",
                    Values: 6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "summon_radius",
                    Values: 200,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "broodmother_web",
            ScriptFile: "abilities/creatures/broodmother_web",
            Behavior: AbilityBehavior.POINT,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            CastRange: 900,
            CastPoint: 1.0,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            Cooldown: 12.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 1200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_distance",
                    Values: 1600,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_radius",
                    Values: 125,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "root_duration",
                    Values: 1.75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height",
                    Values: 65,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration",
                    Values: 0.38,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "baby_broodmother_passive",
            ScriptFile: "abilities/creatures/baby_broodmother_passive",
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.MAGICAL,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "launch_duration",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 40,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "magic_resistance",
                    Values: -15,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 2000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "landing_damage",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height",
                    Values: 37,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration",
                    Values: 0.37,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_batrider_flaming_lasso",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            Type: AbilityTypes.ULTIMATE,
            FightRecapLevel: 2,
            Sound: "Hero_Batrider.FlamingLasso.Cast",
            CastAnimation: GameActivity.INVALID,
            HasScepterUpgrade: true,
            CastPoint: 0.1,
            CastRange: 160,
            Cooldown: 12,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 9,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "drag_distance",
                    Values: 180,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "break_distance",
                    Values: 425,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "grab_radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "grab_radius_scepter",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_scepter",
                    Values: 100,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "puck_flying_bomb",
            ScriptFile: "abilities/creatures/puck_flying_bomb",
            TextureName: "sven_storm_bolt",
            Behavior: AbilityBehavior.POINT,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_REFRACTION,
            CastRange: 1000,
            CastPoint: 0.75,
            Cooldown: 8,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "explosion_radius",
                    Values: 220,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "flight_duration",
                    Values: 2.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "explosion_damage",
                    Values: 800,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "flight_speed",
                    Values: 500,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_elder_titan_echo_stomp",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.CHANNELLED],
            UnitDamageType: DamageType.PHYSICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            FightRecapLevel: 1,
            Sound: "Hero_ElderTitan.EchoStomp",
            CastAnimation: GameActivity.INVALID,
            CastPoint: 0.4,
            CastRange: 500,
            ChannelTime: 1.3,
            Cooldown: 16,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "cast_time",
                    Values: 1.7,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 350,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "sleep_duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "stomp_damage",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "initial_stun_duration",
                    Values: 0.2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "animation_rate",
                    Values: 0.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "wake_damage_limit",
                    Values: 100,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_elder_titan_earth_splitter",
            Behavior: AbilityBehavior.POINT,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            Type: AbilityTypes.ULTIMATE,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 2,
            Sound: "Hero_ElderTitan.EarthSplitter.Cast",
            HasScepterUpgrade: true,
            CastRange: 2000,
            CastPoint: 0.4,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_5,
            Cooldown: 19.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "vision_duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "vision_step",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "total_steps",
                    Values: 12,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration_scepter",
                    Values: 5.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "crack_time",
                    Values: 3.14,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crack_width",
                    Values: 315,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crack_distance",
                    Values: 3000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_pct",
                    Values: 40,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 910,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_pct",
                    Values: 80,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "vision_width",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "vision_interval",
                    Values: 0.22,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "boss_timbersaw_whirling_death",
            ScriptFile: "abilities/creatures/boss_timbersaw_whirling_death",
            TextureName: "shredder_whirling_death",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.PURE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            Sound: "Hero_Shredder.WhirlingDeath.Cast",
            MaxLevel: 4,
            CastRange: 500,
            CastPoint: [1.55, 1.5, 1.45, 1.4],
            Cooldown: 6,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "whirling_radius",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "whirling_damage",
                    Values: [325, 390, 455, 520],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tree_damage_scale",
                    Values: [15, 20, 25, 30],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "whirling_tick",
                    Values: 0.3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "stat_loss_pct",
                    Values: [15, 20, 25, 30],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 10.0,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_GENERIC_CHANNEL_1,
        });
    
        this.Abilities.push({
            Name: "boss_timbersaw_timber_chain",
            ScriptFile: "abilities/creatures/boss_timbersaw_timber_chain",
            TextureName: "shredder_timber_chain",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING, AbilityBehavior.ROOT_DISABLES],
            UnitDamageType: DamageType.PURE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            FightRecapLevel: 1,
            Sound: "Hero_Shredder.TimberChain.Cast",
            MaxLevel: 5,
            CastPoint: 0.3,
            CastRange: 4800,
            Cooldown: 10,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "chain_radius",
                    Values: [90, 90, 90, 90, 90],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "range",
                    Values: 3600,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: [225, 225, 225, 225, 225],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: [1600, 1800, 2000, 2200, 2400],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [275, 330, 385, 440, 495],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: [1.5, 1.75, 2.0, 2.25],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "boss_timbersaw_reactive_armor",
            ScriptFile: "abilities/creatures/boss_timbersaw_reactive_armor",
            TextureName: "shredder_reactive_armor",
            Behavior: AbilityBehavior.PASSIVE,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            MaxLevel: 5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_stacks",
                    Values: [20, 22, 24, 26, 28],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "armor_per_stack",
                    Values: 1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "magic_resist_per_stack",
                    Values: 1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "regen_per_stack",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "status_resist",
                    Values: [50, 55, 60, 65, 70],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "boss_timbersaw_chakram_dance",
            TextureName: "shredder_chakram",
            ScriptFile: "abilities/creatures/boss_timbersaw_chakram_dance",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.CHANNELLED, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            CastPoint: [2.0, 1.9, 1.8, 1.7, 1.6],
            MaxLevel: 5,
            CastRange: 0,
            Cooldown: [34, 32, 30, 28],
            ChannelTime: 9.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "num_chakrams",
                    Values: 9,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "interval",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "short_range",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "long_range",
                    Values: 1800,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_void_spirit_boss_passive",
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_void_spirit_boss_aether_remnant",
            TextureName: "void_spirit_aether_remnant",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.DONT_RESUME_MOVEMENT, AbilityBehavior.VECTOR_TARGETING],
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            Sound: "Hero_VoidSpirit.AetherRemnant.Cast",
            MaxLevel: 5,
            CastPoint: [1.0, 0.9, 0.8, 0.7, 0.6],
            AnimationPlaybackRate: [0.2500, 0.2778, 0.3125, 0.3571, 0.3849],
            CastRange: 1200,
            Cooldown: [12, 11, 10, 9, 8],
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pull_duration",
                    Values: 2.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pull_destination",
                    Values: 93,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 20.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "think_interval",
                    Values: 0.1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "start_radius",
                    Values: 135,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "end_radius",
                    Values: 135,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 450,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: [650, 700, 750, 800, 850],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "remnant_watch_distance",
                    Values: 625,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "remnant_watch_radius",
                    Values: 130,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "watch_path_vision_radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "activation_delay",
                    Values: 0.4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_damage",
                    Values: [600, 720, 840, 960, 1080],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_void_spirit_boss_dissimilate",
            TextureName: "void_spirit_dissimilate",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.ROOT_DISABLES],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            FightRecapLevel: 1,
            Sound: "Hero_VoidSpirit.Dissimilate.Cast",
            MaxLevel: 5,
            CastPoint: [0.5, 0.45, 0.4, 0.35, 0.3],
            AnimationPlaybackRate: [0.2000, 0.2222, 0.2500, 0.2857, 0.325],
            Cooldown: [16, 15, 14, 13, 12],
            Damage: [1100, 1320, 1540, 1760, 1980],
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "phase_duration",
                    Values: [1.8, 1.7, 1.6, 1.5, 1.4],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "destination_fx_radius",
                    Values: 274,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "portals_per_ring",
                    Values: 6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "angle_per_ring_portal",
                    Values: 60,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "first_ring_distance_offset",
                    Values: 780,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_radius",
                    Values: 412,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pct_of_phase_for_selection",
                    Values: 40,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "search_range_reduction",
                    Values: 200,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_void_spirit_boss_astral_step",
            TextureName: "void_spirit_astral_step",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING, AbilityBehavior.ROOT_DISABLES],
            Type: AbilityTypes.ULTIMATE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            FightRecapLevel: 1,
            Sound: "Hero_VoidSpirit.AstralStep.Start",
            MaxLevel: 5,
            CastPoint: [1.5, 1.4, 1.3, 1.2, 1.1],
            AnimationPlaybackRate: [0.2300, 0.2464, 0.2654, 0.2875, 0.3],
            Cooldown: 0,
            Charges: 2,
            ChargeRestoreTime: [16, 15, 14, 13, 12],
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: [200, 210, 220, 230, 240],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "AbilityCharges",
                    Values: 0,
                    LinkedSpecialBonus: "special_bonus_unique_void_spirit_9",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "AbilityChargeRestoreTime",
                    Values: 0,
                    LinkedSpecialBonus: "special_bonus_unique_void_spirit_1",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "min_travel_distance",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_travel_distance",
                    Values: [1500, 1600, 1700, 1800, 1900],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pop_damage_delay",
                    Values: 1.25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pop_damage",
                    Values: [500, 600, 700, 800, 900],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_slow_pct",
                    Values: 90,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_void_spirit_boss_resonant_pulse",
            TextureName: "void_spirit_resonant_pulse",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            Sound: "Hero_VoidSpirit.Pulse.Cast",
            HasScepterUpgrade: true,
            MaxLevel: 5,
            CastRange: 0,
            CastPoint: [1.2, 1.1, 1.0, 0.9, 0.8],
            AnimationPlaybackRate: [0.3650, 0.3982, 0.4380, 0.4867, 0.53],
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: [18, 17, 16, 15, 14],
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "silence_duration_scepter",
                    Values: [1.6, 1.8, 2.0, 2.2, 2.4],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 1000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [700, 840, 980, 1120, 1260],
                    LinkedSpecialBonus: "special_bonus_unique_void_spirit_4",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "buff_duration",
                    Values: 10.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "base_absorb_amount",
                    Values: [200, 250, 300, 350, 400],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "absorb_per_hero_hit",
                    Values: [200, 220, 240, 260, 280],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "return_projectile_speed",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_charges",
                    Values: 1,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "charge_restore_time",
                    Values: 10,
                    RequiresScepter: true,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "void_spirit_boss_activate_earth_spirits",
            ScriptFile: "abilities/creatures/void_spirit_boss_activate_earth_spirits",
            TextureName: "omniknight_guardian_angel",
            MaxLevel: 5,
            Type: AbilityTypes.ULTIMATE,
            Behavior: [AbilityBehavior.CHANNELLED, AbilityBehavior.NO_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 2,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: [32, 31, 30, 29, 28],
            ChannelTime: 9.0,
            CastPoint: 1.5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "channel_duration",
                    Values: 9.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "earth_spirit_statue_passive",
            ScriptFile: "abilities/creatures/earth_spirit_statue_passive",
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_earth_spirit_boss_boulder_smash",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.UNIT_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.BOTH,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.CREEP],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            FightRecapLevel: 1,
            Sound: "Hero_EarthSpirit.BoulderSmash.Target",
            MaxLevel: 5,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastRange: 150,
            CastPoint: 0.01,
            Cooldown: 1,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "rock_search_aoe",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "rock_damage",
                    Values: [500, 580, 660, 740, 820],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "move_slow",
                    Values: 80,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 0.25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 700,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "unit_distance",
                    Values: 1500.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "rock_distance",
                    Values: 3000.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "remnant_smash_radius_tooltip",
                    Values: 200,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_earth_spirit_boss_rolling_boulder",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING, AbilityBehavior.ROOT_DISABLES],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            Sound: "Hero_EarthSpirit.RollingBoulder.Cast",
            CastRange: 3000,
            CastPoint: 0.01,
            Cooldown: 12.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 1200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "rock_speed",
                    Values: 1600,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "distance",
                    Values: 1500.0,
                    LinkedSpecialBonus: "special_bonus_unique_earth_spirit_4",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "rock_distance",
                    Values: 3000.0,
                    LinkedSpecialBonus: "special_bonus_unique_earth_spirit_4",
                    LinkedSpecialBonusField: "value2",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "delay",
                    Values: 0.6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 700,
                    LinkedSpecialBonus: "special_bonus_unique_earth_spirit",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 1.0,
                    LinkedSpecialBonus: "special_bonus_unique_earth_spirit_3",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "rock_bonus_duration",
                    Values: 1.0,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_earth_spirit_boss_geomagnetic_grip",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.UNIT_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.CREEP],
            UnitTargetFlags: UnitTargetFlags.INVULNERABLE,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            Sound: "Hero_EarthSpirit.GeomagneticGrip.Target",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastRange: 1100,
            CastPoint: 0.01,
            Cooldown: 15,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 180,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "rock_damage",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 3,
                    LinkedSpecialBonus: "special_bonus_unique_earth_spirit_5",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pull_units_per_second_heroes",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pull_units_per_second",
                    Values: 1000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 800,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "total_pull_distance",
                    Values: 2000,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_earth_spirit_boss_stone_caller",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.NOT_LEARNABLE, AbilityBehavior.IGNORE_BACKSWING, AbilityBehavior.SHOW_IN_GUIDES],
            Type: AbilityTypes.BASIC,
            MaxLevel: 1,
            Sound: "Hero_EarthSpirit.StoneRemnant.Impact",
            CastAnimation: GameActivity.DOTA_ES_STONE_CALLER,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastRange: 1100,
            CastPoint: 0.0,
            HasScepterUpgrade: true,
            Cooldown: 0.0,
            Charges: 7,
            ChargeRestoreTime: 1,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 10.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_earth_spirit_boss_petrify",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.HIDDEN, AbilityBehavior.SHOW_IN_GUIDES],
            UnitTargetTeam: UnitTargetTeam.CUSTOM,
            UnitTargetType: UnitTargetType.CUSTOM,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            MaxLevel: 1,
            FightRecapLevel: 1,
            GrantedByScepter: true,
            Sound: "Hero_EarthSpirit.Petrify",
            HasScepterUpgrade: true,
            CastRange: 125,
            CastPoint: 0.2,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_5,
            Cooldown: 35,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 3,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage",
                    Values: 300,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "aoe",
                    Values: 300,
                    RequiresScepter: true,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_earth_spirit_boss_magnetize",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            Type: AbilityTypes.ULTIMATE,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 2,
            Sound: "Hero_EarthSpirit.Magnetize.Cast",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_6,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastRange: 350,
            CastPoint: 0.01,
            Cooldown: 45,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cast_radius",
                    Values: 450,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_per_second",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_duration",
                    Values: 6.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "rock_search_radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "rock_explosion_radius",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_interval",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "rock_explosion_delay",
                    Values: 8.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "silence_duration",
                    Values: 5.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 2.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_fire_breath",
            Behavior: [AbilityBehavior.AOE, AbilityBehavior.POINT],
            UnitDamageType: DamageType.MAGICAL,
            TextureName: "ogre_magi_fireblast",
            MaxLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            Cooldown: 10.0,
            ChannelTime: 3.0,
            CastRange: 1200,
            CastPoint: 2.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "radius",
                    Values: 200.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 1200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "rotation_angle",
                    Values: 90.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_count",
                    Values: 12,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_ice_slam",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitDamageType: DamageType.MAGICAL,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            ManaCost: 0,
            Cooldown: 7.0,
            CastPoint: 1.5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_movement_speed",
                    Values: -25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_attack_speed",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "frozen_path_duration",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 1250,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "freeze_duration",
                    Values: 2.0,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "skeleton_king_run_passive",
            ScriptFile: "abilities/creatures/skeleton_king_run_passive",
            Behavior: AbilityBehavior.PASSIVE,
        });
    
        this.Abilities.push({
            Name: "undead_woods_skeleton_king_hellfire_blast",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            FightRecapLevel: 1,
            Sound: "Hero_SkeletonKing.Hellfire_Blast",
            CastRange: 425,
            CastPoint: 0.35,
            Cooldown: 10,
            Damage: 750,
            ManaCost: 0,
            ModifierSupportValue: 0.5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "blast_speed",
                    Values: 800,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "blast_stun_duration",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "blast_dot_duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "blast_slow",
                    Values: -50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "blast_dot_damage",
                    Values: 125,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_skeleton_king_vampiric_aura",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.AURA],
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            SpellImmunityType: SpellImmunityTypes.ALLIES_YES,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "vampiric_aura_radius",
                    Values: 5000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "vampiric_aura",
                    Values: 20,
                    LinkedSpecialBonus: "special_bonus_unique_wraith_king_2",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "self_bonus",
                    Values: 1.5,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "undead_woods_skeleton_king_mortal_strike",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            Sound: "Hero_SkeletonKing.CriticalStrike",
            CastPoint: 0.1,
            Cooldown: 20,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_mult",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_chance",
                    Values: 15,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "skeleton_duration",
                    Values: 60,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_skeleton_charges",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "spawn_interval",
                    Values: 0.25,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "reincarnate_time",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "gold_bounty",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "xp_bounty",
                    Values: 0,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "undead_woods_skeleton_king_reincarnation",
            Behavior: AbilityBehavior.PASSIVE,
            Type: AbilityTypes.ULTIMATE,
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: UnitTargetType.HERO,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 2,
            HasScepterUpgrade: true,
            Sound: "Hero_SkeletonKing.Reincarnate",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            ManaCost: 0,
            Cooldown: 9999,
            ModifierSupportValue: 0.2,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "reincarnate_time",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_radius",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movespeed",
                    Values: -75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attackslow",
                    Values: -75,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 5.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "scepter_duration",
                    Values: 7,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "aura_radius",
                    Values: 1200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "aura_radius_tooltip_scepter",
                    Values: 1200,
                    RequiresScepter: true,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "sled_penguin_passive",
            ScriptFile: "abilities/sled_penguin_passive",
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_sled_speed",
                    Values: 700,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed_step",
                    Values: 7,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tree_destroy_radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "reset_pos_offset",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "penguin_lifetime",
                    Values: 100.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "collision_radius",
                    Values: 75,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "impaired_duration",
                    Values: 3.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "wandering_ogre_seal_passive",
            ScriptFile: "abilities/creatures/wandering_ogre_seal_passive",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_wander_range",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "min_wander_range",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "move_interval",
                    Values: 5.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_bonus_chicken",
            TextureName: "alchemist_goblins_greed",
            ScriptFile: "abilities/creatures/creature_bonus_chicken",
            Behavior: AbilityBehavior.PASSIVE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "total_gold",
                    Values: 10000,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "time_limit",
                    Values: 40.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "gold_bag_duration",
                    Values: 8.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "creature_bonus_greevil",
            TextureName: "alchemist_goblins_greed",
            ScriptFile: "abilities/creatures/creature_bonus_greevil",
            Behavior: AbilityBehavior.PASSIVE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "total_gold",
                    Values: 10000,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "time_limit",
                    Values: 40.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "gold_bag_duration",
                    Values: 8.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "morty_hop",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.CHANNELLED],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            TextureName: "snapfire_firesnap_cookie",
            FightRecapLevel: 1,
            CastPoint: 0.2,
            CastRange: 1000,
            Cooldown: 1.1,
            ChannelTime: 1.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_radius",
                    Values: 375,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_distance",
                    Values: 1000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "height",
                    Values: 200,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "morty_hop_launch",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE, AbilityBehavior.IGNORE_CHANNEL, AbilityBehavior.HIDDEN],
            CastPoint: [0, 0, 0, 0],
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_rock_golem_smash",
            TextureName: "tiny_avalanche",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
            Behavior: [AbilityBehavior.AOE, AbilityBehavior.POINT],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            MaxLevel: 1,
            CastPoint: 1.4,
            Cooldown: 20.0,
            CastRange: 400,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tick_interval",
                    Values: 0.3,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "total_duration",
                    Values: 1.4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tick_count",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 0.2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "projectile_duration",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "avalanche_damage",
                    Values: 1400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "anim_playback_rate",
                    Values: 1.2143,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "rock_golem_split_a",
            ScriptFile: "abilities/creatures/rock_golem_split_a",
            Behavior: AbilityBehavior.PASSIVE,
            TextureName: "dark_seer_wall_of_replica",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "unit_count",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spawn_radius",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration_min",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration_max",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance_min",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance_max",
                    Values: 275,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height_min",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height_max",
                    Values: 200,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "rock_golem_split_b",
            ScriptFile: "abilities/creatures/rock_golem_split_b",
            Behavior: AbilityBehavior.PASSIVE,
            TextureName: "dark_seer_wall_of_replica",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "unit_count",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spawn_radius",
                    Values: 25,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration_min",
                    Values: 0.6,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration_max",
                    Values: 0.6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance_min",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance_max",
                    Values: 275,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height_min",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height_max",
                    Values: 200,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "bomb_squad_self_cast",
            ScriptFile: "abilities/creatures/bomb_squad_self_cast",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE, AbilityBehavior.IGNORE_CHANNEL],
            CastPoint: [0, 0, 0, 0],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_active_mines",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "mine_spawn_interval",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_launch_distance",
                    Values: 100,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "bomb_squad_mine_charge",
            ScriptFile: "abilities/creatures/bomb_squad_mine_charge",
            Behavior: AbilityBehavior.POINT,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            CastRange: 3000,
            Cooldown: 12,
            CastPoint: 0.5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_active_mines",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "mine_spawn_interval",
                    Values: 0.3,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_launch_distance",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "speed",
                    Values: 350,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "bomb_squad_landmine_detonate",
            ScriptFile: "abilities/creatures/bomb_squad_landmine_detonate",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE, AbilityBehavior.IGNORE_CHANNEL],
            CastPoint: [0, 0, 0, 0],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 1.8,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "detonate_radius",
                    Values: 375,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "detonate_damage",
                    Values: 1200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "chain_radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "chain_duration",
                    Values: 0.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "bomb_squad_stasis_launch",
            ScriptFile: "abilities/creatures/bomb_squad_stasis_launch",
            Behavior: AbilityBehavior.POINT,
            CastRange: 750,
            Cooldown: 2.5,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            CastPoint: 0.3,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "detonate_radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "activation_delay",
                    Values: 1.3,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 380,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "mine_lifetime",
                    Values: 3.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_walrus_pudge_harpoon",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.PURE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            FightRecapLevel: 1,
            Sound: "Hero_Pudge.AttackHookExtend",
            TextureName: "pudge_meat_hook",
            CastRange: 1300,
            CastPoint: [0.3, 0.3, 0.3, 0.3],
            Cooldown: 12,
            Damage: 1050,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "hook_speed",
                    Values: 1200.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hook_width",
                    Values: 120,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hook_distance",
                    Values: 2700,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "vision_radius",
                    Values: [500, 500, 500, 500],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "vision_duration",
                    Values: [4.0, 4.0, 4.0, 4.0],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "enraged_wildwing_create_tornado",
            ScriptFile: "abilities/creatures/enraged_wildwing_create_tornado",
            MaxLevel: 1,
            Behavior: AbilityBehavior.NO_TARGET,
            UnitDamageType: DamageType.MAGICAL,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            CastRange: 500,
            CastPoint: 0.4,
            Cooldown: 0.0,
            ChannelTime: 140.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 350,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tornado_radius",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "movespeed_pct",
                    Values: 40.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "harpy_spawn_interval",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "harpy_spawn_amount",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_total_harpies",
                    Values: 14,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "enraged_wildkin_tornado_passive",
            ScriptFile: "abilities/creatures/enraged_wildkin_tornado_passive",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.MAGICAL,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tornado_radius",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "movespeed_pct",
                    Values: 20.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "harpy_spawn_interval",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "harpy_spawn_amount",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_total_harpies",
                    Values: 14,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_enraged_wildwing_tornado_blast",
            ScriptFile: "abilities/creatures/aghsfort_enraged_wildwing_tornado_blast",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            UnitDamageType: DamageType.MAGICAL,
            Sound: "Hero_Invoker.Tornado",
            CastRange: 3000,
            CastPoint: 0.8,
            CastAnimation: GameActivity.INVALID,
            Cooldown: 7,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "travel_distance",
                    Values: 1500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "travel_speed",
                    Values: 750,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "area_of_effect",
                    Values: 220,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "disable_duration",
                    Values: 2.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spawns_per_blast",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "harpy_spawn_amount",
                    Values: 2,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "tornado_harpy_intrinsic",
            ScriptFile: "abilities/creatures/tornado_harpy_intrinsic",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.MAGICAL,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed_boost",
                    Values: 250,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "preview_intrinsic",
            ScriptFile: "abilities/creatures/preview_intrinsic",
            MaxLevel: 1,
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.MAGICAL,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghanim_empty_spell1",
            TextureName: "aghanim_spell_swap",
            Behavior: [AbilityBehavior.NOT_LEARNABLE, AbilityBehavior.HIDDEN],
            MaxLevel: 1,
        });
    
        this.Abilities.push({
            Name: "aghanim_empty_spell2",
            TextureName: "aghanim_spell_swap",
            Behavior: [AbilityBehavior.NOT_LEARNABLE, AbilityBehavior.HIDDEN],
            MaxLevel: 1,
        });
    
        this.Abilities.push({
            Name: "aghanim_empty_spell3",
            TextureName: "aghanim_spell_swap",
            Behavior: [AbilityBehavior.NOT_LEARNABLE, AbilityBehavior.HIDDEN],
            MaxLevel: 1,
        });
    
        this.Abilities.push({
            Name: "aghanim_empty_spell4",
            TextureName: "aghanim_spell_swap",
            Behavior: [AbilityBehavior.NOT_LEARNABLE, AbilityBehavior.HIDDEN],
            MaxLevel: 1,
        });
    
        this.Abilities.push({
            Name: "aghanim_passive",
            TextureName: "aghanim_passive",
            ScriptFile: "abilities/creatures/aghanim_passive",
            MaxLevel: 5,
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "status_resist",
                    Values: [10, 20, 30, 40, 50, 75],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghanim_spear",
            TextureName: "aghanim_spear",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.DIRECTIONAL],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            FightRecapLevel: 1,
            Sound: "Hero_Mars.Spear.Cast",
            MaxLevel: 6,
            CastPoint: 0.0,
            Cooldown: 0.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [2200, 2640, 3080, 3520, 3960, 4400],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "spear_speed",
                    Values: [1000, 1100, 1200, 1300, 1400, 1500],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spear_width",
                    Values: 90,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spear_vision",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spear_range",
                    Values: 10000,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "activity_duration",
                    Values: 1.7,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: [1.25, 1.5, 1.75, 2.0, 2.25, 2.5],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration",
                    Values: 0.25,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_distance",
                    Values: 75,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_5,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
        });
    
        this.Abilities.push({
            Name: "aghanim_crystal_attack",
            Behavior: AbilityBehavior.POINT,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.PHYSICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            FightRecapLevel: 1,
            TextureName: "ancient_apparition_ice_blast",
            ScriptFile: "abilities/creatures/aghanim_crystal_attack",
            MaxLevel: 6,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            AnimationIgnoresModelScale: true,
            CastRange: 10000,
            CastPoint: 0.5,
            Cooldown: [0.6, 0.5, 0.4, 0.3, 0.2, 0.1],
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pulse_radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pulse_damage",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pulse_damage_pct",
                    Values: [15, 20, 25, 30, 35, 40],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "attack_time",
                    Values: [1.7, 1.65, 1.6, 1.55, 1.5, 1.45],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "explosion_radius",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_damage",
                    Values: [1800, 2100, 2400, 2700, 3000, 3300],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration",
                    Values: [0.5, 0.55, 0.6, 0.65, 0.7, 0.75],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance",
                    Values: [80, 90, 100, 110, 120, 130],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_height",
                    Values: [80, 90, 100, 110, 120, 130],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "heal_suppression_pct",
                    Values: [50, 55, 60, 65, 70, 75],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "debuff_duration",
                    Values: 12.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "armor_reduction_pct",
                    Values: [18, 26, 34, 42, 50, 58],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghanim_staff_beams",
            TextureName: "aghanim_staff_beams",
            ScriptFile: "abilities/creatures/aghanim_staff_beams",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.CHANNELLED, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            ChannelAnimation: GameActivity.DOTA_CHANNEL_ABILITY_2,
            AnimationIgnoresModelScale: true,
            CastPoint: 2.0,
            MaxLevel: 6,
            CastRange: 10000,
            Cooldown: 5,
            ChannelTime: 6.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "beam_speed",
                    Values: [320, 340, 360, 380, 400, 420],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "beam_radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "beam_dps",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "linger_time",
                    Values: [5.0, 6.0, 7.0, 8.0, 9.0, 10.0],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "linger_create_interval",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_interval",
                    Values: 0.1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "beam_dps_pct",
                    Values: [30, 33, 36, 39, 42, 45],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghanim_summon_portals",
            TextureName: "aghanim_summon_portals",
            ScriptFile: "abilities/creatures/aghanim_summon_portals",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.CHANNELLED, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            ChannelAnimation: GameActivity.DOTA_CHANNEL_ABILITY_4,
            AnimationIgnoresModelScale: true,
            CastPoint: 1.4,
            AnimationPlaybackRate: 1.0,
            MaxLevel: 6,
            CastRange: 10000,
            Cooldown: 5,
            ChannelTime: 5.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "staff_crush_delay",
                    Values: 0.30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "base_portals",
                    Values: [4, 4, 5, 6, 7, 8],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "portal_health_pct",
                    Values: [20, 18, 16, 14, 10],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "min_portal_offset",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_portal_offset",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "portal_time",
                    Values: [2.0, 1.8, 1.6, 1.4, 1.2],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "total_portal_depth",
                    Values: [20, 24, 28, 32, 36],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "staff_crush_radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "staff_crush_damage",
                    Values: [3400, 4250, 5100, 5950, 6800, 7650],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "staff_crush_stun_duration",
                    Values: [2.0, 3.0, 4.0, 5.0, 6.0, 7.0],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghanim_blink",
            TextureName: "aghanim_blink",
            ScriptFile: "abilities/creatures/aghanim_blink",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.ROOT_DISABLES],
            Sound: "Hero_QueenOfPain.Blink_in",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
            CastRange: 99999,
            CastPoint: 1.5,
            MaxLevel: 6,
            Cooldown: 15.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "travel_speed",
                    Values: 2500,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghanim_spell_swap",
            TextureName: "aghanim_spell_swap",
            ScriptFile: "abilities/creatures/aghanim_spell_swap",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.CHANNELLED, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_5,
            ChannelAnimation: GameActivity.DOTA_CHANNEL_ABILITY_5,
            AnimationIgnoresModelScale: true,
            CastPoint: 2.0,
            MaxLevel: 6,
            CastRange: 10000,
            Cooldown: 7.5,
            ChannelTime: [7.5, 7.5, 7.5, 7.5, 6.0, 4.5],
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "animation_rate",
                    Values: 0.1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "move_speed_slow_pct",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "num_crystal_hits",
                    Values: [9, 12, 15, 18, 21, 24],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghanim_shard_attack",
            TextureName: "aghanim_shard_attack",
            ScriptFile: "abilities/creatures/aghanim_shard_attack",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.CHANNELLED, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitDamageType: DamageType.PURE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_6,
            ChannelAnimation: GameActivity.DOTA_CHANNEL_ABILITY_6,
            AnimationIgnoresModelScale: true,
            CastPoint: 2.0,
            MaxLevel: 6,
            CastRange: 10000,
            Cooldown: 10.0,
            ChannelTime: 10.0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spiral_projectiles",
                    Values: [12, 12, 13, 14, 15, 16],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spiral_projectile_waves",
                    Values: 6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spiral_projectile_width",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spiral_projectile_damage",
                    Values: [2250, 2250, 2500, 2750, 3000, 10000],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spiral_projectile_speed",
                    Values: [625, 625, 675, 725, 775, 850],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "spiral_projectile_rotation_speed",
                    Values: 1.2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "spiral_projectile_speed_change_interval",
                    Values: 0.75,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_elemental_tiny_toss",
            TextureName: "tiny_toss",
            ScriptFile: "abilities/creatures/aghsfort_elemental_tiny_toss",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            FightRecapLevel: 1,
            CastRange: 3200,
            CastPoint: 0.5,
            Cooldown: 4.5,
            ManaCost: 0,
            ModifierSupportValue: 0.25,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 1.3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "grab_radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage_pct",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "toss_damage",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "AbilityCharges",
                    Values: 0,
                    LinkedSpecialBonus: "special_bonus_unique_tiny_2",
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_elemental_tiny_create_io",
            ScriptFile: "abilities/creatures/aghsfort_elemental_tiny_create_io",
            Behavior: [AbilityBehavior.IMMEDIATE, AbilityBehavior.NO_TARGET, AbilityBehavior.IGNORE_CHANNEL],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            CastRange: 0,
            CastPoint: 0.0,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            Cooldown: 8.0,
            Damage: 0,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spawn_count",
                    Values: 1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spawn_distance",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_summons",
                    Values: 3,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_wisp_tether",
            TextureName: "wisp_tether",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellImmunityType: SpellImmunityTypes.ALLIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            CastPoint: 0,
            CastAnimation: GameActivity.INVALID,
            Cooldown: 0,
            ManaCost: 0,
            CastRange: 800,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_speed",
                    Values: 15,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "health_regen",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "status_resist",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: [900, 900, 900, 900],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movespeed",
                    Values: [5, 8, 11, 14],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "latch_distance",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "latch_speed",
                    Values: [1000, 1000, 1000, 1000],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tether_heal_amp",
                    Values: 1.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "self_bonus",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow",
                    Values: 25,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 5.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_speed",
                    Values: 15,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "elemental_tiny_tree_attack",
            ScriptFile: "abilities/creatures/elemental_tiny_tree_attack",
            Behavior: AbilityBehavior.PASSIVE,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage",
                    Values: 0,
                    CalculateSpellDamageTooltip: false,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage_buildings",
                    Values: 0,
                    CalculateSpellDamageTooltip: false,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_range",
                    Values: 170,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "splash_width",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "splash_range",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "splash_pct",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "throw_splash_pct",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bat_increase",
                    Values: 0.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed_reduction",
                    Values: 0,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_wisp_autoattack",
            ScriptFile: "abilities/creatures/aghsfort_wisp_autoattack",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "wisp_tether",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "attack_interval",
                    Values: 0.9,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_omniknight_purification",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.AOE, AbilityBehavior.CAN_SELF_CAST],
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ALLIES_YES,
            FightRecapLevel: 1,
            Sound: "Hero_Omniknight.Purification",
            TextureName: "omniknight_purification",
            CastRange: 300,
            CastPoint: 0.2,
            Cooldown: [14, 13, 12, 11],
            ManaCost: [75, 90, 105, 120],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "heal",
                    Values: [90, 160, 230, 300],
                    LinkedSpecialBonus: "special_bonus_unique_omniknight_1",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 260,
                    LinkedSpecialBonus: "special_bonus_unique_omniknight_4",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cast_radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "AbilityCharges",
                    Values: 0,
                    LinkedSpecialBonus: "aghsfort_special_omniknight_purification_charges",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "secondary_heal_damage_pct",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cast_range",
                    Values: 300,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_omniknight_guardian_angel",
            Behavior: AbilityBehavior.NO_TARGET,
            Type: AbilityTypes.ULTIMATE,
            SpellImmunityType: SpellImmunityTypes.ALLIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 2,
            Sound: "Hero_Omniknight.GuardianAngel.Cast",
            TextureName: "omniknight_guardian_angel",
            Cooldown: [100, 80, 60],
            CastPoint: 0.4,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            ManaCost: [125, 175, 250],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: [4.0, 5, 6],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 1000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hp_regen",
                    Values: [10, 14, 18],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_guardian_angel_single_target",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.HIDDEN, AbilityBehavior.NOT_LEARNABLE],
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellImmunityType: SpellImmunityTypes.ALLIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 2,
            Type: AbilityTypes.ULTIMATE,
            MaxLevel: 1,
            Sound: "Hero_Omniknight.GuardianAngel.Cast",
            TextureName: "omniknight_guardian_angel",
            CastRange: 500,
            Cooldown: [100, 80, 60],
            CastPoint: 0.4,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            ManaCost: [75, 125, 150],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "mana_cost_modifier",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_guardian_angel_single_target_dummy",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "omniknight_guardian_angel",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "mana_cost_modifier",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_purification_cast_radius",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "omniknight_purification",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 250,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_purification_charges",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "omniknight_purification",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 2,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_purification_cooldown_reduction",
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_purification_multicast",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "omniknight_purification",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "multicast_chance",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "multicast_delay",
                    Values: 0.3,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_repel_procs_purification",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "omniknight_repel",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_repel_outgoing_damage",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "omniknight_repel",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 30,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_repel_applies_degen_aura",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "omniknight_repel",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_repel_damage_instance_refraction",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "omniknight_repel",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_threshold",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_instances",
                    Values: 5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_repel_knockback_on_cast",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "omniknight_repel",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_speed",
                    Values: 1000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_damage_pct",
                    Values: 150,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_degen_aura_damage",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "omniknight_degen_aura",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_interval",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_damage_pct",
                    Values: 25,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_degen_aura_restoration",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "omniknight_degen_aura",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 4,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_degen_aura_toggle",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "omniknight_degen_aura",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_guardian_angel_purification",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "omniknight_guardian_angel",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "purification_trigger_chance",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "purification_trigger_cooldown",
                    Values: 1.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_omniknight_guardian_angel_immune_flight",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "omniknight_guardian_angel",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 30,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_disruptor_thunder_strike",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            Sound: "Hero_Disruptor.ThunderStrike.Target",
            TextureName: "disruptor_thunder_strike",
            CastAnimation: GameActivity.DOTA_THUNDER_STRIKE,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastPoint: [0.05, 0.05, 0.05, 0.05],
            Cooldown: [15, 13, 11, 9],
            ManaCost: [130, 140, 150, 160],
            CastRange: [800, 800, 800, 800],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: [240, 240, 240, 240],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "strikes",
                    Values: 4,
                    LinkedSpecialBonus: "special_bonus_unique_disruptor",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "strike_interval",
                    Values: [2.0, 2.0, 2.0, 2.0],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "strike_damage",
                    Values: [45, 70, 95, 120],
                    LinkedSpecialBonus: "special_bonus_unique_disruptor_3",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 0.1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_amount",
                    Values: 100,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_thunder_strike_interval_upgrade",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_thunder_strike",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_thunder_strike_mana_restore",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_thunder_strike",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "restore_radius",
                    Values: 450,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "restore_amount",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "int_increase_amount",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "int_increase_duration",
                    Values: 25,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_thunder_strike_crit_chance",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_thunder_strike",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_chance",
                    Values: 25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_pct",
                    Values: 175,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_thunder_strike_on_attack",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_thunder_strike",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "strike_chance",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_disruptor_glimpse",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: UnitTargetType.HERO,
            UnitTargetFlags: UnitTargetFlags.NOT_CREEP_HERO,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            Sound: "Hero_Disruptor.Glimpse.Target",
            TextureName: "disruptor_glimpse",
            CastPoint: [0.05, 0.05, 0.05, 0.05],
            Cooldown: [18.0, 16.0, 14.0, 12.0],
            ManaCost: 100,
            CastRange: [600, 1000, 1400, 1800],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "backtrack_time",
                    Values: [4.0, 4.0, 4.0, 4.0],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cast_range",
                    Values: [600, 1000, 1400, 1800],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cast_radius",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage",
                    Values: [15, 30, 45, 60],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_glimpse_cast_aoe",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_glimpse",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 250,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_glimpse_hit_on_arrival",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_glimpse",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hit_radius",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "int_pct",
                    Values: 170,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_glimpse_travel_damage",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_glimpse",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 70,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_disruptor_kinetic_field",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE, AbilityBehavior.IGNORE_BACKSWING],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            FightRecapLevel: 1,
            Sound: "Hero_Disruptor.KineticField",
            TextureName: "disruptor_kinetic_field",
            CastAnimation: GameActivity.DOTA_KINETIC_FIELD,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastPoint: [0.05, 0.05, 0.05, 0.05],
            Cooldown: [18, 16, 14, 12],
            ManaCost: [70, 80, 90, 100],
            CastRange: [900, 900, 900, 900],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 340,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "formation_time",
                    Values: [1.2, 1.2, 1.2, 1.2],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: [2.8, 3.2, 3.4, 4],
                    LinkedSpecialBonus: "special_bonus_unique_disruptor_5",
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_kinetic_field_instant_setup",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_kinetic_field",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 60,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_kinetic_field_allied_attack_buff",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_kinetic_field",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 60,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_kinetic_field_damage",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_kinetic_field",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_kinetic_field_allied_heal",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_kinetic_field",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_kinetic_field_double_ring",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_kinetic_field",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 2,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_disruptor_static_storm",
            Type: AbilityTypes.ULTIMATE,
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 2,
            Sound: "Hero_Disruptor.StaticStorm.Cast",
            TextureName: "disruptor_static_storm",
            CastAnimation: GameActivity.DOTA_STATIC_STORM,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastPoint: [0.05, 0.05, 0.05, 0.05],
            Cooldown: [90, 80, 70],
            ManaCost: [125, 175, 225],
            CastRange: [800, 800, 800, 800],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pulses",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_max",
                    Values: [200, 275, 350],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 5.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_static_storm_kinetic_field_on_cast",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_static_storm",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_static_storm_crits_on_attacks",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_static_storm",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_chance",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_damage",
                    Values: 150,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_disruptor_static_storm_damage_reduction",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "disruptor_static_storm",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_reduction_pct",
                    Values: 30,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_magnataur_shockwave",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.POINT],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            TextureName: "magnataur_shockwave",
            FightRecapLevel: 1,
            CastRange: 1200,
            CastPoint: [0.3, 0.3, 0.3, 0.3],
            Cooldown: [14, 13, 12, 11],
            Duration: [0.6875, 0.6875, 0.6875, 0.6875],
            ManaCost: [90, 100, 110, 120],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "basic_slow_duration",
                    Values: 0.75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "shock_speed",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "shock_width",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "shock_damage",
                    Values: [75, 150, 225, 300],
                    LinkedSpecialBonus: "special_bonus_unique_magnus_4",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pull_duration",
                    Values: 0.2,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_slow",
                    Values: 60,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "scepter_distance",
                    Values: 2000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "scepter_speed",
                    Values: 1500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pull_distance",
                    Values: 150,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_shockwave_multishot",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "magnataur_shockwave",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "total_shockwaves",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "degrees_between_shockwaves",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_pct",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_shockwave_damage_reduction",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "magnataur_shockwave",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 2.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_reduction_pct",
                    Values: 65,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_shockwave_boomerang",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "magnataur_shockwave",
        });
    
        this.Abilities.push({
            Name: "aghsfort_magnataur_empower",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellImmunityType: SpellImmunityTypes.ALLIES_YES,
            UnitTargetFlags: UnitTargetFlags.INVULNERABLE,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            Sound: "Hero_Magnataur.Empower.Cast",
            TextureName: "magnataur_empower",
            CastRange: 800,
            CastPoint: [0.3, 0.3, 0.3, 0.3],
            Cooldown: 8,
            ManaCost: [45, 60, 75, 90],
            ModifierSupportValue: 0.3,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "self_multiplier",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "empower_duration",
                    Values: [38, 42, 46, 50],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage_pct",
                    Values: [10, 15, 20, 25],
                    LinkedSpecialBonus: "special_bonus_unique_magnus_2",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "cleave_damage_pct",
                    Values: [10, 20, 30, 40],
                    LinkedSpecialBonus: "special_bonus_unique_magnus_2",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cleave_starting_width",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cleave_ending_width",
                    Values: 360,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cleave_distance",
                    Values: 650,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "splash_damage_pct",
                    Values: [10, 15, 20, 25],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "splash_radius",
                    Values: 240,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "aura_radius",
                    Values: 900,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_empower_all_allies",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "magnataur_empower",
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_empower_lifesteal",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "magnataur_empower",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 10,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_empower_shockwave_on_attack",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "magnataur_empower",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "shockwave_cooldown",
                    Values: 4,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_magnataur_skewer",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.ROOT_DISABLES],
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.CREEP],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            Sound: "Hero_Magnataur.Skewer.Cast",
            TextureName: "magnataur_skewer",
            CastPoint: [0.3, 0.3, 0.3, 0.3],
            Cooldown: [16, 14, 12, 10],
            ManaCost: [80, 80, 80, 80],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "skewer_manacost",
                    Values: 40,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "skewer_speed",
                    Values: 950,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "range",
                    Values: [800, 900, 1000, 1100],
                    LinkedSpecialBonus: "special_bonus_unique_magnus_3",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_pct",
                    Values: [10, 20, 30, 40],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "skewer_radius",
                    Values: 135,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 3.25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "skewer_damage",
                    Values: [70, 140, 210, 280],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tree_radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tool_attack_slow",
                    Values: [10, 20, 30, 40],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "skewer_cooldown",
                    Values: 6,
                    RequiresScepter: true,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_friendly_skewer",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.ROOT_DISABLES],
            UnitTargetType: UnitTargetType.HERO,
            UnitDamageType: DamageType.NONE,
            FightRecapLevel: 1,
            Sound: "Hero_Magnataur.Skewer.Cast",
            TextureName: "aghsfort_magnataur_friendly_skewer",
            CastPoint: [0.3, 0.3, 0.3, 0.3],
            Cooldown: 15.0,
            ManaCost: 20,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "skewer_speed",
                    Values: 950,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "skewer_radius",
                    Values: 125,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_targets",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_pct",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "skewer_damage",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "range",
                    Values: [600, 800, 1000, 1200],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tree_radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "affects_creeps",
                    Values: 0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_skewer_original_scepter",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "magnataur_skewer",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "skewer_manacost",
                    Values: 40,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "skewer_cooldown",
                    Values: 6,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_skewer_bonus_strength",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "magnataur_skewer",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "strength_gain",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "buff_duration",
                    Values: 20,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_skewer_heal",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "magnataur_skewer",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 60,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_skewer_shockwave",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "magnataur_skewer",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "cooldown_reduction_per_hit",
                    Values: 1.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_magnataur_reverse_polarity",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitDamageType: DamageType.MAGICAL,
            Type: AbilityTypes.ULTIMATE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            FightRecapLevel: 2,
            Sound: "Hero_Magnataur.ReversePolarity.Cast",
            TextureName: "magnataur_reverse_polarity",
            CastPoint: [0.3, 0.3, 0.3],
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: 90,
            ManaCost: [200, 250, 300],
            CastRange: [410, 410, 410],
            ModifierSupportValue: 0.5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pull_radius",
                    Values: 410,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "polarity_damage",
                    Values: [50, 125, 200],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "hero_stun_duration",
                    Values: [2.75, 3.25, 3.75],
                    LinkedSpecialBonus: "special_bonus_unique_magnus_5",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pull_duration",
                    Values: [0.0, 0.0, 0.0],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_reverse_polarity_polarity",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.HIDDEN, AbilityBehavior.NOT_LEARNABLE],
            UnitDamageType: DamageType.MAGICAL,
            Type: AbilityTypes.ULTIMATE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            FightRecapLevel: 2,
            Sound: "Hero_Magnataur.ReversePolarity.Cast",
            TextureName: "aghsfort_magnataur_reverse_polarity_polarity",
            CastPoint: [0.3, 0.3, 0.3],
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: 90,
            ManaCost: [200, 250, 300],
            CastRange: [410, 410, 410],
            ModifierSupportValue: 0.5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pull_radius",
                    Values: 410,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "polarity_damage",
                    Values: [50, 125, 200],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "hero_stun_duration",
                    Values: [2.75, 3.25, 3.75],
                    LinkedSpecialBonus: "special_bonus_unique_magnus_5",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pull_duration",
                    Values: [0.3, 0.3, 3.3],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius_modifier",
                    Values: 75,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_reverse_polarity_polarity_dummy",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "magnataur_reverse_polarity",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_reverse_polarity_radius",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "magnataur_reverse_polarity",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 820,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_reverse_polarity_allies_crit",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "magnataur_reverse_polarity",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 300,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_magnataur_reverse_polarity_steroid",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "magnataur_reverse_polarity",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "move_speed_percent",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_speed",
                    Values: 70,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "buff_duration",
                    Values: 30,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_phantom_assassin_stifling_dagger",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.CREEP],
            UnitDamageType: DamageType.PHYSICAL,
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            Sound: "Hero_PhantomAssassin.Dagger.Cast",
            TextureName: "phantom_assassin_stifling_dagger",
            CastRange: [525, 750, 975, 1200],
            CastPoint: [0.3, 0.3, 0.3, 0.3],
            Cooldown: [6, 5.5, 5, 4.5],
            ManaCost: 30,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "move_slow",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "dagger_speed",
                    Values: 1200,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: [1.75, 2.5, 3.25, 4],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "base_damage",
                    Values: 65,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_factor",
                    Values: [75, 60, 45, 30],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "secondary_dagger_range",
                    Values: [600, 650, 700, 750],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "secondary_dagger_width",
                    Values: 220,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "secondary_dagger_amount",
                    Values: [4, 5, 6, 7],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_phantom_assassin_stifling_dagger_no_secondary_dagger_restriction",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "aghsfort_phantom_assassin_stifling_dagger_upgrade",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_phantom_assassin_stifling_dagger_on_attack",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "aghsfort_phantom_assassin_stifling_dagger_upgrade",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "strike_chance",
                    Values: 25,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_phantom_assassin_stifling_dagger_autodagger",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "aghsfort_phantom_assassin_stifling_dagger_upgrade",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "fire_rate",
                    Values: 2.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 700,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_phantom_assassin_phantom_strike",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.ROOT_DISABLES],
            UnitTargetTeam: UnitTargetTeam.CUSTOM,
            UnitTargetType: UnitTargetType.CUSTOM,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            Sound: "Hero_PhantomAssassin.Strike.Start",
            TextureName: "phantom_assassin_phantom_strike",
            CastRange: [1000, 1000, 1000, 1000],
            CastPoint: 0.25,
            Cooldown: [11, 10, 9, 8],
            ManaCost: [35, 40, 45, 50],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_speed",
                    Values: [100, 125, 150, 175],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_evasion",
                    Values: [14, 16, 18, 20],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_phantom_assassin_phantom_strike_buff_allies",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "aghsfort_phantom_assassin_phantom_strike_upgrade",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_phantom_assassin_phantom_strike_mastery",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "aghsfort_phantom_assassin_phantom_strike_upgrade",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_range",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_duration",
                    Values: 1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_evasion",
                    Values: 15,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_phantom_assassin_phantom_strike_damage_reduction",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "aghsfort_phantom_assassin_phantom_strike_upgrade",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_reduction_pct",
                    Values: 85,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_phantom_assassin_blur",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: UnitTargetType.HERO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            TextureName: "phantom_assassin_blur",
            Cooldown: [18, 16, 14, 12],
            CastRange: 600,
            CastPoint: 0.4,
            ManaCost: 50,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_evasion",
                    Values: [20, 30, 40, 50],
                    LinkedSpecialBonus: "special_bonus_unique_phantom_assassin_3",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: [6, 7, 8, 9],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "fade_duration",
                    Values: 0.75,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_phantom_assassin_blur_regen_when_active",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "aghsfort_phantom_assassin_blur_upgrade",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 6,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_phantom_assassin_blur_dagger_on_end",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "aghsfort_phantom_assassin_blur_upgrade",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_phantom_assassin_blur_immediate",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "aghsfort_phantom_assassin_blur_upgrade",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 8,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_phantom_assassin_coup_de_grace",
            Behavior: AbilityBehavior.PASSIVE,
            Type: AbilityTypes.ULTIMATE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            Sound: "Hero_PhantomAssassin.CoupDeGrace",
            TextureName: "phantom_assassin_coup_de_grace",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            CastRange: 800,
            CastPoint: [0.3, 0.3, 0.3, 0.3],
            Cooldown: 40,
            ManaCost: [30, 45, 60],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_chance",
                    Values: 15,
                    LinkedSpecialBonus: "special_bonus_unique_phantom_assassin_2",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_bonus",
                    Values: [200, 325, 450],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_phantom_assassin_coup_de_grace_marks_target",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "aghsfort_phantom_assassin_coup_de_grace_upgrade",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 10,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_phantom_assassin_coup_de_grace_execute",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "aghsfort_phantom_assassin_coup_de_grace_upgrade",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "health_percent",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "kill_percent",
                    Values: 20,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_phantom_assassin_coup_de_grace_kills_refresh",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "aghsfort_phantom_assassin_coup_de_grace_upgrade",
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_phantom_assassin_coup_de_grace_bloody_debuff",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "aghsfort_phantom_assassin_coup_de_grace_upgrade",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_reduction",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "debuff_duration",
                    Values: 15,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "radius",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "angle",
                    Values: 45,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_winter_wyvern_arctic_burn",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            Sound: "Hero_WinterWyvern.ArcticBurn.Cast",
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            TextureName: "winter_wyvern_arctic_burn",
            CastPoint: [0.0, 0.0, 0.0, 0.0],
            Cooldown: [19.0, 18.0, 17.0, 16.0],
            ManaCost: 90,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "attack_point",
                    Values: 0.1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "mana_cost_scepter",
                    Values: 30,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 7.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_range_bonus",
                    Values: [300, 350, 400, 450],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_per_second",
                    Values: [15, 30, 45, 60],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "tick_rate",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_duration",
                    Values: 5.0,
                    CalculateSpellDamageTooltip: false,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "move_slow",
                    Values: [22, 28, 34, 40],
                    LinkedSpecialBonus: "special_bonus_unique_winter_wyvern_1",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "night_vision_bonus",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed_bonus",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tree_destruction_radius",
                    Values: 250,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_winter_wyvern_arctic_burn_splitshot",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "winter_wyvern_arctic_burn",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_modifier",
                    Values: -50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_modifier_tooltip",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "arrow_count",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "split_shot_bonus_range",
                    Values: 100,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_winter_wyvern_arctic_burn_doubleattack",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "winter_wyvern_arctic_burn",
            Cooldown: 3.5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "delay",
                    Values: 0.25,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "cooldown_tooltip",
                    Values: 3.5,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_winter_wyvern_arctic_burn_nomana",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "winter_wyvern_arctic_burn",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_winter_wyvern_arctic_burn_splash_damage",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "winter_wyvern_arctic_burn",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 175,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_winter_wyvern_splinter_blast",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.AOE],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            TextureName: "winter_wyvern_splinter_blast",
            FightRecapLevel: 1,
            CastRange: 1200,
            CastPoint: [0.3, 0.3, 0.3, 0.3],
            Cooldown: 7,
            Damage: 0,
            ManaCost: [105, 120, 135, 150],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 650,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "projectile_max_time",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "split_radius",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_movespeed",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movespeed_slow_tooltip",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "secondary_projectile_speed",
                    Values: 650,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "splinter_damage",
                    Values: [100, 180, 260, 340],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_winter_wyvern_splinter_blast_main_target_hit",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "winter_wyvern_splinter_blast",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_winter_wyvern_splinter_blast_vacuum",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "winter_wyvern_splinter_blast",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 0.3,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_winter_wyvern_splinter_blast_heal",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "winter_wyvern_splinter_blast",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 50,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_winter_wyvern_cold_embrace",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.CREEP],
            SpellImmunityType: SpellImmunityTypes.ALLIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            TextureName: "winter_wyvern_cold_embrace",
            FightRecapLevel: 1,
            Sound: "Hero_Winter_Wyvern.ColdEmbrace",
            CastRange: 1000,
            CastPoint: [0.3, 0.3, 0.3, 0.3],
            Cooldown: [19, 17, 15, 13],
            ManaCost: [50, 60, 70, 80],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "heal_additive",
                    Values: [20, 26, 32, 38],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "heal_percentage",
                    Values: [2.5, 3.5, 4.5, 5.5],
                    LinkedSpecialBonus: "special_bonus_unique_winter_wyvern_5",
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_winter_wyvern_cold_embrace_charges",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "winter_wyvern_cold_embrace",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 2,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_winter_wyvern_cold_embrace_blast_on_end",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "winter_wyvern_cold_embrace",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_winter_wyvern_cold_embrace_magic_damage_block",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "winter_wyvern_cold_embrace",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 350,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_winter_wyvern_winters_curse",
            Type: AbilityTypes.ULTIMATE,
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.AOE],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.CREEP],
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            TextureName: "winter_wyvern_winters_curse",
            FightRecapLevel: 2,
            Sound: "Hero_WinterWyvern.WintersCurse.Target",
            CastRange: 800,
            CastPoint: [0.3, 0.3, 0.3, 0.3],
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: 80,
            ManaCost: 250,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_reduction",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_amplification",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_speed",
                    Values: 55,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: [4.0, 4.75, 5.5],
                    LinkedSpecialBonus: "special_bonus_unique_winter_wyvern_3",
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_winter_wyvern_winters_curse_transfer",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "winter_wyvern_winters_curse",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_winter_wyvern_winters_curse_damage_amp",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "winter_wyvern_winters_curse",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_winter_wyvern_winters_curse_heal_on_death",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "winter_wyvern_winters_curse",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_snapfire_scatterblast",
            Behavior: AbilityBehavior.POINT,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            FightRecapLevel: 1,
            Sound: "Hero_Snapfire.Shotgun.Fire",
            TextureName: "snapfire_scatterblast",
            CastRange: 800,
            CastPoint: 0.4,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            AnimationPlaybackRate: 1.2,
            Cooldown: 10.0,
            ManaCost: [80, 90, 100, 110],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [80, 150, 220, 290],
                    LinkedSpecialBonus: "special_bonus_unique_snapfire_7",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "blast_speed",
                    Values: 3000,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "blast_width_initial",
                    Values: 225,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "blast_width_end",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "debuff_duration",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_slow_pct",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "point_blank_range",
                    Values: 450,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "point_blank_dmg_bonus_pct",
                    Values: 50.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_snapfire_mortimer_kisses",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE, AbilityBehavior.DONT_RESUME_MOVEMENT, AbilityBehavior.DONT_RESUME_ATTACK],
            Type: AbilityTypes.ULTIMATE,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            Sound: "Hero_Snapfire.MortimerBlob.Launch",
            TextureName: "snapfire_mortimer_kisses",
            CastRange: 3000,
            CastPoint: 0.5,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            UnitDamageType: DamageType.MAGICAL,
            Cooldown: 110,
            Duration: 6.0,
            ManaCost: [125, 150, 175],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "burn_damage",
                    Values: [50, 75, 100],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "move_slow_pct",
                    Values: [15, 20, 25],
                    LinkedSpecialBonus: "special_bonus_unique_snapfire_4",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_ground_duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "dist_change_speed",
                    Values: 75,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "min_range",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "min_lob_travel_time",
                    Values: 0.8,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_lob_travel_time",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "delay_after_last_projectile",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_linger_duration",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_count",
                    Values: 8,
                    LinkedSpecialBonus: "special_bonus_unique_snapfire_1",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 1300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_width",
                    Values: 130,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_radius",
                    Values: 275,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_per_impact",
                    Values: [160, 240, 320],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration_tooltip",
                    Values: 6.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_vision",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "turn_rate",
                    Values: 75,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_interval",
                    Values: 0.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_snapfire_gobble_up",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.DONT_RESUME_ATTACK, AbilityBehavior.HIDDEN, AbilityBehavior.SHOW_IN_GUIDES],
            UnitTargetTeam: UnitTargetTeam.CUSTOM,
            UnitTargetType: UnitTargetType.CUSTOM,
            UnitTargetFlags: UnitTargetFlags.NOT_CREEP_HERO,
            MaxLevel: 1,
            FightRecapLevel: 1,
            GrantedByScepter: true,
            Sound: "Hero_Snapfire.GobbleUp.Cast",
            TextureName: "snapfire_gobble_up",
            CastPoint: 0.3,
            CastRange: 150,
            Cooldown: 40,
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_time_in_belly",
                    Values: 3.0,
                    RequiresScepter: true,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_snapfire_spit_creep",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE, AbilityBehavior.DONT_RESUME_MOVEMENT, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            MaxLevel: 1,
            FightRecapLevel: 1,
            GrantedByScepter: true,
            Sound: "Hero_Snapfire.MortimerBlob.Launch",
            TextureName: "snapfire_spit_creep",
            CastRange: 3000,
            CastPoint: 0.3,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            UnitDamageType: DamageType.MAGICAL,
            Cooldown: 0,
            ManaCost: 150,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "min_range",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "min_lob_travel_time",
                    Values: 0.1,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_lob_travel_time",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_linger_duration",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "min_height_above_lowest",
                    Values: 150.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "min_height_above_highest",
                    Values: 100.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "min_acceleration",
                    Values: 1000.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_acceleration",
                    Values: 2000.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 1400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_width",
                    Values: 130,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_damage",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_vision",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_interval",
                    Values: 0.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "burn_damage",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "move_slow_pct",
                    Values: 25,
                    LinkedSpecialBonus: "special_bonus_unique_snapfire_4",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_ground_duration",
                    Values: 3.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_snapfire_firesnap_cookie",
            ID: 6483,
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.BOTH,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.CREEP],
            UnitTargetFlags: UnitTargetFlags.INVULNERABLE,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            UnitDamageType: DamageType.MAGICAL,
            FightRecapLevel: 1,
            Sound: "Hero_Snapfire.FeedCookie.Cast",
            TextureName: "snapfire_firesnap_cookie",
            CastRange: 700,
            CastPoint: 0.2,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            Cooldown: [13, 12, 11, 10],
            ManaCost: 100,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "impact_stun_duration",
                    Values: [1.6, 1.8, 2.0, 2.2],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "self_cast_delay",
                    Values: 0.3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 1000,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pre_hop_duration",
                    Values: 0.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "jump_duration",
                    Values: 0.484,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "jump_height",
                    Values: 257,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "jump_horizontal_distance",
                    Values: 450,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pre_land_anim_time",
                    Values: 0.14,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "landing_gesture_duration",
                    Values: 0.6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_damage",
                    Values: [90, 160, 230, 300],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_snapfire_lil_shredder",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: UnitTargetType.HERO,
            UnitDamageType: DamageType.PHYSICAL,
            UnitTargetFlags: UnitTargetFlags.INVULNERABLE,
            FightRecapLevel: 1,
            Sound: "Hero_Snapfire.ExplosiveShells.Cast",
            TextureName: "snapfire_lil_shredder",
            CastPoint: 0.0,
            CastRange: 800,
            CastAnimation: GameActivity.DOTA_OVERRIDE_ABILITY_3,
            Cooldown: [14, 13, 12, 11],
            Duration: 8,
            ManaCost: 90,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [35, 50, 65, 80],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "buffed_attacks",
                    Values: 6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_speed_bonus",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_range_bonus",
                    Values: [75, 150, 225, 300],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "buff_duration_tooltip",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "base_attack_time",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_speed_slow_per_stack",
                    Values: [15, 20, 25, 30],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 3.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_snapfire_scatterblast_double_barrel",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "snapfire_scatterblast",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 2,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_snapfire_scatterblast_knockback",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "snapfire_scatterblast",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 250,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_snapfire_scatterblast_fullrange_pointblank",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "snapfire_scatterblast",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_snapfire_scatterblast_barrage",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "snapfire_scatterblast",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 60,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_snapfire_firesnap_cookie_multicookie",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "snapfire_firesnap_cookie",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed_pct",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_snapfire_firesnap_cookie_allied_buff",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "snapfire_firesnap_cookie",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_range",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_damage",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "buff_duration",
                    Values: 6.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_snapfire_firesnap_cookie_enemytarget",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "snapfire_firesnap_cookie",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_snapfire_lil_shredder_explosives",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "snapfire_lil_shredder",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 150,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_snapfire_lil_shredder_bouncing_bullets",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "snapfire_lil_shredder",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bounce_range",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bounces",
                    Values: 3,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_snapfire_lil_shredder_ally_cast",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "snapfire_lil_shredder",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 500,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_snapfire_mortimer_kisses_fragmentation",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "snapfire_mortimer_kisses",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "split_projectiles",
                    Values: 6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "split_radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "split_impact_radius",
                    Values: 150,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_snapfire_mortimer_kisses_autoattack",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "snapfire_mortimer_kisses",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "fire_rate",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 450,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_snapfire_mortimer_kisses_incoming_damage_reduction",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "snapfire_mortimer_kisses",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_reduction",
                    Values: 80,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_tusk_ice_shards",
            Behavior: [AbilityBehavior.DIRECTIONAL, AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            FightRecapLevel: 1,
            Sound: "Hero_Tusk.IceShards",
            TextureName: "tusk_ice_shards",
            CastRange: 2000,
            CastPoint: [0.1, 0.1, 0.1, 0.1],
            Cooldown: [18.0, 16.0, 14.0, 12.0],
            ManaCost: [100, 110, 120, 130],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "shard_width",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "shard_damage",
                    Values: [80, 160, 240, 320],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "shard_count",
                    Values: 7,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "shard_speed",
                    Values: 1200.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "shard_duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "shard_angle_step",
                    Values: 40.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "shard_distance",
                    Values: 200,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_tusk_ice_shards_stop",
            Behavior: [AbilityBehavior.HIDDEN, AbilityBehavior.NO_TARGET],
            CastPoint: [0.0, 0.0, 0.0, 0.0],
        });
    
        this.Abilities.push({
            Name: "aghsfort_tusk_snowball",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.ROOT_DISABLES],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            Sound: "Hero_Tusk.Snowball.Cast",
            TextureName: "tusk_snowball",
            CastRange: 1250,
            CastPoint: [0.1, 0.1, 0.1, 0.1],
            Cooldown: [21, 19, 17, 15],
            ManaCost: [75, 80, 85, 90],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "snowball_grab_radius",
                    Values: 350,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "snowball_damage",
                    Values: [90, 150, 210, 270],
                    LinkedSpecialBonus: "special_bonus_unique_tusk_2",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "snowball_speed",
                    Values: [600, 625, 650, 675],
                    LinkedSpecialBonus: "special_bonus_unique_tusk_3",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "snowball_damage_bonus",
                    Values: [40, 60, 80, 100],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: [0.5, 0.75, 1.0, 1.25],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "snowball_windup_radius",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "snowball_duration",
                    Values: 3.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "snowball_radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "snowball_grow_rate",
                    Values: 40,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "snowball_windup",
                    Values: 3.0,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_tusk_launch_snowball",
            Behavior: [AbilityBehavior.HIDDEN, AbilityBehavior.NO_TARGET, AbilityBehavior.NOT_LEARNABLE, AbilityBehavior.IMMEDIATE, AbilityBehavior.IGNORE_PSEUDO_QUEUE],
            TextureName: "tusk_snowball",
            CastPoint: [0.0, 0.0, 0.0, 0.0],
            CastAnimation: GameActivity.INVALID,
        });
    
        this.Abilities.push({
            Name: "aghsfort_tusk_tag_team",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.PHYSICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            Sound: "Hero_Tusk.FrozenSigil",
            TextureName: "tusk_tag_team",
            CastPoint: 0,
            CastRange: 500,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            Cooldown: [21, 18, 15, 12],
            ManaCost: 70,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage",
                    Values: [25, 50, 75, 100],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_slow",
                    Values: 75,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 0.4,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "debuff_duration",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 350,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_tusk_walrus_punch",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.AUTOCAST, AbilityBehavior.ATTACK],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            Type: AbilityTypes.ULTIMATE,
            FightRecapLevel: 1,
            Sound: "Hero_Tusk.WalrusPunch.Target",
            TextureName: "tusk_walrus_punch",
            CastPoint: 0,
            CastRange: 150,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: [28, 20, 12],
            ManaCost: [50, 75, 100],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_multiplier",
                    Values: 350,
                    LinkedSpecialBonus: "special_bonus_unique_tusk",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "air_time",
                    Values: 1.0,
                    LinkedSpecialBonus: "special_bonus_unique_tusk_7",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: [2.0, 3.0, 4.0],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "move_slow",
                    Values: 40,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "push_length",
                    Values: 1000,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_tusk_ice_shards_circle",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "tusk_ice_shards",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 80,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_tusk_ice_shards_secondary",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "tusk_ice_shards",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 2000,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_tusk_ice_shards_explode",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "tusk_ice_shards",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_pct",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "explosion_interval",
                    Values: 0.75,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_tusk_ice_shards_stun",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "tusk_ice_shards",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 2,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_tusk_snowball_heal",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "tusk_snowball",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 4,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_tusk_snowball_end_damage",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "tusk_snowball",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 450,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_tusk_snowball_global",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "tusk_snowball",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_tusk_tag_team_lifesteal",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "tusk_tag_team",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 8,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_tusk_tag_team_toggle",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "tusk_tag_team",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 15,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_tusk_tag_team_global",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "tusk_tag_team",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_tusk_walrus_punch_reset",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "tusk_walrus_punch",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_tusk_walrus_punch_land_damage",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "tusk_walrus_punch",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_pct",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_tusk_walrus_punch_wallop",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "tusk_walrus_punch",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "distance",
                    Values: 600,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "fall_off_pct",
                    Values: 25,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "vertical_distance",
                    Values: 150,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_ursa_earthshock",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            Sound: "Hero_Ursa.Earthshock",
            TextureName: "ursa_earthshock",
            CastRange: 0,
            CastPoint: 0,
            Cooldown: [9, 8, 7, 6],
            Duration: 4.0,
            ManaCost: 85,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "shock_radius",
                    Values: 385,
                    LinkedSpecialBonus: "special_bonus_unique_ursa_5",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_slow",
                    Values: [10, 25, 40, 55],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hop_distance",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "hop_duration",
                    Values: 0.25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "hop_height",
                    Values: 83,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "impact_damage",
                    Values: [75, 125, 175, 225],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
        });
    
        this.Abilities.push({
            Name: "aghsfort_ursa_overpower",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            Sound: "Hero_Ursa.Overpower",
            TextureName: "ursa_overpower",
            CastAnimation: GameActivity.DOTA_OVERRIDE_ABILITY_3,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastRange: 0,
            CastPoint: 0.3,
            Cooldown: [15, 13, 11, 9],
            Duration: 20,
            ManaCost: [55, 60, 65, 70],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_attacks",
                    Values: [3, 4, 5, 6],
                    LinkedSpecialBonus: "special_bonus_unique_ursa_7",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_speed_bonus_pct",
                    Values: 400,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_ursa_fury_swipes",
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.PHYSICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            TextureName: "ursa_fury_swipes",
            CastPoint: 0.3,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_reset_time",
                    Values: 8,
                    LinkedSpecialBonus: "special_bonus_unique_ursa_4",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_reset_time_roshan",
                    Values: 14,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_per_stack",
                    Values: [10, 18, 26, 34],
                    LinkedSpecialBonus: "special_bonus_unique_ursa",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_swipe_stack",
                    Values: 6,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_SPAWN,
        });
    
        this.Abilities.push({
            Name: "aghsfort_ursa_enrage",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE],
            Type: AbilityTypes.ULTIMATE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            Sound: "Hero_Ursa.Enrage",
            TextureName: "ursa_enrage",
            CastAnimation: GameActivity.DOTA_OVERRIDE_ABILITY_4,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
            CastRange: 0,
            Cooldown: [50, 40, 30],
            ManaCost: 0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_reduction",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "status_resistance",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: [4, 4.5, 5],
                    LinkedSpecialBonus: "special_bonus_unique_ursa_3",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "cooldown_scepter",
                    Values: [30, 24, 18],
                    RequiresScepter: true,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_earthshock_bonus_charge",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_earthshock",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 1,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_earthshock_invis",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_earthshock",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 2.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value2",
                    Values: 0.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_earthshock_apply_fury_swipes",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_earthshock",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_earthshock_overpower_stack",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_earthshock",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 2,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_earthshock_knockback",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_earthshock",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 125,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value2",
                    Values: 0.15,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value3",
                    Values: 1.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_earthshock_miss_chance",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_earthshock",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 40,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_overpower_crit",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_overpower",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 130,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_overpower_evasion",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_overpower",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 3.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value2",
                    Values: 30,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_overpower_taunt",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_overpower",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value2",
                    Values: 350,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value3",
                    Values: 2.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_overpower_cleave",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_overpower",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 35,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value2",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value3",
                    Values: 360,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value4",
                    Values: 650,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_fury_swipes_armor_reduction",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_fury_swipes",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 1,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_fury_swipes_lifesteal",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_fury_swipes",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 3,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_fury_swipes_ursa_minor",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_fury_swipes",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cubs",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "mana_cost",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cooldown",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 10.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cub_swipes_modifier",
                    Values: 25,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_enrage_magic_immunity",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_enrage",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 700,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value2",
                    Values: 30,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_enrage_allies",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_enrage",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 700,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_enrage_fear",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_enrage",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value2",
                    Values: 3.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_enrage_armor",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_enrage",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 700,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value2",
                    Values: 30,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_enrage_attack_speed",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_enrage",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 700,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value2",
                    Values: 80,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_ursa_enrage_earthshock",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "ursa_enrage",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "interval",
                    Values: 1.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_sniper_shrapnel",
            Behavior: [AbilityBehavior.AOE, AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            Sound: "Hero_Sniper.ShrapnelShatter",
            TextureName: "sniper_shrapnel",
            CastRange: 1800,
            CastPoint: [0.3, 0.3, 0.3, 0.3],
            Cooldown: 0,
            Charges: 3,
            ChargeRestoreTime: 40,
            ManaCost: 50,
            ModifierSupportValue: 0.25,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_movement_speed",
                    Values: [-12, -18, -24, -30],
                    LinkedSpecialBonus: "special_bonus_unique_sniper_5",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 450,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "shrapnel_damage",
                    Values: [20, 40, 60, 80],
                    LinkedSpecialBonus: "special_bonus_unique_sniper_1",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 6.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_delay",
                    Values: 1.2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: [2.0, 2.0, 2.0, 2.0],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "AbilityCharges",
                    Values: 0,
                    LinkedSpecialBonus: "special_bonus_unique_sniper_2",
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_sniper_headshot",
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.PHYSICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            TextureName: "sniper_headshot",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "proc_chance",
                    Values: 40,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [20, 50, 80, 110],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance",
                    Values: 10,
                    LinkedSpecialBonus: "special_bonus_unique_sniper_3",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow",
                    Values: -100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "slow_vs_considered_hero",
                    Values: -40,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 0.5,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_sniper_take_aim",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE],
            TextureName: "sniper_take_aim",
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            CastRange: 0,
            CastPoint: 0,
            Cooldown: [9, 8, 7, 6],
            ManaCost: 30,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_range",
                    Values: [100, 200, 300, 400],
                    LinkedSpecialBonus: "special_bonus_unique_sniper_6",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "active_attack_range_multiplier",
                    Values: 2,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_sniper_assassinate",
            Type: AbilityTypes.ULTIMATE,
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.NORMAL_WHEN_STOLEN],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: UnitTargetFlags.INVULNERABLE,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            UnitDamageType: DamageType.MAGICAL,
            FightRecapLevel: 2,
            Sound: "Ability.Assassinate",
            TextureName: "sniper_assassinate",
            CastRange: 3000,
            CastRangeBuffer: 600,
            CastPoint: 1.5,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: [20, 15, 10],
            ManaCost: [175, 225, 275],
            ModifierSupportValue: 0.0,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [320, 485, 650],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "abilitycastpoint",
                    Values: 0,
                    LinkedSpecialBonus: "aghsfort_special_sniper_assassinate_original_scepter",
                    LinkedSpecialBonusOperation: LinkedSpecialBonusOperation.SUBTRACT,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "scepter_stun_duration",
                    Values: 1.5,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "scepter_cast_point_pct",
                    Values: 0.5,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 2500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "cast_point",
                    Values: 1.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_sniper_shrapnel_bombs",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "sniper_shrapnel",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value2",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_sniper_shrapnel_attack_speed",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "sniper_shrapnel",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value2",
                    Values: 15,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_sniper_shrapnel_miss_chance",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "sniper_shrapnel",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 15,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_sniper_shrapnel_move_speed",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "sniper_shrapnel",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 150,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_sniper_headshot_crits",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "sniper_headshot",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 135,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_sniper_headshot_stuns",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "sniper_headshot",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 3.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_sniper_take_aim_self_purge",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "sniper_take_aim",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value2",
                    Values: 2.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_sniper_take_aim_aoe",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "sniper_take_aim",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value2",
                    Values: 0.05,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value3",
                    Values: 800,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_sniper_take_aim_hop_backwards",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "sniper_take_aim",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value2",
                    Values: 0.2,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value3",
                    Values: 350,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value4",
                    Values: 180,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value5",
                    Values: 30.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_sniper_take_aim_armor_reduction",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "sniper_take_aim",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value2",
                    Values: 6,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_sniper_take_aim_rapid_fire",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "sniper_take_aim",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 6.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value2",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value3",
                    Values: 3,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_sniper_assassinate_buckshot",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "sniper_assassinate",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value2",
                    Values: 450,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value3",
                    Values: 60,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_sniper_assassinate_original_scepter",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "sniper_assassinate",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_sniper_assassinate_killshot",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "sniper_assassinate",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value2",
                    Values: 1,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_mars_spear",
            TextureName: "mars_spear",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.DIRECTIONAL],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            FightRecapLevel: 1,
            Sound: "Hero_Mars.Spear.Cast",
            CastPoint: 0.25,
            Cooldown: 14.0,
            ManaCost: 100,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [100, 175, 250, 325],
                    LinkedSpecialBonus: "special_bonus_unique_mars_spear_bonus_damage",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "spear_speed",
                    Values: 1400,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spear_width",
                    Values: 125,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spear_vision",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spear_range",
                    Values: [900, 1000, 1100, 1200],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "activity_duration",
                    Values: 1.7,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: [1.6, 2.0, 2.4, 2.8],
                    LinkedSpecialBonus: "special_bonus_unique_mars_spear_stun_duration",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration",
                    Values: 0.25,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_distance",
                    Values: 75,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_5,
        });
    
        this.Abilities.push({
            Name: "aghsfort_mars_gods_rebuke",
            TextureName: "mars_gods_rebuke",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.NORMAL_WHEN_STOLEN],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.PHYSICAL,
            FightRecapLevel: 1,
            Sound: "Hero_Mars.Shield.Cast",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            CastRange: 500,
            CastPoint: 0.2,
            Cooldown: [16, 14, 12, 10],
            ManaCost: [65, 70, 75, 80],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "crit_mult",
                    Values: [120, 150, 180, 220],
                    LinkedSpecialBonus: "special_bonus_unique_mars_gods_rebuke_extra_crit",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "angle",
                    Values: 140,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 500,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration",
                    Values: 0.3,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_distance",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_slow",
                    Values: 40,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_slow_duration",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "activity_duration",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage_vs_heroes",
                    Values: 35,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_mars_bulwark",
            TextureName: "mars_bulwark",
            Behavior: AbilityBehavior.NO_TARGET,
            CastAnimation: GameActivity.INVALID,
            Cooldown: [20, 18, 16, 14],
            Duration: 5.0,
            ManaCost: 25,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "physical_damage_reduction",
                    Values: [10, 15, 20, 25],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "forward_angle",
                    Values: 140,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "physical_damage_reduction_side",
                    Values: [8, 12, 16, 20],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "side_angle",
                    Values: 240,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "redirect_chance",
                    Values: 70,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "redirect_range",
                    Values: 800,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "redirect_speed_penatly",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "active_bulwark_block_bonus",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "active_duration",
                    Values: [4, 5, 6, 7],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_mars_bulwark_stop",
            TextureName: "aghsfort_mars_bulwark_stop",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.NOT_LEARNABLE, AbilityBehavior.HIDDEN, AbilityBehavior.DONT_RESUME_ATTACK, AbilityBehavior.IMMEDIATE],
            CastPoint: [0.0, 0.0, 0.0, 0.0],
            CastAnimation: GameActivity.INVALID,
        });
    
        this.Abilities.push({
            Name: "aghsfort_mars_arena_of_blood",
            TextureName: "mars_arena_of_blood",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE],
            Type: AbilityTypes.ULTIMATE,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            Sound: "Hero_Mars.ArenaOfBlood.Start",
            CastRange: 400,
            CastPoint: 0.2,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
            Cooldown: [90, 75, 60],
            ManaCost: 200,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "warrior_fade_min_dist",
                    Values: 350.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "warrior_fade_max_dist",
                    Values: 450.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: [5, 6, 7],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 550,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "width",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spear_damage",
                    Values: [120, 185, 250],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "formation_time",
                    Values: 0.3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spear_distance_from_wall",
                    Values: 360,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "spear_attack_interval",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "warrior_count",
                    Values: 14,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "first_warrior_angle",
                    Values: 0.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_spear_multiskewer",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_spear",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 7,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_spear_impale_explosion",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_spear",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 450,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_spear_burning_trail",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_spear",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "trail_duration",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_pct",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "path_radius",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "linger_duration",
                    Values: 0.2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_interval",
                    Values: 0.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_gods_rebuke_full_circle",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_gods_rebuke",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_gods_rebuke_stun",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_gods_rebuke",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 2,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_gods_rebuke_strength_buff",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_gods_rebuke",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "buff_duration",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "strength_gain",
                    Values: 4,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_bulwark_counter_rebuke",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_bulwark",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 17,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_bulwark_healing",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_bulwark",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 4,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_bulwark_spears",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_bulwark",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "stack_limit",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stack_interval",
                    Values: 1.10,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_bulwark_soldiers",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_bulwark",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "soldier_count",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "soldier_offset",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage_pct",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_damage_tooltip",
                    Values: 25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_range_tooltip",
                    Values: 300,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_bulwark_return",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_bulwark",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 35,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_arena_of_blood_fear",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_arena_of_blood",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 3,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_arena_of_blood_global",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_arena_of_blood",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 25,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_arena_of_blood_attack_buff",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_arena_of_blood",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_speed",
                    Values: 25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage",
                    Values: 35,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_mars_arena_of_blood_outside_perimeter",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "mars_arena_of_blood",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 250,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_viper_poison_attack",
            Behavior: [AbilityBehavior.UNIT_TARGET, AbilityBehavior.AUTOCAST, AbilityBehavior.ATTACK],
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            Sound: "hero_viper.poisonAttack.Cast",
            TextureName: "viper_poison_attack",
            CastRange: [600, 640, 680, 720],
            CastPoint: 0,
            Cooldown: 0.0,
            Damage: [0, 0, 0, 0],
            ManaCost: 25,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage",
                    Values: [4, 8, 12, 16],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_speed",
                    Values: [6, 8, 10, 12],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "magic_resistance",
                    Values: [1, 2, 3, 4],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_stacks",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_range",
                    Values: [25, 65, 105, 145],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_viper_nethertoxin",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.AOE],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            TextureName: "viper_nethertoxin",
            CastPoint: 0.2,
            CastRange: 900,
            Cooldown: 14.0,
            ManaCost: [70, 80, 90, 100],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "min_damage",
                    Values: [15, 20, 25, 30],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_damage",
                    Values: [60, 80, 100, 120],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_duration",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 2000,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_viper_corrosive_skin",
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            Sound: "hero_viper.CorrosiveSkin",
            TextureName: "viper_corrosive_skin",
            ModifierSupportBonus: 10,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 4.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_speed",
                    Values: [8, 16, 24, 32],
                    LinkedSpecialBonus: "special_bonus_unique_viper_1",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_magic_resistance",
                    Values: [10, 15, 20, 25],
                    LinkedSpecialBonus: "special_bonus_unique_viper_1",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [8, 16, 24, 32],
                    LinkedSpecialBonus: "special_bonus_unique_viper_1",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_range_tooltip",
                    Values: 1400,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_viper_viper_strike",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            Type: AbilityTypes.ULTIMATE,
            UnitTargetFlags: UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            UnitDamageType: DamageType.MAGICAL,
            FightRecapLevel: 2,
            Sound: "hero_viper.viperStrike",
            TextureName: "viper_viper_strike",
            CastRange: 500,
            CastPoint: [0.3, 0.3, 0.3],
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: [50, 40, 30],
            ManaCost: [125, 175, 250],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "charge_restore_time",
                    Values: 30.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [80, 120, 160],
                    LinkedSpecialBonus: "special_bonus_unique_viper_2",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_movement_speed",
                    Values: [-40, -60, -80],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_speed",
                    Values: [-40, -60, -80],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "mana_cost_scepter",
                    Values: [125, 125, 125],
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "cooldown_scepter",
                    Values: 10,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cast_range_scepter",
                    Values: 900,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 1200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_charges",
                    Values: 2,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_viper_poison_snap",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "viper_poison_attack",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 25,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_viper_poison_attack_explode",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "viper_poison_attack",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_multiplier",
                    Values: 2.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_viper_poison_attack_spread",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "viper_poison_attack",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 300,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_viper_nethertoxin_lifesteal",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "viper_nethertoxin",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 8,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_viper_nethertoxin_charges",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "viper_nethertoxin",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 2,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_viper_nethertoxin_persist",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "viper_nethertoxin",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 2.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_viper_corrosive_skin_speed_steal",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "viper_corrosive_skin",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bonus_factor",
                    Values: 0.25,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_viper_corrosive_skin_flying",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "viper_corrosive_skin",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_multiplier",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "flight_time",
                    Values: 8.0,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "cooldown",
                    Values: 30.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "mana_cost",
                    Values: 50,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 450,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_viper_corrosive_skin_aura",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "viper_corrosive_skin",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 900,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_viper_viper_strike_allies",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "viper_viper_strike",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_viper_chain_viper_strike",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "viper_viper_strike",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 2,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_viper_channeled_viper_strike",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "viper_viper_strike",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_viper_periodic_strike",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "viper_viper_strike",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 0.4,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_weaver_the_swarm",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.PHYSICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            Sound: "Hero_Weaver.Swarm.Cast",
            TextureName: "weaver_the_swarm",
            CastPoint: [0.3, 0.3, 0.3, 0.3],
            CastRange: 3000,
            Cooldown: [20, 18, 16, 14],
            ManaCost: 90,
            ModifierSupportValue: 0.2,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [18, 24, 30, 36],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "attack_rate",
                    Values: [1.15, 1.0, 0.85, 0.7],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "count",
                    Values: 8,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "armor_reduction",
                    Values: [1, 1, 1, 1],
                    LinkedSpecialBonus: "special_bonus_unique_weaver_3",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "destroy_attacks",
                    Values: 2,
                    LinkedSpecialBonus: "special_bonus_unique_weaver_4",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: [100, 100, 100, 100],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: [600, 600, 600, 600],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "spawn_radius",
                    Values: [300, 300, 300, 300],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_weaver_shukuchi",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE, AbilityBehavior.IGNORE_CHANNEL],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            Sound: "Hero_Weaver.Shukuchi",
            TextureName: "weaver_shukuchi",
            CastPoint: [0, 0, 0, 0],
            Cooldown: [12.0, 11.0, 10.0, 9.0],
            ManaCost: 70,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [100, 150, 200, 250],
                    LinkedSpecialBonus: "special_bonus_unique_weaver_1",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: [190, 200, 210, 220],
                    LinkedSpecialBonus: "special_bonus_unique_weaver_2",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: [175, 175, 175, 175],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "fade_time",
                    Values: [0.25, 0.25, 0.25, 0.25],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 3.0,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_weaver_geminate_attack",
            Behavior: AbilityBehavior.PASSIVE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            TextureName: "weaver_geminate_attack",
            Cooldown: [9.0, 7.5, 6.0, 4.5],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "delay",
                    Values: 0.25,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "tooltip_attack",
                    Values: 1,
                    LinkedSpecialBonus: "special_bonus_unique_weaver_5",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage",
                    Values: [10, 25, 40, 55],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_weaver_time_lapse",
            Type: AbilityTypes.ULTIMATE,
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.DONT_RESUME_MOVEMENT, AbilityBehavior.DONT_RESUME_ATTACK, AbilityBehavior.IGNORE_BACKSWING],
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: UnitTargetType.HERO,
            UnitTargetFlags: UnitTargetFlags.NOT_CREEP_HERO,
            CastRange: 1000,
            Sound: "Hero_Weaver.TimeLapse",
            TextureName: "weaver_time_lapse",
            FightRecapLevel: 2,
            CastPoint: [0.3, 0.3, 0.3, 0.3],
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: [70, 55, 40],
            ManaCost: [150, 125, 100],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cooldown_scepter",
                    Values: 16,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cast_range_tooltip_scepter",
                    Values: 1000,
                    RequiresScepter: true,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_swarm_allies",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_the_swarm",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_swarm_explosion",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_the_swarm",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_pct",
                    Values: 150,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_swarm_damage_transfer",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_the_swarm",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 20,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_geminate_attack_splitshot",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_geminate_attack",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_count",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_range",
                    Values: 250,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_geminate_attack_applies_swarm",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_geminate_attack",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_geminate_attack_lifesteal",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_geminate_attack",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback",
                    Values: 40,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_geminate_attack_knockback",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_geminate_attack",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 40,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_shukuchi_pull",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_shukuchi",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_shukuchi_trail",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_shukuchi",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "trail_duration",
                    Values: 4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_pct",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "path_radius",
                    Values: 150,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "linger_duration",
                    Values: 0.2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_interval",
                    Values: 0.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_shukuchi_attack_on_completion",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_shukuchi",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_shukuchi_swarm",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_shukuchi",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_shukuchi_greater_invisibility",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_shukuchi",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_shukuchi_heal",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_shukuchi",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "heal_pct",
                    Values: 60,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_time_lapse_allies",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_time_lapse",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_time_lapse_restoration",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_time_lapse",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_weaver_time_lapse_explosion",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "weaver_time_lapse",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 250,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_pct",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_witch_doctor_paralyzing_cask",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES_STRONG,
            FightRecapLevel: 1,
            Sound: "Hero_WitchDoctor.Paralyzing_Cask_Cast",
            TextureName: "witch_doctor_paralyzing_cask",
            CastRange: 700,
            CastPoint: [0.35, 0.35, 0.35, 0.35],
            Cooldown: [20.0, 18.0, 16.0, 14.0],
            ManaCost: [80, 100, 120, 140],
            ModifierSupportValue: 0.5,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "stun_duration",
                    Values: [1.0, 1.0, 1.0, 1.0],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [75, 100, 125, 150],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bounce_range",
                    Values: [575, 575, 575, 575],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bounces",
                    Values: [3, 5, 7, 9],
                    LinkedSpecialBonus: "special_bonus_unique_witch_doctor_3",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 1000,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "bounce_delay",
                    Values: 0.3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bounces_tooltip",
                    Values: [2, 4, 6, 8],
                    LinkedSpecialBonus: "special_bonus_unique_witch_doctor_3",
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_witch_doctor_voodoo_restoration",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.TOGGLE, AbilityBehavior.IGNORE_CHANNEL],
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            SpellImmunityType: SpellImmunityTypes.ALLIES_YES,
            Sound: "Hero_WitchDoctor.Voodoo_Restoration",
            TextureName: "witch_doctor_voodoo_restoration",
            Cooldown: [0.0, 0.0, 0.0, 0.0],
            ManaCost: [34, 40, 46, 52],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "mana_per_second",
                    Values: [24, 30, 36, 42],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "heal",
                    Values: [16, 24, 32, 40],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "heal_interval",
                    Values: [0.33, 0.33, 0.33, 0.33],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "activation_base_mana_cost",
                    Values: 10,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_witch_doctor_maledict",
            Behavior: [AbilityBehavior.AOE, AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.MAGICAL,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            Sound: "Hero_WitchDoctor.Maledict_Cast",
            TextureName: "witch_doctor_maledict",
            CastRange: 575,
            CastPoint: [0.35, 0.35, 0.35, 0.35],
            Cooldown: [30, 26, 22, 18],
            Duration: 12.0,
            Damage: [7, 14, 21, 28],
            ManaCost: [105, 110, 115, 120],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 180,
                    LinkedSpecialBonus: "special_bonus_unique_witch_doctor_6",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "abilityduration",
                    Values: 0,
                    LinkedSpecialBonus: "special_bonus_unique_witch_doctor_4",
                    LinkedSpecialBonusField: "value",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage",
                    Values: [16, 24, 32, 40],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage_threshold",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "ticks",
                    Values: 3,
                    LinkedSpecialBonusField: "value2",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_bonus_damage",
                    Values: [180, 220, 240, 260],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_witch_doctor_death_ward",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.CHANNELLED],
            Type: AbilityTypes.ULTIMATE,
            UnitDamageType: DamageType.PHYSICAL,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: [UnitTargetFlags.NO_INVIS, UnitTargetFlags.FOW_VISIBLE, UnitTargetFlags.NOT_ATTACK_IMMUNE, UnitTargetFlags.MAGIC_IMMUNE_ENEMIES],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            FightRecapLevel: 2,
            Sound: "Hero_WitchDoctor.Death_WardBuild",
            TextureName: "witch_doctor_death_ward",
            LinkedAbility: "aghsfort_witch_doctor_death_ward_no_channel",
            CastRange: 600,
            CastPoint: [0.35, 0.35, 0.35],
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            ChannelAnimation: GameActivity.DOTA_CHANNEL_ABILITY_4,
            Cooldown: 80.0,
            ManaCost: [200, 200, 200],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [85, 135, 185],
                    LinkedSpecialBonus: "special_bonus_unique_witch_doctor_5",
                    CalculateSpellDamageTooltip: false,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_range_tooltip",
                    Values: 700,
                    LinkedSpecialBonus: "special_bonus_unique_witch_doctor_1",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bounce_radius",
                    Values: [550, 550, 550],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bounces",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "channel_duration",
                    Values: [6.0, 7.0, 8.0],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_witch_doctor_death_ward_no_channel",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.HIDDEN],
            Type: AbilityTypes.ULTIMATE,
            UnitDamageType: DamageType.PHYSICAL,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetFlags: [UnitTargetFlags.NO_INVIS, UnitTargetFlags.FOW_VISIBLE, UnitTargetFlags.NOT_ATTACK_IMMUNE, UnitTargetFlags.MAGIC_IMMUNE_ENEMIES],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            FightRecapLevel: 2,
            Sound: "Hero_WitchDoctor.Death_WardBuild",
            TextureName: "witch_doctor_death_ward",
            CastRange: 600,
            CastPoint: [0.35, 0.35, 0.35],
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            ChannelAnimation: GameActivity.DOTA_CHANNEL_ABILITY_4,
            Cooldown: 80.0,
            Duration: 8.0,
            ManaCost: [200, 200, 200],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [85, 135, 185],
                    LinkedSpecialBonus: "special_bonus_unique_witch_doctor_5",
                    CalculateSpellDamageTooltip: false,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_range_tooltip",
                    Values: 700,
                    LinkedSpecialBonus: "special_bonus_unique_witch_doctor_1",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bounce_radius",
                    Values: [550, 550, 650],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bounces",
                    Values: 2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 8,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_paralyzing_cask_multicask",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_paralyzing_cask",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 1,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_paralyzing_cask_applies_maledict",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_paralyzing_cask",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_paralyzing_cask_aoe_damage",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_paralyzing_cask",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 250,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_paralyzing_cask_attack_procs",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_paralyzing_cask",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cask_chance",
                    Values: 15,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "cask_cooldown",
                    Values: 4,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_maledict_ground_curse",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_maledict",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_maledict_aoe_procs",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_maledict",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 300,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_maledict_death_restoration",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_maledict",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 65,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_maledict_affects_allies",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_maledict",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_maledict_infectious",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_maledict",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 250,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_voodoo_restoration_enemy_damage",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_voodoo_restoration",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_voodoo_restoration_lifesteal",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_voodoo_restoration",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 15,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_voodoo_restoration_damage_amp",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_voodoo_restoration",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 35,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_voodoo_restoration_mana_restore",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_voodoo_restoration",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_death_ward_no_channel",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_death_ward",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_death_ward_splitshot",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_death_ward",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "split_shot_count",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "split_shot_bonus_range",
                    Values: 100,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_death_ward_damage_resist",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_death_ward",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 80,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_witch_doctor_death_ward_bounce",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "witch_doctor_death_ward",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_slark_dark_pact",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            TextureName: "slark_dark_pact",
            FightRecapLevel: 1,
            Sound: "Hero_Slark.DarkPact.Cast",
            CastAnimation: GameActivity.INVALID,
            CastPoint: [0.001, 0.001, 0.001, 0.001],
            CastRange: 325,
            Cooldown: [9.0, 8.0, 7.0, 6.0],
            ManaCost: 60,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "delay",
                    Values: 1.5,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pulse_duration",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 325,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "total_damage",
                    Values: [80, 160, 240, 320],
                    LinkedSpecialBonus: "special_bonus_unique_slark_2",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "total_pulses",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pulse_interval",
                    Values: 0.1,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "heal_pct",
                    Values: 15,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_slark_pounce",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.ROOT_DISABLES],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 1,
            TextureName: "slark_pounce",
            Sound: "Hero_Slark.Pounce.Cast",
            Cooldown: [20.0, 16.0, 12.0, 8.0],
            ManaCost: [75, 75, 75, 75],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pounce_distance",
                    Values: 700,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pounce_speed",
                    Values: 933.33,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pounce_acceleration",
                    Values: 7000.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pounce_radius",
                    Values: 95,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "leash_duration",
                    Values: [2.5, 2.75, 3, 3.25],
                    LinkedSpecialBonus: "special_bonus_unique_slark",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "leash_radius",
                    Values: 200,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pounce_damage",
                    Values: [100, 160, 220, 280],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pounce_damage_multiplier",
                    Values: 1.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pounce_distance_default",
                    Values: 700,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_slark_essence_shift",
            Behavior: [AbilityBehavior.IMMEDIATE, AbilityBehavior.NO_TARGET],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            TextureName: "slark_essence_shift",
            Cooldown: 10,
            ManaCost: 10,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "agi_gain",
                    Values: 3,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "stat_loss",
                    Values: 1,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "active_duration",
                    Values: [7, 8, 9, 10],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_stacks",
                    Values: [10, 15, 20, 25],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "passive_agility",
                    Values: 1,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "debuff_duration",
                    Values: 5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "reduction",
                    Values: -1,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "model_scale",
                    Values: 30,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_slark_shadow_dance",
            Type: AbilityTypes.ULTIMATE,
            Behavior: [AbilityBehavior.IMMEDIATE, AbilityBehavior.NO_TARGET],
            TextureName: "slark_shadow_dance",
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            FightRecapLevel: 2,
            Sound: "Hero_Slark.ShadowDance",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: [80, 70, 60],
            ManaCost: [120, 120, 120],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: [4, 4.25, 4.5],
                    LinkedSpecialBonus: "special_bonus_unique_slark_3",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "fade_time",
                    Values: [0.0, 0.0, 0.0],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_movement_speed",
                    Values: [20, 35, 50],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_regen_pct",
                    Values: [5, 7, 9],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "activation_delay",
                    Values: [0.5, 0.5, 0.5],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "neutral_disable",
                    Values: [2.0, 2.0, 2.0],
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_slark_dark_pact_essence_shift",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "slark_dark_pact",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_slark_dark_pact_push_stun",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "slark_dark_pact",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 1.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_slark_dark_pact_dispells_allies",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "slark_dark_pact",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_slark_dark_pact_unit_target",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "slark_dark_pact",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 800,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_slark_pounce_attack_all",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "slark_pounce",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_slark_pounce_projectiles",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "slark_pounce",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "cone",
                    Values: 180,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_slark_pounce_leashed_bonus",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "slark_pounce",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_slark_essence_shift_aoe_attack",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "slark_essence_shift",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 250,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_slark_essence_shift_leash_chance",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "slark_essence_shift",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "leash_chance",
                    Values: 15,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "leash_cooldown",
                    Values: 3.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_slark_essence_shift_allied_buff",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "slark_essence_shift",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_slark_shadow_dance_dark_pact_pulses",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "slark_shadow_dance",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 0.25,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_slark_shadow_dance_essence_shift_bonus",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "slark_shadow_dance",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 2,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_slark_shadow_dance_leash",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "slark_shadow_dance",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "pull_duration",
                    Values: 0.4,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "pull_radius",
                    Values: 450,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_templar_assassin_refraction",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.IGNORE_BACKSWING],
            UnitDamageType: DamageType.PHYSICAL,
            UnitTargetTeam: UnitTargetTeam.FRIENDLY,
            UnitTargetType: UnitTargetType.HERO,
            UnitTargetFlags: UnitTargetFlags.INVULNERABLE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            Sound: "Hero_TemplarAssassin.Refraction",
            TextureName: "templar_assassin_refraction",
            CastPoint: [0.0,0.0, 0.0, 0.0, 0.0],
            CastRange: 800,
            Cooldown: [17.0, 17.0, 17.0, 17.0],
            ManaCost: 100,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "instances",
                    Values: [3, 4, 5, 6],
                    LinkedSpecialBonus: "special_bonus_unique_templar_assassin",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage",
                    Values: [25, 50, 75, 100],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_threshold",
                    Values: [5, 5, 5, 5],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: [17.0, 17.0, 17.0, 17.0],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "max_damage_absorb",
                    Values: [200, 250, 300, 350],
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_templar_assassin_meld",
            Behavior: [AbilityBehavior.NO_TARGET, AbilityBehavior.DONT_RESUME_MOVEMENT, AbilityBehavior.DONT_RESUME_ATTACK],
            UnitDamageType: DamageType.PHYSICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_NO,
            Sound: "Hero_TemplarAssassin.Meld",
            TextureName: "templar_assassin_meld",
            CastPoint: [0.0, 0.0, 0.0, 0.0],
            Cooldown: [12, 10, 8, 6],
            Duration: 5,
            ManaCost: [50, 50, 50, 50],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage",
                    Values: [50, 100, 150, 200],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_armor",
                    Values: [-5, -6, -7, -8],
                    LinkedSpecialBonus: "special_bonus_unique_templar_assassin_2",
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "meld_duration",
                    Values: 2.5,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
        });
    
        this.Abilities.push({
            Name: "aghsfort_templar_assassin_psi_blades",
            Behavior: AbilityBehavior.PASSIVE,
            UnitDamageType: DamageType.PURE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            TextureName: "templar_assassin_psi_blades",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_range",
                    Values: [60, 120, 180, 240],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_spill_range",
                    Values: [590, 630, 670, 710],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_spill_width",
                    Values: 90,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_spill_pct",
                    Values: 100,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
        });
    
        this.Abilities.push({
            Name: "aghsfort_templar_assassin_psionic_trap",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.IGNORE_BACKSWING],
            Type: AbilityTypes.ULTIMATE,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            Sound: "Hero_TemplarAssassin.Trap",
            TextureName: "templar_assassin_psionic_trap",
            CastRange: 2000,
            CastPoint: [0.3, 0.3, 0.3, 0.3],
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_5,
            Cooldown: 2,
            Charges: [2, 3, 4],
            ChargeRestoreTime: 40,
            ManaCost: [15, 15, 15],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "max_traps",
                    Values: [2, 3, 4],
                    LinkedSpecialBonus: "special_bonus_unique_templar_assassin_6",
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "trap_radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "trap_delay_time",
                    Values: 1.5,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_speed_slow",
                    Values: 40,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "slow_duration",
                    Values: 5.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "trap_damage",
                    Values: [250, 300, 350],
                    LinkedSpecialBonus: "special_bonus_unique_templar_assassin_3",
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_templar_assassin_trap",
            Behavior: [AbilityBehavior.NOT_LEARNABLE, AbilityBehavior.NO_TARGET, AbilityBehavior.IMMEDIATE, AbilityBehavior.IGNORE_CHANNEL],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            MaxLevel: 3,
            TextureName: "templar_assassin_trap",
            CastPoint: 0.0,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: 0.5,
            ManaCost: 0,
            ModifierSupportBonus: 100,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "trap_radius",
                    Values: 400,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "trap_duration",
                    Values: 5.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "trap_bonus_damage",
                    Values: [250, 300, 350],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_speed_min",
                    Values: 30,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_speed_max",
                    Values: 60,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "trap_max_charge_duration",
                    Values: 4,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_templar_assassin_refraction_allies",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "templar_assassin_refraction",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 800,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_templar_assassin_refraction_kill_refresh",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "templar_assassin_refraction",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_templar_assassin_refraction_counter_attack",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "templar_assassin_refraction",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 80,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_templar_assassin_refraction_detonate_trap",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "templar_assassin_refraction",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 80,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_templar_assassin_psionic_trap_area_attack",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "templar_assassin_psionic_trap",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_templar_assassin_psionic_trap_damage_heals",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "templar_assassin_psionic_trap",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 50,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_templar_assassin_psionic_trap_multipulse",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "templar_assassin_psionic_trap",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 3,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_templar_assassin_meld_attack_on_activation",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "templar_assassin_meld",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 300,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_templar_assassin_meld_teleport",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "templar_assassin_meld",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 600,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_templar_assassin_meld_refraction_on_kill",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "templar_assassin_meld",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_templar_assassin_psi_blades_autoattack",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "templar_assassin_psi_blades",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "fire_rate",
                    Values: 1.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "radius",
                    Values: 500,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_templar_assassin_psi_blades_trap",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "templar_assassin_psi_blades",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "trap_chance",
                    Values: 15.0,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_templar_assassin_psi_blades_splash",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "templar_assassin_psi_blades",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 175,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_queenofpain_shadow_strike",
            Behavior: AbilityBehavior.UNIT_TARGET,
            UnitTargetTeam: UnitTargetTeam.ENEMY,
            UnitTargetType: [UnitTargetType.HERO, UnitTargetType.BASIC],
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            SpellDispellableType: SpellDispellableTypes.DISPELLABLE_YES,
            FightRecapLevel: 1,
            Sound: "Hero_QueenOfPain.ShadowStrike",
            TextureName: "queenofpain_shadow_strike",
            CastRange: [450, 500, 550, 600],
            CastPoint: 0.4,
            Cooldown: [16.0, 12.0, 8.0, 4.0],
            Duration: 5.0,
            ManaCost: [110, 120, 130, 140],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "strike_damage",
                    Values: [30, 60, 90, 120],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "duration_damage",
                    Values: [30, 50, 70, 90],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "movement_slow",
                    Values: [-20, -35, -50, -65],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "damage_interval",
                    Values: 1.0,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_1,
        });
    
        this.Abilities.push({
            Name: "aghsfort_queenofpain_blink",
            Behavior: [AbilityBehavior.POINT, AbilityBehavior.ROOT_DISABLES],
            Sound: "Hero_QueenOfPain.Blink_in",
            TextureName: "queenofpain_blink",
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_2,
            CastRange: 0,
            CastPoint: [0.33, 0.33, 0.33, 0.33],
            Cooldown: [15.0, 12.0, 9.0, 6.0],
            ManaCost: [60, 60, 60, 60],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "blink_range",
                    Values: 1300,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "min_blink_range",
                    Values: 200,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_queenofpain_scream_of_pain",
            Behavior: AbilityBehavior.NO_TARGET,
            UnitDamageType: DamageType.MAGICAL,
            SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
            Sound: "Hero_QueenOfPain.ScreamOfPain",
            TextureName: "queenofpain_scream_of_pain",
            CastRange: 0,
            CastPoint: 0.0,
            Cooldown: 7.0,
            ManaCost: [80, 100, 120, 140],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [75, 150, 225, 300],
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "area_of_effect",
                    Values: 525,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "projectile_speed",
                    Values: 900,
                },
    
            ],
    
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_3,
            CastGestureSlot: AbilityCastGestureSlotValue.DEFAULT,
        });
    
        this.Abilities.push({
            Name: "aghsfort_queenofpain_sonic_wave",
            Type: AbilityTypes.ULTIMATE,
            Behavior: [AbilityBehavior.DIRECTIONAL, AbilityBehavior.POINT],
            SpellImmunityType: SpellImmunityTypes.ENEMIES_YES,
            UnitDamageType: DamageType.PURE,
            FightRecapLevel: 2,
            Sound: "Hero_QueenOfPain.SonicWave",
            TextureName: "queenofpain_sonic_wave",
            CastRange: 700,
            CastPoint: 0.452,
            CastAnimation: GameActivity.DOTA_CAST_ABILITY_4,
            Cooldown: 125,
            ManaCost: [250, 400, 550],
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "starting_aoe",
                    Values: 100,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "distance",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "final_aoe",
                    Values: 450,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "speed",
                    Values: 900,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage",
                    Values: [340, 450, 560],
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "cooldown_scepter",
                    Values: 40,
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_scepter",
                    Values: [390, 500, 610],
                    RequiresScepter: true,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_distance",
                    Values: 350,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "knockback_duration",
                    Values: 1.4,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_queenofpain_shadow_strike_on_attack",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "queenofpain_shadow_strike",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "proc_chance_pct",
                    Values: 20,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_queenofpain_shadow_strike_chain",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "queenofpain_shadow_strike",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_queenofpain_shadow_strike_scream",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "queenofpain_shadow_strike",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_queenofpain_blink_generates_scream",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "queenofpain_blink",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_queenofpain_blink_attack_speed",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "queenofpain_blink",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "duration",
                    Values: 2.0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_speed",
                    Values: 60,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_queenofpain_blink_shadow_strike",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "queenofpain_blink",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "effect_radius",
                    Values: 80,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "travel_speed",
                    Values: 1000,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_queenofpain_scream_of_pain_resets_blink",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "queenofpain_scream_of_pain",
            AbilitySpecials:
            [
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_queenofpain_scream_of_pain_restores_caster",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "queenofpain_scream_of_pain",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 10,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_queenofpain_scream_of_pain_knockback",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "queenofpain_scream_of_pain",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "knockback_speed",
                    Values: 1000,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "sonic_wave_cd_reduction",
                    Values: 0.75,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_queenofpain_scream_of_pain_stun",
            Behavior: AbilityBehavior.PASSIVE,
            Type: AbilityTypes.ATTRIBUTES,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "value",
                    Values: 1.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_queenofpain_sonic_wave_trail",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "queenofpain_sonic_wave",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "trail_duration",
                    Values: 6,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "damage_pct",
                    Values: 20,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "linger_duration",
                    Values: 0.2,
                },
    
                {
                    VarType: VarTypes.FLOAT,
                    Name: "burn_interval",
                    Values: 0.5,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_queenofpain_sonic_wave_attack_buff",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "queenofpain_sonic_wave",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.FLOAT,
                    Name: "buff_duration",
                    Values: 7,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "attack_speed",
                    Values: 10,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_damage",
                    Values: 10,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_special_queenofpain_sonic_wave_circle",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "queenofpain_sonic_wave",
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "value",
                    Values: 6,
                },
    
            ],
    
        });
    
        this.Abilities.push({
            Name: "aghsfort_minor_stats_upgrade",
            Behavior: [AbilityBehavior.PASSIVE, AbilityBehavior.HIDDEN],
            TextureName: "attribute_bonus",
            MaxLevel: 1,
            AbilitySpecials:
            [
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_health",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_mana",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_speed",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_heal_amp",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_mana_regen",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_evasion",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_magic_resist",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_lifesteal",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_primary_stat",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_all_stats",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_intelligence",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_movespeed",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_hp_regen",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_armor",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_attack_damage",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_cast_range",
                    Values: 0,
                },
    
                {
                    VarType: VarTypes.INTEGER,
                    Name: "bonus_spell_amp",
                    Values: 0,
                },
    
            ],
    
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
