function loadSignupPage() {
    mainView.router.navigate('signup');
}

function signupUser() {
    let sname = $$('input[name=signup_name]').val();
    let susername = $$('input[name=signup_username]').val();
    let semail = $$('input[name=signup_email]').val();
    let spassword = $$('input[name=signup_password]').val();
    if (!sname) {
        app.toast.show({ text: 'Please enter a valid name.' });
        return;
    }
    if (!susername) {
        app.toast.show({ text: 'Please enter a valid username.' });
        return;
    }
    if (!semail) {
        app.toast.show({ text: 'Please enter a valid email.' });
        return;
    }
    if (!spassword) {
        app.toast.show({ text: 'Please enter a valid password.' });
        return;
    }
    checkIfUsernameExists(susername).then(function (usernameexists: boolean) {
        if (usernameexists) {
            app.toast.show({ text: 'A user with that username already exists.' });
            return;
        } else {
            mainFirebase.auth().createUserWithEmailAndPassword(semail, spassword).then(function () {
                mainFirebase.firestore().collection('users').doc(mainFirebase.auth().currentUser.uid).set({
                    name: sname,
                    username: susername,
                    email: semail
                }).then(function () {
                    app.toast.show({
                        text: 'Successfully signed up.'
                    });
                    mainView.router.navigate('/');
                });
            });
        }
    });
}