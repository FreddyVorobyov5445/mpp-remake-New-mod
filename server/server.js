const ws = require("ws");
const server = new ws.Server({port:3232});

server.on('connection', (conn) => {
    console.log("Client connected!")
    conn.on("message", (data) => {
        var json = JSON.parse(data);

        switch(json.type) {
            /* Send a note to the others */
            case "noteOn":
                server.clients.forEach(client => {
                    if(client !== conn) client.send(JSON.stringify({
                        type: json.type,
                        note:json.note,
                        velocity:json.velocity,
                        sustain:conn.sustain||false
                    }))
                })
            break;
            /* Stop a note */
            case "noteOff":
                server.clients.forEach(client => {
                    if(client !== conn) client.send(JSON.stringify({
                        type: json.type,
                        note:json.note,
                        velocity:json.velocity,
                        sustain:conn.sustain||false
                    }))
                })
            break;
            /* Change the Sustain type and tell the others */
            case "sustainSwitch":
                conn.sustain = json.sustain
                server.clients.forEach(client => {
                    if(client !== conn) client.send(JSON.stringify({
                        type: json.type,
                        sustain:conn.sustain
                    }))
                })
            break;
            default:

            break;
        }
    })
});