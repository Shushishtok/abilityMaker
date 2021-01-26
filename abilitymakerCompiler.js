"use strict";
exports.__esModule = true;
exports.AbilityCompiler = void 0;
var abilityBuilder_1 = require("./abilityBuilder");
var fs = require("fs");
var valve_kv_1 = require("valve-kv");
var AbilityCompiler = /** @class */ (function () {
    function AbilityCompiler() {
        this.filename = "npc_abilities_custom.txt";
        this.filepath = "node_modules/~kv/" + this.filename;
        this.Abilities = new Array();
        this.ability_objects = {};
    }
    AbilityCompiler.prototype.CleanAbilityCustomFile = function () {
        var fd = fs.openSync(this.filepath, 'w');
        fs.closeSync(fd);
    };
    AbilityCompiler.prototype.OnAbilityDataChanged = function (allData) {
        var abilities = new Array;
        for (var _i = 0, _a = Object.entries(allData); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], data = _b[1];
            Array.prototype.push.apply(abilities, data);
        }
        this.Abilities = abilities;
        this.ability_objects = {};
        this.CleanAbilityCustomFile();
        this.CompileAbilitiesKV();
        this.WriteToFile(this.ability_objects);
    };
    AbilityCompiler.prototype.CompileAbilitiesKV = function () {
        for (var _i = 0, _a = this.Abilities; _i < _a.length; _i++) {
            var ability = _a[_i];
            var ability_tokens = {};
            ability_tokens["BaseClass"] = "ability_lua";
            for (var _b = 0, _c = Object.entries(ability); _b < _c.length; _b++) {
                var _d = _c[_b], key = _d[0], value = _d[1];
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
                                if (ability_block_data.CalculateSpellDamageTooltip != undefined) {
                                    token["CalculateSpellDamageTooltip"] = ability_block_data.CalculateSpellDamageTooltip ? "1" : "0";
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
                            // Register each precache type and its paths
                            for (var _e = 0, value_1 = value; _e < value_1.length; _e++) {
                                var precache = value_1[_e];
                                var precacheKV = precache;
                                if (precache_types_map.has(precacheKV.PrecacheType)) {
                                    var precache_type_array = precache_types_map.get(precacheKV.PrecacheType);
                                    precache_type_array.push(precacheKV.path);
                                }
                                else {
                                    precache_types_map.set(precacheKV.PrecacheType, [precacheKV.path]);
                                }
                            }
                            // Create duplicate key arrays for each type
                            for (var _f = 0, _g = precache_types_map.entries(); _f < _g.length; _f++) {
                                var _h = _g[_f], type = _h[0], paths = _h[1];
                                precache_token[type] = valve_kv_1.createDuplicateKeyArray(paths);
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
            // Add the ability token to the ability name            
            this.ability_objects[ability.Name] = ability_tokens;
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
        fs.writeFile(this.filepath, serialized_kv, function () { console.log("\x1b[36m%s\x1b[0m", "Wrote " + abilitiesLength + " " + abilityName + " to " + _this.filename + " successfully."); });
    };
    return AbilityCompiler;
}());
exports.AbilityCompiler = AbilityCompiler;
// new AbilityCompiler();
