"use strict";
import * as vscode from "vscode";
const whitespaceAtEndOfLine = /\s*$/;

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "joinCommentAware.join",
    () => {
      var textEditor = vscode.window.activeTextEditor;
      const document = textEditor.document;

      const newSelections: {
        numLinesRemoved: number;
        selection: vscode.Selection;
      }[] = [];

      textEditor
        .edit((editBuilder) => {
          textEditor.selections
            .filter(
              (selection) => selection.end.line !== document.lineCount - 1
            )
            .forEach((selection) => {
              if (isRangeSimplyCursorPosition(selection)) {
                const newSelectionEnd =
                  document.lineAt(selection.start.line).range.end.character -
                  joinLineWithNext(selection.start.line, editBuilder, document)
                    .whitespaceLengthAtEnd;
                newSelections.push({
                  numLinesRemoved: 1,
                  selection: new vscode.Selection(
                    selection.start.line,
                    newSelectionEnd,
                    selection.end.line,
                    newSelectionEnd
                  ),
                });
              } else if (isRangeOnOneLine(selection)) {
                joinLineWithNext(selection.start.line, editBuilder, document);
                newSelections.push({ numLinesRemoved: 1, selection });
              } else {
                const numberOfCharactersOnFirstLine = document.lineAt(
                  selection.start.line
                ).range.end.character;
                let endCharacterOffset = 0;
                for (
                  let lineIndex = selection.start.line;
                  lineIndex <= selection.end.line - 1;
                  lineIndex++
                ) {
                  const charactersInLine =
                    lineIndex == selection.end.line - 1
                      ? selection.end.character + 1
                      : document.lineAt(lineIndex + 1).range.end.character + 1;
                  const whitespaceLengths = joinLineWithNext(
                    lineIndex,
                    editBuilder,
                    document
                  );
                  endCharacterOffset +=
                    charactersInLine -
                    whitespaceLengths.whitespaceLengthAtEnd -
                    whitespaceLengths.whitespaceLengthAtStart;
                }
                newSelections.push({
                  numLinesRemoved: selection.end.line - selection.start.line,
                  selection: new vscode.Selection(
                    selection.start.line,
                    selection.start.character,
                    selection.start.line,
                    numberOfCharactersOnFirstLine + endCharacterOffset
                  ),
                });
              }
            });
        })
        .then(() => {
          const selections = newSelections.map((x, i) => {
            const { numLinesRemoved, selection } = x;
            const numPreviousLinesRemoved =
              i == 0
                ? 0
                : newSelections
                    .slice(0, i)
                    .map((x) => x.numLinesRemoved)
                    .reduce((a, b) => a + b);
            const newLineNumber =
              selection.start.line - numPreviousLinesRemoved;
            return new vscode.Selection(
              newLineNumber,
              selection.start.character,
              newLineNumber,
              selection.end.character
            );
          });

          if (selections.length > 0) {
            textEditor.selections = selections;
          }
        });
    }
  );

  context.subscriptions.push(disposable);
}

function isRangeOnOneLine(range: vscode.Range): boolean {
  return range.start.line === range.end.line;
}

function isRangeSimplyCursorPosition(range: vscode.Range): boolean {
  return (
    isRangeOnOneLine(range) && range.start.character === range.end.character
  );
}

function textBeginsWithComment(regex: RegExp, text: string): boolean {
]  return regex.test(text);
}

function joinLineWithNext(
  line: number,
  editBuilder: vscode.TextEditorEdit,
  document: vscode.TextDocument
): { whitespaceLengthAtEnd: number; whitespaceLengthAtStart: number } {
  const matchWhitespaceAtEnd = document
    .lineAt(line)
    .text.match(whitespaceAtEndOfLine);

  var line1 = document.lineAt(line);
  var line2 = document.lineAt(line + 1);

  var locationOfFirstNonCommentCharacter =
    line2.firstNonWhitespaceCharacterIndex;
  const commentRegex = commentRegexByLanguage(document.languageId);
  if (
    commentRegex &&
    textBeginsWithComment(commentRegex, line1.text)
  ) {
    // If first line is a comment, remove preceding comment block
    // (or white space) on the following line.
    if (textBeginsWithComment(commentRegex, line2.text)) {
      locationOfFirstNonCommentCharacter =
        line2.text.length -
        line2.text.replace(commentRegex, "")
          .length;
    } else {
      locationOfFirstNonCommentCharacter =
        line2.text.length - line2.text.replace(/^\s*/, "").length;
    }
  }

  const range = new vscode.Range(
    line,
    document.lineAt(line).range.end.character - matchWhitespaceAtEnd[0].length,
    line + 1,
    locationOfFirstNonCommentCharacter
  );

  editBuilder.replace(range, " ");
  return {
    whitespaceLengthAtEnd: matchWhitespaceAtEnd[0].length,
    whitespaceLengthAtStart: document.lineAt(line + 1)
      .firstNonWhitespaceCharacterIndex,
  };
}

// Supported languages:
//   https://code.visualstudio.com/docs/languages/identifiers
function commentRegexByLanguage(languageId: string): RegExp | null {
  switch (languageId) {
    case "ruby":
      return /^[#|\s*]*#[#|\s*]*/;
    case "python":
      return /^["""|#|\s*]*["""|#]["""|#|\s*]/;
    case "cpp":
    case "csharp":
    case "go":
    case "java":
    case "javascript":
    case "json":
    case "php":
      return /^[(\/\/)|\s]*(\/\/)[(\/\/)|\s]*/;
  }
  return null;
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
