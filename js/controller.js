const hashDocument = '';

function onChange(event) { 
    var readerFile = new FileReader()
    readerFile.onload = function(event){
        var arrayBuffer = event.target.result
        var wordArray = CryptoJS.lib.WordArray.create(arrayBuffer)
        hashDocument = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);  
        console.log(hashDocument);     
    }
}

function Sign () {

  var socket = io.connect("wss://192.168.105.9:5696", { 
     path: '/kmip',
     key: './keykmip.pem',
     cert: './certkmip.pem',
     ca: './certhsm.pem',
     transports:  ['websocket'],
     secure: true
  });

  //s_server -accept 5696 -cert cert.pem -key key.pem -verify 10 -CAfile certkmip.pem
  //s_client -connect localhost:5696 -cert certkmip.pem -key keykmip.pem
  //1) CA do controller não está sendo usado como certificado de confiança (está confiando no navegador)
  //2) a biblioteca do socket IO deve ignorar a validação de common name (CN), está esperando que o CN do cert (que no caso pratico é o da dinamo), seja igual ao host onde estou me conectando

 
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
var TTLVRequestPayload = new KMIPTTLV (Tags.REQUEST_PAYLOAD, Types.STRUCTURE, '', 0x00000188);
var TTLVQueryFunction = new KMIPTTLV (Tags.QUERY_FUNCTION, Types.ENUMERATION, QueryFunction.QUERY_PROFILES, 0x00000004);

// 420078 01 000001e8 ''

// 420077 01 00000038 ''
// 420069 01 00000020 ''
// 42006a 02 00000004 00000001 00000000
// 42006b 02 00000004 00000004 00000000
// 420050 02 00000004 00000100 00000000
// 42000d 02 00000004 00000001 00000000

// 42000f 01 000001a0 ''
// 42005c 05 00000004 00000024 00000000
// 420079 01 00000188 ''
// 420074 05 00000004 00000010 00000000


var bin1 = hex2bin(TTLVRequest.getBlock());
var bin2 = hex2bin(TTLVHeader.getBlock());
var bin3 = hex2bin(TTLVProtocol.getBlock());
var bin4 = hex2bin(TTLVProtocolMajor.getBlock());
var bin5 = hex2bin(TTLVProtocolMinor.getBlock());
var bin6 = hex2bin(TTLVMaximumResponse.getBlock());
var bin7 = hex2bin(TTLVHeaderBatch.getBlock());
var bin8 = hex2bin(TTLVBatchItem.getBlock());
var bin9 = hex2bin(TTLVItemOperation.getBlock());
var bin10 = hex2bin(TTLVRequestPayload.getBlock());
var bin11 = hex2bin(TTLVQueryFunction.getBlock());

function hex2bin(n) {
return (parseInt(n, 16).toString(2));
}

console.log(TTLVRequest.getBlock());
console.log("Convert: " + hex2bin(bin1));
console.log(TTLVHeader.getBlock());
console.log(TTLVProtocol.getBlock());
console.log(TTLVProtocolMajor.getBlock());
console.log(TTLVProtocolMinor.getBlock());
console.log(TTLVMaximumResponse.getBlock());
console.log(TTLVHeaderBatch.getBlock());
console.log(TTLVBatchItem.getBlock());
console.log(TTLVItemOperation.getBlock());
console.log(TTLVRequestPayload.getBlock());
console.log(TTLVQueryFunction.getBlock());


//socket.emit('message', hex2bin(sumBlocks));

socket.emit('msg', 1000010000000000111100000000001000000000000000000000001111010000100001000000000011101110000000100000000000000000000000000111000010000100000000001101001000000010000000000000000000000000010000001000010000000000110101000000010000000000000000000000000000001000000000000000000000000000000000100000000000000000000000000000000010000100000000001101011000000100000000000000000000000000000010000000000000000000000000000000100000000000000000000000000000000000100001000000000010100000000001000000000000000000000000000000100000000000000000000000001000000000000000000000000000000000000000001000010000000000000110100000010000000000000000000000000000001000000000000000000000000000000000100000000000000000000000000000000010000100000000000001111000000010000000000000000000000011010000001000010000000000101110000000101000000000000000000000000000001000000000000000000000000000010010000000000000000000000000000000000010000100000000001111001000000010000000000000000000000011000100001000010000000000111010000000101000000000000000000000000000001000000000000000000000000000001000000000000000000000000000000000000);

/*if (client.status == 200)
    alert("A assinatura foi bem sucedida!\n\nThe response representation was:\n\n" + client.responseText)
else
    alert("Falha na assinatura!\n\nThe response status was: " + client.status + " " + client.statusText + ".");
*/
}