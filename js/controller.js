var app = angular.module('homePageApp', ["ngAnimate"]);
app.filter('html',function($sce){
    return function(input){
        return $sce.trustAsHtml(input);
    };
});
app.filter('FractionCurrency',function($sce){
    return function(input){
        return parseFloat(Math.abs(input).toString().split('.')[1]);
    };
});
app.filter('utfdecode', function($sce){
    return function(input){
        var rData = input;
        try{ 
            rData = decodeURIComponent(escape(input))
        }
        catch(e){

        }
        return rData;
    };
});
app.filter('NA', function($sce){
    return function(input){
        if(input == null || input == '')
            return 'NA';
        else
            return input
    };
});
var firstElement = null;
app.controller('homePageController', function($scope,$q, $http,$rootScope , $timeout,$window) {
    $scope.limit = 5;
    $scope.offset = 5;
    $scope.loader = true;
    $scope.myVar="INFO";
    $scope.openMovieBoxId = '';
    $scope.sectionId = '';
    $scope.castCrew = {};
    $scope.planListing;
    $scope.genreList;
    $scope.reviews;
    $scope.comment = '';
    $scope.ViewFavourite=[];
    $rootScope.reviewRating = 0;
    $scope.isDisabled = false;
    $scope.ratings = {
        current: 3,
        max: 5
    };
    $scope.content = {model:''};
    $scope.getFavouriteList=function(obj){
        $scope.ViewFavourite = [];
        var url = HTTP_ROOT+"/rest/ViewFavourite?authToken="+STORE_AUTH_TOKEN;
        var config = {
            headers: {
                'Content-Type': "application/json",
                'authToken': STORE_AUTH_TOKEN,
                'user_id': user_id
            }
        };
        var data = { };
        $http.post(url, data,config).then(function(response){
            $timeout(function (){
            if(response.data.movieList && response.data.movieList.length>0)
            {
                 $scope.ViewFavourite=response.data.movieList;
                 const items = document.querySelectorAll('div.favourite');
                      
                      // loop through list items and add listener to click event
                      for (const item of items) {
                        var content = JSON.parse(item.dataset.content); 
                        var status = $scope.ViewFavourite.findIndex( data => data.movie_id == content.movie_id ); 
                        if(status>=0){
                            item.firstElementChild.style.color = '#67bdf7'
                        }else{
                          item.firstElementChild.style.color = '#fff'
                        }

                      }

            }
        },10);
        });

      }

    if(user_id>0){
        $scope.getFavouriteList();
      }
    $q.all([
        $http.get(HTTP_ROOT+"/rest/loadFeaturedSections?authToken="+STORE_AUTH_TOKEN+"&dataoffset=1&viewlimit=4&lang_code="+ lang_code),
        $http.get(HTTP_ROOT+"/rest/loadFeaturedSections?authToken="+STORE_AUTH_TOKEN+"&dataoffset=5&viewlimit=1&lang_code="+ lang_code),
        $http.get(HTTP_ROOT+"/rest/loadFeaturedSections?authToken="+STORE_AUTH_TOKEN+"&dataoffset=6&viewlimit=1&lang_code="+ lang_code),
        $http.get(HTTP_ROOT+"/rest/loadFeaturedSections?authToken="+STORE_AUTH_TOKEN+"&dataoffset=7&viewlimit=1lang_code="+ lang_code),
        $http.get(HTTP_ROOT+"/rest/getCategoryList?authToken="+STORE_AUTH_TOKEN+"&dataoffset=1&viewlimit="+$scope.limit+"&lang_code="+ lang_code),
        $http.get(HTTP_ROOT+"/rest/getStudioPlanLists?authToken="+STORE_AUTH_TOKEN+"&lang_code="+ lang_code),
        
      ]).then(function(response) {
        
         $scope.featured_section = response[0].data;
         $scope.single_movie_section = response[1].data.section[0].contents[0];
         $scope.best_movie_section = response[2].data;
         $scope.want_movie_section = response[3].data;
         $scope.categoryList = response[4].data;
         $scope.planListing = response[5].data;
         $timeout(function () {
            $scope.loader = false;  
        }, 10);
           
        
      });
  
     

      $scope.checkFavourite=function(obj){
        var status = $scope.ViewFavourite.findIndex( data => data.movie_id == obj.movie_id ); 
            if(status>0){
                return '#67bdf7';
            }else{
                return '#fff';
            }
       }
       $scope.addToFav = function(obj,ele){
            if(user_id>0){
                if(ele.srcElement.style.color == "rgb(103, 189, 247)"){
                    fav_status = 0;
                    ele.srcElement.style.color = "rgb(255, 255, 255)"
                }else{
                    fav_status = 1; 
                    ele.srcElement.style.color = "rgb(103, 189, 247)"
                } 
                $scope.Favourite(obj.movie_id,fav_status)
            }else{
                $("#loginModal").modal('show');
                var input_field = '<div id="fav_input"><input type="hidden" name="add_to_fav" id="add_to_fav" value="1" /><input type="hidden" name="content_type"  id="content_type" value="'+content_type+'" /></div>';
                $("#loginModal .popup_bottom").append(input_field);
                if(content_type == 1){
                    $("#stream_id").val(content_id);
                }else{
                    $("#movie_id").val(content_id);
                }
            }
       }
  
       $scope.Favourite = function(obj,action){
      
        var url = HTTP_ROOT+"/user/addtofavlist/";
        $.ajax({
            url: url,
            data: {'content_id': obj, 'content_type': 0,'login_status':true,'action':action},
            type: 'POST',
            headers: {"X-PJAX":"true","X-PJAX-Container":"#main"},
            success: function (res) {
                $scope.getFavouriteList();
            }
        }); 

       }
    // $http.get(HTTP_ROOT+"/rest/loadFeaturedSections?authToken="+STORE_AUTH_TOKEN+"&dataoffset="+$scope.offset+"&viewlimit="+$scope.limit+"&lang_code={/literal}{$this->language_code}{literal}").then(function(response) {
    //     $scope.featured_section = response.data;     
    //     $scope.loader = false;       
    // }); 
    // $http.get(HTTP_ROOT+"/rest/getGenreList?authToken="+STORE_AUTH_TOKEN+"&dataoffset="+$scope.offset+"&viewlimit="+$scope.limit+"&lang_code={/literal}{$this->language_code}{literal}").then(function(response) {
    //    console.log(response.data);     
             
    // });   
    
    $scope.RelatedMovieContent = [];
    $scope.RelatedContent = function(movie_id,movie_stream_id){
        $http.get(HTTP_ROOT+"/rest/RelatedContent?authToken="+STORE_AUTH_TOKEN+"&content_id="+movie_id+"&content_stream_id="+movie_stream_id+"&lang_code="+ lang_code).then(function(response) {
           $scope.RelatedMovieContent = response.data;
           if($scope.RelatedMovieContent.status == "failure"){
            $scope.RelatedMovieContent.contentData = [];
           }
        }); 
    };

    $scope.castCrewListing = function(movie_id,movie_stream_id){
        $http.get(HTTP_ROOT+"/rest/GetCastList?authToken="+STORE_AUTH_TOKEN+"&content_id="+movie_id+"&content_stream_id="+movie_stream_id+"&lang_code="+ lang_code).then(function(response) {
            $scope.castCrew = response.data;
        }); 
    };
    $scope.reviewListing = function(movie_id ){
        $http.get(HTTP_ROOT+"/rest/Reviews?authToken="+STORE_AUTH_TOKEN+"&content_id="+movie_id+"&lang_code="+ lang_code).then(function(response) {
            $scope.reviews = response.data;
           
        }); 
    };

    $scope.tabDetailPage =function(movie_id = null,movie_stream_id = null, id){
            $('.tab-content').find('.active').removeClass('active');
            if(id == "related_films"){
                $scope.RelatedMovieContent= [];
                $scope.RelatedContent(movie_id,movie_stream_id);
            }else if(id == "review"){
                $scope.reviews={};
                $scope.reviewListing(movie_id);
            }else if(id == "cast_crew"){
                $scope.castCrew= {};
                $scope.castCrewListing(movie_id,movie_stream_id);
            }
            $("#" + id).addClass('active');
    }
  
    $scope.preSlider = function(index){
        $('#'+index).data('owl.carousel').prev();
       
    };
    $scope.nextSlider = function(index){
        $('#'+index).data('owl.carousel').next();
    };
    
    $scope.openMovieBox = function(open_movie_id, section_id){                        
        $scope.$apply(function(){
            $scope.myVar="INFO";
            $scope.openMovieBoxId = open_movie_id;
            $scope.sectionId = section_id;
        });
        $timeout(function () {
            $('html, body').animate({
                scrollTop: $("#"+section_id).offset().top + 210
              }, 1000)
        }, 1);
    }; 
    $scope.tab = function( nav ,movie_id=null ,movie_stream_id=null){
            $scope.myVar = nav;
        if(nav=='RELATED_FILMS' && movie_id!=null && movie_stream_id!=null){
            $scope.RelatedMovieContent= [];
            $scope.RelatedContent(movie_id,movie_stream_id);
        }
        else if(nav=='CAST_CREW' && movie_id!=null && movie_stream_id!=null){
            $scope.castCrew= {};
            $scope.castCrewListing(movie_id,movie_stream_id);
        }
        else if (nav=='REVIEWS' && movie_id!=null){
            $scope.reviews={};
            $scope.reviewListing(movie_id)
        }
      
    };
    $scope.margeArray = function (data){
        var casting = [];
        if(data){
            if(data.actor){
                for (let actor of data.actor) {
                    casting.push(actor);
                }
            }
            if(data.actress){
                for (let actress of data.actress) {
                    casting.push(actress);
                }
            }
            if(data.director){
                for (let director of data.director) {
                    casting.push(director);
                }
            }
        }
        return casting;
    };

    $scope.convertToMin = function(time){
       if(time != null && time != "")
        return (time.split(":")[0] * 60 + parseInt(time.split(":")[1]) + ' mins');
        else
        return 'NA min';
    }
   
    $scope.reviewResponse;
    $scope.reviweCommentPost = function(content,movie_id){
        $scope.isDisabled = true;
        var comment = content.model;
        if( comment == '' ||  comment == undefined || comment == null) {
            $scope.reviewResponse = { msg: "Comment box cannot be blank" };
            $scope.isDisabled = false;
                return 0;
        }
        var url = HTTP_ROOT+"/rest/Savereview?authToken="+STORE_AUTH_TOKEN;
        var config = {
            headers: {
                'Content-Type': "application/json",
                "content_id" : movie_id,
                "user_id"   : user_id,
                "rating"    :  $rootScope.reviewRating,
                "review_comment" : comment
            }
        };
        var data = { };
        $http.post(url, data,config).then(function(response){
            $scope.reviewResponse = response.data;
            if( $scope.reviewResponse.status == "Failure" ||  $scope.reviewResponse.status =="Already Reviewed"){
                    
            } 
            else if($scope.reviewResponse.code == 406){
                window.location.href = '/user/login';
            }
            else{
                content.model = ''
                content.all_comments = parseInt(content.all_comments) + 1;
                $rootScope.reviewRating = 0;
                $scope.reviews = {};
                $scope.reviewListing(movie_id);
            }
            $scope.isDisabled = false;
            $timeout(function () {
                $scope.reviewResponse = {};
                $rootScope.reviewRating = 0;
            }, 3000);
        }, 
        function(error){
            // failure callback
          
        });
        
    };
    $scope.closeMovieBox = function () {
        $scope.openMovieBoxId =0;
        $scope.sectionId = 0;
    };
    $scope.featured_section_load = {section :[]};
    $scope.loader2 = false;
    $scope.sectionLength = true;
    $scope.loadMore = function () {
        $scope.offset += 5;
        $scope.loader2 = true;
        $http.get(HTTP_ROOT+"/rest/loadFeaturedSections?authToken="+STORE_AUTH_TOKEN+"&dataoffset="+$scope.offset+"&viewlimit="+$scope.limit+"&lang_code="+ lang_code).then(function(response) {
            $scope.loader2 = false;
            if(response.data.section.length > 0){
                if( $scope.featured_section_load.section.length>0 ){
                    for(var i=0; i<response.data.section.length ; i++){
                        $scope.featured_section_load.section.push(response.data.section[i]);
                    }
                   
                }else{
                    $scope.featured_section_load = response.data;
                }
            }else{
                $scope.sectionLength = false;
            }
           
          
        });
    };

    $scope.castPrint = function(objCast){
        var cast = "";
        for(key in objCast) {
            if(objCast.hasOwnProperty(key)) {
                var value = objCast[key];
                if(cast == ""){
                    cast = value;
                }else{
                    cast = cast +", " +value;
                }
                
                //do something with value;
            }
        }
        return cast;
    }

    $scope.addFav = function (obj,id){
       var fav_status;
        if(user_id>0){
           if($('#'+ id+'_'+obj.movie_id).hasClass('fa-heart-o')){
            obj.favAdd = 0
            fav_status = 0;
            $('#'+ id+'_'+obj.movie_id).addClass('fa-heart')
        }else{
            obj.favAdd = 1
            fav_status = 1; 
            $('#'+ id+'_'+obj.movie_id).addClass('fa-heart-o')
        } 
        $scope.Favourite(obj.movie_id,fav_status)
        //addFavContent(obj.movie_id, obj.is_episode, true, fav_status);
    }else{
        $("#loginModal").modal('show');
        var input_field = '<div id="fav_input"><input type="hidden" name="add_to_fav" id="add_to_fav" value="1" /><input type="hidden" name="content_type"  id="content_type" value="'+content_type+'" /></div>';
        $("#loginModal .popup_bottom").append(input_field);
        if(content_type == 1){
            $("#stream_id").val(content_id);
        }else{
            $("#movie_id").val(content_id);
        }
    }
    }
    $scope.firstElement = null;
});


