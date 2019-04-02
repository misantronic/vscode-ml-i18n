import * as vscode from 'vscode';
import { loadList } from './api';
import { filterKeys } from './utils';

export async function search() {
    const input = await vscode.window.showInputBox({
        placeHolder: 'Enter value or key...'
    });

    if (!input) {
        return undefined;
    }

    const i18nItems = await loadList();
    const results = filterKeys(i18nItems, input);

    if (results.length === 0) {
        vscode.window.showWarningMessage('No results found.');
        return;
    }

    return results;
}
