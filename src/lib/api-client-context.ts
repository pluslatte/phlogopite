import { api as misskeyApi } from "misskey-js";
import { getContext, setContext } from "svelte";

let clientKey = Symbol('client');

export function setApiClientContext(misskeyApiClient: misskeyApi.APIClient) {
    setContext(clientKey, misskeyApiClient);
}

export function getApiClientContext(): misskeyApi.APIClient {
    return getContext(clientKey) as misskeyApi.APIClient;
}