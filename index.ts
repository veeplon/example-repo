import { EventsSDK } from "github.com/octarine-public/wrapper/index"
import { RendererSDK } from "github.com/octarine-public/wrapper/index"
import { Entity } from "github.com/octarine-public/wrapper/index"
console.log("Hello world!")
EventsSDK.on("GameStarted", () => {
	console.log(Entity.LocalPlayer)
})
EventsSDK.on("GameEnded", () => {
	console.log(Entity.LocalPlayer)
})
EventsSDK.on("EntityCreated", () => {
	console.log(Entity.LocalPlayer)
})
