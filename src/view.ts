import { ItemView, WorkspaceLeaf } from 'obsidian';
import { createApp, App } from 'vue';
import HtmlCommentsTemplate from './HtmlCommentsTemplate.vue';
import { HtmlCommentsPlugin } from "./plugin";

export const VIEW_TYPE: string = 'html-comments';

export class HtmlCommentsView extends ItemView {
    vueApp: App;
    plugin: HtmlCommentsPlugin;
    constructor(leaf: WorkspaceLeaf, plugin: HtmlCommentsPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Html Comments";
    }

    getIcon(): string {
        return "lines-of-text";
    }

    async onOpen(this: HtmlCommentsView) {
        const container = this.containerEl.children[1];
        container.empty();
        const mountPoint = container.createEl("div", {
            cls: "html-comments"
        });
        this.vueApp = createApp(HtmlCommentsTemplate);
        this.vueApp.config.globalProperties.plugin = this.plugin;
        this.vueApp.config.globalProperties.container = mountPoint;
        this.vueApp.mount(mountPoint);
        // setTimeout(()=> { createApp(Outline).mount(mountPoint) }, 0)
    }

    async onClose() {
    }
    onunload(): void {
        this.vueApp.unmount();
    }

}