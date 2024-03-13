/*
 * ==================================
 * Server.js
 * Websocket server to let users communicate with each other.
 * ==================================
 */
const Server = {}
const ws = Server.ws = require("ws")
const server = Server.server = new ws.Server({port:3333})



/*
 * ==================================
 * Client connects to the Server.
 * ==================================
 */
Server.server.on('connection',conn=>{
    Server.log("Server", "Client connected!")


    /*
     * ==================================
     * We receive a message from the Client.
     * ==================================
     */
    conn.on("message", data => {
        var json = JSON.parse(data)
        Server.clients = server.clients

        switch(json.type) {
            
            // Send a note to the others
            case "noteon":
                server.clients.forEach(client => {
                    if(client == conn) return;

                    client.send(JSON.stringify({
                        type: json.type,
                        note:json.note, 
                        velocity:json.velocity, 
                        sustain:conn.sustain||false
                    }))
                })

                Server.log("Client", `Send pressing ${json.note}`)
            break;

            // Stop a note
            case "noteoff":
                server.clients.forEach(client => {
                    if(client == conn) return;

                    client.send(JSON.stringify({
                        type: json.type,
                        note:json.note, 
                        velocity:json.velocity, 
                        sustain:conn.sustain||false
                    }))
                })

                Server.log("Client", `Send releasing ${json.note}`)
            break;

            // Change the Sustain type and tell the others
            case "sustainSwitch":
                conn.sustain = json.sustain

                server.clients.forEach(client => {
                    if(client == conn) return;

                    client.send(JSON.stringify({
                        type: json.type,
                        sustain:conn.sustain
                    }))
                })

                Server.log("Client", `Send changing state of sustain to ${conn.sustain}`)
            break;
            default:
                Server.log("Client", `Tried to send: ${json.type}`)
            break;
        }
    })
});




/**
 * Print properly something to the Console for more overview.
 * @param {String} author 
 * @param {String} message 
 */
Server.log = function(author, message) {console.log(`[${author}] ${message}`)}
