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