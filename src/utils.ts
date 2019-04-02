import * as vscode from 'vscode';
import { I18nItem } from './api';

export function getSelectedText() {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const selection = editor.selection;

        return editor.document.getText(selection);
    }

    return undefined;
}

export function findKey(items: I18nItem[], input: string) {
    return items.find(obj => obj.key === input);
}

export function filterKeys(items: I18nItem[], input: string) {
    return items.filter(obj => {
        return (
            obj.key.search(new RegExp(input, 'i')) > -1 ||
            obj.value.search(new RegExp(input, 'i')) > -1
        );
    });
}
