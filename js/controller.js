function Sign () {

var url = "http://192.168.105.9:5696/kmip";
cliente = new XMLHttpRequest();
cliente.onreadystatechange = function () { 
    if (cliente.readyState == 4 && cliente.status == 200) {
        var json = JSON.parse(cliente.responseText);
        console.log(json)
    }
}

cliente.open("POST", url, true);
cliente.setRequestHeader("Content-Type", "application/octet-stream");



//criar TTLV

var TTLVRequest = new KMIPTTLV (Tags.REQUEST_MESSAGE, Types.STRUCTURE, '', 0x000001e8);
// //Header Section
var TTLVHeader = new KMIPTTLV (Tags.REQUEST_HEADER, Types.STRUCTURE, '', 0x00000038);
var TTLVProtocol = new KMIPTTLV (Tags.PROTOCOL_VERSION, Types.STRUCTURE, '', 0x00000020);
var TTLVProtocolMajor = new KMIPTTLV (Tags.PROTOCOL_VERSION_MAJOR, Types.INTEGER, 0x00000001, 0x00000004);
var TTLVProtocolMinor = new KMIPTTLV (Tags.PROTOCOL_VERSION_MINOR, Types.INTEGER, 0x00000004, 0x00000004);
var TTLVHeaderBatch = new KMIPTTLV (Tags.BATCH_COUNT, Types.INTEGER, 0x00000001, 0x00000004);
//Batch Items
var TTLVBatchItem = new KMIPTTLV (Tags.BATCH_ITEM, Types.STRUCTURE, '', 0x000001a0);
var TTLVItemOperation = new KMIPTTLV (Tags.OPERATION, Types.ENUMERATION, Operation.QUERY, 0x00000004);
var TTLVRequestPayload = new KMIPTTLV (Tags.REQUEST_PAYLOAD, Types.STRUCTURE, '', 0x00000188)
var TTLVQueryFunction = new KMIPTTLV (Tags.QUERY_FUNCTION, Types.ENUMERATION, Operation.QUERY_PROFILES, 0x00000004)


var request = {}; //enviar um binario


cliente.send(request);

/*if (client.status == 200)
    alert("A assinatura foi bem sucedida!\n\nThe response representation was:\n\n" + client.responseText)
else
    alert("Falha na assinatura!\n\nThe response status was: " + client.status + " " + client.statusText + ".");
*/
}

function handleFileBrowse(evt) {

/*const tempReader = new FileReader();
const currentFiles = evt.target.files;
  
  tempReader.onload =
    event =>
    {
      dataBuffer = event.target.result; 
    };

    sequence = sequence.then(
		() => crypto.digest({ name: hashAlg }, new Uint8Array(dataBuffer))
	);
  tempReader.readAsArrayBuffer(currentFiles[0]); */
}

//window.handleFileBrowse = handleFileBrowse;


function getTagLength(tag) { //0x420078
  var lenTag = 4;
  
  while(lenTag > 1) {
    var tmpTag = tag >>> ((lenTag - 1) * 8);
    
    if ((tmpTag & 0xFF) != 0x00) {
      break;
    } 
    
    lenTag--;
  }
  
  return lenTag;
};


function getValueLength(value, constructed) { //0x01
  var lenValue = 0;
  
  if (constructed) {
    for (var i = 0; i < value.length; i++) {
      lenValue = lenValue + value[i].byteLength;
    }
  } else {
    lenValue = value.length;
  }    
  
  return lenValue;
};

function getLengthOfLength(lenValue) {
  var lenOfLen;
  
  if (lenValue > 0x00FFFFFF) {
    lenOfLen = 5;
  } else if (lenValue > 0x0000FFFF) {
    lenOfLen = 4;
  } else if (lenValue > 0x000000FF) {
    lenOfLen = 3;
  } else if (lenValue > 0x0000007F) {
    lenOfLen = 2; 
  } else {
    lenOfLen = 1;
  }
  
  return lenOfLen
};

function encodeNumber(buf, value, len) {
  var index = 0;
  
  while (len > 0) {
    var tmpValue = value >>> ((len - 1) * 8);
    buf[index++] = tmpValue & 0xFF;
    len--;
  }
}

//    TAG REQUEST_MESSAGE                        : 0x420078,
//    TYPE STRUCTURE                              : 0x01,

function KMIPRequestBuilder(_tag, _value) {
  var request = "" || {};
  var tagLength = getTagLength(_tag);
  var valueLength = getValueLength(_value);
  var lenOfLen = getLengthOfLength(valueLength);

  request = Tags.REQUEST_MESSAGE + Types.STRUCTURE;
  
  if (buf === undefined) {
      var buf = new Buffer(tagLength + valueLength + lenOfLen);
  }
  
  var index = 0;
  encodeNumber(buf, _tag, tagLength);
  index += tagLength;
  
  if (lenOfLen == 1) {
    buf[index++] = valueLength;
  } else {
    lenOfLen--;
    buf[index++] = 0x80 | lenOfLen;
    encodeNumber(buf.slice(index), valueLength, lenOfLen);
    index += lenOfLen;
  }
 
  if (this.constructed) {
    for (var i = 0; i < this.value.length; i++) {
      this.value[i].encode(buf.slice(index));
      index = index + this.value[i].byteLength;
    }
    
    if (this.indefiniteLength) {
      buf[index++] = 0x00;
      buf[index++] = 0x00;
    }
  } else {
    this.value.copy(buf, index);
  }
  return buf;

};