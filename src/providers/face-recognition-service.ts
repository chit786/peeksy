import {Injectable} from '@angular/core';
import {Http,HttpModule, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';



@Injectable()
export class FaceRecognitionService {

  public subscriptionKey : string;
  public personGroupId : string;
  public fileTransfer: TransferObject ;
  public data: any = null;

  constructor(public http: Http,private transfer: Transfer) {
     this.subscriptionKey = "6dbf3331c9e147d99200f0cab09d2ea0";
     this.personGroupId = "testperson_grp1";
     this.fileTransfer = this.transfer.create();
  }

  detect(imageURL) {
    
      console.log("Beginning AJAX request for Face Detection");
      console.log(imageURL);
      return new Promise(resolve => {
            // We're using Angular Http provider to request the data,
            // then on the response it'll map the JSON data to a parsed JS object.
            // Next we process the data and resolve the promise with the new data.

            var params = {
                // Specify your subscription key
                'subscription-key': this.subscriptionKey,
                // analyzesFaceLandmarks: "false",
                analyzesAge: "true",
                analyzesGender: "true",
                // analyzesHeadPose: "false",
            };

           // let ft = new Transfer();
            let filename = "face.jpg";
            let options: FileUploadOptions  = {
                fileKey: 'file',
                fileName: filename,
                mimeType: 'image/jpeg',
                chunkedMode: false,
                headers: {
                    'Content-Type' : 'application/octet-stream',
                    'Ocp-Apim-Subscription-Key' : this.subscriptionKey
                },
                params: {
                    fileName: filename
                }
            };
            
            this.fileTransfer.upload(imageURL, "https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true", options, false)
            .then((result: any) => {
                resolve(result);
            }).catch((error: any) => {
                resolve(error);
            });

      });
  }

  identify (faceId, maxNumOfCandidatesReturned) {
      console.log("Beginning POST request for Face Identification");

      return new Promise(resolve => {
            // We're using Angular Http provider to request the data,
            // then on the response it'll map the JSON data to a parsed JS object.
            // Next we process the data and resolve the promise with the new data.

            let body = JSON.stringify({'personGroupId': this.personGroupId, 'faceIds' : [faceId], 'maxNumOfCandidatesReturned' : 1});
            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });
            return this.http.post('https://westeurope.api.cognitive.microsoft.com/face/v1.0/identify?subscription-key=' + this.subscriptionKey, body, options)
                .map(res => res.json())
                .subscribe(data => {
                    if (data[0] != null) {
                        resolve(data[0]);
                    } else {
                        resolve(data);
                    }
                }, err => {
                    resolve(err);
                });
      });
  }

  createPerson(name, userData) {

              console.log("Beginning POST request for person creation");

              return new Promise(resolve => {
                    // We're using Angular Http provider to request the data,
                    // then on the response it'll map the JSON data to a parsed JS object.
                    // Next we process the data and resolve the promise with the new data.

                    let body = "{'name':'" + name + "','userData':'" + userData + "'}";
                    let headers = new Headers({ 'Content-Type': 'application/json' });
                    let options = new RequestOptions({ headers: headers });
                    return this.http.post('https://westeurope.api.cognitive.microsoft.com/face/v1.0/persongroups/'+ this.personGroupId + '/persons?subscription-key=' + this.subscriptionKey, body, options)
                             .map(res => res.json())
                             .subscribe(data => {
                             console.log(JSON.stringify(data));
                             resolve(data);
                    }, err => {
                             resolve(err);
                    });
              });
    }

   addFaceToPerson (personID, imageURL) {
            console.log("Beginning file upload in order to add face to person");

                  return new Promise(resolve => {
                        // We're using Angular Http provider to request the data,
                        // then on the response it'll map the JSON data to a parsed JS object.
                        // Next we process the data and resolve the promise with the new data.

                        var params = {
                            // Specify your subscription key
                            'subscription-key': this.subscriptionKey,
                            // analyzesFaceLandmarks: "false",
                            analyzesAge: "true",
                            analyzesGender: "true",
                            // analyzesHeadPose: "false",
                        };

                        //let ft = new Transfer();
                        let filename = "face.jpg";
                        let options = {
                            fileKey: 'file',
                            fileName: filename,
                            mimeType: 'image/jpeg',
                            chunkedMode: false,
                            headers: {
                                'Content-Type' : 'application/octet-stream',
                                'Ocp-Apim-Subscription-Key' : this.subscriptionKey
                            },
                            params: {
                                fileName: filename
                            }
                        };
                        
                        this.fileTransfer.upload(imageURL, 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/persongroups/' + this.personGroupId + '/persons/' + personID + '/persistedFaces', options, false)
                        .then((result: any) => {
                            resolve(result);
                        }).catch((error: any) => {
                            resolve(error);
                        });
        });
    }

    getPerson(personId) {
        console.log("Beginning GET request for person record");

                    return new Promise(resolve => {
                          // We're using Angular Http provider to request the data,
                          // then on the response it'll map the JSON data to a parsed JS object.
                          // Next we process the data and resolve the promise with the new data.

                          let headers = new Headers({ 'Content-Type': 'application/json' });
                          let options = new RequestOptions({ headers: headers });
                          return this.http.get('https://westeurope.api.cognitive.microsoft.com/face/v1.0/persongroups/'+ this.personGroupId +'/persons/'+ personId +'?subscription-key=' + this.subscriptionKey, options)
                               .map(res => res.json())
                               .subscribe(data => {
                                   console.log(JSON.stringify(data));
                                   resolve(data);
                               }, err => {
                                   resolve(err);
                               });
        });
    }

    // Retrieve the face for a person (used to verify account when face recognized in the user group)
    getPersonsFace (personID, faceID) {
        console.log("Beginning GET request for persons face");

            return new Promise(resolve => {
                  // We're using Angular Http provider to request the data,
                  // then on the response it'll map the JSON data to a parsed JS object.
                  // Next we process the data and resolve the promise with the new data.

                  let headers = new Headers({ 'Content-Type': 'application/json' });
                  let options = new RequestOptions({ headers: headers });
                  return this.http.get('https://westeurope.api.cognitive.microsoft.com/face/v1.0/persongroups/'+ this.personGroupId +'/persons/'+ personID +'/persistedFaces/'+ faceID +'?subscription-key=' + this.subscriptionKey, options)
                       .map(res => res.json())
                       .subscribe(data => {
                           console.log(JSON.stringify(data));
                           resolve(data);
                       }, err => {
                           resolve(err);
                       });
        });
    }


    // This function will no longer be used as we will use the same person group in future.
    createPersonGroup() {

            console.log("Beginning PUT request for person group creation");

            return new Promise(resolve => {
                  // We're using Angular Http provider to request the data,
                  // then on the response it'll map the JSON data to a parsed JS object.
                  // Next we process the data and resolve the promise with the new data.

                  let body = "{'name':'heifer-users','userData':'This value will be used to store information about the users account. It is just a string for the moment.'}";
                  let headers = new Headers({ 'Content-Type': 'application/json' });
                  let options = new RequestOptions({ headers: headers });
                  return this.http.put('https://westeurope.api.cognitive.microsoft.com/face/v1.0/persongroups?subscription-key=' + this.subscriptionKey, body, options)
                      .map(res => res.json())
                      .subscribe(data => {
                          console.log(JSON.stringify(data));
                          resolve(data);
                      }, err => {
                          resolve(err);
                      });
            });
     }

     // Train the person group. This must be called after every update to the person group in order for the
     // updated information to be included in the identify API call
     trainPersonGroup() {
            console.log("Beginning POST request to train person group");

            return new Promise(resolve => {
                  // We're using Angular Http provider to request the data,
                  // then on the response it'll map the JSON data to a parsed JS object.
                  // Next we process the data and resolve the promise with the new data.

                  let body = "";
                  let headers = new Headers({ 'Content-Type': 'application/json' });
                  let options = new RequestOptions({ headers: headers });
                  return this.http.post('https://westeurope.api.cognitive.microsoft.com/face/v1.0/persongroups/' + this.personGroupId + '/train?subscription-key=' + this.subscriptionKey, body, options)
                       .map(res => res.json())
                       .subscribe(data => {
                           console.log(JSON.stringify(data));
                           resolve(data);
                       }, err => {
                           resolve(err);
                       });
        });
    }
}