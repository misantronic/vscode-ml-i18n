import * as vscode from 'vscode';
import { loadList, addEntry } from './api';

export async function addKey(value?: string) {
    const key =
        value ||
        (await vscode.window.showInputBox({
            placeHolder: 'Enter a key...'
        }));

    if (!key) {
        return undefined;
    }

    const i18nItems = await loadList();

    if (i18nItems.some(obj => obj.key === key)) {
        vscode.window.showWarningMessage('The key already exists.');
        return;
    }

    const de = await vscode.window.showInputBox({
        placeHolder: '[DE] Enter text...'
    });

    const en = await vscode.window.showInputBox({
        placeHolder: '[EN] Enter text...'
    });

    try {
        await addEntry(key, { de, en });

        vscode.window.showInformationMessage('The key was successfully added.');
    } catch (e) {
        vscode.window.showErrorMessage(e.errorMessage);
    }
}
