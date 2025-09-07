import { EventsSDK } from "github.com/octarine-public/wrapper/index"
import { RendererSDK } from "github.com/octarine-public/wrapper/index"
console.log("Hello world!")
EventsSDK.on("GameStarted", () => {
	console.log("Game started!")
})
EventsSDK.on("GameEnded", () => {
	console.log("Game ended!")
})
