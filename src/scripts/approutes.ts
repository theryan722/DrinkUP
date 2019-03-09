var _APPROUTES = [
    {
        name: 'home',
        path: '/',
        url: 'pages/home.html',
        beforeEnter: [routerCheckUserAuthentication]
    },
    {
        name: 'signin',
        path: '/signin',
        async(routeTo: any, routeFrom: any, resolve: any, reject: any) {
            if (userIsLoggedIn()) {
                reject();
                mainView.router.navigate('/');
            } else {
                resolve({
                    url: 'pages/signin.html'
                });
            }
        }
    },
    {
        name: 'signup',
        path: '/signup',
        async(routeTo: any, routeFrom: any, resolve: any, reject: any) {
            if (userIsLoggedIn()) {
                reject();
                mainView.router.navigate('/');
            } else {
                resolve({
                    url: 'pages/signup.html'
                });
            }
        }
    }
];