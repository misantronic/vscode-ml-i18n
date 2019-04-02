import * as vscode from 'vscode';
import { findKey } from './utils';
import { I18nItem } from './api';

export function hoverProvider(items: I18nItem[]) {
    return vscode.languages.registerHoverProvider(
        { scheme: 'file', language: 'typescript' },
        {
            provideHover(document, position) {
                const range = new vscode.Range(
                    new vscode.Position(position.line, 0),
                    new vscode.Position(position.line, 999)
                );

                const code = document.getText(range);

                if (code.includes('__(')) {
                    const [, key] = code.match(/__\('([\w.]+)'\)/) || [, ,];

                    if (key) {
                        const item = findKey(items, key);

                        return {
                            contents: [
                                item
                                    ? `**Translation:** ${item.value}`
                                    : '*No translation found*'
                            ]
                        };
                    }
                }
            }
        }
    );
}
