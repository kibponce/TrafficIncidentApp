import firebase from 'react-native-firebase';

class ReportService {
    constructor() {
        // Create the collection in firestore
        this.ref = firebase.firestore().collection('enforcers');
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

    
}

export default reportService = new ReportService();