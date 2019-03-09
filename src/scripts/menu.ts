function updateUserInfoMenuDisplay() {
    if (GlobalVars.Authentication.initialCheck) {
        $$('.menu_account_name').html(GlobalVars.Authentication.userInfo.name);
        $$('.menu_account_username').html(GlobalVars.Authentication.userInfo.username);
        removeSkeletonTextEffect('.menu_account_name');
        removeSkeletonTextEffect('.menu_account_username');
    }
}