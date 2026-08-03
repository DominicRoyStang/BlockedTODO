// Config file name
const NAME_REGEX = /\.?blockedtodo/.source;

// Valid extensions: none, yaml, yml
const EXTENSION_REGEX = /(\.yml|\.yaml)?/.source;

// Start of line
const LINE_START = /^/.source;

// End of line
const LINE_END = /$/.source;

/* i = case insensitive match */
const GLOBAL_PATTERN_FLAGS = 'i';

/* Combine the above partial regexes into one */
const CONFIG_FILE_NAME_REGEX = new RegExp(
    [
        LINE_START,
        NAME_REGEX,
        EXTENSION_REGEX,
        LINE_END,
    ].join(''),
    GLOBAL_PATTERN_FLAGS
);

export default CONFIG_FILE_NAME_REGEX;
