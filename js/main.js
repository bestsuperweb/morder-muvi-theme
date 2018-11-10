


function ConfirmFavPopup(obj) {
    $("#deleteFav").modal('show');
    var header = $(obj).attr('data-header');
    var action_btn = $(obj).attr('data-button');
    $("#deleteFav").find("#Favbodymodal").text(header);
    $("#deleteFav").find('.action_btn').addClass(action_btn);
    $("." + action_btn).attr('data-content_id', $(obj).attr('data-content_id'));
    $("." + action_btn).attr('data-content_type', $(obj).attr('data-content_type'));
    $("#deleteFav").find('.action_btn').attr('onclick','deleteFavContent(this)');
}

function changeFldValue(data_input, calculation){
    var fld = $('.c-spinner input.' + data_input);
    var fldVlu = $('.c-spinner input.' + data_input).val();

    if(fldVlu != ''){
        if(calculation == "plus")
         fld.val(parseInt(fldVlu) + 1);
     else if(calculation == "minus"){
        if(fldVlu > 1)
            fld.val(parseInt(fldVlu) - 1);
    }
}
}
jQuery(document).ready(function($) {
    /*$("div#ap").on("DOMAttrModified",function(){
        if($(this).is(":visible")){
            $('footer').addClass('playerOn');
        }else{
            $('footer').removeClass('playerOn');
        }
    });*/    

    $('body').on('click', '.story-readmore', function(event) {
    	event.preventDefault();
    	/* Act on the event */
    	if ($(this).html() == 'READ MORE' ) {
    		$(this).html('READ LESS');
    		$(this).parent().children('.story-short').hide();
    		$(this).parent().children('.story-full').show();
    	}else{
    		$(this).html('READ MORE');
    		$(this).parent().children('.story-short').show();
    		$(this).parent().children('.story-full').hide();
    	}    	

    });


    $(window).scroll(function(event) {
      event.preventDefault();
      /* Act on the event */
      var top = $(this).scrollTop();
      if( top > 50){
        $('header.navbar-fixed-top').fadeOut(300);
        }else{
            $('header.navbar-fixed-top').fadeIn(300);
        }
    });

    $('body').on('click', function(e) {
        if ($.trim($(e.target).attr('class')) == "language-list" || $.trim($(e.target).attr('class')) == "fa fa-language") {
        } else {
            if ($('.language-list').attr('aria-describedby')) {
                $('.language-list').popover('hide');
                $('.popover').removeClass('in');
                $('.popover').remove();
                $('.language-list').removeAttr('aria-describedby');
            }
        }
    });

    var click_count = 1;
    if (is_audio_enable == 1){
        $('a').attr('data-pjax', '#main');
        $('.playbtn').removeAttr('data-pjax');
        $('.logout').removeAttr('data-pjax');
        $('.language-list').removeAttr('data-pjax');
        getPlaylistName(sdk_user_id);
    }
    $('.c-cart-toggler').removeAttr('data-pjax');
    $('a.managecontent').removeAttr('data-pjax');
    $('a.add-content-btn').removeAttr('data-pjax');
    $('a.edit-ugc-content').removeAttr('data-pjax');
    $('.c-menu-type-classic').click(function() {
        if ($(window).width() < 1280) {
            if (click_count % 2 != 0) {
                $(this).children('.dropdown-menu').css('display', 'block');
            } else {
                $(this).children('.dropdown-menu').css('display', 'none');
            }
            click_count++;
        }
    });
    soundOn();
    $('.playbtn').addClass('btn c-btn btn-lg c-font-bold c-font-white c-theme-btn c-btn-square c-font-uppercase');
    $('.close').click(function() {
        $('.loader').hide();
        $('.avatar-wrapper').html("");
        $('.avatar-input').html("");
    });
    $('.joinnow').addClass('btn btn-lg c-theme-btn c-btn-square c-btn-uppercase c-btn-bold');
    $('.joinnow').attr('data-animation', 'animated fadeInLeft');
    $('#avatar-modal').on('hidden.bs.modal', function() {
        $('.avatar-wrapper').html("");
        $('#avatarInput').val("");

    });
    $('#cancel_now').addClass('btn-lg c-theme-btn c-btn-square c-btn-uppercase c-btn-bold');
    $('.review_form h2').addClass('c-font-uppercase c-font-bold h3');

    $('<div class="c-line-left"></div>').insertAfter(".review_form h2");
    $('.review_form p .btn').addClass('c-font-white c-theme-btn c-btn-square c-font-uppercase btn_view_trailer_inside pull-right');
    $('<div class="clearfix"></div>').insertAfter('.casting .col-md-6:nth-child(2n)');

    // jQuery sticky Menu

    $(".mainmenu-area").sticky({topSpacing: 0});

    $('.product-carousel').owlCarousel({
        loop: true,
        navigation: true,
        navigationText: ['<i class="fa fa-3x fa-chevron-left"></i>', '<i class="fa fa-3x fa-chevron-right"></i>'],
        margin: 20,
        responsiveClass: true,
        rewindNav: false,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 3,
            },
            1000: {
                items: 5,
            }
        }
    });

    $('.related-products-carousel').owlCarousel({
        loop: true,
        nav: true,
        margin: 20,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 2,
            },
            1200: {
                items: 3,
            }
        }
    });

    $('.brand-list').owlCarousel({
        loop: true,
        nav: true,
        margin: 20,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 3,
            },
            1000: {
                items: 4,
            }
        }
    });

    $('[rel="popover"]').popover({
        container: 'body',
        html: true,
        content: function() {
            var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
            return clone;
        }
    }).click(function(e) {
        e.preventDefault();
    });

    //Shift Nav Caret Place From </a> to Parent <li/>
