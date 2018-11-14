import firebase from 'react-native-firebase';

class ReportService {
    constructor() {
        // Create the collection in firestore
        this.ref = firebase.firestore().collection('reports');
        this.unsubscribe = null;

    }

    geopoint(lat, long) {
        return new firebase.firestore.GeoPoint(lat, long);
    }

    add(doc) {
       return this.ref.add(doc);
    }

    get() {
        return this.ref.get();
    }

    onSnapshot(collectionUpdate) {
        this.unsubscribe = this.ref.onSnapshot(collectionUpdate);    
    }

    unsubscribe() {
        this.unsubscribe();
    }
}

export default ReportService = new ReportService();