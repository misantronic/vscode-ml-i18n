import * as vscode from 'vscode';

interface Configuration {
    lang: string;
    platform: number;
    token?: string;
}

export function getConfig() {
    return vscode.workspace.getConfiguration().get<Configuration>('ml.i18n')!;
}
