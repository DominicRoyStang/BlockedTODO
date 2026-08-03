import path from 'path';
import {fileURLToPath} from 'url';

export const filepath = (importMeta) => {
    return importMeta.url ? fileURLToPath(importMeta.url) : '';
};

export const dirpath = (importMeta) => {
    return path.dirname(filepath(importMeta));
};

export const filename = (importMeta) => {
    return path.basename(filepath(importMeta));
};

export const dirname = (importMeta) => {
    return path.basename(dirpath(importMeta));
};

export const resolvePath = path.resolve;
