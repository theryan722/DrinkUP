//Quick check if user is logged in
function userIsLoggedIn(): boolean {
    return GlobalVars.Authentication.userIsLoggedIn;
}

function checkIfUsernameExists(username: string): Promise<any> {
    return new Promise(function (resolve: any, reject: any) {
        mainFirebase.firestore().collection('users').where('username', '==', username).limit(1).get().then(function (users: any) {
            let first = true;
            users.forEach(function (user: any) {
                first = false;
            });
            if (first) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

function authStateCheck(): Promise<any> {
    return new Promise(function (resolve, reject) {
        if (GlobalVars.Authentication.initialized) {
            resolve(GlobalVars.Authentication.userIsLoggedIn);
        } else {
            GlobalVars.Authentication.initialized = true;
            mainFirebase.auth().onAuthStateChanged(function (user: any) {
                if (user) {
                    applySkeletonTextEffect('.menu_account_name');
                    applySkeletonTextEffect('.menu_account_username');
                    GlobalVars.Authentication.userIsLoggedIn = true;
                    if (!GlobalVars.Authentication.initialCheck) {
                        mainFirebase.firestore().collection('users').doc(mainFirebase.auth().currentUser.uid).get().then(function (udoc: any) {
                            if (udoc.exists) {
                                refreshFriendsListIDs();
                                GlobalVars.Authentication.userInfo = udoc.data();
                                GlobalVars.Authentication.initialCheck = true;
                                updateUserInfoMenuDisplay();
                                resolve();
                            }
                        });
                    }
                } else {
                    GlobalVars.Authentication.userIsLoggedIn = false;
                    GlobalVars.Authentication.userInfo = undefined;
                    resolve();
                }
            });
        }
    });
}

function refreshFriendsListIDs() {
    mainFirebase.firestore().collection('users').doc(mainFirebase.auth().currentUser.uid).collection('friends').get().then(function (friends: any) {
        friends.forEach(function (friend: any) {
            if (!GlobalVars.friendsList) {
                GlobalVars.friendsList = [];
            }
            GlobalVars.friendsList.push(friend.id);
        })
    });
}

function signOutUser() {
    app.dialog.confirm('Are you sure you want to sign out?', 'Confirm', function () {
        mainFirebase.auth().signOut().then(function () {
            location.reload();
        }).catch(function (error: any) {
            app.dialog.alert('There was an error attempting to sign out.', 'Error');
        });
    });
}