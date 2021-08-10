
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Header } from './header';
import { WebsiteName } from './website-name';
import { NewsContent } from './news-content';
import { AddNews } from './add-news';
import { NextProcess } from './next-process';
import { VideoTag } from './video-tag';

type web = {
  id: number;
  name: string;
  url: string;
  selector: Array<string>;
}

type newsContent = {
  text: string;
  audio: string;
}

type news = {
  webId: number;
  newsId: number;
  newsDet: Array<newsContent>;
  oneaudio: string;
  audioGen: string;
  videoGen: string;
  postVideo: string;

}

type content = {
  web: Array<web>;
  newsObject: Array<news>;
}

type f2 = {
  result: string;
}

type jsnews = {
text: string;
audio: string;
}

@customElement('container-')
export class Container extends LitElement {

  @property({type:Boolean})
  clickweb = false

  @property({type:Array})
  web: Array<web> = []

  @property({type:Array})
  newsObject: Array<news> = []

  @property({type:Array})
  newsDet: Array<newsContent> = []
                          
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
  fetchobject  = <content>{}

  @property({type:Object})
  fetchobject2  = <f2>{}

  @property({type:Boolean})
  loadbool = false

  async front(){
    this.clickweb = !this.clickweb
    if(this.clickweb === true ){
      await this.fetchfunction('http://localhost:8588/getjson', {})
      const contentJson: content = this.fetchobject
      this.web = contentJson.web
      this.newsObject = contentJson.newsObject
    }
  }

  async display(webid: number){
    this.newsbutclick = !this.newsbutclick
    await this.fetchfunction('http://localhost:8588/getjson', {})
    const contentJson: content = this.fetchobject
    const web: Array<web> = contentJson.web
    const newsObject: Array<news> = contentJson.newsObject
    const index: number = newsObject.length - this.web.length
    this.getnewsObject (webid,index,newsObject,web)
  }

  getnewsObject (webid: number,index: number,newsObject: Array<news>,web: Array<web>) {
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

  dislayotherdet (index: number,newsObject: Array<news>){
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
      const response = this.fetchobject2.result
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
      const response = this.fetchobject2.result
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
      const response = this.fetchobject2.result
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

    const detail = <jsnews>{}
    detail.text = getNews
    detail.audio = fileName
    newsDet[index] = detail

    this.newsDet = newsDet
    await this.fetchfunction('http://localhost:8588/updatejson', contentJson)
    const response = this.fetchobject2.result
    alert(response)
   
  }

  async fetchfunction(url: string, body: Object) {

    const sendreq = await fetch (url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
    const fetchobject = await sendreq.json()
    if( Object.keys(fetchobject).length === 1 ) {
      this.fetchobject2 = fetchobject
    }
    else{ this.fetchobject = fetchobject }

  }

  loadingTemplate(){
    return html`
    <img class="load" src="../src/load.gif">
  `;}

  render(){
    return html`

      ${!this.loadbool ?
      html`

        <header-1 @showWebsiteName="${this.front}" ></header-1>

        ${this.clickweb ?
        html`
          <website-name  .web = "${this.web}" @showNews1="${() => this.display(1)}" @showNews2="${() => this.display(2)}" @showNews3="${() => this.display(3)}" ></website-name>

          ${this.newsbutclick ?
          html`
            <news-content .newsDet="${this.newsDet}" .webname="${this.webname}" ></news-content>
                     
            ${this.addNewsBool ?
            html`
              <add-news .webid = "${this.webid}" @addNews = "${() => this.addNews(this.index)}" ></add-news>
            `:''} 

            <next-process .webid = "${this.webid}" @audioGen="${() => this.audioGen(this.index)}"  @videoGen="${() => this.videoGen(this.index)}" @postVideo="${() => this.postVideo(this.index)}" ></next-process>


            ${this.videoBool ?
            html`
            <video-tag .filename = "${this.filename}" ></video-tag>
            `:''}

          `:''}         
        `:''}  
      `:''}  

      ${this.loadbool ?
        html`
        ${(this.loadingTemplate())}
     `:''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'container-': Container;
    'header-1': Header;
    'website-name': WebsiteName;
    'news-content': NewsContent ;
    'add-news': AddNews ;
    'next-process': NextProcess ;
    'video-tag': VideoTag ;
  }
}

