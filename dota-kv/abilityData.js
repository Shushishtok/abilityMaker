"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAbilityData = void 0;
var abilityBuilder_1 = require("@shushishtok/ability_generator/abilityBuilder");
function GetAbilityData() {
    var Abilities = new Array;
    Abilities.push({
        Name: "shard_explosion",
        ManaCost: [50, 100, 150, 200],
        Cooldown: [25, 22, 19, 16],
        MaxLevel: 4,
        CastGestureSlot: "ABSOLUTE" /* ABSOLUTE */,
        Type: "ABILITY_TYPE_ULTIMATE" /* ULTIMATE */,
        ScriptFile: "abilities/heroes/sven/shard_explosion",
        Behavior: ["DOTA_ABILITY_BEHAVIOR_POINT" /* POINT */, "DOTA_ABILITY_BEHAVIOR_PASSIVE" /* PASSIVE */, "DOTA_ABILITY_BEHAVIOR_CHANNELLED" /* CHANNELLED */],
        UnitTargetTeam: "DOTA_UNIT_TARGET_TEAM_ENEMY" /* ENEMY */,
        UnitTargetType: "DOTA_UNIT_TARGET_HERO" /* HERO */,
        UnitTargetFlags: "DOTA_UNIT_TARGET_FLAG_INVULNERABLE" /* INVULNERABLE */,
        UnitDamageType: "DAMAGE_TYPE_MAGICAL" /* MAGICAL */,
        CastAnimation: "ACT_DOTA_CAST_ABILITY_1" /* DOTA_CAST_ABILITY_1 */,
        FightRecapLevel: 2,
        CastRange: 1000,
        HasScepterUpgrade: true,
        CastPoint: 0.1,
        SpellDispellableType: "SPELL_DISPELLABLE_YES" /* DISPELLABLE_YES */,
        SpellImmunityType: "SPELL_IMMUNITY_ENEMIES_NO" /* ENEMIES_NO */,
        Charges: 2,
        Precache: [
            {
                PrecacheType: "model" /* MODEL */,
                path: "models/props/skulls_and_bones.vmdl"
            },
            abilityBuilder_1.AbilityBuilder.AddPrecacheObject("particle" /* PARTICLE */, "particles/heroes/sven/great_cleave.vcfp")
        ],
        AbilitySpecials: [
            {
                VarType: "FIELD_INTEGER" /* INTEGER */,
                Name: "damage",
                Values: 50,
                LinkedSpecialBonus: "special_bonus_unique_axe_4",
                CalculateSpellDamageTooltip: true,
                LinkedSpecialBonusField: "value2",
                LinkedSpecialBonusOperation: "SPECIAL_BONUS_PERCENTAGE_ADD" /* PERCENTAGE_ADD */
            },
            {
                VarType: "FIELD_INTEGER" /* INTEGER */,
                Name: "bonus_attack_range",
                Values: [75, 100, 125, 150],
                RequiresScepter: true
            },
            abilityBuilder_1.AbilityBuilder.AddAbilitySpecialFloat("spell_amp", [5, 10, 15, 20])
        ]
    });
    return Abilities;
}
exports.GetAbilityData = GetAbilityData;
