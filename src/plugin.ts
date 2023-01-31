import { stat } from 'fs';
import { App, Editor, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
import { v4 as uuidv4 } from 'uuid';
import { HtmlCommentsSettings, HtmlCommentsSettingTab, DEFAULT_SETTINGS } from "./settings";
import { state } from "./state";
import { HtmlCommentsView, VIEW_TYPE } from './view';
import { TextToTreeDataParser } from "./comments/TextToTreeDataParser";
import { constantsAndUtils } from './comments/ConstantsAndUtils';

export class HtmlCommentsPlugin extends Plugin {
	settings: HtmlCommentsSettings;
	currentNote: MarkdownView;

	async onload() {
		await this.loadSettings();
		this.registerView(
			VIEW_TYPE,
			(leaf) => new HtmlCommentsView(leaf, this)
		);

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'add-reading-comment',
			name: 'Add reading comment for selection',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selection = editor.getSelection();
				const commentId = uuidv4();
				const replacement = constantsAndUtils.selectionToComment(commentId, selection);
				editor.replaceSelection(replacement);
			}
		});


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new HtmlCommentsSettingTab(this.app, this));

		this.initState();
		this.registerCommand();
		this.registerListener();
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		state.toggleSettingsChanged();
	}

	initState() {
		state.dark = document.body.hasClass("theme-dark");
		state.autoExpand = this.settings.autoExpand;
		state.leafChange = false;
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		state.currentNote = view;
	}

	registerCommand() {
		this.addCommand({
			id: "reading-comments",
			name: "Reading Comments Panel",
			callback: () => {
				this.activateView();
			}
		});
	}

	registerListener() {
		this.registerEvent(this.app.workspace.on('file-open', async (_) => {
			let view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (view) {
				this.currentNote = view;
				this.parseActiveViewToComments();
			}
		}));
	}

	async activateView() {
		if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length === 0) {
			await this.app.workspace.getRightLeaf(false).setViewState({
				type: VIEW_TYPE,
				active: true,
			});
		}
		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
		);
	}

	getActiveView(): MarkdownView {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) {
			return this.currentNote;
		}
		return activeView;
	}

	parseActiveViewToComments() {
		const text = this.getActiveView().getViewData();
		const parsedText = new TextToTreeDataParser(text);
		state.treeOptions = [];
		state.treeOptions = parsedText.parsedComments.treeOptions;
		if (state.autoExpand) {
			const expandedKeys = state.treeOptions.map(it => it.key) as string[];
			state.expandedKeys = expandedKeys;
		}
	}
}

