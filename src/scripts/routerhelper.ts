//Checks if user is logged in before loading route
function routerCheckUserAuthentication(routeTo: any, routeFrom: any, resolve: any, reject: any): any {
    if (userIsLoggedIn()) {
        console.log('aaa')
        resolve();
    } else {
        console.log('bbb')
        reject();
        loadSignInPage();
    }
}