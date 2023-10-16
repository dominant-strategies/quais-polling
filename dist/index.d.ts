declare const pollFor: (
    provider: any, // Replace 'any' with the actual type of 'provider' if known
    methodName: string,
    params: any[], // Replace 'any' with the actual type of elements in 'params' if known
    initialPollingInterval: number,
    requestTimeout: number,
    max_duration_seconds?: number,
    max_polling_interval?: number
) => Promise<any>; // Replace 'any' with the actual type of the promise result if known

export { pollFor };
