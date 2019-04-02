import * as vscode from 'vscode';
import { loadList } from './api';
import { searchCommand, addCommand } from './commands';
import { hoverProvider } from './hover';
import { getConfig } from './config';

export async function activate(context: vscode.ExtensionContext) {
    const { token } = getConfig();

    if (!token) {
        vscode.window.showErrorMessage(
            `Please provide a token to vscode-ml-i18n`
        );
        return;
    }

    const i18nItems = await loadList();

    console.log('[vscode-ml-i18n] activated!');

    const searchDisposable = searchCommand();
    const addDisposable = addCommand();
    const hoverDisposable = hoverProvider(i18nItems);

    context.subscriptions.push(
        searchDisposable,
        addDisposable,
        hoverDisposable
    );
}

export function deactivate() {}
