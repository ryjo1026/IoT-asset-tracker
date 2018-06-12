pragma solidity ^0.4.24;

contract AssetTracker {
    struct Device {
        string name;
        address owner;
        uint useLength;         // in seconds
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
    mapping(string => Device) private devices;
    string[] names;
    uint public numDevices;
    
    constructor() public {
        numDevices = 0;
    }
    
    // loop over this function from 0 to numDevices to return info on all devices one by one
    // return value are in order: name, use length, location, desired price (by owner), current highest bid, is it up for auction
    function getDeviceInfo (uint _id) public view returns (string, uint, string, uint, uint, bool) {
        return (devices[names[_id]].name, devices[names[_id]].useLength, devices[names[_id]].location, devices[names[_id]].desiredPrice, devices[names[_id]].highestBid, devices[names[_id]].auctionOn);
    }
    
    function registerDevice (string _name, uint _useLength, uint _desiredPrice, string _defaultCode, string _location) public {
        if (devices[_name].isValid) {
            revert();
        }
        
        devices[_name] = Device({name: _name, owner: msg.sender, useLength: _useLength, inUse: false, isValid: true, accessCode: _defaultCode, defaultCode: _defaultCode, location: _location, desiredPrice: _desiredPrice, bidder: 0x0, highestBid: 0 ether, timeBought: 0, auctionOn: false, currentUser: 0x0});
        names.push(_name);
        ++numDevices;
    }
    
    function deregisterDevice (string _name) public {
        if (devices[_name].owner != msg.sender) {
            revert();
        }
        
        if (devices[_name].inUse) {
            // update current user if needed
            if (now - devices[_name].timeBought > devices[_name].useLength) {
                devices[_name].inUse = false;
                devices[_name].accessCode = devices[_name].defaultCode;
                devices[_name].currentUser = 0x0;
            }
            else {
                revert();
            }
        }
        
        delete devices[_name];
        
        // swap last element with deleted element
        for (uint i = 0; i < numDevices; ++i) {
            if (keccak256(names[i]) == keccak256(_name)) {
                --numDevices;
                names[i] = names[numDevices];
                delete names[numDevices];
                break;
            }
        }
    }
    
    function updateDevice (string _name, string _newName, uint _newUseLength, uint _newDesiredPrice, string _newDefaultCode, string _newLocation) public {
        if (devices[_name].owner != msg.sender) {
            revert();
        }
        
        if (devices[_name].inUse) {
            // update current user if needed
            if (now - devices[_name].timeBought > devices[_name].useLength) {
                devices[_name].inUse = false;
                devices[_name].accessCode = devices[_name].defaultCode;
                devices[_name].currentUser = 0x0;
            }
            else {
                revert();
            }
        }
        
        if (devices[_newName].isValid) {
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
        
        // update names array
        for (uint i = 0; i < numDevices; ++i) {
            if (keccak256(names[i]) == keccak256(_name)) {
                names[i] = _newName;
                break;
            }
        }
    }
    
    // function extendUsePeriod (string _name, uint _newUseLength) private {
        // if (!devices[_name].extendable) {
            // revert();
        // }
        
        // devices[_name].useLength = _newUseLength;
    // }
    
    ////////////////// Auction Functions//////////////////////////
    function makeBid(string _deviceName) public payable {
        if (!devices[_deviceName].isValid) {
            revert();
        }
        
        // if this device's current owner's time has expired, take away access and reset
        if (devices[_deviceName].inUse) {
            if (now - devices[_deviceName].timeBought > devices[_deviceName].useLength) {
                devices[_deviceName].inUse = false;
                devices[_deviceName].accessCode = devices[_deviceName].defaultCode;
                devices[_deviceName].currentUser = 0x0;
            }
            else {
                revert();   
            }
        }
        
        if (!devices[_deviceName].auctionOn) {  
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
        
        if (!devices[_deviceName].isValid) {
            revert();
        }
        
        if (devices[_deviceName].inUse) {
            // update current user if needed
            if (now - devices[_deviceName].timeBought > devices[_deviceName].useLength) {
                devices[_deviceName].inUse = false;
                devices[_deviceName].accessCode = devices[_deviceName].defaultCode;
                devices[_deviceName].currentUser = 0x0;
            }
            else {
                revert();
            }
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
        
        if (!devices[_deviceName].isValid) {
            revert();
        }
        
        if (devices[_deviceName].inUse) {
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
    function createAccessCode(string _deviceName, string _myCode) public returns (string) {
        if (!devices[_deviceName].isValid) {
            revert();
        }
        
        if (msg.sender == devices[_deviceName].currentUser) {
            // update current user if needed
            if (now - devices[_deviceName].timeBought > devices[_deviceName].useLength) {
                devices[_deviceName].inUse = false;
                devices[_deviceName].accessCode = devices[_deviceName].defaultCode;
                devices[_deviceName].currentUser = 0x0;
                return "ACCESS EXPIRED";
            }
            
            devices[_deviceName].accessCode = _myCode;
            return "PASSWORD CHANGE SUCCESSFUL";
        }
        
        else {
            return "PERMISSION DENIED";
        }
    }
}
