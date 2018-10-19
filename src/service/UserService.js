import firebase from 'react-native-firebase';

class UserService {
    constructor() {
        // Create the collection in firestore
        this.ref = firebase.firestore().collection('user');
    }

    add(doc) {
       return this.ref.add(doc);
    }
}

export default userService = new UserService();