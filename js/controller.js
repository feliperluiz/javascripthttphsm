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

  // var xhr = new XMLHttpRequest();
  // var url = "https://hsmlab64.dinamonetworks.com/api/auth";
  // xhr.open("POST", url, true);
  // xhr.setRequestHeader("Content-Type", "application/json");
  // xhr.onreadystatechange = function () {
  //     if (xhr.readyState === 4 && xhr.status === 200) {
  //         var json = JSON.parse(xhr.responseText);
  //         console.log(json.email + ", " + json.password);
  //     }
  // };
  // var data = JSON.stringify({"usr": "master", "pwd": "12345678"});
  // xhr.send(data);

  var ws = new WebSocket('ws://localhost:4001');

  //s_server -accept 5696 -cert cert.pem -key key.pem -verify 10 -CAfile certkmip.pem
  //s_client -connect localhost:5696 -cert certkmip.pem -key keykmip.pem
  //1) CA do controller não está sendo usado como certificado de confiança (está confiando no navegador)
  //2) a biblioteca do socket IO deve ignorar a validação de common name (CN), está esperando que o CN do cert (que no caso pratico é o da dinamo), seja igual ao host onde estou me conectando

 
//criando TTLV de teste
var TTLVRequest = new KMIPTTLV (Tags.REQUEST_MESSAGE, Types.STRUCTURE, '', 0x00000040);
// //Header Section
var TTLVHeader = new KMIPTTLV (Tags.REQUEST_HEADER, Types.STRUCTURE, '', 0x00000014);
var TTLVProtocol = new KMIPTTLV (Tags.PROTOCOL_VERSION, Types.STRUCTURE, '', 0x00000008);
var TTLVProtocolMajor = new KMIPTTLV (Tags.PROTOCOL_VERSION_MAJOR, Types.INTEGER, 0x00000001, 0x00000004);
var TTLVProtocolMinor = new KMIPTTLV (Tags.PROTOCOL_VERSION_MINOR, Types.INTEGER, 0x00000003, 0x00000004);

// var TTLVAuthentication = new KMIPTTLV (Tags.AUTHENTICATION, Types.STRUCTURE, '', 0x00000040);
// var TTLVCredential = new KMIPTTLV (Tags.CREDENTIAL, Types.STRUCTURE, '', 0x00000040);
// var TTLVCredencialType = new KMIPTTLV (Tags.CREDENTIAL_TYPE, Types.ENUMERATION, CredentialType.USERNAME_AND_PASSWORD, 0x00000004)
// var TTLVCredencialValue = new KMIPTTLV (Tags.CREDENTIAL_VALUE, Types.STRUCTURE, '', 0x00000040);
// var TTLVUsername = new KMIPTTLV (Tags.USERNAME, Types.TEXT_STRING, 'felipe');
// var TTLVPassword = new KMIPTTLV (Tags.PASSWORD, Types.TEXT_STRING, 'bry123123');

var TTLVHeaderBatch = new KMIPTTLV (Tags.BATCH_COUNT, Types.INTEGER, 0x00000001, 0x00000004);
//Batch Items
var TTLVBatchItem = new KMIPTTLV (Tags.BATCH_ITEM, Types.STRUCTURE, '', 0x0000000C);
var TTLVItemOperation = new KMIPTTLV (Tags.OPERATION, Types.ENUMERATION, Operation.QUERY, 0x00000004);
var TTLVRequestPayload = new KMIPTTLV (Tags.REQUEST_PAYLOAD, Types.STRUCTURE, '', 0x00000004);
var TTLVQueryFunction = new KMIPTTLV (Tags.QUERY_FUNCTION, Types.ENUMERATION, QueryFunction.QUERY_PROFILES, 0x00000004);


var bin1 = TTLVRequest.getBlock()+
TTLVHeader.getBlock()+
TTLVProtocol.getBlock()+
TTLVProtocolMajor.getBlock()+
TTLVProtocolMinor.getBlock()+
// TTLVAuthentication.getBlock()+
// TTLVCredential.getBlock()+
// TTLVCredencialType.getBlock()+
// TTLVCredencialValue.getBlock()+
// TTLVUsername.getBlock()+
// TTLVPassword.getBlock()+
TTLVHeaderBatch.getBlock()+
TTLVBatchItem.getBlock()+
TTLVItemOperation.getBlock()+
TTLVRequestPayload.getBlock()+
TTLVQueryFunction.getBlock();

ws.onopen = function () {
  ws.send(bin1)
  console.log('Valor de assinatura enviado');
};

ws.onmessage = function(data) {
  hashDocumentoAssinado = data;
  console.log('Documento em binário assinado: ' + hashDocumentoAssinado.data);
};

}