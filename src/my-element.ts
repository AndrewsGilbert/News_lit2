
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

      ${!this.loadbool ? 

      html`

      <h1>News Mission</h1>

      <h2 class="head">Welcome to News Misson</h2>

      <button class="button newsclick" @click="${this.front}">Click here for select the website to view the Headline News</button><br><br>
    `:''}
  `;}

  newsWebsitBbuttonTemplate(){

    return html`

    ${this.clickweb && !this.loadbool ? this.web.map( x => html ` <button class="button nbd${x.id}" @click="${() => this.display(x.id)}" >${x.name}</button>`):''}

  `;}

  newsContentTemplate(){

    return html`

    ${this.newsbutclick && this.clickweb && !this.loadbool ? 
        html `
        <h2 class="subhead" >The News from ${this.webname}</h2>
        <div class="ntext">
        <ul>
        ${this.newsDet.map(y => html`<li>${y.text}</li><br>`)}
        </ul>
        </div>
    `:''}
  `;}

  addNewsTemplate(){

    return html`

    ${this.newsbutclick && this.clickweb && this.addNewsBool ?
        html `
        <input class="addnewsinput" type="text" >
        <button class="text font2 tc${this.webid}" @click="${() => this.addNews(this.index)}" >Add News</button><br> 
    `:''}
  `;}

  nextProcessTemplate(){

    return html`

    ${this.newsbutclick && this.clickweb && !this.loadbool ?

       html`
      <button class="text font2 tc${this.webid}" @click="${() => this.audioGen(this.index)}" >Generate Audio</button>
      <button class="text font2 tc${this.webid}" @click="${() => this.videoGen(this.index)}" >Generate Video</button>
      <button class="text font2 tc${this.webid}" @click="${() => this.postVideo(this.index)}" >Post Video</button>
    `:''}
  `;}

  videoDiplayTemplate(){

    return html`

      ${this.newsbutclick && this.clickweb && !this.loadbool && this.videoBool ? 
        html`
        <h2 class="subhead" >The Generated Video</h2>
        <video controls="controls" type="video/mp4" class="video" src="http://localhost:8588/${this.filename}" ></video>
      `:''}
  `;}

  loadingTemplate(){

    return html`

    ${this.loadbool ? 
      html`
      <img class="load" src="../src/load.gif">
    `:''}
  `;}

  render(){

    return html`

    ${(this.headerTemplate())}
    ${(this.newsWebsitBbuttonTemplate())}
    ${(this.newsContentTemplate())}
    ${(this.addNewsTemplate())}
    ${(this.nextProcessTemplate())}
    ${(this.videoDiplayTemplate())}
    ${(this.loadingTemplate())}
    
    `;
  }
}



declare global {
  interface HTMLElementTagNameMap {
    'starting-text': MyElement;

  }
}


//   render() {
//     return html`

//       ${!this.loadbool ? 

//           html`

//           <h1>News Mission</h1>

//           <h2 class="head">Welcome to News Misson</h2>

//           <button class="button newsclick" @click="${this.front}">Click here for select the website to view the Headline News</button><br><br>

//           ${this.clickweb ? this.web.map( x => html ` <button class="button nbd${x.id}" @click="${() => this.display(x.id)}" >${x.name}</button>`):''}

//           ${this.newsbutclick && this.clickweb ? 
//               html `
//               <h2 class="subhead" >The News from ${this.webname}</h2>
//               <div class="ntext">
//               <ul>
//               ${this.newsDet.map(y => html`<li>${y.text}</li><br>`)}
//               </ul>
//               </div>

//               ${this.addNewsBool ?
//               html `
//               <input class="addnewsinput" type="text" >
//               <button class="text font2 tc${this.webid}" @click="${() => this.addNews(this.index)}" >Add News</button><br> 
//               `:''}

//               <button class="text font2 tc${this.webid}" @click="${() => this.audioGen(this.index)}" >Generate Audio</button>
//               <button class="text font2 tc${this.webid}" @click="${() => this.videoGen(this.index)}" >Generate Video</button>
//               <button class="text font2 tc${this.webid}" @click="${() => this.postVideo(this.index)}" >Post Video</button>
                    
//               ${this.videoBool ? 
//               html`
//               <h2 class="subhead" >The Generated Video</h2>
//               <video controls="controls" type="video/mp4" class="video" src="http://localhost:8588/${this.filename}" ></video>
//               `:''}
//           `:''}
//      `:''}

//       ${this.loadbool ? 
//          html`
//          <img class="load" src="../src/load.gif">
//       `:''}
//   `;}
