import path from 'path';
import {fileURLToPath} from 'url';
import {filepath, dirpath, filename, dirname, resolvePath} from './pathHelpers.js';

const thisFile = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);

describe('filepath', () => {
    it('returns the absolute path to the current file', () => {
        expect(filepath(import.meta)).toEqual(thisFile);
    });
});

describe('dirpath', () => {
    it('returns the absolute path to the current file\'s parent directory', () => {
        expect(dirpath(import.meta)).toEqual(thisDir);
    });
});

describe('filename', () => {
    it('returns the name of the current file', () => {
        expect(filename(import.meta)).toEqual('pathHelpers.test.js');
    });
});

describe('dirname', () => {
    it('returns the name of the current file\'s parent directory', () => {
        expect(dirname(import.meta)).toEqual('utils');
    });
});

describe('resolvePath', () => {
    it('resolves a path from its components', () => {
        const resolvedPath = resolvePath(dirpath(import.meta), filename(import.meta));
        expect(resolvedPath).toEqual(thisFile);
    });
});
