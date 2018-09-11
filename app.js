var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http, $interval,$window, $filter,$location, anchorSmoothScroll) {
    //INITIALIZING SCOPE VARIABLES
    $scope.listOfMovies=[];
    $scope.filteredlistOfMovies=[];
    $scope.showMovieDetails=false;
    $scope.details=null;
    $scope.searchOn='';
    $scope.orderProperty='movie_title';
    $scope.languages=[];
    $scope.countries=[];
    $scope.languageFilter=[];
    $scope.languageFilterModel=[];
    $scope.countryFilter=[];
    $scope.countryFilterModel=[];

    //FUNCTIONS FOR FILTERING
    $scope.updateLanguage=function(lang,trueOrFalse){
    	if(trueOrFalse)
    		$scope.languageFilterModel.push(lang);
    	else
    		$scope.languageFilterModel.splice($scope.languageFilterModel.indexOf(lang), 1);
    }

    $scope.updateCountry=function(coun,trueOrFalse){
    	if(trueOrFalse)
    		$scope.countryFilterModel.push(coun);
    	else
    		$scope.countryFilterModel.splice($scope.countryFilterModel.indexOf(coun), 1);
    }

    $scope.filterValues=function(){
    	$scope.filteredlistOfMovies=[];
    	angular.forEach($scope.listOfMovies, function(nValue, nKey){
    		if($scope.countryFilterModel.includes(nValue.country) || $scope.languageFilterModel.includes(nValue.language))
    			$scope.filteredlistOfMovies.push(nValue);
    	})
    }

    $scope.clearFilter=function(){
    	$scope.filteredlistOfMovies=$scope.listOfMovies;
    }
    //END OF FUNCTIONS FOR FILTERING

    //MOVIE DETAILS SCREEN FUNCTIONS
    $scope.openMovieDetails=function(movie){
    	$window.scrollTo(0, 0);
    	$scope.showMovieDetails=true;
    	$scope.details=movie;
    }

    $scope.closeMovieDetails=function(){
    	$scope.showMovieDetails=false;
    	$scope.details=null;
    }
	//END OF MOVIE DETAILS SCREEN FUNCTIONS

	//SORT FUNCTIONS
    $scope.orderByProperty=function(type){
    	$scope.orderProperty=type;
    }
    

    //SCROLLING THROUGH VIEW ALL
    $scope.gotoElement = function (eID){
      $location.hash(eID);
      anchorSmoothScroll.scrollTo(eID);
      
    };

    
    //FUNCTION TO GET GENRES AND PLOTS SEPERATELY
    $scope.getListItems=function(stringValue){
    	if(stringValue==null)
    		return null;
    	return stringValue.split('|');
    }

    //API CALL TO GET ALL MOVIES
	function getListOfMovies(){
		$http.get("http://starlord.hackerearth.com/movieslisting")
		.then(function(response) {
			var counter = 0;
			//Inserting Dummy Rating
			angular.forEach(response.data, function(nvalue){
				if(counter>5){
					counter=0;
				}
				nvalue.rating=counter;
				counter=counter+0.5;
				$scope.listOfMovies.push(nvalue);
				if(!$scope.countries.includes(nvalue.country))
					$scope.countries.push(nvalue.country);
				if(!$scope.languages.includes(nvalue.language))
					$scope.languages.push(nvalue.language);
			});
			$scope.filteredlistOfMovies=$scope.listOfMovies;
		});
	}

    function initialize(){
    	getListOfMovies();
    }

    initialize();
});

//SERVICE FOR SMOOTH SCROLLING -- NOT AUTHORED BY ME, JUST USED FOR CONVIENIENCE PURPOSE
app.service('anchorSmoothScroll', function(){
    
    this.scrollTo = function(eID) {

        // This scrolling function 
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
        
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };
    
});