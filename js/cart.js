if (is_audio_enable == 1){
    $('a.view_cart').attr('data-pjax','#main');
}
function showcart(id, flag,checkquant){        
    var url = HTTP_ROOT+'/shop/addtocart';
    if(typeof checkquant !== typeof undefined){
       var qnt = eval($('#product_qnt').val());
    }else{
       var qnt = 1;
    }
    var reloadUrl = HTTP_ROOT +'/shop/cart';
    if(qnt>0){
        $('.loader_cart').show();
        $.post(url, {'quantity':qnt, 'id':id}, function(res){
            if(flag == 2){	
                $('.loader_cart').hide();
                $('.round-cart').html(eval($('.round-cart').html()) + 1);
                $('#cartpopup').html(res);
                window.location.href = reloadUrl;
            }else{
                $('.loader_cart').hide();
                $('html,body').animate({scrollTop:0}, 500);
                $('.round-cart').html(eval($('.round-cart').html()) + qnt);
                $('#cartpopup').html(res);
            }
        })
    }else{
        alert(JSLANGUAGE.enter_quantity);
    }        
}
function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 49 || charCode > 57))
            return false;
    return true;
}
/*$(document).ready(function(){
    $( 'a.btn_view_trailer_inside' ).fancybox({
            'type' : 'iframe',
            'padding' : 0,
            'closeBtn': true,
            'width'  : 640,
            'height' : 360,
            'scrolling': false,
            'titleShow': false
    });

});*/
function updatequan(inc_desc){
    var val = $('.c-item-1').val();
    if(parseInt(inc_desc) == 1){
        var sum = parseInt(val)+ 1;
    }else{
        var sum = parseInt(val)- 1;
    }
    if(parseInt(sum) >= 0){
      $('#product_qnt').val(sum);
    }
}

$( "#myTrailer" ).addClass( "section" );
(function(){
     var halfwidth= $(window).width() / 2;
     var halfheight= $(window).height() / 2; 
     var type = $('#p_type').length?$('#p_type').val():''; /* physical or digital */
     $('.section').width(halfwidth);
     $('.section').height(halfheight);
 $("a.btn_view_trailer_inside").fancybox({
            openEffect: 'none',
            closeEffect: 'none',
            closeBtn: false,
            scrolling: false,
            titleShow: false,
            padding: 0,
            content: $('#myTrailer').show(),
    beforeShow: function () {
               $(".fancybox-inner").attr("style","background: black");
               $(".fancybox-inner").append('<div style="display: block;" class="loader"></div>');
               var trailer_url= HTTP_ROOT + "/ThirdParty/ThirdPartyList";
               var movie_id = $('#p_movieid').val();
               $.post(trailer_url,{movie_id: movie_id,halfheight: halfheight,halfwidth: halfwidth, type:type},function(res){
               $(".fancybox-inner").attr("style","width:" + halfwidth + "px !important; height :" + halfheight +"px !important;background : black !important;");
               $('#myTrailer').html(res);
//             $('.fancybox-overlay').click(function(){
//                   e.preventDefault();   
//                  $('.fancybox-overlay-fixed').css('display', 'none');
//                });
               $(".loader").hide();
                }); 
                },'afterClose': function () {
                    $('.fancybox-overlay-fixed').remove();
                    $("#myTrailer").hide();
                    $("#myTrailer").html("");
                } 
       });  
 })();