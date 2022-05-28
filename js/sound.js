/*
 * ==================================
 * Sound.js 
 * Handles playing the keys properly.
 * ==================================
 */
const Sound = {}
Sound.audioArr = {}
Sound.currentlyPlaying = []
Sound.keys = ["A0", "As0", "B0",  "C1","Cs1","D1","Ds1","E1","F1","Fs1","G1","Gs1","A1","As1","B1",  "C2","Cs2","D2","Ds2","E2","F2","Fs2","G2","Gs2","A2","As2","B2",  "C3","Cs3","D3","Ds3","E3","F3","Fs3","G3","Gs3","A3","As3","B3",  "C4","Cs4","D4","Ds4","E4","F4","Fs4","G4","Gs4","A4","As4","B4",  "C5","Cs5","D5","Ds5","E5","F5","Fs5","G5","Gs5","A5","As5","B5",  "C6","Cs6","D6","Ds6","E6","F6","Fs6","G6","Gs6","A6","As6","B6",  "C7","Cs7","D7","Ds7","E7","F7","Fs7","G7","Gs7","A7","As7","B7",  "C8"]
Sound.audioCtx = new AudioContext()

/*
 * ==================================
 * init()
 * Prepare everything for playing some funny sounds.
 * ==================================
 */
Sound.init = function() {
    console.group(`Loaded ${this.keys.length} Keys`)

    this.keys.forEach(key=>{
        this.audioArr[key] = [new Audio(`./sounds/Default Piano/${key}.ogg`)]
        this.audioArr[key].push(
            this.audioCtx.createMediaElementSource(this.audioArr[key][0]),
            this.audioCtx.createGain()
        )
        this.audioArr[key][0].type = "audio/ogg"
        this.audioArr[key][2].gain.value=0
    })

    console.table(this.audioArr)
    console.groupEnd()
}



/**
 * Play a key.
 * 
 * @param {String} key 
 * @param {Number} velocity 
 */
Sound.playSound = function(key, velocity) {
    this.audioCtx.resume()

    var keyAudio = this.audioArr[key][0],
        gainNode = this.audioArr[key][2]


    keyAudio.currentTime = 0;
    gainNode.gain.setTargetAtTime(keyAudio.volume, this.audioCtx.currentTime, 0.01)

    this.audioArr[key][1].connect(gainNode)
    gainNode.connect(this.audioCtx.destination)

    $(keyAudio).prop("volume", velocity)
    keyAudio.play()
    Sound.currentlyPlaying.push(key)

    Sound.Debug()
}

/**
 * Stop a key to play.
 * 
 * @param {String} key 
 * @param {Boolean} isSustained
 */
Sound.stopSound = function(key, isSustained=false) {
    if(!isSustained) this.audioArr[key][2].gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.05)

    Sound.currentlyPlaying.splice(Sound.currentlyPlaying.indexOf(key), 1)
    Sound.Debug()
}

/**
 * Trigger this if sustain state changed.
 * 
 * @param {Boolean} sustain 
 */
Sound.onSustainChange = function(sustain=false) {
    if(!sustain) {
        this.keys.forEach(key=>{
            if(this.currentlyPlaying.indexOf(key) === -1 && this.audioArr[key][2].gain.value !== 0)
                this.stopSound(key);
        })
    }
}

Sound.Debug = function() {
    document.open();
    document.writeln(`<br>Currently Playing: ${Sound.currentlyPlaying}`);
    console.log(Sound.currentlyPlaying);
}

/*
 * ==================================
 * Prepare everything for re-use everywhere.
 * ==================================
 */
Sound.init();
export {Sound}