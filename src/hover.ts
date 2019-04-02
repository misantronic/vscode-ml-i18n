import * as vscode from 'vscode';
import { findKey } from './utils';
import { I18nItem, loadList } from './api';
import { validateToken } from './config';

const i18nItems: I18nItem[] = [];

export function hoverProvider() {
    return vscode.languages.registerHoverProvider(
        { scheme: 'file', language: 'typescript' },
        {
            provideHover: async (document, position) => {
                if (validateToken({ warn: false })) {
                    if (i18nItems.length === 0) {
                        const items = await loadList();

                        i18nItems.push(...items);
                    }
                } else {
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
