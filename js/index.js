const ws = new WebSocket("ws://94.222.34.208:3232");
ws.onmessage = function({data}) {
	var json = JSON.parse(data);

	switch(json.type) {

		case "noteOn":
			playSound(json.note,json.velocity)
		break;

		case "noteOff":
			stopSound(json.note, json.sustain)
		break;

		case "sustainSwitch":
			audioArr.forEach(sound => {stopSound(sound, json.sustain)})
		break;
	}
}




WebMidi.enable(function (err) {
    if (err) 
      throw new Error("Midi could not enabled!")
    
	var inputs = [],
		sustain = false

    WebMidi.inputs.forEach(input => {
		inputs.push(input);
	});
	inputs.forEach(input => {

		input.addListener("noteon", "all", function(e) {
			console.log(e)
			ws.send(JSON.stringify({
				type:"noteon",
				note:(e.note.name+e.note.octave).replace("#", "s"),
				velocity:e.velocity
			}))

			playSound((e.note.name+e.note.octave).replace("#", "s"),e.velocity)
		})
		input.addListener("noteoff", "all", function(e) {
			console.log(e)
			ws.send(JSON.stringify({
				type:"noteoff",
				note:(e.note.name+e.note.octave).replace("#", "s"),
				velocity:e.velocity
			}))

			stopSound((e.note.name+e.note.octave).replace("#", "s"), sustain)
		})

		input.addListener("midimessage", "all", function(e) {
			if(e.data[0] === 191 && e.data[1] === 64) {
				ws.send(JSON.stringify({
					type:"sustainSwitch",
					sustain:(e.data[2] === 127) ? true : false
				}))
				sustain = (e.data[2] === 127) ? true : false
			}
		})
	})
});