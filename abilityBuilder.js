"use strict";
// import { AbilitySpecialBlock, DifferentlyNamedAbilityKVs, PrecacheKV, PrecacheType, VarTypes } from "./abilitymakerInterfaces";
exports.__esModule = true;
exports.AbilityBuilder = void 0;
// import { AbilitySpecialBlock, DifferentlyNamedAbilityKVs, PrecacheKV, PrecacheType, VarTypes } from "@shushishtok/ability_generator/output/code/abilitymakerInterfaces";
var DifferentlyNamedAbilityKVsDynamic;
(function (DifferentlyNamedAbilityKVsDynamic) {
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["Type"] = DifferentlyNamedAbilityKVs.Type] = "Type";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["Behavior"] = DifferentlyNamedAbilityKVs.Behavior] = "Behavior";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["OnCastBar"] = DifferentlyNamedAbilityKVs.OnCastBar] = "OnCastBar";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["OnLearnBar"] = DifferentlyNamedAbilityKVs.OnLearnBar] = "OnLearnBar";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["CastRange"] = DifferentlyNamedAbilityKVs.CastRange] = "CastRange";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["CastRangeBuffer"] = DifferentlyNamedAbilityKVs.CastRangeBuffer] = "CastRangeBuffer";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["CastPoint"] = DifferentlyNamedAbilityKVs.CastPoint] = "CastPoint";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["ChannelTime"] = DifferentlyNamedAbilityKVs.ChannelTime] = "ChannelTime";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["Cooldown"] = DifferentlyNamedAbilityKVs.Cooldown] = "Cooldown";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["Duration"] = DifferentlyNamedAbilityKVs.Duration] = "Duration";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["SharedCooldown"] = DifferentlyNamedAbilityKVs.SharedCooldown] = "SharedCooldown";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["Damage"] = DifferentlyNamedAbilityKVs.Damage] = "Damage";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["ManaCost"] = DifferentlyNamedAbilityKVs.ManaCost] = "ManaCost";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["ModifierSupportValue"] = DifferentlyNamedAbilityKVs.ModifierSupportValue] = "ModifierSupportValue";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["ModifierSupportBonus"] = DifferentlyNamedAbilityKVs.ModifierSupportBonus] = "ModifierSupportBonus";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["UnitTargetTeam"] = DifferentlyNamedAbilityKVs.UnitTargetTeam] = "UnitTargetTeam";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["CastAnimation"] = DifferentlyNamedAbilityKVs.CastAnimation] = "CastAnimation";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["UnitDamageType"] = DifferentlyNamedAbilityKVs.UnitDamageType] = "UnitDamageType";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["Sound"] = DifferentlyNamedAbilityKVs.Sound] = "Sound";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["CastGestureSlot"] = DifferentlyNamedAbilityKVs.CastGestureSlot] = "CastGestureSlot";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["UnitTargetType"] = DifferentlyNamedAbilityKVs.UnitTargetType] = "UnitTargetType";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["GrantedByScepter"] = DifferentlyNamedAbilityKVs.GrantedByScepter] = "GrantedByScepter";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["UnitTargetFlags"] = DifferentlyNamedAbilityKVs.UnitTargetFlags] = "UnitTargetFlags";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["GrantedByShard"] = DifferentlyNamedAbilityKVs.GrantedByShard] = "GrantedByShard";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["Charges"] = DifferentlyNamedAbilityKVs.Charges] = "Charges";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["ChargeRestoreTime"] = DifferentlyNamedAbilityKVs.ChargeRestoreTime] = "ChargeRestoreTime";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["ChannelAnimation"] = DifferentlyNamedAbilityKVs.ChannelAnimation] = "ChannelAnimation";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["TextureName"] = DifferentlyNamedAbilityKVs.TextureName] = "TextureName";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["Precache"] = DifferentlyNamedAbilityKVs.Precache] = "Precache";
    DifferentlyNamedAbilityKVsDynamic[DifferentlyNamedAbilityKVsDynamic["AbilitySpecials"] = DifferentlyNamedAbilityKVs.AbilitySpecials] = "AbilitySpecials";
})(DifferentlyNamedAbilityKVsDynamic || (DifferentlyNamedAbilityKVsDynamic = {}));
var AbilityBuilder;
(function (AbilityBuilder) {
    function AddAbilitySpecialInteger(name, values) {
        var ability_special_block = {
            VarType: VarTypes.INTEGER,
            Name: name,
            Values: values
        };
        return ability_special_block;
    }
    AbilityBuilder.AddAbilitySpecialInteger = AddAbilitySpecialInteger;
    function AddAbilitySpecialFloat(name, values) {
        var ability_special_block = {
            VarType: VarTypes.FLOAT,
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
