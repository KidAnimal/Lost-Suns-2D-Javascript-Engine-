self.onmessage=messageHandler;

function messageHandler(e)
{   
    console.log("message Recieved");
    let data = e.data;
    engageDetect = data;

    engage = "You Have Engaged the Enemy!";

    postMessage(engage);
    
    
}
