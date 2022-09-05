import { EntityManager, EventsSDK, GameState, item_blink, LocalPlayer, Menu, monkey_king_tree_dance, TickSleeper } from "github.com/octarine-public/wrapper/wrapper/Imports"

const MKHateTree = Menu.AddEntryDeep(["Examples", "Utility", "MK Catcher"])
const MKHateState = MKHateTree.AddToggle("State")
const MKHateUseOnAlly = MKHateTree.AddToggle("Use on ally")
const MKHateUseBlink = MKHateTree.AddToggle("Use blink")
const MKHateItemsState = MKHateTree.AddImageSelector("Item destroyer tree", [
	"item_quelling_blade",
	"item_tango",
	"item_tango_single",
	"item_bfury",
], new Map([
	["item_quelling_blade", true],
	["item_tango", true],
	["item_tango_single", true],
	["item_bfury", true],
]))

const Sleeper = new TickSleeper()
EventsSDK.on("Tick", () => {
	const MyHero = LocalPlayer?.Hero
	if (
		!MKHateState.value
		|| MyHero === undefined
		|| !MyHero.IsAlive
		|| MyHero.IsStunned
		|| MyHero.IsInvulnerable
		|| (MyHero.IsInvisible && !MyHero.IsVisibleForEnemies)
		|| Sleeper.Sleeping
	)
		return

	EntityManager.GetEntitiesByClass(monkey_king_tree_dance).some(abil => {
		if (abil.TargetTree === undefined || !abil.TargetTree.IsAlive)
			return false
		const owner = abil.Owner
		if (
			owner === undefined
			|| owner === MyHero
			|| (!MKHateUseOnAlly.value && !owner.IsEnemy())
		)
			return false

		const tree = abil.TargetTree
		const cast_time = 100 + MyHero.TurnTime(tree.Position) * 1000 + GameState.Ping
		return MKHateItemsState.values.some(value => {
			if (!MKHateItemsState.IsEnabled(value))
				return false

			const cast_abil = MyHero.GetItemByName(value)
			if (cast_abil === undefined)
				return false

			// if cast range < cast range selected item try use blink in tree position
			if (MKHateUseBlink.value && !MyHero.IsInRange(tree, cast_abil.CastRange)) {
				const blink = MyHero.GetItemByClass(item_blink)
				if (
					blink === undefined
					|| !MyHero.IsInRange(tree, blink.CastRange - 10 + cast_abil.CastRange)
					|| !blink.CanBeCasted()
				)
					return false

				MyHero.CastPosition(blink, MyHero.Position.Extend(
					tree.Position,
					Math.min(blink.CastRange - 10, MyHero.Distance(tree) - (cast_abil.CastRange / 2)),
				))
				Sleeper.Sleep(cast_time)
				return true
			}

			if (!MyHero.IsInRange(tree, cast_abil.CastRange) || !cast_abil.CanBeCasted())
				return false

			MyHero.CastTargetTree(cast_abil, tree)
			Sleeper.Sleep(cast_time)
			return true
		})
	})
})
EventsSDK.on("GameStarted", () => Sleeper.ResetTimer())
EventsSDK.on("GameEnded", () => Sleeper.ResetTimer())
