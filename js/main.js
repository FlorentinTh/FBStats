(function($){
   /*
	* ----- Index page -----
	* 	Start
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
			progress: function(){                  
				$('.login-dial').val(Math.ceil(this.value)).trigger('change');
			}
	});

   /*
	* Application parameters for Facebook API
	*/
	var fbAppId = '696065910462396';

	var redirectUrl = encodeURI('http://176.31.246.54/FBStats/');

	var fbAppScope = 'public_profile,'
				   + 'email,'
				   + 'user_friends,'
				   + 'user_groups,'
				   + 'user_likes,'
				   + 'user_status,'
				   + 'user_videos,'
				   + 'user_photos';

	var url = encodeURI('https://facebook.com/dialog/oauth?response_type=token&client_id=' + fbAppId + '&redirect_uri=' + redirectUrl + '&scope=' + fbAppScope);
	
	var token = null;

	function getURLParameter(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&#]" + name + "=([^&#]*)"),
	        results = regex.exec(top.location.href);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

   /*
	* Facebook login flow
	*/
	if(getURLParameter('access_token') !== ''){
		token = getURLParameter('access_token');
		getUserDatasFromFbGraphApi();
		setTimeout(function(){
			$('.login').hide();
		}, 1500);
		$('.wrap').show();
	}else if(getURLParameter('error_code') === '200'){
		$('.wrap-login').append('<p>Cette application nécessite une autorisation.</p>');
	}

   /*
	* Knobs constructor
	*/
	var knobColors = ['#EF4836', '#F39C12', '#F4D03F', '#049372', '#3A539B', '#22A7F0'];
	var knobIterator = 0;

	function createKnobElement(title, value, percent){
		
		(percent === undefined) ? percent = false : null;

		color = knobColors[knobIterator];
		knobIterator++;
		title = '<span class="title" style="color:' + color + '">' + title + '</span>';
		input = '<input type="text" class="dial" id="dial' + knobIterator + '" value="' + value + '" data-fgColor="' + color + '">';
		percentDisplay = '<span class="percent">' + value + '%</span>';

		$('.item#item' + knobIterator).css({
			'border-top' : '4px solid ' + color
		});

		if(percent === false){
			$('.item#item' + knobIterator).append(title).append(input);
			$('.dial#dial' + knobIterator).knob({ 
				min : 0,
				max : value,
				readOnly : true,
				thickness : 0.05,
				lineCap : 'round',
				bgColor : '#3c4147',
				fgColor: $(this).attr('fgColor'),
				dynamicDraw: true,
				font: 'Lato',
				inputColor: '#d5d9dc',
	        });
		}else{
			$('.item#item' + knobIterator).append(title).append(input).append(percentDisplay);
			$('.dial#dial' + knobIterator).knob({ 
				min : 0,
				max : 100,
				readOnly : true,
				thickness : 0.05,
				lineCap : 'round',
				bgColor : '#3c4147',
				fgColor: $(this).attr('fgColor'),
				dynamicDraw: true,
				font: 'Lato',
				inputColor: '#d5d9dc',
				displayInput: false
	        });
		}
		

        $('.dial').each(function(){
	    	var $item = $(this);
	        var $value = $item.attr('value');  
	        var $color = $item.attr('fgColor');

			$({value: 0}).animate({ 
				value: $value 
			}, {
	  			duration: 1000,
	  			easing: 'swing',
	  			progress: function(){                  
	  				$item.val(Math.ceil(this.value)).trigger('change');
	  			}
			});
		});
	}

	function calculatePopularity(numberOflikes, numberOfFriends){
		return Math.ceil((numberOflikes * 100) / numberOfFriends);
	}

   /*
	* Facebook Graph API calls
	*/
	function getUserDatasFromFbGraphApi(){
		var limit = 1000000;

		window.fbAsyncInit = function(){
		    FB.init({
				appId : fbAppId,
				xfbml : true,
				version : 'v2.2'
		    });

		    (function getDatas(){
		    	var groupCount = 0;
		        var albumsCount = 0;
		        var videosCount = 0;
		        var coverLikesCount = 0;
		        var numberOfFriends = 0;

		    	FB.api(
		        	'/me/picture?type=large',
			        {
				        access_token : token
			        },
		        	function(response){
						if(!response || response.error){
							console.log(response.error);
						}
		            	$('.profil-picture').css({
		            		'background-image': 'url("' + response.data.url + '")'
		            	});
		        	}
		        );

		        FB.api(
		        	'/me?fields=cover{id}',
			        {
				        access_token : token
			        },
		        	function(response){
						if(!response || response.error){
							console.log(response.error);
						}

						FB.api(
				        	'/' + response.cover.id + '?fields=images',
					        {
						        access_token : token
					        },
				        	function(response){
								if(!response || response.error){
									console.log(response.error);
								}

				            	$('.user-info').css({
				            		'background-image': 'url("' + response.images[0].source + '")'
				            	});
				        	}
				        );
		        	}
		        );

		        FB.api(
		        	'/me?fields=name',
			        {
				        access_token : token
			        },
		        	function(response){
						if(!response || response.error){
							console.log(response.error);
						}
						$('span#username').html(response.name);
		        	}
		        );

		        FB.api(
		        	'/me/friends',
			        {
				        access_token : token
			        },
		        	function(response){
						if(!response || response.error){
							console.log(response.error);
						}
						numberOfFriends = response.summary.total_count;
						createKnobElement('Nombre d\'amis', response.summary.total_count);
		        	}
		        );

		    	FB.api(
		        	'/me/groups?fields=id&limit=' + limit,
			        {
				        access_token : token
			        },
		        	function(response){
						if(!response || response.error){
							console.log(response.error);
						}

						$.each(response.data, function(key, value){
		            		groupCount++;
						});

		            	createKnobElement('Nombre de groupes rejoints', groupCount);
		        	}
		        );

		    	FB.api(
		        	'/me?fields=context{mutual_likes}',
			        {
				        access_token : token
			        },
		        	function(response){
						if(!response || response.error){
							console.log(response.error);
						}

						createKnobElement('Nombre de pages aimées', response.context.mutual_likes.summary.total_count);
		        	}
		        );

		    	FB.api(
		        	'/me/albums?fields=id&limit=' + limit,
			        {
				        access_token : token
			        },
		        	function(response){
						if(!response || response.error){
							console.log(response.error);
						}

		            	$.each(response.data, function(key, value){
		            		albumsCount++;
						});

		            	createKnobElement('Nombre d\'albums photo créés', albumsCount);
		        	}
		        );

		    	FB.api(
		        	'/me?fields=videos.limit(' + limit + '){id}',
			        {
				        access_token : token
			        },
		        	function(response){
						if(!response || response.error){
							console.log(response.error);
						}

		            	$.each(response, function(key, value){
		            		videosCount++;
						});

						createKnobElement('Nombre de vidéos uploadées', videosCount);
		        	}
		        );

		    	FB.api(
		        	'/me?fields=cover',
			        {
				        access_token : token
			        },
		        	function(response){
						if(!response || response.error){
							console.log(response.error);
						}

		            	FB.api(
				        	'/' + response.cover.id + '?fields=likes.limit(' + limit + ')',
					        {
						        access_token : token
					        },
				        	function(response){
								if(!response || response.error){
									console.log(response.error);
								}

								$.each(response.likes.data, function(key, value){
				            		coverLikesCount++;
								});
								createKnobElement('Popularité photo de couverture', calculatePopularity(coverLikesCount, numberOfFriends), true);
				        	}
				        );
		        	}
		        );
		    })();
		}
	}

   /*
    * Event handlers : Login/Logout
    */
	var click = 0;

	$('.soc-connect').click(function(e){
		e.preventDefault();
		click++;
		if(click === 1){
			$('a.soc-connect').css({
				'background-color': '#2f477a',
				'color' : '#95a5a6'
			});
			$('i.icon-soc').css('border-color', '#95a5a6');
			top.location.replace(url);
		}
	});

	$('.soc-quit').click(function(e){
		e.preventDefault();
		top.location.replace(redirectUrl);
	});

   /*
	* Load Facebook API 
	*/
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
})(jQuery);