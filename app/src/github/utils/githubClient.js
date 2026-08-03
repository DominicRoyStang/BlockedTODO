import axios from 'axios';
import {config} from '../../utils/index.js';

/* Create an axios client for the GitHub REST API, authenticated with the workflow's token. */
const createGithubClient = () => {
    return axios.create({
        baseURL: 'https://api.github.com',
        headers: {
            common: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${config.github.token}`,
                'X-GitHub-Api-Version': '2022-11-28',
            }
        }
    });
};

export default createGithubClient;
