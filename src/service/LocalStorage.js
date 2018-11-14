
import { AsyncStorage } from 'react-native';

class LocalStorage {
    constructor() {
        this.userDetails = 'USER_DETAILS';
    }

    getUserDetails() {
        return AsyncStorage.getItem(this.userDetails);
    }
    
    setUserDetails(details) {
    console.log("Storing user details", details);
    // Do not use safeStringify because it should fail if there are circular refs
    return AsyncStorage.setItem(this.userDetails, JSON.stringify(details));
    }

    clearUserDetails() {
        console.log("Clearing user details");
        return AsyncStorage.removeItem(this.userDetails);
      }
}

export default LocalStorage = new LocalStorage();