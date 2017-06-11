import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PaymentConfirmation page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-payment-confirmation',
  templateUrl: 'payment-confirmation.html',
})
export class PaymentConfirmation {


  personsData:any;
  keys:any;
  amount:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.personsData = this.navParams.get('persons');
    this.amount = this.navParams.get('amountdata');
    this.keys = Object.keys(this.personsData);
    console.log(this.personsData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentConfirmation');
  }

  closeOverlay(){
    this.navCtrl.pop();
  }

  payToUsers(){

    showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Payment!',
      subTitle: 'Payment is processed',
      buttons: ['OK']
    });
    alert.present();
  }


  }


}
