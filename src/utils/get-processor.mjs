import { processBytesNewsletter } from '../processors/bytesdev.mjs';
import { processCooperpressNewsletter } from '../processors/cooperpress.mjs';
import { processThisweekinreactNewsletter } from '../processors/thisweekinreact.mjs';

export const getProcessor = (newsletter) => {
    switch (newsletter) {
        case 'frontendfoc.us':
        case 'javascriptweekly.com':
        case 'nodeweekly.com':
        case 'react.statuscode.com':
            return processCooperpressNewsletter;
        case 'bytes.dev':
            return processBytesNewsletter;
        case 'thisweekinreact.com':
            return processThisweekinreactNewsletter;
        default:
            return null;
    }
};
