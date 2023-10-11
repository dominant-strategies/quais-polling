const quais = require('quais')

quais.pollFor = function (provider, methodName, params, pollingInterval, requestTimeout) {
	function withTimeout(promise, ms) {
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				reject(new Error('Promise timeout'))
			}, ms)

			promise
				.then((value) => {
					clearTimeout(timer)
					resolve(value)
				})
				.catch((reason) => {
					clearTimeout(timer)
					reject(reason)
				})
		})
	}

	async function main() {
		if (typeof provider[methodName] !== 'function') {
			throw new Error(`Invalid method: ${methodName}`)
		} else {
			console.log(`Waiting for ${methodName} to return`)
		}
		return new Promise(async (resolve, reject) => {
			let response = null
			while (!response) {
				try {
					response = await withTimeout(provider[methodName](params), requestTimeout)
				} catch (error) {
					if (error.message === 'Promise timeout') {
						console.log('Request timed out. Retrying...')
					} else {
						reject(error)
						return
					}
				}
				if (!response) {
					await new Promise((r) => setTimeout(r, pollingInterval - requestTimeout))
				}
			}
			resolve(response)
		})
	}
	return main()
}

module.exports = quais
