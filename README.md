# join-comment-aware

`join-comment-aware` will join lines and remove extraneous comment indicators. Previously when joining lines (e.g. via `ctrl+j` or `shift+j` in vim mode), comment characters are kept and you'll have to remove them manually.

![demo](images/demo.gif)

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

## Suggested Installation

This isn't available through the vscode standard installation. You can install it manually by downloading a zip of this repo and [adding it to your extensions directory](https://code.visualstudio.com/docs/extensions/example-hello-world#_installing-your-extension-locally).

I'd recommend replacing your normal join command (e.g. `ctrl+j` or `shift+j` in vim mode) with `join-comment-aware`. If a file type isn't recognized, it performs the default behavior as before.

To replace the default join command *without* vim mode (`ctrl+j`), add this to your `keybindings.json`:
```
[
  ...
  {
    "key": "ctrl+j",
    "command": "extensions.joinCommentAware",
    "when": "terminalFocus"
  }
]
```

To replace the default join command *with* vim mode (`shift+j`), add this to your `settings.json`:
```
{
  ...
  "vim.otherModesKeyBindingsNonRecursive": [
    {
      "before": ["J"],
      "after": [],
      "commands": [
        {
          "command": "extension.joinCommentAware",
          "args": []
        }
      ]
    }
  ]
}
```


## Known Issues

The following file types are supported with comment-awareness joining. Otherwise, default join behavior will take over.

- ruby
- python
- javascript
- java
- json
- csharp
- cpp
- go
- php

## Release Notes

Initial join-comment-aware release.

## Motivation

I've been thinking about switching from vim to vscode and noticed the line-joiner could use some improvement. And I saw [this issue](https://github.com/Microsoft/vscode/issues/17553) that other folks have the same feedback. I also was inspired by the [original vscode join](https://github.com/wmaurer/vscode-join-lines), which got integrated directly into the editor.

### 0.0.2

Add icons. Update version so VS Marketplace can udpate.

### 0.0.1

Initial release of `join-comment-aware`
