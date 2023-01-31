import { App, PluginSettingTab, Setting } from 'obsidian';

import { HtmlCommentsPlugin } from "./plugin";
import { state } from './state';

export interface HtmlCommentsSettings {
    autoExpand: boolean;
    commentedTextColorLight: string;
    commentedTextColorDark: string;
    commentColorLight: string;
    commentColorDark: string;
}

export const DEFAULT_SETTINGS: HtmlCommentsSettings = {
    autoExpand: false,
    commentedTextColorLight: "#f16e6e",
    commentedTextColorDark: "#585809",
    commentColorLight: "#f3f367",
    commentColorDark: "#330202"
}

export class HtmlCommentsSettingTab extends PluginSettingTab {
    plugin: HtmlCommentsPlugin;

    constructor(app: App, plugin: HtmlCommentsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Settings for Reading comments plugin.' });

        new Setting(containerEl)
            .setName('Auto Expand Tags')
            .setDesc('Automatically expand all tags')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoExpand)
                .onChange(
                    async (value) => {
                        this.plugin.settings.autoExpand = value;
                        state.expandedKeys = [];
                        await this.plugin.saveSettings();
                    }
                )
            );

            new Setting(containerEl)
            .setName("Set Commented Text Color Light/Dark")
            .addColorPicker(color => color
                .setValue(this.plugin.settings.commentedTextColorLight)
                .onChange(async (value) => {
                    this.plugin.settings.commentedTextColorLight = value;
                    this.plugin.saveSettings();
                })
            )
            .addColorPicker(color => color
                .setValue(this.plugin.settings.commentedTextColorDark)
                .onChange(async (value) => {
                    this.plugin.settings.commentedTextColorDark = value;
                    this.plugin.saveSettings();
                })
            );

            new Setting(containerEl)
            .setName("Set Comment Color Light/Dark")
            .addColorPicker(color => color
                .setValue(this.plugin.settings.commentColorLight)
                .onChange(async (value) => {
                    this.plugin.settings.commentedTextColorLight = value;
                    this.plugin.saveSettings();
                })
            )
            .addColorPicker(color => color
                .setValue(this.plugin.settings.commentColorDark)
                .onChange(async (value) => {
                    this.plugin.settings.commentedTextColorDark = value;
                    this.plugin.saveSettings();
                })
            );
    }
}
