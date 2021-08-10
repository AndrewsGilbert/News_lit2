import {LitElement, html} from 'lit';
import {customElement,property} from 'lit/decorators.js';
import { styleSheet } from './src/styles.js';

@customElement('next-process')
export class NextProcess extends LitElement {

    static get styles(){
    return styleSheet;
    }

    @property({type:Number})
    webid = 0

    render(){
        return html`
            <button class="text font2 tc${this.webid}" @click="${() => this.customEvent('audioGen')}"  >Generate Audio</button>
            <button class="text font2 tc${this.webid}" @click="${() => this.customEvent('videoGen')}" >Generate Video</button>
            <button class="text font2 tc${this.webid}" @click="${() => this.customEvent('postVideo')}"  >Post Video</button>
    `;}

    customEvent(ename: string) {
        const myEvent = new CustomEvent(ename);
        this.dispatchEvent(myEvent);
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'next-process': NextProcess;
    }
}