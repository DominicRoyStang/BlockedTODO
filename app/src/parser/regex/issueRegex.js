import urlRegex from 'url-regex-safe';
import {escapeRegex} from '../../utils/index.js';

/* URL regex. */
const URL_REGEX = new RegExp('(?<url>' + urlRegex({strict: false}).source + ')').source;

/* g = global: All matches (don't return after first match)
 * m = multi line: Causes ^ and $ to match the begin/end of each line (not only begin/end of string)
 * i = case insensitive match */
const GLOBAL_PATTERN_FLAGS = 'gmi';

const issueRegex = (config) => {
    /* Get prefixes from configuration and escape regex characters to avoid ReDoS attacks.
     * The prefix comes before the issue url eg. BlockedTODO:, Blocked by, NOTIFY: */
    const prefixes = config.comment_prefixes.map(escapeRegex);

    // Create a prefix regex from the list of prefixes in the provided config
    const PREFIX_REGEX = new RegExp('((?<prefix>' + prefixes.join('|') + ')\\s*)').source;

    // Combine the partial regexes into one
    const ISSUE_REGEX = new RegExp(
        [
            PREFIX_REGEX,
            URL_REGEX,
        ].join(''),
        GLOBAL_PATTERN_FLAGS
    );

    return ISSUE_REGEX;
};

export default issueRegex;
