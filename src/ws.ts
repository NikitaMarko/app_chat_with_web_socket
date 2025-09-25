import {Server} from 'http'
import {WebSocketServer,WebSocket} from "ws";


export const setupWebSocket = (server: Server) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket) => {
        console.log('Client connected');

        (ws as any).isNameSet = false;
        (ws as any).name = `Guest${wss.clients.size}`;

        ws.send(`Hello! To get started, enter /name your_name`);

        ws.on('message', (msg: string) => {
            const message = msg.toString().trim();

            if (message.startsWith('/name ')) {
                const newName = message.substring(6).trim();

                if (newName) {
                    const oldName = (ws as any).name;
                    (ws as any).name = newName;
                    (ws as any).isNameSet = true;

                    wss.clients.forEach((client: WebSocket) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(`${oldName} now known as ${newName}`);
                        }
                    });
                }
                return;
            }

            if ((ws as any).isNameSet) {
                wss.clients.forEach((client: WebSocket) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(`[${(ws as any).name}]: ${message}`);
                    }
                });
            } else {
                ws.send("Please set the name first using /name your_name");
            }
        });

        ws.on('close', () => {
            console.log(`Stream from client ${(ws as any).name} was closed`);
        });
    });

    return (msg: string) => {
        wss.clients.forEach((client: WebSocket) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        });
    };
};
