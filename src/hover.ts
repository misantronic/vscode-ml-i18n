import * as vscode from 'vscode';
import { findKey } from './utils';
import { i18nItems } from './api';
import { validateToken } from './config';

export function hoverProvider() {
    return vscode.languages.registerHoverProvider(
        { scheme: 'file', language: 'typescript' },
        {
            provideHover: async (document, position) => {
                if (!validateToken({ warn: false })) {
                    return;
                }

                const range = new vscode.Range(
                    new vscode.Position(position.line, 0),
                    new vscode.Position(position.line, 999)
                );

                const code = document.getText(range);

                if (code.includes('__(')) {
                    const [, key] = code.match(/__\('([\w.]+)'\)/) || [, ,];

                    if (key) {
                        const item = findKey(i18nItems, key);

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