//    $('.navbar-nav >li > a > span.caret').each(function() {
//        //alert($(this).closest("a").attr("href"));
//        if ($(this).closest("a").attr("href") != "#") {
//
//            var aprentNode = $(this).closest("li");
//            $(this).detach().appendTo(aprentNode).addClass("mob-nav-caret");
//        }
//    });
$.widget("custom.catcomplete", $.ui.autocomplete, {
    _renderMenu: function (ul, items) {
        var self = this, currentCategory = "";
        $.each(items, function (index, item) {
                    /*for(var i in item){
                     alert(item[i]);
                 }*/
                 if (item.category != currentCategory) {
                        //alert(item.category);
                        ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                        currentCategory = item.category;
                    }

                    self._renderItemData(ul, item);
                });
    }
});
var category = "";
$("#siteSearchField").catcomplete({
    source: HTTP_ROOT + "/search/search/",
    minLength: 1,
    select: function (event, ui) {
        console.log(HTTP_ROOT);
        var I = ui.item;
        var searchCat = I.category;
        searchCat = searchCat.toLowerCase();
        var logurl = HTTP_ROOT + '/search/siteSearchLog';
        $.post(logurl, {'object_category': I.content_types, 'search_string': I.value, 'search_url': window.location.href, 'object_id': I.id}, function (res) {
            if (parseInt(searchCat.search(" - episode")) >= 0) {
                playAudio(I.stream_id);
            } else if (searchCat == 'star') {
                $.cookie("audio_star", '1');
                var cast_url = HTTP_ROOT + '/star/' + I.title;
                $.pjax({url: cast_url, container: '#main'});
                        //window.location = HTTP_ROOT + '/star/' + I.title;
                    } else {
                        $.cookie("audio_content", '1');
                        var content_url =  HTTP_ROOT + '/' + I.title;
                        $.pjax({url: content_url, container: '#main'});
                        //window.location = HTTP_ROOT + '/' + I.title;
                    }

                });
    }
});

var price   = $('div.ppv_price h1').eq(0).html();
console.log(price);
var btn     = $('a.playbtn').eq(0).html();
$('a.playbtn').eq(0).html(btn + ' ' + price );

});

//Make footer stick to bottom
var footerHeight = 0;
var footerTop = 0;
var footerObj = "";
$(function(){
    positionFooter();
})
$(window).bind("load", function() { 
    positionFooter();
    setInterval(function(){ 
     positionFooter();
 }, 3000);
});
$(window).bind("scroll", function() { 
    positionFooter();
});
$(window).bind("resize", function() { 
    positionFooter();
});

function positionFooter() {
    footerObj = $(".c-layout-footer");
    footerHeight = footerObj.height();
    footerTop = ($(window).scrollTop() + $(window).height() - footerHeight);
    if ($('body').hasClass('has-player'))
        footerTop = footerTop - $('#ap').height();
    footerTop = footerTop + "px";
    if (($(document.body).height() + footerHeight) < $(window).height()) {
        footerObj.css({
            position: "absolute",
            width: "100%"
        }).animate({
            top: footerTop
        });
    } else {
        footerObj.css({
            position: "static"
        });
    }
}


