import * as vscode from 'vscode';
import { i18nItems } from './api';
import { filterKeys } from './utils';

export async function search() {
    const input = await vscode.window.showInputBox({
        placeHolder: 'Enter value or key...'
    });

    if (!input) {
        return undefined;
    }

    const results = filterKeys(i18nItems, input);

    if (results.length === 0) {
        vscode.window.showWarningMessage('No results found.');
        return;
    }

    return results;
}
