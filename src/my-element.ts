
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { styleSheet } from '../src/styles.js';

@customElement('container-')
export class Container extends LitElement {

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

  @property({type:Object})
  fetchobject = {}

  @property({type:Boolean})
  loadbool = false

  async front(){
 
    this.clickweb = !this.clickweb
    if(this.clickweb === true ){
      await this.fetchfunction('http://localhost:8588/getjson', {})
      const contentJson = this.fetchobject
      this.web = contentJson.web
      this.newsObject = contentJson.newsObject
    }
  }

  async display(webid: number){

    this.newsbutclick = !this.newsbutclick
    await this.fetchfunction('http://localhost:8588/getjson', {})
    const contentJson = this.fetchobject
    const web: Array = contentJson.web
    const newsObject: Array = contentJson.newsObject
    const index: number = newsObject.length - this.web.length

    this.getnewsObject (webid,index,newsObject,web)
  }

  getnewsObject (webid: number,index: number,newsObject: Array,web: Array) {

    if (this.newsbutclick === false && this.webid !== webid ){
      this.newsbutclick = !this.newsbutclick
    }

    for (let j = index; j < newsObject.length; j++) {
      if (newsObject[j].webId !== webid) { continue }
      this.newsDet = newsObject[j].newsDet
      this.webname = web[webid-1].name
      this.webid = webid
      this.index = j
      this.dislayotherdet (j,newsObject)
    }
  }

  dislayotherdet (index: number,newsObject: Array){

    if(newsObject[index].videoGen === 'yes'){
      this.filename = newsObject[index].oneaudio
      this.videoBool = true
    }
    else if (newsObject[index].videoGen === 'no'){this.videoBool = false}

    if(newsObject[index].audioGen === 'yes'){this.addNewsBool = false}
    else if (newsObject[index].audioGen === 'no'){this.addNewsBool = true}
  }

  async audioGen (index: number) {
  
    this.addNewsBool = false

    await this.fetchfunction('http://localhost:8588/getjson', {})
    const contentJson = this.fetchobject
    const newsObject = contentJson.newsObject
    const objectInd = index
  
    if (newsObject[objectInd].audioGen === 'yes') { alert('Audio Already Generated') } else {
      alert('Audio Generation started')
      this.loadbool = true
      const data = {"ind":index}
      await this.fetchfunction('http://localhost:8588/generateaudio', data)
      const response = this.fetchobject.result
      this.loadbool = false
      alert(response)
    }
  }

  async  videoGen (index: number) {
    await this.fetchfunction('http://localhost:8588/getjson', {})
    const contentJson = this.fetchobject
    const newsObject = contentJson.newsObject
    const objectInd = index
   

    if (newsObject[objectInd].videoGen === 'yes') { alert('Video Already Generated') } else if (newsObject[objectInd].audioGen === 'no') { alert('Audio is not yet Generated') } else {
      
      this.filename = `${newsObject[index].oneaudio}.mp4`
      alert('Video Generation started')
      this.loadbool = true
      const data = {"ind":index}
      await this.fetchfunction('http://localhost:8588/generatevideo', data)
      const response = this.fetchobject.result
      this.loadbool = false
      alert(response)
      this.videoBool =true
    }
  }

  async postVideo (index: number) {
    await this.fetchfunction('http://localhost:8588/getjson' ,{})
    const contentJson = this.fetchobject
    const newsObject = contentJson.newsObject
    const objectInd = index
  
    if (newsObject[objectInd].postVideo === 'yes') { alert('Video Already Posted') } else if (newsObject[objectInd].videoGen === 'no') { alert('Video is not yet Generated') } else {
      alert('Video Posting started')
      this.loadbool = true
      const data = {"ind":index}
      await this.fetchfunction('http://localhost:8588/postvideo', data)
      const response = this.fetchobject.result
      this.loadbool = false
      alert(response)
    }
  }

  async addNews(ind: number){

    const getNews: string = this.shadowRoot.querySelector('INPUT').value
    this.shadowRoot.querySelector('INPUT').value = ''

    await this.fetchfunction('http://localhost:8588/getjson', {})
    const contentJson = this.fetchobject
    const newsObject = contentJson.newsObject
    const objectInd = ind
    const newsDet = newsObject[objectInd].newsDet
    const newsId = newsObject[objectInd].newsId
    const index = newsDet.length

    const date = new Date().toString().replace(/[{(+)}]|GMT|0530|India Standard Time| /g, '')
    const fileName = 'voice/NewsId:' + newsId + '-index:' + index + '-' + date + '.wav'

    const detail = {}
    detail.text = getNews
    detail.audio = fileName
    newsDet[index] = detail

    this.newsDet = newsDet
    await this.fetchfunction('http://localhost:8588/updatejson', contentJson)
    const response = this.fetchobject.result
    alert(response)
   
  }

