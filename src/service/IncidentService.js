import firebase from 'react-native-firebase';
import moment from 'moment';

class IncidentService {
    constructor() {
        // Create the collection in firestore
        this.ref = firebase.firestore().collection('incidents');
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

    onIncedentsSnapshot(collectionUpdate) {
        var start = new Date();
        start.setHours(0,0,0,0);
        var end = new Date();
        end.setHours(23,59,59,999);

        this.unsubscribe = this.ref
                                .where('date', '>=', start)
                                .where('date', '<=', end)
                                .onSnapshot(collectionUpdate);    
    }

    unsubscribeIncidents() {
        this.unsubscribe();
    }

    settleIncidents(id, data) {
        this.ref.doc(id).set(data);
    }
}

export default incidentService = new IncidentService();