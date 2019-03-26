function Sign () {

  var socket = io("wss://localhost:5696", { 
    
     key: './keykmip.pem',
     cert: './certkmip.pem',
     ca: './cert.pem',
  //     secure: true,
       transports:  ['websocket']
  //     onlyBinaryUpgrades: true
  });

  socket.on('connect', function () {
    socket.send('hi');

    socket.on('message', function (msg) {
      // my msg
    });
  });


 
//criar TTLV de teste
var TTLVRequest = new KMIPTTLV (Tags.REQUEST_MESSAGE, Types.STRUCTURE, '', 0x000001e8);
// //Header Section
var TTLVHeader = new KMIPTTLV (Tags.REQUEST_HEADER, Types.STRUCTURE, '', 0x00000038);
var TTLVProtocol = new KMIPTTLV (Tags.PROTOCOL_VERSION, Types.STRUCTURE, '', 0x00000020);
var TTLVProtocolMajor = new KMIPTTLV (Tags.PROTOCOL_VERSION_MAJOR, Types.INTEGER, 0x00000001, 0x00000004);
var TTLVProtocolMinor = new KMIPTTLV (Tags.PROTOCOL_VERSION_MINOR, Types.INTEGER, 0x00000004, 0x00000004);
var TTLVMaximumResponse = new KMIPTTLV (Tags.MAXIMUM_RESPONSE_SIZE, Types.INTEGER, 0x00000100, 0x00000004);
var TTLVHeaderBatch = new KMIPTTLV (Tags.BATCH_COUNT, Types.INTEGER, 0x00000001, 0x00000004);
//Batch Items
var TTLVBatchItem = new KMIPTTLV (Tags.BATCH_ITEM, Types.STRUCTURE, '', 0x000001a0);
var TTLVItemOperation = new KMIPTTLV (Tags.OPERATION, Types.ENUMERATION, Operation.QUERY, 0x00000004);
var TTLVRequestPayload = new KMIPTTLV (Tags.REQUEST_PAYLOAD, Types.STRUCTURE, '', 0x00000188)
var TTLVQueryFunction = new KMIPTTLV (Tags.QUERY_FUNCTION, Types.ENUMERATION, QueryFunction.QUERY_PROFILES, 0x00000004)

var sumBlocks = TTLVRequest.getBlock() + TTLVHeader.getBlock() + TTLVProtocol.getBlock() + TTLVProtocolMajor.getBlock() + 
  TTLVProtocolMinor.getBlock() + TTLVMaximumResponse.getBlock() + TTLVHeaderBatch.getBlock() + TTLVBatchItem.getBlock() + 
  TTLVItemOperation.getBlock() + TTLVRequestPayload.getBlock() + TTLVQueryFunction.getBlock();


function hex2bin(sumBlocks){
    return (parseInt(sumBlocks, 16).toString(2)).padStart(8, '0');
}

console.log(hex2bin(sumBlocks));

//socket.emit('message', hex2bin(sumBlocks));

socket.emit('msg', 1000010000000000111100000000001000000000000000000000001111010000100001000000000011101110000000100000000000000000000000000111000010000100000000001101001000000010000000000000000000000000010000001000010000000000110101000000010000000000000000000000000000001000000000000000000000000000000000100000000000000000000000000000000010000100000000001101011000000100000000000000000000000000000010000000000000000000000000000000100000000000000000000000000000000000100001000000000010100000000001000000000000000000000000000000100000000000000000000000001000000000000000000000000000000000000000001000010000000000000110100000010000000000000000000000000000001000000000000000000000000000000000100000000000000000000000000000000010000100000000000001111000000010000000000000000000000011010000001000010000000000101110000000101000000000000000000000000000001000000000000000000000000000010010000000000000000000000000000000000010000100000000001111001000000010000000000000000000000011000100001000010000000000111010000000101000000000000000000000000000001000000000000000000000000000001000000000000000000000000000000000000);


// socket.on('connection', function (socket) {
//         console.log('socketid',socket.id,'connected');
//         socket.on('msg', function (data) {
//             // socket_handler.process(socket,data,function(err) {
//             //    //
//             // });
//         });
        
// });

/*if (client.status == 200)
    alert("A assinatura foi bem sucedida!\n\nThe response representation was:\n\n" + client.responseText)
else
    alert("Falha na assinatura!\n\nThe response status was: " + client.status + " " + client.statusText + ".");
*/
}