app.directive("owlCarousel", function($timeout) {
    return {
        restrict: 'E',
        transclude: false,
        scope: true,
        link: function (scope) {
            
            scope.initCarousel = function(element) {                                      
                var defaultOptions = {
                    nav: false,
                    margin: 10,
                    autoHeight: false,
                    autoWidth: true,
                    pagination:false, 
                    dots: false,
                    loop  : true,
                    responsive: {
                        0: {
                            items: 1,
                        },
                        600: {
                            items: 3,
                        },
                        960: {
                            items: 4,
                        },
                        1200: {
                            items: 6,
                        }
                    }
                };
               
                var customOptions = scope.$eval($(element).attr('data-options'));                    
                for(var key in customOptions) {
                    defaultOptions[key] = customOptions[key];
                }
                $timeout(function () {
                    var owl = $(element);
                    owl.owlCarousel(defaultOptions);   
                    $(element).on('click', 'a.more_info1', function(el) { 
                        var open_movie_id = el.currentTarget.dataset.id;   
                        var sectionId =el.currentTarget.dataset.sectionid;                
                        scope.openMovieBox(open_movie_id, sectionId)
                        if(firstElement){
                            $(firstElement).attr('class' , 'tile__img');
                        }
                      
                    });
                    $(element).on('click', 'li.favourite1', function(el) { 
                        var content = JSON.parse(el.currentTarget.dataset.content);   
                        var checkFavourite = el.currentTarget.dataset.checkfavourite;
                        scope.addToFav(content,el)
                    });
                  
                      
                      // reference to all list items
                      
                

                    $(element).find('img.tile__img').bind('click',function(el){
                        var open_movie_id = el.currentTarget.dataset.id;   
                        var sectionId = el.currentTarget.dataset.sectionid;
                     
                        if(open_movie_id != undefined && sectionId != undefined){
                            if(firstElement){
                                $(firstElement).attr('class' , 'tile__img');
                                firstElement = $(this);
                            }else{
                                firstElement = $(this);
                            }
                            $(firstElement).attr('class' , 'tile__img active');
                            scope.openMovieBox(open_movie_id, sectionId);   
                        }
                                         
                    });
                    
                }, 1);
               
            };
          
        }
    };
});
app.directive('owlCarouselItem', function($timeout) {
    return {
        restrict: 'EA',
        transclude: false,
        scope: true,
        link: function(scope, element) {              
            if(scope.$last) {
                scope.initCarousel(element.parent());                    
            }
           
        }
    };
});

