"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbilityCompiler = void 0;
var abilityBuilder_1 = require("./abilityBuilder");
var fs = __importStar(require("fs"));
var valve_kv_1 = require("valve-kv");
var AbilityCompiler = /** @class */ (function () {
    function AbilityCompiler() {
        this.filepath = "node_modules/~kv/npc_abilities_custom.txt";
        this.Abilities = new Array();
        this.ability_objects = {};
    }
    AbilityCompiler.prototype.CleanAbilityCustomFile = function () {
        var fd = fs.openSync(this.filepath, 'w');
        fs.closeSync(fd);
    };
    AbilityCompiler.prototype.OnAbilityDataChanged = function (allData) {
        var e_1, _a;
        var abilities = new Array;
        try {
            for (var _b = __values(Object.entries(allData)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], data = _d[1];
                Array.prototype.push.apply(abilities, data);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.Abilities = abilities;
        this.ability_objects = {};
        this.CleanAbilityCustomFile();
        this.CompileAbilitiesKV();
        this.WriteToFile(this.ability_objects);
    };
    AbilityCompiler.prototype.CompileAbilitiesKV = function () {
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d;
        try {
            for (var _e = __values(this.Abilities), _f = _e.next(); !_f.done; _f = _e.next()) {
                var ability = _f.value;
                var ability_tokens = {};
                ability_tokens["BaseClass"] = "ability_lua";
                try {
                    for (var _g = (e_3 = void 0, __values(Object.entries(ability))), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var _j = __read(_h.value, 2), key = _j[0], value = _j[1];
                        if (key === "Name")
                            continue;
                        var actual_key = abilityBuilder_1.AbilityBuilder.GetExpectedKVFromString(key) != undefined ? abilityBuilder_1.AbilityBuilder.GetExpectedKVFromString(key) : key;
                        var actual_value = value;
                        // Booleans are expected to be shown in a 1/0 pattern for true/false
                        if (typeof value === "boolean") {
                            actual_value = value ? "1" : "0";
                        }
                        else if (Array.isArray(value)) {
                            // Numeric arrays
                            if (typeof value[0] === 'number') {
                                actual_value = abilityBuilder_1.AbilityBuilder.FillNumericKVValues(value);
                            }
                            // Arrays of objects
                            else if (typeof value[0] === "object") {
                                if (abilityBuilder_1.AbilityBuilder.IsAbilitySpecialBlock(value[0])) {
                                    actual_value = {};
                                    for (var index = 1; index <= value.length; index++) {
                                        // Form the index
                                        var indexToken = "";
                                        if (index < 10) {
                                            indexToken = "0";
                                        }
                                        indexToken += index;
                                        // Insert token into object
                                        var token = actual_value[indexToken] = {};
                                        var ability_block_data = value[index - 1];
                                        token["var_type"] = ability_block_data.VarType;
                                        // name-value can either be a single number or an array of numbers
                                        if (typeof ability_block_data.Values === "number") {
                                            token[ability_block_data.Name] = ability_block_data.Values;
                                        }
                                        else {
                                            token[ability_block_data.Name] = abilityBuilder_1.AbilityBuilder.FillNumericKVValues(ability_block_data.Values);
                                        }
                                        if (ability_block_data.CalculateSpellDamageTooltip) {
                                            token["CalculateSpellDamageTooltip"] = ability_block_data.CalculateSpellDamageTooltip;
                                        }
                                        if (ability_block_data.LinkedSpecialBonus) {
                                            token["LinkedSpecialBonus"] = ability_block_data.LinkedSpecialBonus;
                                        }
                                        if (ability_block_data.LinkedSpecialBonusField) {
                                            token["LinkedSpecialBonusField"] = ability_block_data.LinkedSpecialBonusField;
                                        }
                                        if (ability_block_data.LinkedSpecialBonusOperation) {
                                            token["LinkedSpecialBonusOperation"] = ability_block_data.LinkedSpecialBonusOperation;
                                        }
                                    }
                                }
                                else if (abilityBuilder_1.AbilityBuilder.IsPrecacheKV(value[0])) {
                                    // Create precache token                            
                                    var precache_token = actual_value = {};
                                    var precache_types_map = new Map();
                                    try {
                                        // Register each precache type and its paths
                                        for (var value_1 = (e_4 = void 0, __values(value)), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
                                            var precache = value_1_1.value;
                                            var precacheKV = precache;
                                            if (precache_types_map.has(precacheKV.PrecacheType)) {
                                                var precache_type_array = precache_types_map.get(precacheKV.PrecacheType);
                                                precache_type_array.push(precacheKV.path);
                                            }
                                            else {
                                                precache_types_map.set(precacheKV.PrecacheType, [precacheKV.path]);
                                            }
                                        }
                                    }
                                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                    finally {
                                        try {
                                            if (value_1_1 && !value_1_1.done && (_c = value_1.return)) _c.call(value_1);
                                        }
                                        finally { if (e_4) throw e_4.error; }
                                    }
                                    try {
                                        // Create duplicate key arrays for each type
                                        for (var _k = (e_5 = void 0, __values(precache_types_map.entries())), _l = _k.next(); !_l.done; _l = _k.next()) {
                                            var _m = __read(_l.value, 2), type = _m[0], paths = _m[1];
                                            precache_token[type] = valve_kv_1.createDuplicateKeyArray(paths);
                                        }
                                    }
                                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                                    finally {
                                        try {
                                            if (_l && !_l.done && (_d = _k.return)) _d.call(_k);
                                        }
                                        finally { if (e_5) throw e_5.error; }
                                    }
                                }
                            }
                            // One of the custom enum arrays
                            else {
                                var seperator = " | ";
                                var enums = "";
                                for (var index = 0; index < value.length; index++) {
                                    if (index > 0) {
                                        enums += seperator;
                                    }
                                    enums += value[index];
                                }
                                actual_value = enums;
                            }
                        }
                        ability_tokens[actual_key] = actual_value;
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                // Add the ability token to the ability name            
                this.ability_objects[ability.Name] = ability_tokens;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    AbilityCompiler.prototype.WriteToFile = function (ability_objects) {
        var _this = this;
        // Build the KV
        var kv = { DOTAAbilities: ability_objects };
        // Serializa
        var serialized_kv = valve_kv_1.serialize(kv);
        // Write to file
        var abilitiesLength = Object.keys(this.ability_objects).length;
        var abilityName = abilitiesLength == 1 ? "ability" : "abilities";
        fs.writeFile(this.filepath, serialized_kv, function () { console.log("\x1b[36m%s\x1b[0m", "Wrote " + abilitiesLength + " " + abilityName + " to " + _this.filepath + " successfully."); });
    };
    return AbilityCompiler;
}());
exports.AbilityCompiler = AbilityCompiler;
// new AbilityCompiler();
