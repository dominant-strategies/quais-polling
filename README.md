# Quais Polling Shim

Quais Polling Shim is an extension to the [Quais library](https://github.com/dominant-strategies/quais-5.js), designed to provide an easy and efficient way to poll for responses on the client side. Built on top of Quais, it maintains the simplicity and reliability you're accustomed to, with added polling capabilities.

## Features

- Seamless integration with Quais.
- Poll for transaction receipts, contract method results, or any asynchronous process.
- Configurable polling intervals and timeout settings.
- Efficient error handling during the polling process.

## Installation

Before you install the Quais Polling Shim, make sure you have Quais installed in your project.

```
npm install quais
```

Then, you can install Quais Polling Shim using npm:

```
npm install quais-polling-shim
```

Or yarn:

```
yarn add quais-polling-shim
```

## Usage
Here's a quick example to get you started:

```
const { pollFor } = require('quais-polling-shim');
const quais = require('quais');

async function main() {
    const provider = new quais.providers.JsonRpcProvider("http://localhost:8545");
    const transactionHash = 'your-transaction-hash';

    try {
        const receipt = await pollFor(provider, 'getTransactionReceipt', [transactionHash], 1000, 30000);
        console.log(receipt);
    } catch (error) {
        console.error('Error polling for transaction receipt:', error);
    }
}

main();
```

## API Reference
```
pollFor(provider, methodName, params, initialPollingInterval, requestTimeout, maxDurationSeconds = 180, maxPollingInterval = 10000)
```
Polls for a method's response.

Parameters
* provider: The Quais provider instance.
* methodName: Name of the method you're awaiting a response from.
* params: Parameters to be passed to the method being called.
* initialPollingInterval: Time (in milliseconds) for the initial interval between polls.
* requestTimeout: Time (in milliseconds) before the request times out.
* maxDurationSeconds (optional): Maximum duration (in seconds) before the entire polling process times out. Defaults to 180 seconds.
* maxPollingInterval (optional): Maximum time (in milliseconds) allowed between polls. Defaults to 10000 milliseconds.

# Contributing
We welcome contributions! Please see our contributing guidelines for details.
