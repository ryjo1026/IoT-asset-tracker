pragma solidity ^0.4.24;

contract AssetTracker {
    struct Device {
        string name;
        address owner;
        uint useLength;
        bool inUse;
        bool isValid;
        string accessCode;
        string defaultCode;
        string location;
        uint desiredPrice;
        address bidder;
        uint highestBid;
        uint timeBought;
        bool auctionOn;
        address currentUser;
    }

    // contract members
    mapping(string => Device) devices;

    constructor() public {}

    function registerDevice (string _name, uint _useLength, uint _desiredPrice, string _defaultCode, string _location) public {
        if (devices[_name].isValid) {
            revert();
        }

        devices[_name] = Device({name: _name, owner: msg.sender, useLength: _useLength, inUse: false, isValid: true, accessCode: _defaultCode, defaultCode: _defaultCode, location: _location, desiredPrice: _desiredPrice, bidder: 0x0, highestBid: 0 ether, timeBought: 0, auctionOn: false, currentUser: 0x0});
    }

    function deregisterDevice (string _name) public {
        if (devices[_name].owner != msg.sender) {
            revert();
        }

        delete devices[_name];
    }

    function updateDevice (string _name, string _newName, uint _newUseLength, uint _newDesiredPrice, string _newDefaultCode, string _newLocation) public {
        if (devices[_name].owner != msg.sender) {
            revert();
        }

        if (devices[_newName].isValid) {
            revert();
        }

        if (devices[_name].inUse) {
            revert();
        }
        Device memory updatedDevice = devices[_name];
        updatedDevice.name = _newName;
        updatedDevice.useLength = _newUseLength;
        updatedDevice.desiredPrice = _newDesiredPrice;
        updatedDevice.defaultCode = _newDefaultCode;
        updatedDevice.location = _newLocation;

        delete devices[_name];
        devices[_newName] = updatedDevice;
    }

    // function extendUsePeriod (string _name, uint _newUseLength) private {
        // if (!devices[_name].extendable) {
            // revert();
        // }

        // devices[_name].useLength = _newUseLength;
    // }

    ////////////////// Auction Functions//////////////////////////
    function makeBid(string _deviceName) public payable {
        // if this device's current owner's time has expired, take away access and reset
        if (devices[_deviceName].inUse) {       // these two might be redundant
            if (now - devices[_deviceName].timeBought > devices[_deviceName].useLength) {
                devices[_deviceName].inUse = false;
                devices[_deviceName].accessCode = devices[_deviceName].defaultCode;
                devices[_deviceName].currentUser = 0x0;
            }
            else {
                revert();
            }
        }

        if (!devices[_deviceName].auctionOn) {      // these two might be redundant
            revert();
        }

        if (!devices[_deviceName].isValid) {
            revert();
        }

        if (msg.value < devices[_deviceName].desiredPrice) {
            revert();
        }

        if (msg.value <= devices[_deviceName].highestBid) {
            revert();
        }

        // if this bid is valid, give back old highest bid and take this bid
        if (devices[_deviceName].highestBid != 0) {
            devices[_deviceName].bidder.transfer(devices[_deviceName].highestBid);
        }

        devices[_deviceName].highestBid = msg.value;
        devices[_deviceName].bidder = msg.sender;
    }

    function startAuction(string _deviceName) public {
        if (devices[_deviceName].owner != msg.sender) {
            revert();
        }

        if (devices[_deviceName].inUse) {
            revert();
        }

        if (!devices[_deviceName].isValid) {
            revert();
        }

        if (devices[_deviceName].auctionOn) {
            revert();
        }

        devices[_deviceName].auctionOn = true;
    }

    function endAuction(string _deviceName) public {
        if (devices[_deviceName].owner != msg.sender) {
            revert();
        }

        if (devices[_deviceName].inUse) {
            revert();
        }

        if (!devices[_deviceName].isValid) {
            revert();
        }

        if (!devices[_deviceName].auctionOn) {
            revert();
        }

        if (devices[_deviceName].bidder == 0x0) {
            devices[_deviceName].auctionOn = false;
            return;
        }

        devices[_deviceName].timeBought = now;
        msg.sender.transfer(devices[_deviceName].highestBid);   // send money from auction to device owner
        // call give access
        giveAccess(_deviceName, devices[_deviceName].bidder);
        devices[_deviceName].bidder = 0x0;
        devices[_deviceName].highestBid = 0;
        devices[_deviceName].auctionOn = false;
    }


    ///////////////////////// Access Functions /////////////////////////////////
    function giveAccess(string _deviceName, address _winner) private {
        if (devices[_deviceName].owner != msg.sender) {
            revert();
        }

        devices[_deviceName].inUse = true;
        devices[_deviceName].currentUser = _winner;
    }

    function removeAccess(string _deviceName) public {
        if (devices[_deviceName].owner != msg.sender) {
            revert();
        }

        if (now - devices[_deviceName].timeBought <= devices[_deviceName].useLength) {
            revert();
        }

        if (!devices[_deviceName].isValid) {
            revert();
        }

        devices[_deviceName].inUse = false;
        devices[_deviceName].accessCode = devices[_deviceName].defaultCode;
        devices[_deviceName].currentUser = 0x0;
    }

    // allows current user (and only the current user) to change and view access code
    function createAccessCode(string _deviceName, string _myCode) public returns (string _code){
        if (msg.sender == devices[_deviceName].currentUser) {
            devices[_deviceName].accessCode = _myCode;
            _code = devices[_deviceName].accessCode;
            return _code;
        }

        else {
            _code = "PERMISSION DENIED";
            return _code;
        }
    }
}
