import axios from 'axios';
import auth from '../appAuthentication.js';

export const createAppClient = async () => {
    const {token} = await auth({type: 'app'});

    const client = axios.create({
        baseURL: 'https://api.github.com',
        headers: {
            common: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.machine-man-preview+json',
            }
        }
    });

    client.interceptors.response.use(githubGraphqlErrorInterceptor);

    return client;
};

export const createInstallationClient = async (installationId) => {
    const {token} = await auth({type: 'installation', installationId});

    const client = axios.create({
        baseURL: 'https://api.github.com',
        headers: {
            common: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.machine-man-preview+json',
            }
        }
    });

    client.interceptors.response.use(githubGraphqlErrorInterceptor);

    return client;
};

// GitHub GraphQL errors return a 200 status code and drop errors in response.data.errors
const githubGraphqlErrorInterceptor = (response) => {
    const graphqlErrors = response.data?.errors;
    if (graphqlErrors && graphqlErrors.length > 0) {
        const errorMessages = graphqlErrors.map((error) => error.message);

        const error = new Error(`GitHub request returned the following errors: ${errorMessages}`);
        error.response = response;

        throw error;
    }

    return response;
};
