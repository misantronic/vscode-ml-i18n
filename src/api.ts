import * as request from 'request';
import * as vscode from 'vscode';
import { getConfig } from './config';

export interface I18nItem {
    key: string;
    value: string;
}

interface Language {
    databaseId: number;
    optlock: number;
    name: string;
    regionCode: string;
    languageCode: string;
}

const API_URL = 'https://i18n.magicline.com/localization-api';

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        Authorization: `Basic ${getConfig().token}`
    };
}

export const i18nItems: I18nItem[] = [];

export function onDidUpdateConfiguration() {
    async function load() {
        const items = await loadList();

        i18nItems.push(...items);
    }

    load();

    return vscode.workspace.onDidChangeConfiguration(load);
}

async function loadList() {
    const languages = await loadLanguages();

    return new Promise<I18nItem[]>((resolve, reject) => {
        const { platform, lang } = getConfig();
        const language = languages.find(l => l.languageCode === lang);
        const defaultLanguage = languages.find(l => l.languageCode === 'de')!;

        if (!language) {
            reject(`language ${lang} not found.`);
            return;
        }

        const languageId = language.databaseId;

        request(
            `${API_URL}/entry/list?platform%5B%5D=${platform}`,
            {
                headers: getHeaders()
            },
            (error, response, body) => {
                if (error) {
                    reject(error);
                } else if (response.statusCode === 200) {
                    const jsonBody = JSON.parse(body);

                    resolve(
                        jsonBody.map((item: any) => {
                            const translation = item.translations.find(
                                (t: any) => t.languageId === languageId
                            );
                            const fallbackTranslation = item.translations.find(
                                (t: any) =>
                                    t.languageId === defaultLanguage.databaseId
                            );

                            return {
                                key: item.key,
                                value: translation
                                    ? translation.value
                                    : `[DE: ${fallbackTranslation.value}]`
                            };
                        })
                    );
                }
            }
        );
    });
}

export function loadLanguages() {
    return new Promise<Language[]>((resolve, reject) => {
        request(
            `${API_URL}/language`,
            {
                headers: getHeaders()
            },
            (error, response, body) => {
                if (error) {
                    reject(error);
                } else if (response.statusCode === 200) {
                    resolve(JSON.parse(body));
                } else {
                    reject(JSON.parse(body));
                }
            }
        );
    });
}

export async function addEntry(
    key: string,
    texts: { [code: string]: string | undefined }
) {
    const languages = await loadLanguages();

    return new Promise((resolve, reject) => {
        const { platform } = getConfig();
        const listPlatformTranslations = Object.entries(texts)
            .filter(([_, value]) => Boolean(value))
            .map(([code, value]) => {
                return {
                    platform,
                    translation: {
                        language: languages.find(
                            lang => lang.languageCode === code
                        ),
                        databaseId: null,
                        optlock: 0,
                        value,
                        _isCustomerApiTranslation: false
                    }
                };
            });

        const data = {
            key,
            optlock: 0,
            listPlatformTranslations
        };

        request.post(
            `${API_URL}/entry`,
            {
                headers: getHeaders(),
                body: JSON.stringify(data)
            },
            (error, response, body) => {
                if (error) {
                    reject(error);
                } else if (response.statusCode === 200) {
                    resolve(JSON.parse(body));
                } else {
                    reject(JSON.parse(body));
                }
            }
        );
    });
}
