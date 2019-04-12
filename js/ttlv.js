const binStrLen = '00000000';
const binStrType = '00';

function KMIPTTLV (tag, type, value, length) {
		this.tag = tag;
		this.type = type;
		this.value = formatValues(value, this.type);
		this.constructed = (value instanceof Array); //TODO::  If constructed, get bytelength of children.	
		this.length = (typeof length === 'undefined') ? getFieldLength(this.type, this.value) : length.toString(16);
		this.padding = ttlvPadding(this.type, this.value);
		this.fullLength = _getLength(this.tag.toString(16)) + _getLength(formatNumbers(this.type, 'type')) + _getLength(formatNumbers(this.length, 'length')) + _getLength(this.value) + _getLength(this.padding);
}

KMIPTTLV.prototype.getBlock = function()
{
	//example var TTLVRequest = new KMIPTTLV (Tags.REQUEST_MESSAGE, Types.STRUCTURE, '', 0x000001e8);
  return this.tag.toString(16) + '' + formatNumbers(this.type, 'type') + '' + formatNumbers(this.length, 'length') + '' + this.value + '' + this.padding;
};

function formatValues(value, type) { 
	var tmpStr = '';
	var tmpLen = getFieldLength(type, value);
	switch(type) {
		case Types.INTEGER:
			var IntFill = '00000000';
			tmpStr = (IntFill + value.toString(16)).substr(-8);
			return tmpStr;
		case Types.ENUMERATION:
			var enumFill = '00000000'; 
			value = value + "";
			tmpStr = (enumFill + value.toString(16)).substr(-8);
			return tmpStr;  
		case Types.TEXT_STRING:
			if (!isHex(value)) {
				var hexbuf = new Buffer(value);
				tmpStr = hexbuf.toString('hex');
			} else {
				tmpStr = value.toString(16);
			}
			return tmpStr;
		default:
			tmpStr = value;
			return tmpStr;
	}
};

function ttlvPadding(type, value) {
	var pad;
	switch(type) {
		case Types.INTEGER:
			pad = '00000000';
			return pad;
		case Types.INTERVAL:
			pad = '00000000';
			return pad;
		case Types.ENUMERATION:
			pad = '00000000';
			return pad;
		case Types.TEXT_STRING:
		if (isMultiple(getByteLen(value), 8)) {
			pad = '';
		} else {
			var remainder = getByteLen(value) % 8;
			var diff = 8 - remainder;
			var byteBuff = new Buffer(diff).fill(0);
			pad = byteBuff.toString('hex');
		}
		return pad;

		case Types.BYTE_STRING:
			return pad;
		default:
			pad = '';
			return pad;
	}
};

/*If the Item Type is Structure,
then the Item Length is the total length of all of the sub-items contained in the structure, 
including any padding. 

If the Item Type is Integer, Enumeration, Text String, Byte String, or Interval, 
then the Item Length is the number of bytes excluding the padding bytes. 

Text Strings and Byte Strings SHALL be padded with the minimal number of bytes 
following the Item Value to obtain a multiple of eight bytes. 

Integers, Enumerations, and Intervals SHALL be padded with four bytes following the Item Value.*/

function getFieldLength(type, value) {
	var remainder, length;
	switch(type) {
		case Types.STRUCTURE: //is the total length of all of the sub-items contained in the structure, including any padding.
			if (value) {
				var tmpLen = getByteLen(value);
				return tmpLen.toString(16);
			}
		case Types.INTEGER:
			return 4;
		case Types.LONG_INTEGER:
			return 8;
		case Types.BIG_INTEGER:
		case Types.ENUMERATION:
			return 4;
		case Types.BOOLEAN:
			return 8;
		case Types.TEXT_STRING:
		if (value) {
			var tmpLen = value.length/2; //ex: 0000000(size 8) / 2 = 4
			return parseInt(tmpLen.toString(16));
		}
		case Types.BYTE_STRING:
		case Types.DATE_TIME:
			return 8;
		case Types.INTERVAL:
			return 4;
		default:
			return 4;
	}
}

function getByteLen(normal_val) {
    // Force string type
    normal_val = String(normal_val);
    var normal_buff = new Buffer(normal_val);

    var byteLen = 0;
    for (var i = 0; i < normal_val.length; i++) {
        var c = normal_val.charCodeAt(i);
        byteLen += c < (1 <<  7) ? 1 :
                   c < (1 << 11) ? 2 :
                   c < (1 << 16) ? 3 :
                   c < (1 << 21) ? 4 :
                   c < (1 << 26) ? 5 :
                   c < (1 << 31) ? 6 : Number.NaN;
    }

    //console.log('GetByteLen Buffer: ');
    //console.log(normal_buff.byteLength);
    //console.log('GetByteLen Long Math: ');
    //console.log(byteLen);
    return byteLen;
}

function _getLength(value) {
	//2 characters is a Byte, ByteLength is considering every character as a byte representation
	var Len = (value.length/2);
	return Len;
};

function formatNumbers(number, type) {
	var basenum = '00000000'; 
	if (type === 'type') { //no exemplo do TTLVRequest é um type de Structure
		basenum = binStrType;
	} else if (type === 'length') {
		basenum = binStrLen;
	} else {
		throw new Error('Unknown type.');
	}

	number = "" + number;
	var tmpStr = basenum.slice(number.length) + '' + number;

	return tmpStr;
};