function initSlickSlider(currentObj){ //currently using for featured section
    $(currentObj).not('.slick-initialized').slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 6,
        customPadding: '40px',
        autoplay: false,
        autoplaySpeed: 3000,

        responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 4,
                infinite: false,
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1
            }
        }
        ]
    });
}
function episodeContent() {
    var movie_id = $('#content_id').val();
    var movie_type = $('#episode_type').val();
    if (movie_type == '6') {
        $(".loader_episode").show();
        var action_url = HTTP_ROOT + "/content/findepisodes";
        $.ajax({
            method: "POST",
            url: action_url,
            dataType: "json",
            data: {'movie_id': movie_id, 'limit': 9999}
        }).done(function (res) {
            $('.loader_episode').hide();
            $(".tracklist").html(res.msg);
            var total_track = '';
            var trackLang;
            if (res.status != 'failure') {
                total_track = $('.episode_total').val();
            }
            var date = $('.release_date').html();
            var cast = $('.cast_data').html();
            var cast_symbol = '';
            var release_symbol = '';

            if (cast) {
                cast_symbol = '<span class="symbol">&nbsp;-</span>&nbsp;&nbsp;';
            }
            if (date) {
                var release_symbol = '<span class="symbol">&nbsp;-</span>&nbsp;&nbsp;';
            }
            if(total_track == 1){
                trackLang = track;
            }else{
                trackLang = tracks;
            }
            if (total_track != '') {
                $('.symbol-release').addClass('hide');
                $('.tracks').html(cast_symbol + total_track + '&nbsp;' + trackLang + release_symbol);
            }
        });
    }
}
function soundOn(){
    $(".bar1").animate({height:'15px'}, 80, soundOn);
    $(".bar2").animate({height:'15px'}, 100);
    $(".bar3").animate({height:'15px'}, 100);
    $(".bar1").animate({height:'1px'}, 100);
    $(".bar2").animate({height:'15px'}, 100);
    $(".bar3").animate({height:'2px'}, 100);
    $(".bar1").animate({height:'3px'}, 100);
    $(".bar2").animate({height:'2px'}, 100);
    $(".bar3").animate({height:'1px'}, 100);
    $(".bar1").animate({height:'15px'}, 100);
    $(".bar2").animate({height:'2px'}, 100);
    $(".bar3").animate({height:'10px'}, 100);
    $(".bar1").animate({height:'12px'}, 100);
    $(".bar2").animate({height:'8px'}, 100);
    $(".bar3").animate({height:'12px'}, 100);
    $(".bar1").animate({height:'9px'}, 100);
    $(".bar2").animate({height:'12.5px'}, 100);
    $(".bar3").animate({height:'3px'}, 100);
}
function bannerLoad(autoScroll,interval,thumb_visibe){
    var autoScroll = $('#auto_scroll').val();
    var interval = $('#scroll_interval').val();
    var thumb_visibe = $('#active_thumb').val();
    initSliderOne();
    configSliderOne(thumb_visibe);
}
function submit_search(){
 var search_val = $("input[name='search_field']").val();
 if (search_val == "") {
    return false;
}
var event = HTTP_ROOT + "/search/show_all";
var form = $('#form');
$.pjax({
    container: "#main", 
    timeout: 2000,
    url: event,
    data: form.serialize()
});
}
function addFav(obj){
    var login_status  = $(obj).attr('data-login_status'); 
    var content_id    = $(obj).attr('data-content_id'); 
    var content_type  = $(obj).attr('data-content_type'); 
    var fav_status    = $(obj).attr('data-fav_status'); 
    if(login_status == 1){
       $('#loader_fav').show();
       if($(obj).find('.fa').hasClass('fa-heart-o')){
        $(obj).find('.fa').removeClass('fa-heart-o');
        $(obj).find('.fa').addClass('fa-heart');
        $(obj).attr('data-fav_status',0);
        $('.favourite__content').html(added_fav);
    }else{
        $(obj).find('.fa').removeClass('fa-heart');
        $(obj).find('.fa').addClass('fa-heart-o');
        $(obj).attr('data-fav_status',1);
        $('.favourite__content').html(add_fav);
    } 
    addFavContent(content_id,content_type,true, fav_status);
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
function addFavContent(content_id,content_type,login_status,action){
    var url = HTTP_ROOT+"/user/addtofavlist/";
    $.ajax({
        url: url,
        data: {'content_id': content_id, 'content_type': content_type,'login_status':login_status,'action':action},
        type: 'POST',
        headers: {"X-PJAX":"true","X-PJAX-Container":"#main"},
        success: function (res) {
            $('#loader_fav').hide();
        }
    });
}
function deleteFavContent(obj) {
    var content_id = $(obj).attr('data-content_id');
    var content_type = $(obj).attr('data-content_type');
    var url = HTTP_ROOT + "/user/deletefromfavlist/";
    $('#favlist_loading').show();
    $('#deleteFav').modal('hide');
    var action = 0;
    if ($.trim(content_type) == "") {
       content_type = 0;
   }
   $.post(url, {'content_id': content_id, 'content_type': content_type, 'login_status': true, 'action': action}, function (res) {
    location.reload();
});
}
function showText()
{
    $('.short-content').addClass('hide-text');
    $('.full-content').removeClass('hide-text');
}
function removefromcart(id, cartid, qnty) {
    $('.loader_cart').show();
    var url = HTTP_ROOT+'/shop/RemoveCart';
    $.post(url, {'id': id,'cartpopup':1}, function (res) {
        $('.loader_cart').hide();
        $('.round-cart').html(eval($('.round-cart').html()) - eval(qnty));
        $('#cartpopup').html(res);
    });
}
function goKart(){
 window.location.href=HTTP_ROOT+"/shop/cart";
}


