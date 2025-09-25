
import cluster from "node:cluster";
import * as os from "node:os";
import {app} from "./app.js";

const numCore = os.cpus().length;
if(cluster.isPrimary){
    console.log(`Master PID: ${process.pid}`);
    console.log('Workers number: ' + numCore);

    for (let i = 0; i < numCore; i++) {
        cluster.fork()
    }
    cluster.on("exit", (worker,code,signal)=>{
        console.log(`Worker ${worker.process.pid} died. Restarting...`)
        cluster.fork()
    })
}else{
    app.listen(3022,()=>{
        console.log(`Worker started ${process.pid}`);
    })
}