import yaml from 'js-yaml';
import {promises as fsPromises} from 'fs';
import {logger, DEFAULT_CONFIG} from '../utils/index.js';
import {CONFIG_FILE_NAME_REGEX} from './regex/index.js';

const getConfig = async (codeFolder) => {
    const rootFiles = await fsPromises.readdir(codeFolder);

    const configFiles = rootFiles.filter((fileName) => CONFIG_FILE_NAME_REGEX.test(fileName));

    if (configFiles.length === 0) {
        logger.info('No config file found. Using default config');
        return DEFAULT_CONFIG;
    }

    if (configFiles.length > 1) {
        logger.warn(`Found more than one valid config file: ${configFiles}. Using the first one.`);
    }

    return await loadConfig(`${codeFolder}/${configFiles[0]}`);
};

// Creates a js object from the provided yaml file, merges it with the default config
const loadConfig = async (filePath) => {
    try {
        const fileContents = await fsPromises.readFile(filePath, {encoding: 'utf-8'});
        const config = yaml.load(fileContents);

        /* Return shallow merge of the object and the default config
         * If we ever add nested objects, we will have to merge each of them
         * to ensure that all keys are optional */
        return {...DEFAULT_CONFIG, ...config};
    } catch (error) {
        logger.error(`An error occurred while parsing config file ${filePath}. Using default config.`, {error});
        return DEFAULT_CONFIG;
    }
};

export default getConfig;
