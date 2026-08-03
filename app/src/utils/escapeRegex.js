/* Escape user input to be treated as a literal string within a regular expression
 * Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping */
const escapeRegex = (string) => {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

export default escapeRegex;
