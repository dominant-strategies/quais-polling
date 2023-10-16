export const pollFor = async function (
	provider,
	methodName,
	params,
	initialPollingInterval,
	requestTimeout,
	max_duration_seconds = 180,
	max_polling_interval = 10000
) {
	const MAX_DURATION = max_duration_seconds * 1000
	const MAX_POLLING_INTERVAL = Math.max(max_polling_interval, 10000)
	let pollingInterval = initialPollingInterval
	let startTime = Date.now()
	let poll_count = 0

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

	if (typeof provider[methodName] !== 'function') {
		throw new Error(`Invalid method: ${methodName}`)
	}

	if (provider[methodName].length !== params.length) {
		throw new Error('Incorrect number of arguments provided.')
	}

	while (true) {
		if (Date.now() - startTime > MAX_DURATION) {
			throw new Error('Maximum polling duration exceeded. Giving up.')
		}
		try {
			let methodResult = provider[methodName](...params)
			if (methodResult instanceof Promise) {
				methodResult = await withTimeout(methodResult, requestTimeout)
			}
			if (methodResult != null) {
				return methodResult
			}
		} catch (error) {
			if (error.message === 'Promise timeout') {
				console.log('Request timed out. Retrying...')
			} else {
				console.error(`An error occurred: ${error.message}. Retrying...`)
			}
		}
		poll_count += 1
		if (poll_count % 5 == 0) {
			pollingInterval = Math.min(2000 + pollingInterval, MAX_POLLING_INTERVAL)
		}
		await new Promise((resolve) => setTimeout(resolve, pollingInterval))
	}
}
