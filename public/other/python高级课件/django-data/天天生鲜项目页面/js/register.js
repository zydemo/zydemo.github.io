$(function () {
    var error_name = false;
    var error_pwd = false;
    var error_cpwd = false;
    var error_email = false;
    var error_check = false;

    $('#user_name').blur(function () {
        check_user_name();
    });

    function check_user_name() {
        var $user_name = $('#user_name');
        var re = /^\w{5,20}$/;
        var result = re.test($user_name.val());
        if (result) {
            $user_name.next().hide();
            error_name = false;
        }else{
            error_name = true;
            $user_name.next().show();
            $user_name.next().html('请输入5-20个字符的用户名(包含字母、数字、下划线)');
        }

        // 另一种方法
        // var len = $('#user_name').val().length;
        // if (len < 5 || len > 20) {
        //     error_name = true;
        //     $('#user_name').next().show();
        //     $('#user_name').next().html('请输入5-20个字符的用户名');
        // } else {
        //     $('#user_name').next().hide();
        //     error_name = false;
        // }
    }

    $('#pwd').blur(function () {
        check_pwd();
        check_cpwd();
    });

    function check_pwd() {
        var len = $('#pwd').val().length;
        if (len < 8 || len > 20) {
            $('#pwd').next().show();
            $('#pwd').next().html('密码最少8位，最长20位');
            error_pwd = true;
        } else {
            $('#pwd').next().hide();
            error_pwd = false;
        }
    }

    $('#cpwd').blur(function () {
        check_cpwd();
    });

    function check_cpwd() {
        if ($('#pwd').val() !== $('#cpwd').val()) {
            $('#cpwd').next().show();
            $('#cpwd').next().html('两次输入的密码不一致');
            error_cpwd = true;
        } else {
            $('#cpwd').next().hide();
            error_cpwd = false;
        }
    }

    $('#email').blur(function () {
        check_email();
    });

    function check_email() {
        var re = /^[a-z0-9A-Z][\w\-\.]*@[a-z0-9A-Z\-]+(\.[a-zA-Z]{2,5}){1,2}$/;
        var result = re.test($('#email').val());
        if (result) {
            $('#email').next().hide();
            error_email = false;
        } else {
            $('#email').next().show();
            $('#email').next().html('你输入的邮箱格式不正确');
            error_email = true;
        }
    }

    $('#allow').click(function () {
        if ($(this).is(':checked')) {
            $(this).siblings('span').hide();
            error_check = false;
        } else {
            $(this).siblings('span').show();
            $(this).siblings('span').html('请勾选同意');
            error_check = true;
        }
    });

    $('.reg_form').submit(function () {
        check_user_name();
        check_pwd();
        check_cpwd();
        check_email();

        // if (error_name === false && error_pwd === false && error_cpwd === false && error_email === false && error_check === false) {
        //     return true;
        // } else {
        //     return false;
        // }
        // 以上if-else简写为：
        return (error_name === false && error_pwd === false && error_cpwd === false && error_email === false && error_check === false)
    })

});