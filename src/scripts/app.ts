function takeADrink(justasip: boolean = false) {
    mainFirebase.firestore().collection('drinks').add({
        userid: mainFirebase.auth().currentUser.uid,
        //@ts-ignore
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        name: GlobalVars.Authentication.userInfo.name,
        username: GlobalVars.Authentication.userInfo.username,
        sip: justasip
    }).then(function () {
        if (GlobalVars.friendsList) {
            for (let key in GlobalVars.friendsList) {
                sendNotification(GlobalVars.friendsList[key], GlobalVars.Authentication.userInfo.name + ' took a ' + (justasip ? 'sip!' : ' drink!'), (justasip ? 'It\'s just a sip, you can catch up.' : 'They took a whole drink, time to step your game up 💪'))
            }
        }
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
        let drinkcount: number = 0;
        let sipscount: number = 0;
        let todaydate = convertTimestampToDate(new Date());
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

            let drinkdate = convertTimestampToDate(drink.data().timestamp.toDate());
            if (drinkdate === todaydate) {
                if (!drink.data().sip) {
                    drinkcount += 1;
                } else {
                    sipscount += 1;
                }
            }
            $$('#drinkloglist').append(fritem);
        });
        if (first) {
            $$('#drinkloglist').html('<img src="img/empty.svg" alt="No drinks" class="backgroundsvg">');
            $$('#drinkloglist').append('<center><p>You haven\'t drank anything! Pick up a glass of water!!</p></center>');
        }
        drinkcount += sipscount / 3;
        let gaugevalue: number = drinkcount / 10;
        if (gaugevalue > 1) {
            gaugevalue = 1;
        }
        let drinkloggauge = app.gauge.create({
            el: '.drinkloggauge',
            type: 'semicircle',
            value: gaugevalue,
            borderColor: '#2196f3',
            valueText: Math.floor((gaugevalue * 10)) + ' / 10',
            labelText: 'Today\'s Progress'
        });
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

function loadFriend(userid: string) {
    app.popup.close();
    app.popup.open('.popup-friend');
    mainFirebase.firestore().collection('users').doc(userid).get().then(function (uinfo: any) {
        $$('.popup_friend_title').html(uinfo.data().name + ' | ' + uinfo.data().username);
        mainFirebase.firestore().collection('drinks').where('userid', '==', userid).orderBy('timestamp', 'desc').get().then(function (drinks: any) {
            let first = true;
            let drinkcount: number = 0;
            let sipscount: number = 0;
            let todaydate = convertTimestampToDate(new Date());
            drinks.forEach(function (drink: any) {
                if (first) {
                    first = false;
                    $$('#frienddrinklog').html('');
                }
                //@ts-ignore
                let fritem: any = nunjucks.render('drinklogitemtemplate.html', {
                    timestamp: formatTimeStamp(drink.data().timestamp.toMillis()),
                    sip: drink.data().sip
                });
                let drinkdate = convertTimestampToDate(drink.data().timestamp.toDate());
                if (drinkdate === todaydate) {
                    if (!drink.data().sip) {
                        drinkcount += 1;
                    } else {
                        sipscount += 1;
                    }
                }
                $$('#frienddrinklog').append(fritem);
            });
            if (first) {
                $$('#frienddrinklog').html('<img src="img/empty.svg" alt="No drinks" class="backgroundsvg">');
                $$('#frienddrinklog').append('<center><p>This friend hasn\'t drank anything yet. Go yell at them!</p></center>');
            }
            drinkcount += sipscount / 3;
            let gaugevalue: number = drinkcount / 10;
            if (gaugevalue > 1) {
                gaugevalue = 1;
            }
            let frienddrinkloggauge = app.gauge.create({
                el: '.friendgauge',
                type: 'semicircle',
                value: gaugevalue,
                borderColor: '#2196f3',
                valueText: Math.floor((gaugevalue * 10)) + ' / 10',
                labelText: 'Today\'s Progress'
            });
        });
    });
}

function displayNotifications() {
    app.popup.open('.popup-notifications');
    refreshNotifications();
}

function refreshNotifications() {
    mainFirebase.firestore().collection('users').doc(mainFirebase.auth().currentUser.uid).collection('notifications').orderBy('timestamp', 'desc').get().then(function (notifications: any) {
        let first = true;
        notifications.forEach(function (notification: any) {
            if (first) {
                first = false;
                $$('#notificationslist').html('');
            }
            //@ts-ignore
            let fritem = nunjucks.render('notificationitemtemplate.html', {
                title: notification.data().title,
                body: notification.data().body,
                timestamp: formatTimeStamp(notification.data().timestamp.toMillis())
            });
            $$('#notificationslist').append(fritem);
        });
        if (first) {
            $$('#notificationslist').html('<img src="img/nonotifications.svg" alt="No notifications" class="backgroundsvg">');
            $$('#notificationslist').append('<center><p>No notifications. You\'re all good!</p></center>');
        }
    });
}

function deleteNotification(notid: string) {
    mainFirebase.firestore().collection('users').doc(mainFirebase.auth().currentUser.uid).collection('notifications').doc(notid).delete().then(function () {
        //wait to see if we need to refresh notifications
    });
}

function sendNotification(userto: string, title: string, body = '') {
    mainFirebase.firestore().collection('users').doc(userto).collection('notifications').add({
        //@ts-ignore
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        title: title,
        body: body
    });
}