export const getConfig = (newsletter) => {
    const defaultConfig = {
        urlTemplate: '',
        elementsToRemove: [],
    };

    switch (newsletter) {
        case 'frontendfoc.us':
        case 'javascriptweekly.com':
        case 'nodeweekly.com':
        case 'react.statuscode.com':
            return {
                ...defaultConfig,
                urlTemplate: `https://${newsletter}/issues/{issue}`,
                elementsToRemove: [
                    'header.contained',
                    'script',
                    'style',
                    'link',
                    'div.nomobile',
                    'form',
                    'table[ok]',
                    'table.norss',
                    'table.el-masthead',
                    'div.pager',
                    'table.el-fullwidthimage',
                    'table.el-splitbar',
                    'img',
                ],
            };
        case 'bytes.dev':
            return {
                ...defaultConfig,
                urlTemplate: `https://${newsletter}/archives/{issue}`,
            };
        case 'thisweekinreact.com':
            return {
                ...defaultConfig,
                urlTemplate: `https://${newsletter}/newsletter/{issue}`,
                elementsToRemove: [
                    'div[role="region"]',
                    'div.card',
                    'ul.table-of-contents',
                    'header',
                    'footer',
                    'nav',
                    'aside',
                    'img',
                ],
            };
        default:
            return defaultConfig;
    }
};
