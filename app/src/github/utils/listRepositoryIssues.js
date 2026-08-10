/* List repository issues (not pull requests), newest first, across all pages. */
const listRepositoryIssues = async (githubClient, repository, {state = 'all', perPage = 100} = {}) => {
    const issues = [];
    let page = 1;
    let pageSize = perPage;

    while (pageSize === perPage) {
        const response = await githubClient.get(`/repos/${repository}/issues`, {
            params: {
                state,
                per_page: perPage,
                page,
                direction: 'desc',
                sort: 'created',
            },
        });

        pageSize = response.data.length;
        issues.push(...response.data.filter((issue) => !issue.pull_request));
        page += 1;
    }

    return issues;
};

export default listRepositoryIssues;
