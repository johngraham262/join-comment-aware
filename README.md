# join-comment-aware README

`join-comment-aware` will join lines and remove extraneous comment indicators. Normally when joining lines (e.g. via `ctrl+j` or `shift+j` in vim mode), comment characters are kept and you'll have to remove them manually.

Lines to join:

```
# This is a comment
# and this is the 2nd line
```

Old join style: 

```
# This is a comment # and this is the 2nd line
```

New join functionality:

```
# This is a comment and this is the 2nd line
```

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Suggested Installation

I'd recomment replacing your normal join command (e.g. `ctrl+j` or `shift+j` in vim mode) with `join-comment-aware`. If a file type isn't recognized, it performs the default behavior as before.

## Known Issues

Only supports a few file-types at the moment.

## Release Notes

Initial join-comment-aware release.

### 1.0.0

Initial release of `join-comment-aware`