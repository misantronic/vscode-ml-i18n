import * as vscode from 'vscode';
import { quickPick } from './action-quick-pick';
import { search } from './action-search';
import { getSelectedText } from './utils';
import { addKey } from './action-add-key';

export function searchCommand() {
    return vscode.commands.registerCommand('ml.i18n.search', async () => {
        const results = await search();

        if (!results) {
            return;
        }

        quickPick(results);
    });
}

export function addCommand() {
    return vscode.commands.registerCommand('ml.i18n.add', async () => {
        const value = getSelectedText();

        addKey(value);
    });
}
