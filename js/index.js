/*
 * ==================================
 * Index.js
 * Client and websocket handling.
 * ==================================
*/
const Client = {}

Client.ws = new WebSocket("ws://188.103.32.175:3232")
Client.inputs = []
Client.sustain = false

/*
 * ==================================
 * Import separate Files
 * ==================================
*/
import {Sound} from './sound.js';


WebMidi.enable(function(err) {
    if (err) throw new Error("Midi could not enabled!")

    WebMidi.inputs.forEach(input=>{Client.inputs.push(input)});

	Client.inputs.forEach(function(input) {

		input.addListener("noteon", "all", e=>{
			Client.ws.send(JSON.stringify({
				type:"noteon",
				note:(e.note.name+e.note.octave).replace("#", "s"),
				velocity:e.velocity
			}))

			Sound.playSound((e.note.name+e.note.octave).replace("#", "s"), e.velocity)
		})
		input.addListener("noteoff", "all", e=>{
			Client.ws.send(JSON.stringify({
				type:"noteoff",
				note:(e.note.name+e.note.octave).replace("#", "s"),
				velocity:e.velocity
			}))

			Sound.stopSound((e.note.name+e.note.octave).replace("#", "s"), Client.sustain)
		})
		input.addListener("midimessage", "all", e=>{
			if(e.data[0] === 191 && e.data[1] === 64) {
				const res = Client.sustain = (e.data[2] === 127) ? true : false

				ws.send(JSON.stringify({
					type:"sustainSwitch",
					sustain: res
				}))
			}
		})

	})

});


/*
 * ==================================
 * Receive a websocket message
 * ==================================
*/
Client.ws.onmessage = function({data}) {
	var json = JSON.parse(data);

	switch(json.type) {
		case "noteOn": Sound.playSound(json.note,json.velocity); break;

		case "noteOff": Sound.stopSound(json.note, json.sustain); break;

		case "sustainSwitch": Sound.keys.forEach(function(key) {this.stopSound(key, json.sustain)}); break;
	}
}