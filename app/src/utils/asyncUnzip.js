import fs from 'fs';
import unzipper from 'unzipper';
import logger from './logger.js';

/* Promisify stream unzip function so we can use it with async/await */
const asyncUnzip = (zipFile, outputPath) => {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(zipFile)
            .pipe(unzipper.Extract({path: outputPath}));

        stream.on('close', () => {
            logger.info(`file unzipped into: ${outputPath}`);
            resolve(outputPath);
        });
    });
};

export default asyncUnzip;
