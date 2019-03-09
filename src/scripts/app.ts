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
    mainFirebase.firestore().collection('users').doc(mainFirebase.auth().currentUser.uid).collection('friends').orderBy('username', 'desc').get().then(function (friends: any){
        let first = true;
        friends.forEach(function (friend: any) {
           if (first) {
               first = false;
               $$('#friendslist').html('<img src="img/friendship.svg" alt="Drinks" class="backgroundsvg">');
           } 
        });
        if (first) {
            $$('#friendslist').html('<img src="img/nofriends.svg" alt="No friends" class="backgroundsvg">');
            $$('#friendslist').append('<center><p>You don\'t have any friends. Why not <a onclick="javascript:displayAddFriendDialog();">add</a> some?</p></center>');
        }
    });
}