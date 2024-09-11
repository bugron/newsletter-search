import { fetchBytesDevNewsletter } from '../fetchers/bytesdev.mjs';
import { fetchCooperpressNewsletter } from '../fetchers/cooperpress.mjs';

export const getFetcher = (newsletter) => {
    switch (newsletter) {
        case 'frontendfoc.us':
        case 'javascriptweekly.com':
        case 'nodeweekly.com':
        case 'react.statuscode.com':
            return fetchCooperpressNewsletter;
        case 'bytes.dev':
            return fetchBytesDevNewsletter;
        default:
            return null;
    }
};
