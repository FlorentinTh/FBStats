(function($){
   /*
	* Use of Facebook API 
	*/
	var baseUri = encodeURI('http://www.florentinth.fr/8INF803/FBStats/');
	var uri = encodeURI('http://www.florentinth.fr/8INF803/FBStats/stats.html');

	// (getUrlParam('error_reason') === 'user_denied') ? window.location = baseUri : null;

	window.fbAsyncInit = function(){
	    FB.init({
			appId      : '696065910462396',
			channelUrl : 'http://www.florentinth.fr/8INF803/FBStats/',
			status     : true,
			cookie     : true,
			xfbml      : true
	    });
    };

    function login(){
    	FB.getLoginStatus(function(response){
		    if(response.status === 'connected'){
		        window.location = uri;
		    }else if(response.status === 'not_authorized'){
		        window.location = encodeURI('https://www.facebook.com/dialog/oauth?client_id=696065910462396&redirect_uri=' + uri + '&response_type=token&scope=email');
		    }else{
		    	window.location = encodeURI('https://www.facebook.com/dialog/oauth?client_id=696065910462396&redirect_uri=' + uri + '&response_type=token&scope=email');
		    }
		});
    }

    function logout(){
    	FB.getLoginStatus(function(response){
	        if(response && response.status === 'connected'){
	            FB.logout(function(response){
	                 window.location = baseUri;
	            });
	        }
	    }, true);
	}

    $('div.login a.soc-connect').click(function(){
    	login();
    });

    $('a.soc-quit').click(function(){
    	logout();
    });

   /*
    * Global stuff
    */
	var colors = ['#16a085', '#27ae60', '#2980b9', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c'];
	
	function randomizeColor(){
		random = Math.round(Math.random() * 100 / 10);
		while(random > 6){
			random = Math.round(Math.random() * 100 / 10);
		}
		return colors[random];
	}

	function randomizeValue(){
		return Math.round(Math.random() * 100);
	}

	function getUrlParam(name){
		var results = new RegExp('[\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
		if(results !== null)
			return results[1] || 0
		return null;
	}

   /*
	* ----- Index page -----
	*/
	var logoValue = 75;

	$('.login-dial').knob({ 
		min : 0,
		max : 100,
		readOnly : true,
		thickness : 0.05,
		lineCap : 'round',
		bgColor : '#3c4147',
		fgColor : '#4dc2d4',        
		dynamicDraw : true,
		font : 'Lato',
		inputColor : '#d5d9dc',
		displayInput : false
    });

	$({value: 0}).animate({ 
		value: logoValue
	}, {
			duration: 1000,
			easing: 'swing',
			progress: function () {                  
				$('.login-dial').val(Math.ceil(this.value)).trigger('change');
			}
	});

   /*
	* ----- Stats Page -----
	*/
	$('.item').each(function(){
		color = randomizeColor();
		title = '<span class="title" style="color:' + color + '">Lorem ipsum</span>';
		input = '<input type="text" class="dial" value="' + randomizeValue() + '" data-fgColor="' + color + '">';
		$(this).css({
			'border-top' : '4px solid ' + color
		});
		$(this).append(title).append(input);
	});
	
   /*
	*  Knobs animation
	*/
    $('.dial').each(function(){
    	var $item = $(this);
        var $value = $item.attr('value');  
        var $color = $item.attr('fgColor');

        $item.knob({ 
			min : 0,
			max : 100,
			readOnly : true,
			thickness : 0.05,
			lineCap : 'round',
			bgColor : '#3c4147',
			fgColor: $color,        
			dynamicDraw: true,
			font: 'Lato',
			inputColor: '#d5d9dc'
        });

		$({value: 0}).animate({ 
			value: $value 
		}, {
  			duration: 1000,
  			easing: 'swing',
  			progress: function () {                  
  				$item.val(Math.ceil(this.value)).trigger('change');
  			}
		});
	});

   /*
	* Load Facebook API 
	*/
	(function(d){
		var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement('script'); js.id = id; js.async = true;
		js.src = "//connect.facebook.net/en_US/all.js";
		ref.parentNode.insertBefore(js, ref);
   	}(document));
})(jQuery);