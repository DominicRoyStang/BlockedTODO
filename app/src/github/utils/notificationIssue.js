const NOTIFICATION_TITLE_PREFIX = 'Unblocked TODO:';
const LINK_LINE_REGEX = /^Link to closed issue:\s*(\S+)/m;
const TITLE_PATHNAME_REGEX = /^Unblocked TODO:\s*(\/.+\/issues\/\d+)\s+was closed\.$/;

export const isNotificationIssueTitle = (title) => Boolean(title?.startsWith(NOTIFICATION_TITLE_PREFIX));

export const notificationIssueTitle = (pathname) => `${NOTIFICATION_TITLE_PREFIX} ${pathname} was closed.`;

/* Prefer the body link; fall back to the deterministic title pathname. */
export const extractWatchedIssueUrl = ({title, body} = {}) => {
    const fromBody = body?.match(LINK_LINE_REGEX)?.[1];
    if (fromBody) {
        return fromBody;
    }

    const pathname = title?.match(TITLE_PATHNAME_REGEX)?.[1];
    if (pathname) {
        return `https://github.com${pathname}`;
    }

    return null;
};
