import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import { styleSheet } from './src/styles.js';

@customElement('header-1')
export class Header extends LitElement {

  static get styles(){
    return styleSheet;
  }

  render(){
    return html`
      <h1>News Mission</h1>
      <h2 class="head">Welcome to News Misson</h2>
      <button class="button newsclick" @click="${() => this.customEvent()}">Click here for select the website to view the Headline News</button><br><br>
  `;}
    
  customEvent() {
    const myEvent = new CustomEvent('showWebsiteName');
    this.dispatchEvent(myEvent);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'header-1': Header;
  }
}