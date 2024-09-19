import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-imagebox',
  templateUrl: './imagebox.component.html',
  styleUrls: ['./imagebox.component.scss']
})
export class ImageboxComponent{

  constructor(){}

  @Input() inp_text!:string
  @Input() imgs:string[]
  @Input() inp_type:string
  @Output() dbClick = new EventEmitter();
  @Output() deleteClick= new EventEmitter();
  @Input() isSaved=true
  @Input() delete=false

  download(img) {
    const downloadLink = document.createElement('a');
    if(this.inp_type==='text'){
      downloadLink.setAttribute('href', img);
      downloadLink.setAttribute('download', this.inp_text.indexOf('.')===-1?this.inp_text:'GeneratedText');
    }else{
      downloadLink.setAttribute('href', img['image']);
      downloadLink.setAttribute('download', img['name']+'.png');
    }
    downloadLink.click();
  }

  share(img:any, name_val:string) {
    const imageUrl = img;
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], name_val+'.jpg', {type: blob.type});
        const shareData = {
          title: 'Sharing this Image',
          text: 'Check out this generated image',
          files: [file],
        };
        navigator.share(shareData);
      })
      .catch(error => console.error(error));
  }
  
  save(){
    this.dbClick.emit();
  }

  delete_image(img){
    this.deleteClick.emit(img);
  }

  getImageFileName(url: string): string {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const fileName = lastPart.split('.')[0];
    return fileName;
  }

  async getImageData(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    return data;
  }
}
