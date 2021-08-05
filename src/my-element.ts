
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { styleSheet } from '../src/styles.js';


@customElement('starting-text')
export class MyElement extends LitElement {

  static get styles(){
    return styleSheet;
  }
  
  @property({type:Boolean})
  clickweb = false

  @property({type:Array})
  web = []

  @property({type:Array})
  newsObject = []

  @property({type:Array})
  newsDet = []
                          
  @property({type:Boolean})
  newsbutclick = false

  @property({type:String})
  webname = ''

  @property({type:Number})
  webid = 0

  @property({type:Number})
  index = 0

  @property({type:String})
  filename = ''

  @property({type:Boolean})
  videoBool = false

  @property({type:Boolean})
  addNewsBool = true
             
  async front(){
    this.clickweb = !this.clickweb
    if(this.clickweb === true ){
      const url = 'http://localhost:8588/getjson'
      const res = await fetch(url)
      const contentJson = await res.json()
      this.web = contentJson.web
      this.newsObject = contentJson.newsObject
    }
  }

  async display(webid){
    this.newsbutclick = !this.newsbutclick

    const url = 'http://localhost:8588/getjson'
    const res = await fetch(url)
    const contentJson = await res.json()
    const web:Array = contentJson.web
    const newsObject:Array = contentJson.newsObject

    let index = newsObject.length - this.web.length
    let newsDet:Array
    let webname:String
  
    function getnewsObject (webid) {
      for (let j = index; j < newsObject.length; j++) {
        if (newsObject[j].webId !== webid) { continue }
        newsDet = newsObject[j].newsDet
        webname = web[webid-1].name
        index = j
      }
    }
    if(this.newsbutclick === true ){ getnewsObject(webid)}
    else if (this.newsbutclick === false && this.webid !== webid ){
      this.newsbutclick = !this.newsbutclick
       getnewsObject(webid)
      }
    this.newsDet = newsDet
    this.webname = webname
    this.webid = webid
    this.index = index

    if(newsObject[index].videoGen === 'yes'){
      this.videoBool = true
      this.filename = newsObject[index].oneaudio
    }
    else if (newsObject[index].videoGen === 'no'){this.videoBool = false}

    if(newsObject[index].audioGen === 'yes'){
      this.addNewsBool = false
    }
    else if (newsObject[index].audioGen === 'no'){this.addNewsBool = true}

  }

  async audioGen (index, id) {
  
    const url = 'http://localhost:8588/getjson'
    const res = await fetch(url)
    const contentJson = await res.json()
    const newsObject = contentJson.newsObject
    const objectInd = index
  
    if (newsObject[objectInd].audioGen === 'yes') { alert('Audio Already Generated') } else {
      alert('Audio Generation started')
      const xhttp = new XMLHttpRequest()
      xhttp.onload = function () {
        alert(this.responseText)
      }
      xhttp.open('POST', 'http://localhost:8588/generateaudio')
      xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhttp.send(`ind=${index}`)
    }
  }

  async  videoGen (index) {
    const url = 'http://localhost:8588/getjson'
    const res = await fetch(url)
    const contentJson = await res.json()
    const newsObject = contentJson.newsObject
    const objectInd = index
  
    if (newsObject[objectInd].videoGen === 'yes') { alert('Video Already Generated') } else if (newsObject[objectInd].audioGen === 'no') { alert('Audio is not yet Generated') } else {
      alert('Video Generation started')
      const xhttp = new XMLHttpRequest()
      xhttp.onload = function () {
        alert(this.responseText)
        this.videoBool = true
        this.filename = newsObject[index].oneaudio
      }
      xhttp.open('POST', 'http://localhost:8588/generatevideo')
      xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhttp.send(`ind=${index}`)
    }
  }

  async postVideo (index) {
    const url = 'http://localhost:8588/getjson'
    const res = await fetch(url)
    const contentJson = await res.json()
    const newsObject = contentJson.newsObject
    const objectInd = index
  
    if (newsObject[objectInd].postVideo === 'yes') { alert('Video Already Posted') } else if (newsObject[objectInd].videoGen === 'no') { alert('Video is not yet Generated') } else {
      alert('Video Posting started')
      const xhttp = new XMLHttpRequest()
      xhttp.onload = function () {
        alert(this.responseText)
      }
      xhttp.open('POST', 'http://localhost:8588/postvideo')
      xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhttp.send(`ind=${index}`)
    }
  }

  async addNews(index){

    const text = document.querySelector(input).value
      alert(index,text)
  }

  render() {
    return html`
     <h1>News Mission</h1>

      <h2 class="head">Welcome to News Misson</h2>

      <button class="button newsclick" @click="${this.front}">Click here for select the website to view the Headline News</button><br><br>

      ${this.clickweb ? this.web.map( x => html ` <button class="button nbd${x.id}" @click="${() => this.display(x.id)}" >${x.name}</button>`):''}

      ${this.newsbutclick && this.clickweb ? 
            html `
            <h2 class="subhead" >The News from ${this.webname}</h2>
            <div class="ntext">
            <ul>
            ${this.newsDet.map(y => html`<li>${y.text}</li><br>`)}
            </ul>
            </div>

            ${this.addNewsBool ?
              html `
              <input class="addnewsinput" type="text" >
              <button class="text font2 tc${this.webid}" @click="${() => this.addNews(this.index)}" >Add News</button><br> 
            `:''}

            <button class="text font2 tc${this.webid}" @click="${() => this.audioGen(this.index,this.webid)}" >Generate Audio</button>
            <button class="text font2 tc${this.webid}" @click="${() => this.videoGen(this.index)}" >Generate Video</button>
            <button class="text font2 tc${this.webid}" @click="${() => this.postVideo(this.index)}" >Post Video</button>
           
            ${this.videoBool ? 
              html`
              <h2 class="subhead" >The Generated Video</h2>
              <video controls="controls" type="video/mp4" class="video" src="http://localhost:8588/${this.filename}" ></video>
            `:''}
      `:''}
  `;}
}

declare global {
  interface HTMLElementTagNameMap {
    'starting-text': MyElement;

  }
}
