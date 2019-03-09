function takeADrink(justasip: boolean = false) {
    mainFirebase.firestore().collection('drinks').add({
        userid: mainFirebase.auth().currentUser.uid,
        //@ts-ignore
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        name: GlobalVars.Authentication.userInfo.name,
        username: GlobalVars.Authentication.userInfo.username,
        sip: justasip
    }).then(function () {
        if (justasip) {
            app.popup.open('.popup-drink_sip');
            runDrinkAnimation();
        } else {
            app.popup.open('.popup-drink_full');
        }
    });
}

function viewDrinkLog() {
    app.popup.open('.popup-drinklog');
    refreshDrinkLog();
}

function refreshDrinkLog() {
    mainFirebase.firestore().collection('drinks').where('userid', '==', mainFirebase.auth().currentUser.uid).orderBy('timestamp', 'desc').get().then(function (drinks: any) {
        let first = true;
        drinks.forEach(function (drink: any) {
            if (first) {
                first = false;
                $$('#drinkloglist').html('<img src="img/drinklog.svg" alt="Drinks" class="backgroundsvg">');
            }
            //@ts-ignore
            let fritem: any = nunjucks.render('drinklogitemtemplate.html', {
                timestamp: formatTimeStamp(drink.data().timestamp.toMillis()),
                sip: drink.data().sip
            });
            $$('#drinkloglist').append(fritem);
        });
        if (first) {
            $$('#drinkloglist').html('<img src="img/empty.svg" alt="No drinks" class="backgroundsvg">');
            $$('#drinkloglist').append('<center><p>You haven\'t drank anything! Pick up a glass of water!!</p></center>');
        }
    });
}

function displayFriendsList() {
    app.popup.open('.popup-friends');
    refreshFriendsList();
}

function refreshFriendsList() {
    mainFirebase.firestore().collection('users').doc(mainFirebase.auth().currentUser.uid).collection('friends').orderBy('username', 'desc').get().then(function (friends: any) {
        let first = true;
        friends.forEach(function (friend: any) {
            if (first) {
                first = false;
                $$('#friendslist').html('<img src="img/friendship.svg" alt="Drinks" class="backgroundsvg">');
            }
            //@ts-ignore
            let fritem: any = nunjucks.render('frienditemtemplate.html', {
                name: friend.data().name,
                username: friend.data().username,
                userid: friend.id
            });
            $$('#friendslist').append(fritem);
        });
        if (first) {
            $$('#friendslist').html('<img src="img/nofriends.svg" alt="No friends" class="backgroundsvg">');
            $$('#friendslist').append('<center><p>You don\'t have any friends. Why not <a onclick="javascript:displayAddFriendDialog();">add</a> some?</p></center>');
        }
    });
}

function displayAddFriendDialog() {
    app.dialog.prompt('Enter the username of your friend', 'Add Friend', function (username: string) {
        if (username) {
            checkIfUsernameExists(username).then(function (usernameexists: boolean) {
                if (usernameexists) {
                    mainFirebase.firestore().collection('users').where('username', '==', username).limit(1).get().then(function (users: any) {
                        users.forEach(function (user: any) {
                            mainFirebase.firestore().collection('users').doc(user.id).collection('friends').doc(mainFirebase.auth().currentUser.uid).set({
                                name: GlobalVars.Authentication.userInfo.name,
                                username: GlobalVars.Authentication.userInfo.username
                            }).then(function () {
                                mainFirebase.firestore().collection('users').doc(mainFirebase.auth().currentUser.uid).collection('friends').doc(user.id).set({
                                    name: user.data().name,
                                    username: user.data().username
                                }).then(function () {
                                    refreshFriendsList();
                                    app.toast.show({ text: 'Successfully added new friend!' });
                                });
                            });
                        });
                    });
                } else {
                    app.toast.show({ text: 'A user with that username could not be found. Please try again.' });
                    return;
                }
            });
        }
    });
}