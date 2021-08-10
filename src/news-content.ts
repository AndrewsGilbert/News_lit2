import {LitElement, html} from 'lit';
import {customElement,property} from 'lit/decorators.js';
import { styleSheet } from './src/styles.js';

type newsContent = {
    text: string;
    audio: string;
  }

@customElement('news-content')
export class NewsContent extends LitElement {

  static get styles(){
    return styleSheet;
  }

  @property({type:String})
  webname = ''

  @property({type:Array})
  newsDet: Array<newsContent> = []

  render(){
    return html`
      <h2 class="subhead" >The News from ${this.webname}</h2>
      <div class="ntext">
      <ul>
      ${this.newsDet.map(y => html`<li>${y.text}</li><br>`)}
      </ul>
      </div>
  `;}
}

declare global {
  interface HTMLElementTagNameMap {
    'news-content': NewsContent;
  }
}