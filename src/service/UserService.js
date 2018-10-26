import firebase from 'react-native-firebase';

class UserService {
    constructor() {
        // Create the collection in firestore
        this.ref = firebase.firestore().collection('user');
    }

    add(doc) {
       return this.ref.add(doc);
    }

    getByEmail(email) {
        return this.ref.where('email', '==', email).get()
    }
}

export default userService = new UserService();