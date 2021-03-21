var util = require("util"); //javascript utility library
var bleno = require("bleno"); //or 'bleno-mac' if you are using that
var fs = require("fs");
var {execSync} = require("child_process");
var BlenoCharacteristic = bleno.Characteristic;

const rootDir = `${__dirname.substring(0, __dirname.indexOf("lunchLockerBLESystem")+"lunchLockerBLESystem".length)}`;
console.log(`root dir: ${rootDir}`)
const statFile = "data/safe.status";
const unLockFile = "src/safe.unlock.sh";
const lockFile = "src/safe.lock.sh";

var SafeLockCharacteristic = function () {
  //this is the characteristic that is in charge of the safe's lock mechanism
  SafeLockCharacteristic.super_.call(this, {
    uuid: "fd49f629-e9a4-42b8-bcc1-9818e759b2c4",
    properties: ["read", "write"],
  });

  this._value = new Buffer.alloc(0);
  this.status = null; //status of safe - can either be 0 (locked) or 1 (unlocked)
  this._updateValueCallback = null;

  this.status = function () {
	var value = fs.readFileSync(`${rootDir}/${statFile}`);
	if(value != '00' & value != '01'){
		console.error(`invalid value inside safe.status file! check contents. The value recieved was \'${value}\'`);
	}
	return value;
  };

  this.lock = function () {
    //TODO: write code that locks the safe
	console.log("request to lock the safe recieved!");
	console.log(execSync(`${rootDir}/${lockFile} ${rootDir}/${statFile}`).toString());
  };

  this.unLock = function () {
    //TODO: write code that unlocks the safe
	console.log("request to unlock the safe recieved!");
	console.log(execSync(`${rootDir}/${unLockFile} ${rootDir}/${statFile}`).toString());
  };
};
SafeLockCharacteristic.prototype.onReadRequest = function (offset, callback) {
  //this function should get and send the status of the lock  
  if(authed){
    var message = this.status();

    console.log("read request recieved!");
    console.log(`sending status of ${message}`);
    console.log('');
    var data = Buffer.alloc(1);
    data.writeUInt8(parseInt(message), 0);
    callback(this.RESULT_SUCCESS, data ); 
  }
  else{
    callback(this.RESULT_UNLIKELY_ERROR);
  }
};

SafeLockCharacteristic.prototype.onWriteRequest = function (
  data,
  offset,
  withoutResponse,
  callback
) {
  //TODO: run lock/unlock process and report result

  if(authed){
    var dataString = data.toString('hex');
    if(dataString == '00') 
      this.lock();
    else if (dataString == '01') 
      this.unLock();
    else 
      console.log("invalid write!");
    callback(this.RESULT_SUCCESS);
  }else {
    callback(this.RESULT_UNLIKELY_ERROR);
  }

};

SafeLockCharacteristic.prototype.onSubscribe = function (
  maxValueSize,
  updateValueCallback
) {
  //TODO: consider adding some process for when the user subscribes
  console.log("new subscription");
};

SafeLockCharacteristic.prototype.onUnsubscribe = function () {
  //TODO: consider adding some process for when the user unsubscribes
  console.log("subscription disconnected");
};
util.inherits(SafeLockCharacteristic, BlenoCharacteristic); //crude old javascript version of the 'extends' keyword

var authed = false;


var SafeAuthCharacteristic = function() {
  SafeAuthCharacteristic.super_.call(this, {
    uuid: "1e4bed6d-dca4-4f95-8662-feb4d735f10c",
    properties: ["read", "write", "notify"],
  });
}
const { v4: uuidv4, parse: parseuUuid } = require('uuid');
SafeAuthCharacteristic.prototype.onReadRequest = function(offset, callback) {
  var usersData = JSON.parse(fs.readFileSync(`${rootDir}/data/users.json`));
  var generatedUUID = uuidv4();
  usersData.users.push(generatedUUID.replace(/-/g,""));
  console.log(`after we try to remove hyphens: ${generatedUUID.replace(/-/g,"")}`);
  fs.writeFileSync(`${rootDir}/data/users.json`, JSON.stringify(usersData));
  callback(this.RESULT_SUCCESS, parseuUuid(generatedUUID));
}
SafeAuthCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log(`in SafeAuthCharacteristic.prototype.onWriteRequest the data that we got is ${data.toString('hex')}`);
  if(JSON.parse(fs.readFileSync(`${rootDir}/data/users.json`)).users.includes(data.toString('hex'))){
    console.log("ACCESS GRANTED");
    authed = true;
  }else{
    console.log("ACCESS DENIED");
    authed = false;
  }
  callback(this.RESULT_SUCCESS);
}
var setAuthed = function(val) {
  authed = val;
}
util.inherits(SafeAuthCharacteristic, BlenoCharacteristic);
module.exports = { SafeLockCharacteristic, SafeAuthCharacteristic, authed, setAuthed}; //crude old javascript version of the 'export' keyword
