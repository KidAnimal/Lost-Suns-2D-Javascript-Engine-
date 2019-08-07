let game = angular.module("game",
    [
        'ngStorage',
        'LocalStorageModule',
        'ngRoute'
    ]);

//Creates routes for the game so that infromation can be loaded while playing 

game.config(['$routeProvider', function ($routeProvider) {
    console.log("This is a Router Test");

    $routeProvider
        .when("/login", {
            templateUrl: "views/login.html",
            controller: 'gameController'
        })
        .when("/instructions", {
            templateUrl: "views/instructions.html",
            controller: "gameController"
        })
        .when("/game", {
            templateUrl: "views/game.html",
            controller: "gameController"
        })
        .otherwise({
            redirectTo: "/brokenURL.html"
        })
}]);

//Sets up the game controller

game.controller('gameController', function ($scope, $timeout, $interval) {

    window.localStorage.getItem('user');
    $scope.characterName = "Edgar Anem";

    $scope.characterType = "Soldier";
    $scope.userName = "Edgar";
    $scope.region = "Europe"
    $scope.delimiter = "_";

    let user=[{
        userName:$scope.userName,
        region:$scope.region
    }];
    $scope.onSubmit = function()
    {
        user.push({userName:$scope.userName,region:$scope.region});
        window.localStorage.setItem('user',JSON.stringify(user));
        // $scope.characterName = user[0].userName;
        console.log('Submitted New User');
    }

//Calls local storage information and outputs it to the screen. 

    $scope.items = JSON.parse(window.localStorage.getItem('undefined'));
    $scope.boss = JSON.parse(window.localStorage.getItem("boss"));
    $scope.character = JSON.parse(window.localStorage.getItem("character"));
    
    let timer = 0;

//This is an in game timer which is used to update the angularJS so that the $watch function gets called.

    $interval(function(){
        timer++;
        $scope.count = timer;
    },1000)
    
//This watches the javascript file and updates each time bAtkDebounced is called \
//or something is updated int he Angular File

    $scope.$watch(bAtkDebounced, function () {
        let id = 0;

        $scope.character = JSON.parse(window.localStorage.getItem("character"));
        $scope.characterHealth = character[id].health;
        
        $scope.boss = JSON.parse(window.localStorage.getItem("boss"));
        $scope.bossName = bossArray[id].name;
        $scope.bossType = bossArray[id].type;
        $scope.bossHealth = bossArray[id].health;
    })

//This explains the game's rules throught the Timeout Service 

    $scope.dialogue = "This Game Follows Basic W,A,S,D Movement Controls";
    $timeout(function () {
        $scope.dialogue = "You can attack with space bar when in range of the enemy";
    }, 4000);
    $timeout(function () {
        $scope.dialogue = "If you click shift when the enemy attacks you will parry";
    }, 8000);
    $timeout(function () {
        $scope.dialogue = "If you hit shift at any other time you will shoot a projectile";
    }, 10000);

//This Scope will hide the total game item list when, and when clicked reveal them 
    $scope.isVisible = false;
    $scope.showHide = function () {
            $scope.isInvisible = $scope.isVisible = true;
        }
});

//This filter will check for white space and fill in any with an underscore.
    game.filter('validate', function () {

        var regex = /\s/g

		//if statements to determine input and set default tokenizer
		return function (value, coalesce) {
			if (angular.isString(value)) {
				if (coalesce == "") {
					return value.replace(regex, "_");
				}
				if (coalesce == undefined) {
					return value.replace(regex, "_");
				}
			} else {
				return value;
			}
		}
    });