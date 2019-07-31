import io from "socket.io-client";

const socket = io("https://gateway.growfy.pro:60440/app", function(algo) {
    console.log(algo);
});

export default socket;