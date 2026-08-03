import CONFIG_FILE_NAME_REGEX from './configFileNameRegex.js';

describe('Config file name regex', () => {
    it('matches a valid file name (sanity test)', () => {
        const fileName = 'blockedtodo.yaml';
        expect(CONFIG_FILE_NAME_REGEX.test(fileName)).toBe(true);
    });

    it('matches case insensitive', () => {
        const fileName = 'bLOCKedtoDo.yaml';
        expect(CONFIG_FILE_NAME_REGEX.test(fileName)).toBe(true);
    });

    it('matches hidden files', () => {
        const fileName = '.blockedtodo.yaml';
        expect(CONFIG_FILE_NAME_REGEX.test(fileName)).toBe(true);
    });

    it('does not match nested files', () => {
        const fileName = 'parent/.blockedtodo.yaml';
        expect(CONFIG_FILE_NAME_REGEX.test(fileName)).toBe(false);
    });

    it('does not match files that contain a file prefix', () => {
        const fileName = 'sample.blockedtodo.yaml';
        expect(CONFIG_FILE_NAME_REGEX.test(fileName)).toBe(false);
    });

    it('does not match files that contain a file suffix', () => {
        const fileName = 'blockedtodo.yaml.sample';
        expect(CONFIG_FILE_NAME_REGEX.test(fileName)).toBe(false);
    });

    it('only allows full matches', () => {
        const fileName = '.blockedtodoooooooo.yaml';
        expect(CONFIG_FILE_NAME_REGEX.test(fileName)).toBe(false);
    });
});
