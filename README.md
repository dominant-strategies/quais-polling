# Quais Polling 

Quais Polling is an extension to the [Quais library](https://github.com/dominant-strategies/quais-5.js), designed to provide an easy and efficient way to poll for responses on the client side. Built on top of Quais, it maintains the simplicity and reliability you're accustomed to, with added polling capabilities.

## Features

- Seamless integration with Quais.
- Poll for transaction receipts, contract method results, or any asynchronous process.
- Configurable polling intervals and timeout settings.
- Efficient error handling during the polling process.

## Installation

Before you install the Quais Polling, make sure you have Quais installed in your project.

```
npm install quais
```

Then, you can install Quais Polling using npm:

```
npm install quais-polling
```

Or yarn:

```
yarn add quais-polling
```

## Usage
Here's a quick example to get you started:

```
const { pollFor } = require('quais-polling');
const quais = require('quais');

async function main() {
    const provider = new quais.providers.JsonRpcProvider("http://localhost:8610");
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
pollFor(provider, methodName, params, initial_polling_interval = 60, request_timeout = 30, max_duration = 180, max_polling_interval = 90)
```
Polls for a method's response.

Parameters
* provider: The Quais provider instance.
* methodName: Name of the method you're awaiting a response from.
* params: Parameters to be passed to the method being called.
* initial_polling_interval (optional): Time (in seconds) for the initial interval between polls.
* request_timeout (optional): Time (in seconds) before the request times out.
* max_duration (optional): Maximum duration (in seconds) before the entire polling process times out. Defaults to 180 seconds.
* max_polling_interval (optional): Maximum time (in seconds) allowed between polls. Defaults to 10000 milliseconds.

# Contributing
We welcome contributions! Please see our contributing guidelines for details.
