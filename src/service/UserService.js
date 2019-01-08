import firebase from 'react-native-firebase';

class UserService {
    constructor() {
        // Create the collection in firestore
        this.ref = firebase.firestore().collection('user');
        this.unsubscribeEnforcers = null;
    }

    geopoint(lat, long) {
        return new firebase.firestore.GeoPoint(lat, long);
    }

    add(doc) {
       return this.ref.add(doc);
    }

    getByEmail(email) {
        return this.ref.where('email', '==', email).get()
    }

    getAllEnforcers() {
        return this.ref.where('isEnforcer', '==', true).get()
    }

    onEnforcersSnapshot(collectionUpdate) {
        if(this.unsubscribe) { this.unsubscribe(); }
        this.unsubscribeEnforcers = this.ref.where('isEnforcer', '==', true).onSnapshot(collectionUpdate);    
    }

    unsubscribeEnforcers() {
        this.unsubscribeEnforcers();
    }

    updateLocation(id, data) {
        this.ref.doc(id).set(data);
    }
}

export default userService = new UserService();