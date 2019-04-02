import * as vscode from 'vscode';
import { searchCommand, addCommand } from './commands';
import { hoverProvider } from './hover';
import { onDidUpdateConfiguration } from './api';

export async function activate(context: vscode.ExtensionContext) {
    console.log('[vscode-ml-i18n] activated!');

    const configDisposable = onDidUpdateConfiguration();
    const searchDisposable = searchCommand();
    const addDisposable = addCommand();
    const hoverDisposable = hoverProvider();

    context.subscriptions.push(
        configDisposable,
        searchDisposable,
        addDisposable,
        hoverDisposable
    );
}

export function deactivate() {}
