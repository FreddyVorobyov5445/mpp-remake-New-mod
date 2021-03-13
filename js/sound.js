
var keys = 
["A0", "As0", "B0",
"C1","Cs1", "D1","Ds1","E1","F1","Fs1","G1","Gs1","A1","As1","B1",
"C2","Cs2", "D2","Ds2","E2","F2","Fs2","G2","Gs2","A2","As2","B2",
"C3","Cs3", "D3","Ds3","E3","F3","Fs3","G3","Gs3","A3","As3","B3",
"C4","Cs4", "D4","Ds4","E4","F4","Fs4","G4","Gs4","A4","As4","B4",
"C5","Cs5", "D5","Ds5","E5","F5","Fs5","G5","Gs5","A5","As5","B5",
"C6","Cs6", "D6","Ds6","E6","F6","Fs6","G6","Gs6","A6","As6","B6",
"C7","Cs7", "D7","Ds7","E7","F7","Fs7","G7","Gs7","A7","As7","B7",
"C8"],
audioArr = {},
audioCtx = {},
currentlyPlaying = []

console.group(`Loaded ${keys.length} Keys`)
keys.forEach(key => {
    audioArr[key] = [
        new Audio(`../sounds/Default Piano/`+key+`.ogg`), 
        new AudioContext()
    ]
    audioArr[key].type = "audio/ogg"

    audioCtx[key] = [
        audioArr[key][1].createMediaElementSource(audioArr[key][0]),
        audioArr[key][1].createGain()
    ]
})
console.table(audioArr)
console.groupEnd()

/**
 * Play a key.
 * @param {String} key 
 * @param {Number} velocity 
 */
function playSound(key, velocity) {
    audioArr[key][1].resume()

    var keyAudio = audioArr[key][0],
        Ctx = audioArr[key][1],
        mediaElSource = audioCtx[key][0],
        gainNode = audioCtx[key][1]


    console.log(keyAudio.readyState)

    keyAudio.src = keyAudio.src
    gainNode.gain.setTargetAtTime(keyAudio.volume, Ctx.currentTime, 0.01)

    mediaElSource.connect(gainNode)
    gainNode.connect(Ctx.destination)

    $(keyAudio).prop("volume", velocity)
    keyAudio.play()
    currentlyPlaying.push(key)

    console.log(currentlyPlaying);
}

/**
 * Stop a key to play.
 * @param {String} key 
 * @param {Boolean} isSustained
 */
function stopSound(key, isSustained=false) {
    var Ctx = audioArr[key][1],
        gainNode = audioCtx[key][1]

    if(!isSustained)
        gainNode.gain.setTargetAtTime(0, Ctx.currentTime, 0.05)

    currentlyPlaying.splice(currentlyPlaying.indexOf(key), 1)
}

export {stopSound, playSound, currentlyPlaying, audioArr, audioCtx, keys}