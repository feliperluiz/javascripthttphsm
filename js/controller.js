var hashDocumentoAssinado = '';
var hashDocumento = '';

function onChange(event) { 
    var logFile = $('#input_file').get(0).files[0];
    var readerFile = new FileReader();
    readerFile.readAsBinaryString(logFile);
    readerFile.onload = function(event){
        var arrayBuffer = event.target.result;
        hashDocumento = CryptoJS.SHA256(arrayBuffer).toString(CryptoJS.enc.Hex);
        console.log(hashDocumento);
             
    }
}

function Sign () {

  var net = new WebTCP('localhost', 4002); //Cria a bridge "proxy" TCP

  options = {
    encoding: "utf-8",
    timeout: 0,
    noDelay: true, // disable/enable Nagle algorithm
    keepAlive: false, //default is false
    initialDelay: 0 // for keepAlive. default is 0
  }

  var socket = net.createSocket("localhost", 4000, options)

  // On connection callback
  socket.on('connect', function(){
    console.log('[4000-SOCKET] Socket cliente conectado');
  })

  socket.on('data', function(data) {
    hashDocumentoAssinado = data;
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

function hex2bin(n) {
  // console.log('Numero em hex: ' + n);
  // console.log('Numero em bin: ' + parseInt(n,16).toString(2));
  return n.toString(2).substr(-8);
}

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


//socket.write(hashDocumento);
socket.write("1000010000000000111100000000001000000000000000000000001111010000100001000000000011101110000000100000000000000000000000000111000010000100000000001101001000000010000000000000000000000000010000001000010000000000110101000000010000000000000000000000000000001000000000000000000000000000000000100000000000000000000000000000000010000100000000001101011000000100000000000000000000000000000010000000000000000000000000000000100000000000000000000000000000000000100001000000000010100000000001000000000000000000000000000000100000000000000000000000001000000000000000000000000000000000000000001000010000000000000110100000010000000000000000000000000000001000000000000000000000000000000000100000000000000000000000000000000010000100000000000001111000000010000000000000000000000011010000001000010000000000101110000000101000000000000000000000000000001000000000000000000000000000010010000000000000000000000000000000000010000100000000001111001000000010000000000000000000000011000100001000010000000000111010000000101000000000000000000000000000001000000000000000000000000000001000000000000000000000000000000000000");
console.log('Valor de assinatura enviado');

/*if (client.status == 200)
    alert("A assinatura foi bem sucedida!\n\nThe response representation was:\n\n" + client.responseText)
else
    alert("Falha na assinatura!\n\nThe response status was: " + client.status + " " + client.statusText + ".");
*/
}