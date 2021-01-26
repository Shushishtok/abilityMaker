// import { AbilitySpecialBlock, DifferentlyNamedAbilityKVs, PrecacheKV, PrecacheType, VarTypes } from "./abilitymakerInterfaces";

// import { AbilitySpecialBlock, DifferentlyNamedAbilityKVs, PrecacheKV, PrecacheType, VarTypes } from "@shushishtok/ability_generator/output/code/abilitymakerInterfaces";

enum DifferentlyNamedAbilityKVsDynamic
{
    Type = DifferentlyNamedAbilityKVs.Type,
    Behavior = DifferentlyNamedAbilityKVs.Behavior,
    OnCastBar = DifferentlyNamedAbilityKVs.OnCastBar,
    OnLearnBar = DifferentlyNamedAbilityKVs.OnLearnBar,
    CastRange = DifferentlyNamedAbilityKVs.CastRange,
    CastRangeBuffer = DifferentlyNamedAbilityKVs.CastRangeBuffer,
    CastPoint = DifferentlyNamedAbilityKVs.CastPoint,
    ChannelTime = DifferentlyNamedAbilityKVs.ChannelTime,
    Cooldown = DifferentlyNamedAbilityKVs.Cooldown,
    Duration = DifferentlyNamedAbilityKVs.Duration,
    SharedCooldown = DifferentlyNamedAbilityKVs.SharedCooldown,
    Damage = DifferentlyNamedAbilityKVs.Damage,
    ManaCost = DifferentlyNamedAbilityKVs.ManaCost,
    ModifierSupportValue = DifferentlyNamedAbilityKVs.ModifierSupportValue,
    ModifierSupportBonus = DifferentlyNamedAbilityKVs.ModifierSupportBonus,
    UnitTargetTeam = DifferentlyNamedAbilityKVs.UnitTargetTeam,
    CastAnimation = DifferentlyNamedAbilityKVs.CastAnimation,
    UnitDamageType = DifferentlyNamedAbilityKVs.UnitDamageType,
    Sound = DifferentlyNamedAbilityKVs.Sound,
    CastGestureSlot = DifferentlyNamedAbilityKVs.CastGestureSlot,
    UnitTargetType = DifferentlyNamedAbilityKVs.UnitTargetType,
    GrantedByScepter = DifferentlyNamedAbilityKVs.GrantedByScepter,
    UnitTargetFlags = DifferentlyNamedAbilityKVs.UnitTargetFlags,
    GrantedByShard = DifferentlyNamedAbilityKVs.GrantedByShard,
    Charges = DifferentlyNamedAbilityKVs.Charges,
    ChargeRestoreTime = DifferentlyNamedAbilityKVs.ChargeRestoreTime,
    ChannelAnimation = DifferentlyNamedAbilityKVs.ChannelAnimation,
    TextureName = DifferentlyNamedAbilityKVs.TextureName,
    Precache = DifferentlyNamedAbilityKVs.Precache,
    AbilitySpecials = DifferentlyNamedAbilityKVs.AbilitySpecials,
}

export namespace AbilityBuilder {
	export function AddAbilitySpecialInteger(name: string, values: number | Array<number>): AbilitySpecialBlock
	{
		const ability_special_block: AbilitySpecialBlock =
		{
			VarType: VarTypes.INTEGER,
			Name: name,
			Values: values
		}

		return ability_special_block;
	}

	export function AddAbilitySpecialFloat(name: string, values: number | Array<number>): AbilitySpecialBlock
	{
		const ability_special_block: AbilitySpecialBlock =
		{
			VarType: VarTypes.FLOAT,
			Name: name,
			Values: values
		}

		return ability_special_block;
	}

	export function AddPrecacheObject(precache_type: PrecacheType, path: string): PrecacheKV
	{
		const precache_object: PrecacheKV =
		{
			PrecacheType: precache_type,
			path: path
		}

		return precache_object;
	}

	export function GetExpectedKVFromString(name: any): string | undefined
	{
		for (const key in DifferentlyNamedAbilityKVsDynamic)
		{
			if (key === name)
			{
				return DifferentlyNamedAbilityKVsDynamic[key];
			}
		}
		return undefined;
	}

	export function IsAbilitySpecialBlock(object: any): object is AbilitySpecialBlock
	{        
		return (<AbilitySpecialBlock>object).VarType !== undefined;
	}

	export function IsPrecacheKV(object: any): object is PrecacheKV
	{
		return (<PrecacheKV>object).PrecacheType !== undefined;
	}

	export function FillNumericKVValues(value: Array<number>): string
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