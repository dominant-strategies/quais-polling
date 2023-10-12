const quais = require('./../shims/quais-shim.js')

describe('quais.pollFor', () => {
	let quaisProvider
	beforeEach(() => {
		quaisProvider = {
			getTransactionReceipt: jest.fn((hash) => {
				if (hash === '0xValid') {
					return Promise.resolve('some-receipt')
				} else if (hash === '0xInvalid') {
					return Promise.resolve(null)
				} else {
					return Promise.reject(new Error(`Unexpected hash: ${hash}`))
				}
			}),
		}
	})

	test('resolves when method returns a value', async () => {
		const expectedResult = 'some-receipt'
		quaisProvider.getTransactionReceipt.mockResolvedValueOnce(expectedResult)

		const result = await quais.pollFor(quaisProvider, 'getTransactionReceipt', ['0xValid'], 1000, 30000)

		expect(result).toBe(expectedResult)
		expect(quaisProvider.getTransactionReceipt).toHaveBeenCalledWith('0xValid')
	})

	test('retries on timeout and resolves when method returns', async () => {
		const expectedResult = 'some-receipt'
		quaisProvider.getTransactionReceipt
			.mockRejectedValueOnce(new Error('Promise timeout'))
			.mockResolvedValueOnce(expectedResult)

		const result = await quais.pollFor(quaisProvider, 'getTransactionReceipt', ['0xValid'], 1000, 30000)

		expect(result).toBe(expectedResult)
		expect(quaisProvider.getTransactionReceipt).toHaveBeenCalledTimes(2)
	})

	test('throws error for invalid method name', async () => {
		await expect(quais.pollFor(quaisProvider, 'invalidMethod', ['0xValid'], 1000, 30000)).rejects.toThrow(
			'Invalid method: invalidMethod'
		)
	})

	test('throws error for incorrect number of arguments', async () => {
		await expect(quais.pollFor(quaisProvider, 'getTransactionReceipt', [], 1000, 30000)).rejects.toThrow(
			'Incorrect number of arguments provided.'
		)
	})

	test('gives up after max_duration', async () => {
		quaisProvider.getTransactionReceipt.mockResolvedValue(Promise.resolve(null))
		const max_duration_seconds = 2
		const result = quais.pollFor(
			quaisProvider,
			'getTransactionReceipt',
			['0xInvalid'],
			1000,
			30000,
			max_duration_seconds
		)
		await expect(result).rejects.toThrow('Maximum polling duration exceeded. Giving up.')
		expect(quaisProvider.getTransactionReceipt).toHaveBeenCalled()
	}, 20000)
})
