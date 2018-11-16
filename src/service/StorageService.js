import { Platform } from 'react-native';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'rn-fetch-blob';

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

class StorageService {
    guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + s4();
    }

    uploadValidId(uri, mime = 'application/octet-stream') {
        return firebase.storage().
                        ref('valid_ids').
                        child(this.guid()).
                        put(uri, { contentType: mime })
    }

    uploadIncident(uri, mime = 'application/octet-stream') {
        return firebase.storage().
                        ref('incidents').
                        child(this.guid()).
                        put(uri, { contentType: mime })
    }
}

export default new StorageService();