class NetworkConnectionError extends Error {
  constructor(message = 'Cannot connect to MetaMask.') {
    super(message);
  }
}
class AccountConnectionError extends Error {
  constructor(message = 'Cannot connect to Accounts.') {
    super(message);
  }
}

module.exports = {
  NetworkConnectionError: NetworkConnectionError,
  AccountConnectionError: AccountConnectionError,
};
