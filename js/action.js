var months = new Array('JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC');

$(document).ready(function () {
    $('input').attr('autocomplete', 'false');
    $('form').attr('autocomplete', 'false');
    $('.plan-box').click(function () {
        $('.plan-box').removeClass('choosen');
        $(this).addClass('choosen');
        $('.tick-icon').hide();
        $(this).find('.tick-icon').show();

        $('#plan_id').val($(this).attr('data-id'));
        $('#currency_id').val($(this).attr('data-currency_id'));
		$('#is_subscription_bundles').val($(this).attr('data-is_subscriptionbundle'));
        resetCouponForSubscription();
    });

    $('#coupon').keyup(function(){
        if($(this).val()==""){
            $("#invalid_coupon_error").html('').hide();
            $("#dis_charged_amt").html('');
            $("#discount_charged_amt_span").html('');
            $("#free_trail_txt").html('');
            $("#labele_text").html('');
            $("#valid_coupon_suc").hide();
            $("#discount_amount").val('');
            $("#free_trail_charged").val('');
         }
    });
     
    $('#email_address').on('blur', function() {
        var regex = /([A-Z0-9a-z_-][^@])+?@[^$#<>?]+?\.[\w]{2,4}/.test(this.value);
        if(!regex) {
            $('#coupon').attr('disabled','disabled');
            $('#coupon_btn').attr('disabled','disabled');
        } else {
            $('#coupon').removeAttr('disabled');
            $('#coupon_btn').removeAttr('disabled');
         }
    });
    if ($('#bill_fname').length) {
        $('[name="data[email]"]').on('change', function () {
            $('#bill_email').val($('[name="data[email]"]').val());
        });
        $('#card_name').on('change', function () {
            var card_name_arr = $('#card_name').val().split(' ');
            var first_name = '';
            var last_name = '';
            if (card_name_arr.length >= 1) {
                first_name = card_name_arr[0];
                last_name = card_name_arr[card_name_arr.length-1];
                console.log(first_name);
                console.log(last_name);
                $('#bill_fname').val(first_name);
                $('#bill_lname').val(last_name);
            }
        });
    }

    $('#loading').hide();
});

function generateSSTSubscription(){
    document.membership_form.action = HTTP_ROOT + "/user/SubscriptionPaymentProcess";
    document.membership_form.submit();
    return false;
}
function validatePaymentForm() {
    $("#membership_form").validate({
        rules: {
            "data[card_name]": {
                required: true,
            },
            "data[card_number]": {
                required: true,
                number: true
            },
            "data[exp_month]": {
                required: true
            },
            "data[exp_year]": {
                required: true
            },
            "data[security_code]": {
                required: true
            },
            "data[over_18]": {
                required: true
            },
            "data[country]": {
                required: true
            },
            "data[iban]": {
                required: true
            },
            "data[street]": {
                required: true
            },
            "data[city]": {
                required: true
            },
            "data[postalcode]": {
                required: true
            },
            "data[ext_coupon]": {
                required: true
            }
        },
        messages: {
            "data[card_name]": {
                required: JSLANGUAGE.card_name_required,
            },
            "data[card_number]": {
                required: JSLANGUAGE.card_number_required,
                number: JSLANGUAGE.card_number_required
            },
            "data[exp_month]": {
                required: JSLANGUAGE.expiry_month_required
            },
            "data[exp_year]": {
                required: JSLANGUAGE.expiry_year_required
            },
            "data[security_code]": {
                required: JSLANGUAGE.security_code_required
            },
            "data[over_18]": {
                required: JSLANGUAGE.term_privacy_policy_required
            },
            "data[country]": {
                required: JSLANGUAGE.country_address_validate
            },
            "data[iban]": {
                required: JSLANGUAGE.international_bank_account_validate
            },
            "data[street]": {
                required: JSLANGUAGE.street_address_validate
            },
            "data[city]": {
                required: JSLANGUAGE.city_address_validate
            },
            "data[postalcode]": {
                required: JSLANGUAGE.postal_code_address_validate
            },
            "data[ext_coupon]": {
                required: JSLANGUAGE.ext_coupon_code_validate
            }
        },
        submitHandler: function (form) {
            $('#membership_loading').show();
            if ($("#payment_gateway").val() !== 'manual') {
                var payment_gateway = $("#payment_gateway").val();
                        if($.trim(payment_gateway)){
                            var have_paypal_pro = 0;
                            if($('#have_paypal_pro').is(":checked")){
                                have_paypal_pro = 1;
                            }
                           var payment_gateway_str = $('#payment_gateway_str').val();
                           if(payment_gateway_str == 'ccavenue'){
                                document.membership_form.action = HTTP_ROOT + "/user/CCAvenueSubscriptionPaymentProcess";
                                document.membership_form.submit();
                                return false;                               
                           } else if(payment_gateway == 'corvus'){

                               if (have_paypal_pro) {
                                    if (payment_gateway = 'paypalpro') {
                                        payment_gateway_str = payment_gateway;
                                    } else {
                                        payment_gateway_str = payment_gateway_str.replace(payment_gateway, '');
                                    }
                                } else {
                                    document.membership_form.action = HTTP_ROOT + "/user/CorvusSubscriptionPaymentProcess";
                                    document.membership_form.submit();
                                    return false;
                                }   
                           }
                           if(!have_paypal_pro && payment_gateway != 'paypalpro'){
                               var temp_str = payment_gateway_str.split(',');
                               if(temp_str.length > 1){
                                   payment_gateway_str = temp_str[0];
                               }else{
                                   payment_gateway_str = payment_gateway;
                               }
                                payment_gateway_str = payment_gateway_str.replace('paypalpro','');
                           }else if(have_paypal_pro){
                               if(payment_gateway = 'paypalpro'){
                                   payment_gateway_str = payment_gateway;
                               }else{
                                    payment_gateway_str = payment_gateway_str.replace(payment_gateway,'');
                                }
                            }else{
                                payment_gateway_str = payment_gateway;
                            }
                            payment_gateway_str = payment_gateway_str.replace(/(^,)|(,$)/g, "");
                            
                           var class_name = payment_gateway_str+'()';
                           eval ("var obj = new "+class_name);
                            if (payment_gateway_str == 'paypal') {
                                var monetization = $('#monetization').val();
                if($.trim(monetization)){}else{
                     var monetization = '';
                }
                                document.membership_form.action = HTTP_ROOT + "/user" + monetization + "/" + action;
                                document.membership_form.submit();
                                return false;
                            } else {
                                if (payment_gateway_str == 'ideabiz') {
                                    obj.sendOtp();
                                    return false;
                                } else {
                                    obj.processCard();
                                }
                            }
                        }
            } else {
                var monetization = $('#monetization').val();
                if($.trim(monetization)){}else{
                     var monetization = '';
                }
                document.membership_form.action = HTTP_ROOT + "/user" + monetization + "/" + action;
                document.membership_form.submit();
                return false;
            }
        }
    });
}

function validateSignupStep1Form() {
    $("#membership_form").validate({
        rules: {
            "data[name]": {
                required: true,
                textonly: true,
                minlength: 1
            },
            "data[email]": {
                required: true,
                email: true
            },
            "data[password]": {
                required: true,
                minlength: 6
            },
            "data[confirm_password]": {
                required: true,
                equalTo: '#join_password'
            },
            "data[over_18]": {
                required: true
            },
            "data[country]": {
                required: true
            },
            "data[iban]": {
                required: true
            },
            "data[street]": {
                required: true
            },
            "data[city]": {
                required: true
            },
            "data[postalcode]": {
                required: true
            },
            "data[ext_coupon]": {
                required: true
            },
            "data[mobile_number]": {
                required: true,
                number: true
            }
        },
        messages: {
            "data[name]": {
                required: JSLANGUAGE.full_name_required,
                textonly: JSLANGUAGE.valid_text,
                minlength: JSLANGUAGE.name_minlength
            },
            "data[mobile_number]": {
                required: JSLANGUAGE.mobile_number_required,
            },
            "data[email]": {
                required:  JSLANGUAGE.email_required,
                email: JSLANGUAGE.valid_email
            },
            "data[password]": {
                required: JSLANGUAGE.password_required,
                minlength: JSLANGUAGE.password_minlength
            },
            "data[confirm_password]": {
                required: JSLANGUAGE.valid_confirm_password,
                equalTo: JSLANGUAGE.password_donot_match
            },
            "data[over_18]": {
                required: JSLANGUAGE.term_privacy_policy_required
            },
            "data[country]": {
                required: JSLANGUAGE.country_address_validate
            },
            "data[iban]": {
                required: JSLANGUAGE.international_bank_account_validate
            },
            "data[street]": {
                required: JSLANGUAGE.street_address_validate
            },
            "data[city]": {
                required: JSLANGUAGE.city_address_validate
            },
            "data[postalcode]": {
                required: JSLANGUAGE.postal_code_address_validate
            },
            "data[ext_coupon]": {
                required: JSLANGUAGE.ext_coupon_code_validate
            }
        },
        errorPlacement: function(error, element) {            
            if ($(element).hasClass("one_required")) {
                $(element).closest("div").parent().append(error);
            } else {
                error.insertAfter(element);
            }
	},
        submitHandler: function (form) {
            //6307: Hitting Register button twice in the Registration page of Customer websites, creates duplicate registration
            //ajit@muvi.com
            var is_api = $('#is_api').val();
            $("#register_membership").prop("disabled", true);
            if (is_api) {
                checkDuplicateMobile(1); 
            } else {
                checkDuplicateEmail(1);
            }
        }
    });
}

function validateUserSignupForm() {
    $("#membership_form").validate({
        rules: {
            "data[name]": {
                required: true,
                textonly: true,
                minlength: 1
            },
            "data[email]": {
                required: true,
                email: true
            },
            "data[password]": {
                required: true,
                minlength: 6
            },
            "data[confirm_password]": {
                required: true,
                equalTo: '#join_password'
            },
            "data[card_name]": {
                required: true
            },
            "data[card_number]": {
                required: true,
                number: true
            },
            "data[exp_month]": {
                required: true
            },
            "data[exp_year]": {
                required: true
            },
            "data[security_code]": {
                required: true
            },
            "data[over_18]": {
                required: true
            },
            "data[country]": {
                required: true
            },
            "data[iban]": {
                required: true
            },
            "data[street]": {
                required: true
            },
            "data[city]": {
                required: true
            },
            "data[postalcode]": {
                required: true
            },
            "data[ext_coupon]": {
                required: true
            }
        },
        messages: {
            "data[name]": {
                required: JSLANGUAGE.full_name_required,
                textonly: JSLANGUAGE.valid_text,
                minlength: JSLANGUAGE.name_minlength
            },
            "data[email]": {
                required:  JSLANGUAGE.email_required,
                email: JSLANGUAGE.valid_email
            },
            "data[password]": {
                required: JSLANGUAGE.password_required,
                minlength: JSLANGUAGE.password_minlength
            },
            "data[confirm_password]": {
                required: JSLANGUAGE.valid_confirm_password,
                equalTo: JSLANGUAGE.password_donot_match
            },
            "data[card_name]": {
                required: JSLANGUAGE.card_name_required
            },
            "data[card_number]": {
                required: JSLANGUAGE.card_number_required,
                number: JSLANGUAGE.card_number_required
            },
            "data[exp_month]": {
                required: JSLANGUAGE.expiry_month_required
            },
            "data[exp_year]": {
                required: JSLANGUAGE.expiry_year_required
            },
            "data[security_code]": {
                required: JSLANGUAGE.security_code_required
            },
            "data[over_18]": {
                required: JSLANGUAGE.term_privacy_policy_required
            },
            "data[country]": {
                required: JSLANGUAGE.country_address_validate
            },
            "data[iban]": {
                required: JSLANGUAGE.international_bank_account_validate
            },
            "data[street]": {
                required: JSLANGUAGE.street_address_validate
            },
            "data[city]": {
                required: JSLANGUAGE.city_address_validate
            },
            "data[postalcode]": {
                required: JSLANGUAGE.postal_code_address_validate
            },
            "data[ext_coupon]": {
                required: JSLANGUAGE.ext_coupon_code_validate
            }
        },
        errorPlacement: function(error, element) {
            if ($(element).hasClass("one_required")) {
                $(element).closest("div").parent().append(error);
            } else {
                error.insertAfter(element);
            }
	},
        submitHandler: function (form) {
            //6307: Hitting Register button twice in the Registration page of Customer websites, creates duplicate registration
            //ajit@muvi.com
            $("#register_membership").prop("disabled", true);
            //Check unique email exists or not
            checkDuplicateEmail(1);
        }
    });
}
function checkDuplicateMobile(arg){
    var mobile_number = $.trim($('#mobile_number').val());
    $('#membership_loading').show();
    $('#membership_form').find('.errordiv').html('').hide();
    $.post(HTTP_ROOT + "/user/checkMobile", {'mobile_number': mobile_number}, function (res) {
        if ($.trim(res) == '1') {
            $('#membership_loading').hide();
            var msg = JSLANGUAGE.mobile_number_exists_us;
            $('#errors').html(msg);
            $('#errors').show();
            $('#membership_form').find('.errordiv').html(msg).show();
            $("#register_membership").prop("disabled", false);
            return false;
        }else{
            document.membership_form.action = HTTP_ROOT + "/user/" + action;
            document.membership_form.submit();
            return false;
        }
    
    }); 
}

function checkDuplicateEmail(arg) {
    login_fields = [];
    var msg;
    var email = $.trim($('#membership_form').find("input[type='email']" ).val());
    $('#membership_form .login_field').each(function(){
        pushToArray(this.id, this.value);
    });
    $('#membership_loading').show();
    $('#membership_form').find('.errordiv').html('').hide();
    $.post(HTTP_ROOT + "/user/checkemail", {'email': email, 'formdata' : login_fields}, function (res) {
        if (parseInt(res.isExists) === 1) {
            $('#membership_loading').hide();
            if($.trim(res.field_name) == 'email_address'){
                msg = JSLANGUAGE.email_exists_us;
            }else{
                msg = JSLANGUAGE.value_exists;
            }
            $('<label id="'+res.field_name+'-error" class="error" for="'+res.field_name+'">'+msg+'</label>').insertAfter("#"+$.trim(res.field_name));

            $("#register_membership").prop("disabled", false);
            return false;
        } else {
            $('#errors').html('').hide();
            $('#membership_loading').hide();
            if (parseInt(arg)) {
                if (parseInt($("#payment_gateway").length)) {
                    if ($("#payment_gateway").val() !== 'manual') {
                        var payment_gateway = $("#payment_gateway").val();
                        if($.trim(payment_gateway)){
                            
                            if(payment_gateway == 'ippayment'){
                                document.membership_form.action = HTTP_ROOT + "/user/SubscriptionPaymentProcess";
                                document.membership_form.submit();
                                return false;
                            }else if(payment_gateway == 'ccavenue'){
                                document.membership_form.action = HTTP_ROOT + "/user/" + 'CCAvenueSubscriptionPaymentProcess';
                                document.membership_form.submit();
                                return false;                              
                            } else {
                            var have_paypal_pro = 0;
                            if($('#have_paypal_pro').is(":checked")){
                                have_paypal_pro = 1;
                            }
                           var payment_gateway_str = $('#payment_gateway_str').val();
                           if (payment_gateway == 'corvus') {
                                    if (have_paypal_pro) {
                                        if (payment_gateway = 'paypalpro') {
                                            payment_gateway_str = payment_gateway;
                                        } else {
                                            payment_gateway_str = payment_gateway_str.replace(payment_gateway, '');
                                        }
                                    } else {
                                        document.membership_form.action = HTTP_ROOT + "/user/" + 'CorvusSubscriptionPaymentProcess';
                                        document.membership_form.submit();
                                        return false;
                                    }
                                } else if (!have_paypal_pro && payment_gateway != 'paypalpro'){
                               var temp_str = payment_gateway_str.split(',');
                               if(temp_str.length > 1){
                                   payment_gateway_str = temp_str[0];
                               }else{
                                   payment_gateway_str = payment_gateway;
                               }
                                payment_gateway_str = payment_gateway_str.replace('paypalpro','');
                           }else if(have_paypal_pro){
                               if(payment_gateway = 'paypalpro'){
                                   payment_gateway_str = payment_gateway;
                               }else{
                                    payment_gateway_str = payment_gateway_str.replace(payment_gateway,'');
                                }
                            }else{
                                payment_gateway_str = payment_gateway;
                            }
                            payment_gateway_str = payment_gateway_str.replace(/(^,)|(,$)/g, "");
                           var class_name = payment_gateway_str+'()';
                           eval ("var obj = new "+class_name);
                            if (payment_gateway_str == 'paypal') {
                                var monetization = $('#monetization').val();
                if($.trim(monetization)){}else{
                     var monetization = '';
                }
                                document.membership_form.action = HTTP_ROOT + "/user" + monetization + "/" + action;
                                document.membership_form.submit();
                                return false;
                            } else {
                                    if (payment_gateway_str == 'ideabiz') {
                                        obj.sendOtp();
                                        return false;
                                    } else {
                                obj.processCard();
                            }
                        }
                    }
                    }
                    }
                } else {
                    var monetization = $('#monetization').val();
                if($.trim(monetization)){}else{
                     var monetization = '';
                }
                    document.membership_form.action = HTTP_ROOT + "/user" + monetization + "/" + action;
                    document.membership_form.submit();
                    return false;
                }
            }
        }
    }, 'json');
}
function getMonthList() {
    var d = new Date();
    var curyr = d.getFullYear();
    var selyr = parseInt($('#exp_year').val());
    var curmonth = d.getMonth() + 1;
    var sel_month = $.trim($("#exp_month").val());
    var startindex = 1;

    if (curyr === selyr) {
        startindex = curmonth;
    }

    var month_opt = '<option value="">'+JSLANGUAGE.expiry_month+'</option>';
    for (var i = startindex; i <= 12; i++) {
        var selected = '';
        if (i === parseInt(sel_month)) {
            selected = 'selected="selected"';
        }
        month_opt += '<option value="' + i + '" ' + selected + '>' + months[i - 1] + '</option>';
    }
    $('#exp_month').html(month_opt);
}

$('#have_paypal_pro').click(function () {
    if ($(this).is(":checked")) {
        $('#card-section').hide(1500);
    } else {
        $('#card-section').show(1500);
    }
});

function validateCouponForSubscription() {
    $("#register_membership").prop("disabled", true);
    var coupon = $.trim($("#coupon").val());
    
    $("#invalid_coupon_error").html('').hide();
    $("#dis_charged_amt").html('');
    $("#discount_charged_amt_span").html('');
    $("#free_trail_txt").html('');
    $("#labele_text").html('');
    $("#valid_coupon_suc").hide();
    $("#discount_amount").val('');
    $("#free_trail_charged").val('');
    if(coupon !== ''){
        $("#coupon_btn").prop("disabled", true);
        $("#coupon_btn").html(JSLANGUAGE.wait);
        var url = HTTP_ROOT+"/userPayment/validateCouponForSubscription";
        var plan = $('#plan_id').val();
        var currency = $('#currency_id').val();
        $.post(url, {'coupon': coupon, 'plan': plan, 'currency' : currency, 'email' : userEmail}, function (res) {
            $("#register_membership").prop("disabled", false);
            $("#invalid_coupon_error").html('').hide();
            
            $("#coupon_btn").removeAttr("disabled");
            $("#coupon_btn").html(JSLANGUAGE.btn_apply_coupon);
            if (parseInt(res.isError)) {
                    if (parseInt(res.isError) === 1) {
                        $("#coupon_use").val(0);
                        $("#valid_coupon_suc").hide();
                    $("#invalid_coupon_error").show().html(JSLANGUAGE.invalid_coupon);
                    } else if (parseInt(res.isError) === 2) {
                        $("#coupon_use").val(0);
                        $("#valid_coupon_suc").hide();
                        $("#invalid_coupon_error").show().html(JSLANGUAGE.coupon_already_used);
                    }
                    
                    $("#charged_amt").show();
                    $("#discount_charged_amt").hide();
                    $("#discount_charged_amt_span").text(0);
                    
            }else{
                    $("#coupon_use").val(1);
                    $("#invalid_coupon_error").html('').hide();
                    $("#valid_coupon_suc").show();
                    
                    $("#dis_charged_amt").text(res.symbol+""+res.full_amount);
                    if (parseInt(res.is_cash)) {
                        $("#coupon_in_amt").text(res.symbol+""+res.discount_price);
                    }else{
                        $("#coupon_in_amt").text(res.discount_price+" %");
                    }
                    $("#discount_amount").val(res.discount_amount);
                    if(parseInt(res.extend_free_trail)>0){
                        //$("#free_trail_txt").text("Free Trail "+res.extend_free_trail+" Day(s)");
                        $("#free_trail_txt").text(JSLANGUAGE.free_trial + " "+res.extend_free_trail+" "+JSLANGUAGE.days);
                        $("#free_trail_charged").val(res.extend_free_trail);
                    }
                    $("#charged_amt").hide();
                    $("#discount_charged_amt").show();
                    $("#discount_charged_amt_span").text(res.symbol+""+res.discount_amount);
            }
        }, 'json');
    } else {
        $("#invalid_coupon_error").show().html(JSLANGUAGE.invalid_coupon);
        $("#register_membership").prop("disabled", false);
    }
}

function resetCouponForSubscription() {
    $("#coupon").val('');
    $("#invalid_coupon_error").html('').hide();
    $("#dis_charged_amt").html('');
    $("#discount_charged_amt_span").html('');
    $("#free_trail_txt").html('');
    $("#labele_text").html('');
    $("#valid_coupon_suc").hide();
}

//validate coupon subscription bundle
function validateCouponForSubscriptionBundles() {
   
    $("#btn_proceed_payment").prop("disabled", true);
    var coupon = $.trim($("#coupon").val());
    $("#invalid_coupon_error").html('').hide();
    $("#dis_charged_amt").html('');
    $("#discount_charged_amt_span").html('');
    $("#free_trail_txt").html('');
    $("#labele_text").html('');
    $("#valid_coupon_suc").hide();
    if(coupon !== ''){
        $("#coupon_btn").prop("disabled", true);
        $("#coupon_btn").html(JSLANGUAGE.wait);
        var url = HTTP_ROOT+"/userPayment/ValidateCouponForSubscriptionBundles";
        var currency = $('#currency_id').val();
        var movie_id=$.trim($("#content_ids").val());
        var plan = $("input[name='data[bundleplan]']:checked"). val();
        $.post(url, {'coupon': coupon, 'plan': plan,'movie_unique_id' : movie_id,'currency' : currency}, function (res) {
            $("#btn_proceed_payment").prop("disabled", false);
            $("#invalid_coupon_error").html('').hide();
            
            $("#coupon_btn").removeAttr("disabled");
            $("#coupon_btn").html(JSLANGUAGE.btn_apply_coupon);
            if (parseInt(res.isError)) {
                    if (parseInt(res.isError) === 1) {
                        $("#coupon_use").val(0);
                        $("#valid_coupon_suc").hide();
                        $("#invalid_coupon_error").show().html(JSLANGUAGE.invalid_coupon);
                    } else if (parseInt(res.isError) === 2) {
                        $("#coupon_use").val(0);
                        $("#valid_coupon_suc").hide();
                        $("#invalid_coupon_error").show().html(JSLANGUAGE.coupon_already_used);
                    }
                    
                    $("#charged_amt").show();
                    $("#discount_charged_amt").hide();
                    $("#discount_charged_amt_span").text(0);
                    
            }else{
                    $("#coupon_use").val(1);
                    $("#invalid_coupon_error").html('').hide();
                    $("#valid_coupon_suc").show();
                    
                    $("#dis_charged_amt").text(res.symbol+""+res.full_amount);
                    if (parseInt(res.is_cash)) {
                        $("#coupon_in_amt").text(res.symbol+""+res.discount_price);
                    }else{
                        $("#coupon_in_amt").text(res.discount_price+" %");
                    }
                    $("#discount_amount").val(res.discount_amount);
                    if(parseInt(res.extend_free_trail)>0){
                        //$("#free_trail_txt").text("Free Trail "+res.extend_free_trail+" Day(s)");
                        $("#free_trail_txt").text(JSLANGUAGE.free_trial + " "+res.extend_free_trail+" "+JSLANGUAGE.days);
                        $("#free_trail_txt").show();
                        $("#free_trail_charged").val(res.extend_free_trail);
                    }
                    $("#charged_amt").hide();
                    $("#discount_charged_amt").show();
                    $("#discount_charged_amt_span").text(res.symbol+""+res.discount_amount);
            }
        }, 'json');
    } else {
        $("#invalid_coupon_error").show().html(JSLANGUAGE.invalid_coupon);
        $("#btn_proceed_payment").prop("disabled", false);
    }
}