  async fetchfunction(url: string, body: Object) {

    const sendreq = await fetch (url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
    this.fetchobject = await sendreq.json()
  }

  headerTemplate(){
    return html`
      <h1>News Mission</h1>
      <h2 class="head">Welcome to News Misson</h2>
      <button class="button newsclick" @click="${() => this.customEvent(['header-', 'showWebsiteName'])}" >Click here for select the website to view the Headline News</button><br><br>
  `;}

  newsWebsiteTemplate(){
    return html`
    ${this.web.map( x => html ` <button class="button nbd${x.id}" @click="${() => this.customEvent(['news-details', `showNews${x.id}`])}"  >${x.name}</button>`)}
  `;}

  newsContentTemplate(){
    return html`
      <h2 class="subhead" >The News from ${this.webname}</h2>
      <div class="ntext">
      <ul>
      ${this.newsDet.map(y => html`<li>${y.text}</li><br>`)}
      </ul>
      </div>
  `;}

  addNewsTemplate(){
    return html`
      <input class="addnewsinput" type="text" >
      <button class="text font2 tc${this.webid}" @click="${() => this.customEvent(['website-name', 'addNews'])}" >Add News</button><br> 
 `;}

  nextProcessTemplate(){
    return html`
      <button class="text font2 tc${this.webid}" @click="${() => this.customEvent(['news-content', 'audioGen'])}" >Generate Audio</button>
      <button class="text font2 tc${this.webid}" @click="${() => this.customEvent(['news-content', 'videoGen'])}" >Generate Video</button>
      <button class="text font2 tc${this.webid}" @click="${() => this.customEvent(['news-content', 'postVideo'])}" >Post Video</button>
  `;}

  videoDiplayTemplate(){
    return html`
      <h2 class="subhead" >The Generated Video</h2>
      <video controls="controls" type="video/mp4" class="video" src="http://localhost:8588/${this.filename}" ></video>
  `;}

  loadingTemplate(){
    return html`
    <img class="load" src="../src/load.gif">
  `;}

  render(){
    return html`

    ${!this.loadbool ?
      html`

      <header- @showWebsiteName="${this.front}">
      ${(this.headerTemplate())}
      </header->

      ${this.clickweb ?
        html`

        <news-details @showNews1="${() => this.display(1)}" @showNews2="${() => this.display(2)}" @showNews3="${() => this.display(3)}" >

        <website-name @addNews="${() => this.addNews(this.index)}"  >
        ${(this.newsWebsiteTemplate())}
        </website-name>

        ${this.newsbutclick ?
          html`

          <news-content @audioGen="${() => this.audioGen(this.index)}" @videoGen="${() => this.videoGen(this.index)}" @postVideo="${() => this.postVideo(this.index)}" >
          ${(this.newsContentTemplate())}
          </news-content>

          ${this.addNewsBool ?
           html`

            <add-news>
            ${(this.addNewsTemplate())}
            </add-news>
          `:''} 

          <next-process>
          ${(this.nextProcessTemplate())}
          </next-process>


          ${this.videoBool ?
            html`

            <video-tag>
            ${(this.videoDiplayTemplate())}
            </video-tag>
          `:''} 
        `:''} 

        </news-details>
      `:''} 
    `:''} 
    
    ${this.loadbool ?
        html`
        ${(this.loadingTemplate())}
    `:''}
    
    `;
  }

  customEvent(a: Array<String>) {
    console.log(1)
    const myEvent = new CustomEvent(`${a[1]}`, { 
      detail: { message: 'my-event happened.' }
    });
    this.shadowRoot.querySelector(`${a[0]}`).dispatchEvent(myEvent);
    console.log(3)
  }
}




declare global {
  interface HTMLElementTagNameMap {
    'container-': Container;
    'header-': HTMLElement;
    'news-details': HTMLElement ;
    'website-name': HTMLElement ;
    'news-content': HTMLElement ;
    'add-news': HTMLElement ;
    'next-process': HTMLElement ;
    'video-tag': HTMLElement ;
  }
}

