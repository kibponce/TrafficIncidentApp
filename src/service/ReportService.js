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
        var start = new Date();
        start.setHours(0,0,0,0);
        var end = new Date();
        end.setHours(23,59,59,999);

        
        this.unsubscribe = this.ref
                                .where('date', '>=', start)
                                .where('date', '<=', end)
                                .onSnapshot(collectionUpdate);    
    }

    unsubscribe() {
        this.unsubscribe();
    }
}

export default ReportService = new ReportService();