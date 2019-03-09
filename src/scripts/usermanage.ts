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