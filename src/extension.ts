import * as vscode from 'vscode';
import { searchCommand, addCommand } from './commands';
import { hoverProvider } from './hover';

export async function activate(context: vscode.ExtensionContext) {
    console.log('[vscode-ml-i18n] activated!');

    const searchDisposable = searchCommand();
    const addDisposable = addCommand();
    const hoverDisposable = hoverProvider();

    context.subscriptions.push(
        searchDisposable,
        addDisposable,
        hoverDisposable
    );
}

export function deactivate() {}
