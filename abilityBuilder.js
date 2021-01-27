"use strict";
// import { AbilitySpecialBlock, DifferentlyNamedAbilityKVs, PrecacheKV, PrecacheType, VarTypes } from "./abilitymakerInterfaces";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbilityBuilder = void 0;
// import { AbilitySpecialBlock, DifferentlyNamedAbilityKVs, PrecacheKV, PrecacheType, VarTypes } from "@shushishtok/ability_generator/output/code/abilitymakerInterfaces";
var DifferentlyNamedAbilityKVsDynamic;
(function (DifferentlyNamedAbilityKVsDynamic) {
    DifferentlyNamedAbilityKVsDynamic["Type"] = "AbilityType";
    DifferentlyNamedAbilityKVsDynamic["Behavior"] = "AbilityBehavior";
    DifferentlyNamedAbilityKVsDynamic["OnCastBar"] = "OnCastbar";
    DifferentlyNamedAbilityKVsDynamic["OnLearnBar"] = "OnLearnbar";
    DifferentlyNamedAbilityKVsDynamic["CastRange"] = "AbilityCastRange";
    DifferentlyNamedAbilityKVsDynamic["CastRangeBuffer"] = "AbilityCastRangeBuffer";
    DifferentlyNamedAbilityKVsDynamic["CastPoint"] = "AbilityCastPoint";
    DifferentlyNamedAbilityKVsDynamic["ChannelTime"] = "AbilityChannelTime";
    DifferentlyNamedAbilityKVsDynamic["Cooldown"] = "AbilityCooldown";
    DifferentlyNamedAbilityKVsDynamic["Duration"] = "AbilityDuration";
    DifferentlyNamedAbilityKVsDynamic["SharedCooldown"] = "AbilitySharedCooldown";
    DifferentlyNamedAbilityKVsDynamic["Damage"] = "AbilityDamage";
    DifferentlyNamedAbilityKVsDynamic["ManaCost"] = "AbilityManaCost";
    DifferentlyNamedAbilityKVsDynamic["ModifierSupportValue"] = "AbilityModifierSupportValue";
    DifferentlyNamedAbilityKVsDynamic["ModifierSupportBonus"] = "AbilityModifierSupportBonus";
    DifferentlyNamedAbilityKVsDynamic["UnitTargetTeam"] = "AbilityUnitTargetTeam";
    DifferentlyNamedAbilityKVsDynamic["CastAnimation"] = "AbilityCastAnimation";
    DifferentlyNamedAbilityKVsDynamic["UnitDamageType"] = "AbilityUnitDamageType";
    DifferentlyNamedAbilityKVsDynamic["Sound"] = "AbilitySound";
    DifferentlyNamedAbilityKVsDynamic["CastGestureSlot"] = "AbilityCastGestureSlot";
    DifferentlyNamedAbilityKVsDynamic["UnitTargetType"] = "AbilityUnitTargetType";
    DifferentlyNamedAbilityKVsDynamic["GrantedByScepter"] = "IsGrantedByScepter";
    DifferentlyNamedAbilityKVsDynamic["UnitTargetFlags"] = "AbilityUnitTargetFlags";
    DifferentlyNamedAbilityKVsDynamic["GrantedByShard"] = "IsGrantedByShard";
    DifferentlyNamedAbilityKVsDynamic["Charges"] = "AbilityCharges";
    DifferentlyNamedAbilityKVsDynamic["ChargeRestoreTime"] = "AbilityChargeRestoreTime";
    DifferentlyNamedAbilityKVsDynamic["ChannelAnimation"] = "AbilityChannelAnimation";
    DifferentlyNamedAbilityKVsDynamic["TextureName"] = "AbilityTextureName";
    DifferentlyNamedAbilityKVsDynamic["Precache"] = "precache";
    DifferentlyNamedAbilityKVsDynamic["AbilitySpecials"] = "AbilitySpecial";
})(DifferentlyNamedAbilityKVsDynamic || (DifferentlyNamedAbilityKVsDynamic = {}));
var AbilityBuilder;
(function (AbilityBuilder) {
    function AddAbilitySpecialInteger(name, values) {
        var ability_special_block = {
            VarType: "FIELD_INTEGER" /* INTEGER */,
            Name: name,
            Values: values
        };
        return ability_special_block;
    }
    AbilityBuilder.AddAbilitySpecialInteger = AddAbilitySpecialInteger;
    function AddAbilitySpecialFloat(name, values) {
        var ability_special_block = {
            VarType: "FIELD_FLOAT" /* FLOAT */,
            Name: name,
            Values: values
        };
        return ability_special_block;
    }
    AbilityBuilder.AddAbilitySpecialFloat = AddAbilitySpecialFloat;
    function AddPrecacheObject(precache_type, path) {
        var precache_object = {
            PrecacheType: precache_type,
            path: path
        };
        return precache_object;
    }
    AbilityBuilder.AddPrecacheObject = AddPrecacheObject;
    function GetExpectedKVFromString(name) {
        for (var key in DifferentlyNamedAbilityKVsDynamic) {
            if (key === name) {
                return DifferentlyNamedAbilityKVsDynamic[key];
            }
        }
        return undefined;
    }
    AbilityBuilder.GetExpectedKVFromString = GetExpectedKVFromString;
    function IsAbilitySpecialBlock(object) {
        return object.VarType !== undefined;
    }
    AbilityBuilder.IsAbilitySpecialBlock = IsAbilitySpecialBlock;
    function IsPrecacheKV(object) {
        return object.PrecacheType !== undefined;
    }
    AbilityBuilder.IsPrecacheKV = IsPrecacheKV;
    function FillNumericKVValues(value) {
        var values = "";
        for (var index = 0; index < value.length; index++) {
            // Add a space after each index that isn't the first index
            if (index > 0) {
                values += " ";
            }
            // Add value
            values += value[index];
        }
        return values;
    }
    AbilityBuilder.FillNumericKVValues = FillNumericKVValues;
})(AbilityBuilder = exports.AbilityBuilder || (exports.AbilityBuilder = {}));
