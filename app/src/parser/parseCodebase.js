import {promises as fsPromises} from 'fs';
import path from 'path';
import {globby} from 'globby';
import {logger} from '../utils/index.js';
import {COMMENT_REGEX, issueRegex} from './regex/index.js';
import getConfig from './getConfig.js';

/* Return array of issue urls that match the issue regex in a single comment */
const scanComment = (comment, config) => {
    const results = comment.matchAll(issueRegex(config));
    const issueUrls = [];
    for (const result of results) {
        issueUrls.push(result.groups.url);
    }
    return issueUrls;
};

/* Scans one file for comments that match the proper regexes
 * returns an array of objects with the following structure{<url>: {filePath, comment}} */
const scanOneFile = async (file, config) => {
    try {
        logger.info(`Gathering comments from file: ${file}`);
        const contents = await fsPromises.readFile(file, {encoding: 'utf-8'});
        const fileComments = contents.match(COMMENT_REGEX) || [];

        const fileIssueUrls = [];
        for (const comment of fileComments) {
            const commentIssueUrls = scanComment(comment, config);
            commentIssueUrls.forEach((url) => {
                fileIssueUrls.push({[url]: {filePath: file, comment: comment}});
            });
        }
        return fileIssueUrls;
    } catch (error) {
        logger.error(`Error occurred while reading file ${file}`, {error});
        throw error;
    }
};

/* Create a set of issue URLs from a list of settled promises (no duplicates),
 * represented as an object with the following structure: {<url>: [{file, comment}]} */
const mergeScanResults = (results, codeFolder) => {
    const referencedIssues = {};
    for (const {status, value: urlList} of results) {
        if (status !== 'fulfilled' || !urlList) {
            continue;
        }

        for (const urlObject of urlList) {
            for (const [key, commentDetails] of Object.entries(urlObject)) {
                const relativeCommentDetails = {
                    file: path.relative(codeFolder, commentDetails.filePath),
                    comment: commentDetails.comment,
                };
                if (key in referencedIssues) {
                    referencedIssues[key].push(relativeCommentDetails);
                } else {
                    referencedIssues[key] = [relativeCommentDetails];
                }
            }
        }
    }

    return referencedIssues;
};

/* Take in a path to a codebase, return a set of issue URLs */
const parseCodebase = async (codeFolder) => {
    // Absolute cwd required for globby gitignore (relative `..` paths break ignore)
    codeFolder = path.resolve(codeFolder);

    const config = await getConfig(codeFolder);
    logger.info({config});

    const filesToScan = await globby('**/*', {cwd: codeFolder, gitignore: true, absolute: true});
    logger.info(`files to scan: ${filesToScan}`);

    // Create promises for each file to scan
    const scanPromises = filesToScan.map((file) => scanOneFile(file, config));

    // Scan all files asynchronously, continue when all files are scanned.
    const results = await Promise.allSettled(scanPromises);

    return mergeScanResults(results, codeFolder);
};

export default parseCodebase;
