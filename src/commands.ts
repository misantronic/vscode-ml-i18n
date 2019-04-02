import * as vscode from 'vscode';
import { quickPick } from './action-quick-pick';
import { search } from './action-search';
import { getSelectedText } from './utils';
import { addKey } from './action-add-key';
import { validateToken } from './config';

export function searchCommand() {
    return vscode.commands.registerCommand('ml.i18n.search', async () => {
        if (!validateToken()) {
            return;
        }

        const results = await search();

        if (!results) {
            return;
        }

        quickPick(results);
    });
}

export function addCommand() {
    return vscode.commands.registerCommand('ml.i18n.add', async () => {
        if (!validateToken()) {
            return;
        }

        const value = getSelectedText();

        addKey(value);
    });
}