app.directive('owlNavigationPrev', [function(scope, element) {
    return {
        restrict: 'E',            
        template: ' <a class="backward owl-next" href="javascript:void(0)" ng-click="preSlider(fs.id)"></a>'
    };
}]);
app.directive('owlNavigationNext', [function(scope, element) {
    return {
        restrict: 'E',            
        template: '<a class="forward owl-next" href="javascript:void(0)" ng-click="nextSlider(fs.id)"></a>'      
    };
}]); 
app.directive('starRating', function () {    
    return {
        scope: {
            rating: '=',
            maxRating: '@',
            readOnly: '@',
            click: "&",
            mouseHover: "&",
            mouseLeave: "&"
        },
        restrict: 'EA',
        template:
            `<div style='display: inline-block; margin: 0px; padding: 0px; cursor:pointer;' ng-repeat='idx in maxRatings track by $index'>
                    <img ng-src='{{((hoverValue + _rating) <= $index) && "http://www.codeproject.com/script/ratings/images/star-empty-lg.png" || "http://www.codeproject.com/script/ratings/images/star-fill-lg.png"}}' 
                    ng-Click='isolatedClick($index + 1)' 
                    ng-mouseenter='isolatedMouseHover($index + 1)' 
                    ng-mouseleave='isolatedMouseLeave($index + 1)'></img> 
            </div>`,
        compile: function (element, attrs) {
            if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                attrs.maxRating = '5';
            };
        },
        controller: function ($scope, $element, $attrs, $rootScope) {
            $scope.maxRatings = [];

            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push({});
            };

            $scope._rating = $scope.rating;
			
			$scope.isolatedClick = function (param) {
				if ($scope.readOnly == 'true') return;
                $scope.rating = $scope._rating = param;
                $rootScope.reviewRating = param;
                
				$scope.hoverValue = 0;
				$scope.click({
					param: param
				});
			};

			$scope.isolatedMouseHover = function (param) {
				if ($scope.readOnly == 'true') return;

				$scope._rating = 0;
				$scope.hoverValue = param;
				$scope.mouseHover({
					param: param
				});
			};

			$scope.isolatedMouseLeave = function (param) {
				if ($scope.readOnly == 'true') return;

				$scope._rating = $scope.rating;
				$scope.hoverValue = 0;
				$scope.mouseLeave({
					param: param
				});
			};
        }
    };
});

app.directive('myMaxlength', ['$compile', '$log', function($compile, $log) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            attrs.$set("ngTrim", "false");
            var maxlength = parseInt(attrs.myMaxlength, 10);
            ctrl.$parsers.push(function (value) {
               // $log.info("In parser function value = [" + value + "].");
                if (value.length > maxlength)
                {
                    //$log.info("The value [" + value + "] is too long!");
                    value = value.substr(0, maxlength);
                    ctrl.$setViewValue(value);
                    ctrl.$render();
                    //$log.info("The value is now truncated as [" + value + "].");
                }
                return value;
            });
        }
    };
}]);


