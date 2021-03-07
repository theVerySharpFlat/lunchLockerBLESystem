# lunchLockerBLESystem

This is the BLE peripheral system for the LunchLocker safe. 

## A Quick Explanation of BLE (Bluetooth Low Energy)
Bluetooth low energy is a type of bluetooth connection where one device, called the peripheral, brodcasts it's status and services (things that it allows you to do to it) and another device, called the central, connects to the peripheral and accesses the services that are provided. Services can be 'read', 'write', or 'notify'

More information here: [https://www.youtube.com/watch?v=chfXawb_eVY](https://www.youtube.com/watch?v=chfXawb_eVY)

## Getting the Code
First, clone the repo:
```bash
git clone https://github.com/theVerySharpFlat/lunchLockerBLESystem/tree/master
```
If you don't have git installed, you can just go here: [https://github.com/theVerySharpFlat/lunchLockerBLESystem/tree/master](https://github.com/theVerySharpFlat/lunchLockerBLESystem/tree/master)<br>click the green button that says "Code" and click "Download ZIP". Make sure to unzip the files.

## Installing Dependencies
The code has been tested with the most recent version of node (14.6)

Also, dependencies of dependencies may need to be installed:
```bash
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
```
<br>



## Running the Code
first,
```bash
cd lunchLockerBLESystem
```

To run the code, you need sudo priveleges. Run:
```bash
sudo $(which node) src/index.js
```

## Resources
[https://github.com/noble/bleno](https://github.com/noble/bleno)

[https://nodejs.org/en/](https://nodejs.org/en/)