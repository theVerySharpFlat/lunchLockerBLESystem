var util = require('util'); //javascript utility library
var bleno = require('bleno'); //or 'bleno-mac' if you are using that
var BlenoCharacteristic = bleno.Characteristic;

var SafeLockCharacteristic = function(){//this is the characteristic that is in charge of the safe's lock mechanism
	SafeLockCharacteristic.super_.call(this, {
		uuid: 'fd49f629-e9a4-42b8-bcc1-9818e759b2c4',
		properties: ['read', 'write']
	});

	this._value = new Buffer.alloc(0);
	this.status = null; //status of safe - can either be 0 (locked) or 1 (unlocked)
	this._updateValueCallback = null 

}

SafeLockCharacteristic.prototype.onReadRequest = function(offset, callback){ //this function should get the status of the lock
	console.log('SafeLockCharacteristic onReadRequest\n');
	var message = "NO STATUS";

	if(this.status) message = this.status.toString();

	callback(this.RESULT_SUCCESS, Buffer.from(message, 'utf-8')); //the first argument is just the outcome of the operation
																  //the second one is the actual data. I converted it into a buffer
}

SafeLockCharacteristic.prototype.onWriteRequest = function(data,offset,withoutResponse,callback){
	this._value = data;

	console.log("value recieved");
	console.log(`value: \'${this._value.toString('hex')}\'`);
	console.log("");

	if(this._value.toString('hex') == '00'){ //data is sent (before being encoded) as hex values, so we need to convert back to hex
		this.status = '0';
	}
	else if(this._value.toString('hex') == '01'){
		this.status = '1';
	}else{
		console.log("something went wrong checking value equalites! (could be just that you didn't enter 01 or 00)");
		callback(this.RESULT_UNLIKELY_ERROR);
		return;
	}
	console.log(`Status: ${this.status}`);
	callback(this.RESULT_SUCCESS);
}

SafeLockCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback){
	console.log("new subscription");
}

SafeLockCharacteristic.prototype.onUnsubscribe = function(){
	console.log("subscription disconnected");
}
util.inherits(SafeLockCharacteristic, BlenoCharacteristic); //crude old javascript version of the 'extends' keyword
module.exports = {SafeLockCharacteristic}; //crude old javascript version of the 'export' keyword
