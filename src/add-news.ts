import {LitElement, html} from 'lit';
import {customElement,property} from 'lit/decorators.js';
import { styleSheet } from './src/styles.js';

@customElement('add-news')
export class AddNews extends LitElement {

  static get styles(){
    return styleSheet;
  }

  @property({type:Number})
  webid = 0
  
  render(){
    return html`
      <input class="addnewsinput" type="text" >
      <button class="text font2 tc${this.webid}" @click="${() => this.customEvent()}"   >Add News</button><br> 
  `;}

  customEvent() {
    const myEvent = new CustomEvent('addNews');
    this.dispatchEvent(myEvent);
  }
}

declare global {
    interface HTMLElementTagNameMap {
      'add-news': AddNews;
    }
  }