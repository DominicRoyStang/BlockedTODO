# FAQ  <!-- omit in toc -->
Frequently Asked Questions

## Table of Contents <!-- omit in toc -->
- [What data does BlockedTODO store?](#what-data-does-blockedtodo-store)
- [Can I use a different comment pattern?](#can-i-use-a-different-comment-pattern)
- [Can it support other issue sources?](#can-it-support-other-issue-sources)
- [Can it create tasks on another service?](#can-it-create-tasks-on-another-service)
- [Can I install this on my GitLab/Bitbucket repository?](#can-i-install-this-on-my-gitlabbitbucket-repository)
- [What technologies does BlockedTODO use?](#what-technologies-does-blockedtodo-use)
- [Are there any other reasons to use BlockedTODO that you couldn't find space to mention elsewhere?](#are-there-any-other-reasons-to-use-blockedtodo-that-you-couldnt-find-space-to-mention-elsewhere)

## What data does BlockedTODO store?
State lives in a SQLite database that is stored as a GitHub Actions artifact in _your_ repository. It tracks issue URLs mentioned in your comments and the notification issues BlockedTODO creates. Your source code is only read on your own Actions runners.

If the database artifact is missing or was created with an incompatible schema, BlockedTODO rebuilds it and rehydrates notification state from existing `Unblocked TODO` issues in your repository so it does not create duplicates. You can still delete the `blockedtodo-database` artifact manually if you want to force a rebuild.

## Can I use a different comment pattern?
Yes! By default, BlockedTODO will match the following prefixes:
- `BlockedTODO:`
- `NOTIFY:`
- `Blocked by`
- `Waiting on`

To override these defaults, all you need to do is add a `.blockedtodo.yaml` file at the root of your repository and append the following text:

```yaml
comment_prefixes: # Prefixes are case insensitive
  - 'BlockedTODO:'
  - 'My custom prefix'
  - 'NOTIFY:'
```

The file name is case insensitive and the file extension is optional. _If specified, the file extension must be either `.yml` or `.yaml`._

You can even match all URLs in comments by allowing the _empty string_ prefix:

```yaml
comment_prefixes:
  - ''
```

## Can it support other issue sources?
Supporting other issue sources such as google bugtracker and Jira instances is definitely something I would like to support in the future.

In the short term, however, focus will remain on polishing the experience with GitHub issues.

## Can it create tasks on another service?
Eventually, I would like to support other task destinations such as Jira and Trello. For now, the focus is on polishing the GitHub experience.

## Can I install this on my GitLab/Bitbucket repository?
At the moment, BlockedTODO is only available as a GitHub Action. Supporting other repository hosts is a long-term goal.

## What technologies does BlockedTODO use?
Here are some of the main ones:

- **Runtime**: JavaScript (Node.js) GitHub Action
- **Database**: [SQLite](https://www.sqlite.org/) with [Knex](https://knexjs.org/) and [Objection](https://vincit.github.io/objection.js/)
- **CI**: [GitHub Actions](https://github.com/features/actions)

## Are there any other reasons to use BlockedTODO that you couldn't find space to mention elsewhere?

What a great question! 😉

On top of the benefits mentioned in the README, using BlockedTODO across a codebase encourages good commenting habits. [Good comments explain _why_, not _what_](https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/). By providing a comment with a short explanation for the presence of your workaround along with a link to an issue with more details, you are giving the reader all the context they need to understand the code.

_With BlockedTODO, you can track, document, and fix technical debt with no overhead._
