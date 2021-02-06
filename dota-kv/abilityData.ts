import { AbilityBuilder } from "@shushishtok/ability_generator/abilityBuilder";

export function GetAbilityData():Array<AbilityKV> {
	let Abilities: Array<AbilityKV> = new Array;
	Abilities.push({
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
			AbilityBuilder.AddPrecacheObject(PrecacheType.PARTICLE, "particles/heroes/sven/great_cleave.vcfp")
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
			AbilityBuilder.AddAbilitySpecialFloat("spell_amp", [5, 10, 15, 20])
		]
	});
	return Abilities;
}