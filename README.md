<p align="left">
    <img src="./docs/assets/blockedtodo-logo-banner.svg" alt="BlockedTODO" width="336">
</p>

_Track, document, and fix technical debt with zero additional effort._

**BlockedTODO** is a repository add-on that tracks issues mentioned in code comments.
It periodically scans your repository for comments with the following format:

> BlockedTODO: \<github issue url\>

When a mentioned issue is closed, BlockedTODO will automatically open a new task on your backlog letting you know the issue is unblocked.

![Screenshot of a task automatically created by BlockedTODO](./docs/assets/task-screenshot.png)

💡 **Pro Tip!** You can change the default comment prefix (see [here](./docs/faq.md#can-i-use-a-different-comment-pattern))

---

## Table of Contents <!-- omit in toc -->
- [Installation](#installation)
- [About](#about)
  - [When would I need this?](#when-would-i-need-this)
  - [Why is this better than subscribing to a GitHub issue?](#why-is-this-better-than-subscribing-to-a-github-issue)
  - [Why can't I just open an issue in my backlog?](#why-cant-i-just-open-an-issue-in-my-backlog)
  - [What is the value proposition?](#what-is-the-value-proposition)
- [Other Questions (FAQ)](#other-questions-faq)
- [The `blockedtodo.yaml` Config File](#the-blockedtodoyaml-config-file)
- [Contribute](#contribute)
  - [Local setup](#local-setup)
- [License](#license)

## Installation
Installing BlockedTODO on your GitHub repository is easy!

1. Visit https://github.com/apps/blockedtodo
2. Click install
3. Select repositories on which to install the GitHub app

## About
### When would I need this?
If you work with lots of dependencies and cutting-edge technologies, odds are that you will eventually end up in a situation where a library you're using is missing a feature for your use case. You look it up on a search engine, and end up landing on an open GitHub issue for the exact feature you are looking for.

Since the issue is still open, you write a not-so-clean workaround in your codebase in the meantime, but you'd like to clean it up once the issue is resolved. BlockedTODO's proposed solution is to do the following:

- Install BlockedTODO on your GitHub repository
- Add a comment in your codebase referring to the open issue and describe what should be done once it's resolved

BlockedTODO will then automatically open an issue on your repository when the watched issue is closed.

### Why is this better than subscribing to a GitHub issue?
For personal repositories, the biggest benefit is that the opened issue gives you context for _why_ you are being notified.
If you subscribed to an issue one year ago and it gets closed today, you'll be notified, but you may not remember why you were following that issue in the first place. BlockedTODO will give you **additional context** to help you recall.

It shows even more benefits for **teams working on a shared codebase**.

Suppose we have a developer _Bob_ who works on a typical development team. Bob subscribes to an open feature request on library X, and in the meantime, writes a workaround in his codebase. One year later, library X addresses the issue and Bob is notified. In all likelihood, by this point, Bob no longer works on that part of the code.

In this situation, he may decide to ignore the notification. If he ignores it, then the company is left with **technical debt** that will probably never be addressed and no explanation for the added complexity in the codebase created by Bob's workaround.

Even worse, if Bob has left the company by the time he gets the notification, then _nobody_ at the company even knows about this unnecessary and **completely untracked** source of complexity left unaddressed in the codebase.

If bob is a better team member and still works at the company, he may instead choose to open an issue on his backlog explaining what work can be done now that library X is updated. If he does that, then he has essentially done **manually** what BlockedTODO could have done for him **automatically**.

### Why can't I just open an issue in my backlog?
This is definitely a good first step. The problem with this approach is that it can pollute your backlog with a bunch of unactionable tasks.

Ideally, a _blocked_ task in your backlog is blocked by another task in your own backlog, meaning that unblocking a task is completely within your control. When it comes to issues on your dependencies' codebases, you have no control over when they will be unblocked.

With BlockedTODO, tasks enter your backlog only after they become actionable.

### What is the value proposition?
BlockedTODO is a dependency monitoring tool that provides convenience via automation.

**Developers are expensive**. This tool automates a non-development task, allowing devs to focus their time on using their valuable coding skills.

**Technical debt is not only expensive, it also [compounds over time](https://dev.to/dealeron/what-s-the-interest-on-your-technical-debt-4pon)!** BlockedTODO minimizes the time your technical debt spends compounding.

## Other Questions (FAQ)
Visit the [FAQ](./docs/faq.md). You can also ask questions by [opening an issue](https://github.com/BlockedTODO/BlockedTODO/issues/new) or [starting a discussion](https://github.com/BlockedTODO/BlockedTODO/discussions/new).

For private inquiries, email blockedtodo@gmail.com

## The `blockedtodo.yaml` Config File
You can add a `blockedtodo.yaml` or `.blockedtodo.yaml` file at the root of the repository to **customize BlockedTODO**.

If no file is specified, it will default to the following configuration:
```yaml
comment_prefixes: # Comment prefixes are case insensitive
  - 'BlockedTODO:'
  - 'NOTIFY:'
  - 'Blocked by'
  - 'Waiting on'
```

More information on the `.blockedtodo.yaml` config file [here](./docs/faq.md#can-i-use-a-different-comment-pattern).

## Contribute
Create feature requests and bug reports by [opening an issue](https://github.com/BlockedTODO/BlockedTODO/issues/new).

Vote on issues by reacting with a thumbs up to the issues that affect you. I use reaction counts to prioritize tasks.

Pull requests are welcome, but please keep in mind that while the code is public, it does not have an open-source license (ie. all rights reserved). This means that any contribution will require you to transfer your IP to BlockedTODO for that contribution.

### Local setup
See [these instructions](./docs/dev_setup.md) to set up and run the codebase locally.

## License

This project is licensed under the Prosperity Public License 3.0.0.

At a high-level, it allows the following use cases:

- Charities and other non-commercial entities are free to use and modify the software, but not to resell it.
- Commercial use of the software is limited to a trial period.

See the [LICENSE](./LICENSE.md) file for details.

If you are looking for a commercial exemption, contact blockedtodo@gmail.com with your request and a short description of your use case. We'll try our best to accommodate.

**Why is this codebase public?** So that companies and individuals can verify/audit that the code is up to their security and privacy standards. It also gives the community a place to open/discuss issues and feature requests.
