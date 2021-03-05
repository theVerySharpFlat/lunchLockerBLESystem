/*  index.js 
 *  Simple ble peripheral service with nodejs and the bleno peripheral library
 *  Written to run on a raspberry pi
 *  Written for 4330's lunch locker safe 
 *  Aiden Lambert 3/5/21
 */

var bleno = require('bleno') ; 
var BlenoPrimaryService = bleno.PrimaryService;

bleno.on('stateChange', function(state) {
console.log('on -> stateChange: ' + state);
	if (state === 'poweredOn') {
		console.log("request startAdvertising");
		bleno.startAdvertising('rpi', ['27cf08c1-076a-41af-becd-02ed6f6109b9']);  
	} else {
		console.log("request stopAdvertising");
		bleno.stopAdvertising(); 
	}
});

var CustomCharacteristics = require('./characteristics');

bleno.on('advertisingStart', function(error) {
	console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

	if (!error) {
		bleno.setServices([
			new BlenoPrimaryService({
				uuid: '27cf08c1-076a-41af-becd-02ed6f6109b9',
				characteristics: [
					new CustomCharacteristics.SafeLockCharacteristic()
				]
			})
		]);
	}
});
