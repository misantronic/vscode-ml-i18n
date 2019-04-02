import * as vscode from 'vscode';
import * as ncp from 'copy-paste';
import { I18nItem } from './api';

export async function quickPick(i18nItems: I18nItem[]) {
    const quickpickItems = i18nItems.map<vscode.QuickPickItem>(obj => ({
        description: obj.value,
        label: obj.key
    }));

    const pick = await vscode.window.showQuickPick(quickpickItems, {
        placeHolder: 'Pick an item and the key will be copied to clipboard'
    });

    if (!pick) {
        return;
    }

    ncp.copy(pick.label);

    vscode.window.showInformationMessage(`Copied i18n-key to clipboard.`);
}
