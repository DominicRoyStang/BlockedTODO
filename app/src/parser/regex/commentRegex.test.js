import COMMENT_REGEX from './commentRegex.js';

describe('JavaScript single-line comments', () => {
    it('matches a basic comment (sanity test)', () => {
        const code = '// hello world';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual([code]);
    });

    it('matches an inline comment', () => {
        const code = 'let x = 5; // hello world';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual(['// hello world']);
    });

    it('matches comments containing a url starting with http://', () => {
        const code = '// http://github.com';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual([code]);
    });

    it('does not match a url outside of a comment', () => {
        const code = 'let website = "http://github.com";';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toBeNull();
    });

    it('matches an inline comment with no spacing between the code and the comment', () => {
        const code = 'let x = 5;//hello world';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual(['//hello world']);
    });

    it('matches two neighbouring single-line comments as one single comment', () => {
        const code = `// BlockedTODO: https://github.com/BlockedTODO/BlockedTODO/issues/57
                      // Do something when the issue is resolved.`;
        const matches = code.match(COMMENT_REGEX);

        expect(matches.length).toBe(1);
        expect(matches).toEqual([code]);
    });

    it('matches two single-line comments on consecutive lines separated by some code as two comments', () => {
        const topComment = '// this code adds two numbers together';
        const inlineComment = '// z is the sum of x and y';
        const code = `${topComment}
                      let z = x + y; ${inlineComment}`;
        const matches = code.match(COMMENT_REGEX);

        expect(matches.length).toBe(2);
        expect(matches).toEqual([topComment, inlineComment]);
    });

    it('correctly handles urls in consecutive single-line comments', () => {
        const comment = `// BlockedTODO: https://github.com/BlockedTODO/BlockedTODO/issues/57
                         // Visit http://github.com when the issue is resolved.`;
        const code = `${comment}
                      let website = "http://github.com
                      ${comment}`;
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual([comment, comment]);
    });
});

describe('JavaScript multi-line comments', () => {
    it('matches a basic comment (sanity test)', () => {
        const code = '/* hello world */';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual([code]);
    });

    it('matches an inline comment', () => {
        const code = 'let x = 5; /* hello world */';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual(['/* hello world */']);
    });

    it('matches a multi-line comment', () => {
        const code = `/* first line
                       * second line */`;
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual([code]);
    });

    it('matches multi-line comments surrounded by code', () => {
        const comment = `/* this comment
                            spans two lines */`;
        const code = `let x = 1;${comment} let y = 2;${comment}let z = x + y;`;
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual([comment, comment]);
    });
});

describe('Python single-line comments', () => {
    it('matches a basic comment (sanity test)', () => {
        const code = '# hello world';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual([code]);
    });

    it('matches an inline comment', () => {
        const code = 'x = 5 # hello world';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual(['# hello world']);
    });

    it('matches comments containing a url starting with http://', () => {
        const code = '# http://github.com';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual([code]);
    });

    it('matches an inline comment with no spacing between the code and the comment', () => {
        const code = 'x = 5#hello world';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual(['#hello world']);
    });

    it('matches two neighbouring single-line comments as one single comment', () => {
        const code = `# BlockedTODO: https://github.com/BlockedTODO/BlockedTODO/issues/57
                      # Do something when the issue is resolved.`;
        const matches = code.match(COMMENT_REGEX);

        expect(matches.length).toBe(1);
        expect(matches).toEqual([code]);
    });

    it('matches two single-line comments on consecutive lines separated by some code as two comments', () => {
        const topComment = '# this code adds two numbers together';
        const inlineComment = '# z is the sum of x and y';
        const code = `${topComment}
                      z = x + y ${inlineComment}`;
        const matches = code.match(COMMENT_REGEX);

        expect(matches.length).toBe(2);
        expect(matches).toEqual([topComment, inlineComment]);
    });
});

describe('Python multi-line comments', () => {
    it('matches a basic comment (sanity test)', () => {
        const code = '""" hello world """';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual([code]);
    });

    it('matches an inline comment', () => {
        const code = 'let x = 5; """ hello world """';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual(['""" hello world """']);
    });

    it('matches a multi-line comment', () => {
        const code = `""" first line
                          second line """`;
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual([code]);
    });
});

describe('HTML comments', () => {
    it('matches a basic comment (sanity test)', () => {
        const code = '<!-- hello world -->';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual([code]);
    });

    it('matches an inline comment', () => {
        const code = '<br /> <!-- hello world -->';
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual(['<!-- hello world -->']);
    });

    it('matches a multi-line comment', () => {
        const code = `<!-- first line
                           second line -->`;
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual([code]);
    });

    it('matches a multi-line comment inside an html <div>', () => {
        const comment = `<!-- first line
                              second line -->`;
        const code = `<div>${comment}</div>`;
        const matches = code.match(COMMENT_REGEX);

        expect(matches).toEqual([comment]);
    });
});
