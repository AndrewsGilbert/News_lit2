import {LitElement, html} from 'lit';
import {customElement,property} from 'lit/decorators.js';
import { styleSheet } from './src/styles.js';

type web = {
  id: number;
  name: string;
  url: string;
  selector: Array<string>;
}

@customElement('website-name')
export class WebsiteName extends LitElement {

  static get styles(){
    return styleSheet;
  }

  @property({type:Array})
  web: Array<web> = []

  render(){
    return html`
      ${this.web.map( x => html ` <button class="button nbd${x.id}" @click="${() => this.customEvent(x.id)}"  >${x.name}</button>`)}
  `;}

  customEvent(id: number) {
    const myEvent = new CustomEvent(`showNews${id}`);
    this.dispatchEvent(myEvent);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-name': WebsiteName;
  }
}