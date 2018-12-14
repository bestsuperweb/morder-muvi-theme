var findEpisodesURL = HTTP_ROOT + "/content/findepisodes";
var loginurl = HTTP_ROOT + "/user/checklogin";
var comment_url = HTTP_ROOT+"/media/comment_add";
var delay = 1000, setTimeoutConst, setTimeoutConst1;
var loader=true;
var xhr = null;
var pageNumber = 1, scrollAmountTrigger = 400, offset = 0, limit = 2;
if ($("#limit").length > 0 ){
    limit = $("#limit").val();
}
if($("#page_size").length <=0){
fetchEpisodeContent(pageNumber, offset);
}else{
 fetchEpisodeContentnew();   
}
$(document).ready(function() {
    if ($("#season_price").length > 0) {
        checkSeasonPurchased();
    }
   
    $('#series').change(function() {
       
         $('#loader_episode').show();
        $('.allplay').addClass('hide');
	if($("#page_size").length <=0){
         if( xhr != null ) {
                xhr.abort();
                xhr = null;
        }    
      xhr=$.ajax({
            method: "POST",
            url: findEpisodesURL,
            dataType: "json",
            data: {'movie_id': $('#content_id').val(), 'series': $('#series').val(), 'limit': limit}
        }).done(function(res) {
            $("#episodes").html(res.msg);
            $('#loader_episode').hide();
            initializeContentData();
            loader = true;
            offset = limit;
            pageNumber = 1;
            fetchEpisodeContent(pageNumber, offset);
        });
	}else
	{
            fetchEpisodeContentnew();
	}
        if ($("#season_price").length > 0) {
            checkSeasonPurchased();
        }
    });

    $('.rating-tooltip-manual').rating({
        extendSymbol: function() {
            var title;
            $(this).tooltip({
                container: 'body',
                placement: 'bottom',
                trigger: 'manual',
                title: function() {
                    return title;
                }
            });
            $(this).on('rating.rateenter', function(e, rate) {
                title = rate;
                $(this).tooltip('show');
            })
                    .on('rating.rateleave', function() {
                        $(this).tooltip('hide');
                    });
        }
    });

    $('#watch_now').click(function() {
        $("#playbtn").trigger("click");
    });
});

$(document).ready(function() {

    $('.thumbnail').hover(
            function() {
                var obj = this;
                setTimeoutConst = setTimeout(function() {
                    $(obj).find('.caption').fadeIn('slow');
                }, 500);
            },
            function() {
                clearTimeout(setTimeoutConst);
                $(this).find('.caption').fadeOut('slow');
            }
    );
	//Save Review data
    $("#review").validate({
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                mail: true,
            },
            rate: {
                required: true,
                min: 1
            }
        },
        submitHandler: function(form) {
            $('#loader_review').show();
            $.ajax({
                url: HTTP_ROOT + "/RatingReview/savereview",
                data: $("#review").serialize(),
                dataType: 'json',
                method: 'post',
                success: function(result) {
                    if (result.status == 'success')
                    {
                        $('#loader_review').hide();  
                        location.reload();
                    }
                    else
                    {
                        $('#loader_review').hide();  
                        $('#review_error').html(result.message);
                        return false;
                    }
                }
            });
        }
    });
    $('.post-comment').click(function (e) { 
        var movie_id = $(this).attr('data-content_id');
        var com_text = $('#commentfield').val();
        $("#commentform").validate({
            rules: {
                "commentfield": {
                    required: true
                }
            },
            submitHandler: function (form) {

                $.ajax({
                    method: "POST",
                    url: loginurl,
                    beforeSend: function () {
                     $('#comment_loader').show();
                    },
                    success: function (res) {
                        if (parseInt(res) === 1) {
                            if (com_text != "") {
                                $.post(comment_url, {com_text: com_text, movie_id: movie_id}, function (res) {
                                    $("#comment_box").val("");
                                    $('#commentfield').val('');
                                    $("#comment_list").html(res);
                                    $('#comment_loader').hide();
                                });
                            }
                        } else {
                            $('#comment_loader').hide();
                            $("#loginModal").modal('show');
                            return false;
                        }
                    }
                });

            }
        });
    });
    
    $('.comment-reply-btn').click(function(e){
        e.preventDefault();        
        var reply_form = $(this).closest('form');
        var reply_loader = reply_form.find('.loader');
        var parent_id = $(this).attr('data-parent_id');
        var movie_id = $(this).attr('data-content_id');         
        $.ajax({
            method: "POST",
            url: loginurl,
            beforeSend: function () {
                reply_loader.show();
            },
            success: function(res){
                if (parseInt(res) === 1) {                    
                    var reply_text = reply_form.find("[name='reply_text']").val();
                    $.post(comment_url, {com_text: reply_text, movie_id: movie_id, parent_id: parent_id}, function (reply_msg) {
                        reply_loader.hide();
                        reply_form.find("[name='reply_text']").val('');
                        $("#comment_list").html(reply_msg);
                    });
                } else {
                    reply_loader.hide();
                    $("#loginModal").modal('show');
                    return false;
                }            
            }   
        });
    });
});    

