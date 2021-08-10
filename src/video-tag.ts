import {LitElement, html} from 'lit';
import {customElement,property} from 'lit/decorators.js';
import { styleSheet } from './src/styles.js';

@customElement('video-tag')
export class VideoTag extends LitElement {

  static get styles(){
    return styleSheet;
  }

  @property({type:String})
  filename = ''

  render(){
    return html`
      <h2 class="subhead" >The Generated Video</h2>
      <video controls="controls" type="video/mp4" class="video" src="http://localhost:8588/${this.filename}" ></video>
  `;}
}

declare global {
  interface HTMLElementTagNameMap {
    'video-tag': VideoTag;
  }
}