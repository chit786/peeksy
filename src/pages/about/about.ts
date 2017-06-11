import { Component } from '@angular/core';
import { NavController,ModalController,AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {PaymentConfirmation} from '../payment-confirmation/payment-confirmation'
import {FaceRecognitionService} from '../../providers/face-recognition-service';
import { NativeStorage } from '@ionic-native/native-storage';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  personData:any={};
  showFlag:any=true;
  URL:any;
  amount:any;
  enableNext:any=false;
  constructor(public modalCtrl: ModalController,public alertCtrl: AlertController,public navCtrl: NavController,private camera: Camera,private faceAPI:FaceRecognitionService,private nativeStorage: NativeStorage) {
    this.showFlag = true;
  }
  openImageUploadOption(){
    
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      saveToPhotoAlbum:true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.nativeStorage.setItem('imagetaken', {property: imageData})
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );

      this.nativeStorage.getItem('imagetaken')
        .then(
          data => {
            console.log(data);
            this.URL = data.property;
          },
          error => console.error(error)
        );



      this.showFlag = false;
      console.log((imageData));
      this.faceAPI.detect(imageData).then((personData)=>{
        console.log((personData as any).response);
        
        var data = JSON.parse((personData as any).response);
       for(var key in data){
         this.faceAPI.identify(data[key].faceId,1).then((person)=>{
            console.log(person);
           
            console.log(this.personData);

           

            this.faceAPI.getPerson((person as any).candidates[0].personId).then((person)=>{
               this.personData[data[key].faceId] = person;
               this.enableNext = true;
            })

         }).catch((err)=>{
            console.log(err);
         })
       }

      }).catch((err)=>{
        console.log(err);
      })
      //let base64Image = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
      // Handle error
    })
  }

  payToPersons(){

     let profileModal = this.modalCtrl.create(PaymentConfirmation, { persons: this.personData, amountdata: this.amount});
                profileModal.present();

      profileModal.onDidDismiss(()=>{
        this.personData = {};
        this.enableNext = false;
        this.showFlag = true;


      })

  }

   showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Check Image!',
      subTitle: 'Friend, You are not found!',
      buttons: ['OK']
    });
    alert.present();
  }



  

}