function initializeContentData() {
    $(".playbtn").click(function () {
        $('#loader').show();
        var movie_id = $(this).attr('data-movie_id');
        var stream_id = $(this).attr('data-stream_id');
        var isppv = $(this).attr('data-isppv');
        var is_ppv_bundle = $(this).attr('data-is_ppv_bundle');
        var isadv = $(this).attr('data-isadv');
    
        if (typeof isadv !== typeof undefined && isadv !== false) {

        } else {
            isadv = 0;
        }
    
        var permalink = $(this).attr("data-content-permalink");
        var contentTypePermalink = $(this).attr("data-content-type-permalink");

        $('#loginModal').on('show.bs.modal', function (e) {
            $('#loader').hide();
            $("#movie_id").val(movie_id);
            $("#stream_id").val(stream_id);
            $("#isppv").val(isppv);
            $("#is_ppv_bundle").val(is_ppv_bundle);
            $("#isadv").val(isadv);
            $('#content-permalink').val(permalink);
            $('#content-type-permalink').val(contentTypePermalink);
        });
    });
}
function fetchEpisodeContent(pageNumber, offset)
{
    pageNumber++;
    if (pageNumber != 2) {
        offset = parseInt(offset) + parseInt(limit);
    }
    if ($("#episodes").length > 0) {
        $('#loader_episode').show();
      xhr=$.ajax({
            method: "POST",
            url: findEpisodesURL,
            dataType: "json",
            data: {'movie_id': $('#content_id').val(), 'series': $('#series').val(), 'offset': offset, 'limit': limit}
        }).done(function(res) {
            $('#loader_episode').hide();
            if ($.trim(res.status) == "success") {
                $("#episodes").append(res.msg);
                initializeContentData();
                if (loader) {
                    fetchEpisodeContent(pageNumber, offset);
                }
            } else {
                loader = false;
            }
        });
    }

}

function fetchEpisodeContentnew()
{
 $('#loader_episode').show();
 
   xhr = $.ajax({
            method: "POST",
            url: findEpisodesURL,
            dataType:"json",
            data: {'movie_id': $('#content_id').val(), 'series': $('#series').val(), 'offset': 0, 'limit' : limit}
        }).done(function (res) {
            $('#loader_episode').hide();
            if($.trim(res.status) == "success"){
                $("#episodes").html(res.msg);
                //initializeContentData();
                getpagination(res.msg);
            }else{
                loader = false;
            }
        });  
    
}

function getpagination(res)
{
    
        var mydata = $(res).find('data-count');    
        var mydata1=$("#data-count1").val();
        var maxcount=$("#page_size").val();
        var regex = /\d+/g;
        var count = mydata.prevObject[0].outerHTML.match(regex);
       
        var page_size = $('#page_size').val();
        
        var total = parseInt(count)/parseInt(page_size);
       
        var maxVisible = total/2;
        
         if(maxVisible >= parseInt(maxcount)){
             maxVisible = parseInt(maxcount);
         }else{
             maxVisible = total;
         }

         if($('.page-selection-div').length){
            $('.page-selection-div').remove(); 
        }
        if(parseInt(count) < parseInt(page_size)  || parseInt(mydata1)<1){
            $('#page-selection').parent().hide();
        }else{
        if($('.page-selection-div').length){
            $('#page-selection').parent().show();
        }else{
            $('#episodes').after('<div class="page-selection-div"><div id="page-selection" class="pull-right"></div></div><div class="h-40"></div>');
            $('#page-selection').parent().show();
        }
    }
   $('#page-selection').bootpag({
       total: Math.ceil(total),
       page: 1,
       maxVisible: Math.round(maxVisible)
       }).on('page', function(event, num){
            $.post('/content/Findepisodes',{'page':num,'movie_id':$('#content_id').val(), 'series': $('#series').val()},function(res){               
                
                $('#episodes').html(res.msg);
                $('.loader').hide();
    },'json');
   });
}

