# IoTAssetTracker
Ethereum Ðapp for matching IoT device owners and bidders. This application is an adaptation of a simple bidding platform in ethereum. IoT device owners can list their device on the marketplace and then interested bidders will bid to purchase access to these devices. 

<img src="https://i.imgur.com/ALYhsAc.png" height="500">

So far the project is in a proof-of-concept state and there is work that needs to be done if this were to handle actual user data. Overall the project demonstrates smart contract design in Ethereum as well as using more established tools such as React with new blockchain technology.

Completed as part of the Experience Ethereum research project at Lunds Tekniska Högskola.

## How to Use
1. Register a device on the registration page
2. Start the bidding for that device in the management page (you will need to search for the device you registered by name)
3. Search for availible devices and bid on them in the search page
4. Close the bidding for a device in the management page. Ethereum will be properly distributed to the owner and those who particpated in bidding.

## Development
* Install [yarn](https://yarnpkg.com/en/docs/install#mac-stable)
* Run ```yarn install``` to install all devDependencies
* Run ```yarn start``` to start a live-reloading development server

Its recommended to install an ESLint plugin in your editor so you can properly conform to the styleguide for this project.

### Contract
Due to the amount of function calls that need to be made when testing out the functionality of the application, its recommended to deploy the contract to Ganache. This should be accomplished by modifying the truffle.js file with information for your private network. Once this is setup run ```truffle migrate``` to migrate the contract to the network. Record the address that the contract is at and paste it into the space at the top of the withWeb3.js file.

Note that eslint is implemented following the google styleguide so it would be helpful to install an eslint plugin for your text editor so that code style will match.
