/**
 * Created by Administrator on 2015.12.05..
 */
bb8_control.constant('routes', [
        {
            name: 'Kezdőképernyő',
            href: 'home'
        }
    ]
);

bb8_control.config(function($stateProvider, routes) {
        routes.forEach(function (route) {
            var stateName = route.href.split('?')[0]
            $stateProvider.state(stateName, {
                url: "/" + route.href,
                templateUrl: 'src/features/' + stateName + '/' + stateName + '.html'
            });
        });
    }
);

bb8_control.run(function($state){
   if(!$state.current.name || $state.current.name == ''){
        $state.go('home');
   }
});