function resize_player() {
    if (full_screen == false) {
        full_screen = true;
        var large_screen = setTimeout(function() {
            if (full_screen == true) {
            }
        }, 5000);
    } else {
        //clearTimeout(large_screen);
        full_screen = false;
    }
}
$( "#myTrailer" ).addClass( "section" );
(function(){
     var halfwidth= $(window).width();
     if(halfwidth > 800){
        halfwidth = halfwidth / 2;
     } else {
         halfwidth = halfwidth - (halfwidth/10);
     }
     var halfheight= $(window).height() / 2; 
     var type = $('#p_type').length?$('#p_type').val():''; /* physical or digital */
     $('.section').width(halfwidth);
     $('.section').height(halfheight);
	$('#myTrailer').hide();
	$("body").on('click', '#trailer-btn', function () {
		var trailer_url= HTTP_ROOT + "/ThirdParty/ThirdPartyList";
		var movie_id = $('#p_movieid').val();
		$.post(trailer_url,{movie_id: movie_id,halfheight: halfheight,halfwidth: halfwidth, type:type},function(res){
			$(".fancybox-inner").attr("style","width:" + halfwidth + "px !important; height :" + halfheight +"px !important;background : black !important;");
            $('.fancybox-wrap').width(''+halfwidth);
			$('#myTrailer').html(res);
			//$('.fancybox-overlay').click(function(){
			//e.preventDefault();   
			//$('.fancybox-overlay-fixed').css('display', 'none');
			//});
			$(".loader").hide();
		}); 
 $("#trailer-btn").fancybox({
            autoCenter:true,
            autoSize :false,
            autoHeight:true,
            width:halfwidth,
            fitToView:true,
            openEffect: 'none',
            closeEffect: 'none',
            closeBtn: false,
            titleShow: false,
            padding: 0,
			scrolling   : 'hidden',
			helpers: {
				overlay: {
				  locked: false 
				}
			},
            content: $('#myTrailer').show(),
    beforeShow: function () {
				$("body").css({'overflow-y':'hidden'});
                $(".fancybox-inner").attr("style", "width:" + halfwidth + "px !important; height :" + halfheight + "px !important;background : black !important;");
                $('.fancybox-wrap').width(''+halfwidth);
                $('#myTrailer').append('<iframe id="js_trailer_block" width="' + halfwidth + '" autoplay="true" allowfullscreen webkitallowfullscreen scrolling="no" height="' + halfheight + '" style="overflow:hidden" src="' + trailer_url + '?movie_id=' + movie_id + '&halfheight=' + halfheight + '&halfwidth=' + halfwidth + '&type=' + type + '&permalink=load"></iframe>');
               $(".fancybox-inner").attr("style","background: black");
               $(".fancybox-inner").append('<div style="display: block;" class="loader"></div>');
                },
            afterShow: function (instance, current) {
                setInterval(function(){$("#js_trailer_block").contents().find('#video_block').attr('style','margin-left: -7px;margin-top: -8px;');}, 1000);
                setTimeout(function(){ $('.loader').hide();}, 2000);
            },
            'afterClose': function () {
					$("body").css({'overflow-y':'visible'});
                    $('.fancybox-overlay-fixed').remove();
                    $("#myTrailer").hide();
                    $("#myTrailer").html("");
                } 
       });  
	});

 })();

function show_reply(parent_id) {
    $("#reply_area_" + parent_id).show();
}
function checkSeasonPurchased() {
    var season = $('#series').val();
    var ppv_plan_id = $('#ppv_plan_id').val();
    var user_id = $('#current_user_id').val();
    var movie_id = $('#movie_uniq_id').val();
	var movieId = $('#p_movieid').val();
    var checkSeason = 0;
    if($('#check_season').length > 0){
        checkSeason = $('#check_season').val();
    }
    var season_check_url = HTTP_ROOT + "/rest/iscontentauthorized";
    if (checkSeason == 1 && user_id > 0) {
        $.post(season_check_url, {user_id: user_id, movie_id: movie_id, season_id: season, purchase_type: 'season', authToken : STORE_AUTH_TOKEN}, function (res) {
            if (res.string_code == "allowed" || res.string_code == "already_purchased") {
                $('.buynow').css('display', 'none');
            } else {
                $('.buynow').css('display', 'inline-block');
                getSeasonPrice(season, ppv_plan_id, user_id, movieId);
            }
        });
    }else{
        getSeasonPrice(season, ppv_plan_id, user_id, movieId);
    }
}
function getSeasonPrice(season, ppv_plan_id, user_id, movieId) {
    var seasonPriceURL = HTTP_ROOT + "/user/getseasonprice/";
    $.ajax({
        method: "POST",
        url: seasonPriceURL,
        data: {'season': season, 'ppv_plan_id': ppv_plan_id, 'user_id': user_id, 'addBefore':1,'movie_id':movieId},
        success: function(res){
            if($.trim(res) !=""){
                if(res == 0){
                    res = "";
                }
                $("#season_price").html(res);
				$('.buynow').show();
            }else{
				$('.buynow').hide();
            }
        }
    });
}