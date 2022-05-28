/*
 * ==================================
 * Index.js
 * Client and websocket handling.
 * ==================================
*/
const Client = {}

Client.ws = new WebSocket("ws://localhost:3232")
Client.inputs = []
Client.sustain = false

/*
 * ==================================
 * Import separate Files
 * ==================================
*/
import {Sound} from './sound.js';

WebMidi.enable(function(err) {
    if (err) throw new Error("Midi could not be enabled!")

    WebMidi.inputs.forEach(input=>{
		Client.inputs.push(input)
	});

	Client.inputs.forEach(function(input) {

		
		input.addListener("noteon", "all", e=>{
			Client.ws.send(JSON.stringify({
				type:"noteon",
				note:e.note,
				velocity:e.velocity
			}))
			Sound.playSound(e.note, e.velocity);
		})
		input.addListener("noteoff", "all", e=>{
			Client.ws.send(JSON.stringify({
				type:"noteoff",
				note:e.note,
				velocity:e.velocity
			}))

			Sound.stopSound(e.note, Client.sustain)
		})
		input.addListener("midimessage", "all", e=>{
			if(!(e.data[0] === 191 && e.data[1] === 64)) return;

			const res = Client.sustain = (e.data[2] === 127) ? true : false

			Client.ws.send(JSON.stringify({
				type:"sustainSwitch",
				sustain: res
			}))

			Sound.onSustainChange(Client.sustain);
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
	console.log(json);
	switch(json.type) {
		case "noteon": 
			Sound.playSound(json.note,json.velocity);
			break;

		case "noteoff":
			Sound.stopSound(json.note, json.sustain);
			break;

		case "sustainSwitch":
			Sound.keys.forEach(function(key) {
				this.stopSound(key, json.sustain)
			});
			break;
	}
}