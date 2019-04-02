import * as vscode from 'vscode';

interface Configuration {
    lang: string;
    platform: number;
    token?: string;
}

export function getConfig() {
    return vscode.workspace.getConfiguration().get<Configuration>('ml.i18n')!;
}

export function validateToken(options = { warn: true }) {
    const { token } = getConfig();

    if (!token) {
        if (options.warn) {
            vscode.window.showWarningMessage(
                `Please provide a token to vscode-ml-i18n`
            );
        }
        return false;
    }

    return true;
}
