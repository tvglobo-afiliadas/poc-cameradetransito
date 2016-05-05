// @codekit-prepend "plugins/placeholder.js"

(function() {

	// - - - - - - - - - - - - - - - - - - - - Detectar navegador / SO - - - - - - - - - - - - - - - - - - - -
	var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0; // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
	var isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
	var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0; // At least Safari 3+: "[object HTMLElementConstructor]"
	var isChrome = !!window.chrome && !isOpera; // Chrome 1+
	var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6
	if (isFirefox) {$('body').addClass('firefox');}
	if (isSafari) {$('body').addClass('safari');}
	if (isChrome) {$('body').addClass('chrome');}
	if (isIE) {$('body').addClass('ie');}
	$('body').addClass(navigator.platform);

	// - - - - - - - - - - - - - - - - - - - - Lista sidebar - - - - - - - - - - - - - - - - - - - -
	var listaWrap = $('.lista-wrap'),
		lista = listaWrap.find('dl.lista-end'),
		btnSlider = $('section#main-content aside').find('.btn-slider'),
		btnUp = $('section#main-content aside').find('.btn-slider.btn-up'),
		btnDown = $('section#main-content aside').find('.btn-slider.btn-down');

	$.getJSON('cameras.json', function(json, textStatus) {

		var cidade = json.cidades,
			cameras = cidade.cameras,
			camerasLength = cameras.length;

		$.each(cameras, function(index, val) {
			html = '<dt><a href="" id="link-'+index+'" data-id="'+val.thumb+'" data-url="'+val.url+'" class="btn-end"><span>'+val.nome+'</span></a></dt>
					<dd>
						<div class="camera-wrap"><div id="camera-'+index+'" data-id="'+val.thumb+'" data-url="'+val.url+'"></div></div>
						<div class="share-wrap">
							<ul class="social-icons">
								<li><a href="http://www.facebook.com/share.php?v=4&src=bm&u=http://especiais.g1.globo.com/sao-paulo/transito/radar-transito-agora.html" target="_blank" class="btn-facebook">facebook</a></li>
								<li><a href="http://twitter.com/intent/tweet?source=webclient&text=Radar%20G1%3A%20tr%C3%A2nsito%20agora%20em%20S%C3%A3o%20Paulo.%20Acesse%3A%20http%3A%2F%2Fbit.ly%2F1M8FtQn" target="_blank" class="btn-twitter">twitter</a></li>
								<li><a href="https://plus.google.com/share?url=http://especiais.g1.globo.com/sao-paulo/transito/radar-transito-agora.html" target="_blank" class="btn-google-plus">google-plus</a></li>
							</ul><!-- social-icons -->
							<form action="#" class="link-form">
								<label for="input-link">link</label>
								<input type="text" id="input-link" readonly="1" onclick="this.focus(); this.select()" value="http://especiais.g1.globo.com/minas-gerais/transito/radar-transito-agora.html">
							</form>
						</div>
					</dd>';
			lista.append(html);

			var playerInstance = jwplayer("camera-"+index);
			playerInstance.setup({
				file: $("#camera-"+index).data("url"),
				image: $("#camera-"+index).data("id"),
				width: 265,
				height: 118,
				androidhls: true,
				fallback: false,
				type: 'mp4',
				primary: "flash"
			});
			
			if(index < 1){
				if($(window).width() > 768) {
					var cameraLink = val.url;
					var cameraImage = val.thumb;
					var cameraTitle = val.nome;
					$('.title-wrap h3').html(cameraTitle);
					var playerInstance = jwplayer("current-cam");
					playerInstance.setup({
						file: cameraLink,
						image: cameraImage,
						width: 620,
						height: 280
					});
				}
			}
		});

		lista.find('dt:first').addClass('active');

		if ( $('body').hasClass('MacIntel') || $('body').hasClass('Win32') ) {

			if ( camerasLength > 6 ) {
				btnDown.addClass('show');

				if ( camerasLength >= 12 ) {
					listaWrap.css('height', '395px');
				} else if ( camerasLength === 8 ) {
					listaWrap.css('height', '263px');
				}

				var current = 1;
				var getMarginTop;
				var itemHeight = 66;

				btnUp.on('click', function(event) {
					event.preventDefault();

					var multiplo;

					( camerasLength % 4 === 0 && camerasLength <= 8) ? multiplo = 4 : multiplo = 6;

					var mod = camerasLength % multiplo;
					var rest = parseInt(camerasLength / multiplo);
					var diff = ( mod === 0 ) ? itemHeight * multiplo : (current <= rest) ? itemHeight * multiplo : itemHeight * mod ;

					current--;

					(current === rest) ? btnDown.addClass('show') : (current === 1 ) ? btnDown.addClass('show') : false ;
					(current === 1) ? btnUp.removeClass('show') : false ;

					(getMarginTop > 0)? getMarginTop -= diff : getMarginTop = diff;
					
					lista.animate({marginTop: -getMarginTop });

				});

				btnDown.on('click', function(event) {
					event.preventDefault();

					var multiplo;

					( camerasLength % 4 === 0 && camerasLength <= 8) ? multiplo = 4 : multiplo = 6;

					current++;

					var mod = camerasLength % multiplo;
					var rest = parseInt(camerasLength / multiplo);
					var diff = ( mod === 0 ) ? itemHeight * multiplo : (current <= rest) ? itemHeight * multiplo : itemHeight * mod ;

					(current > rest) ? btnDown.removeClass('show') : (camerasLength / current === multiplo ) ? btnDown.removeClass('show') : false ;
					(current > 1) ? btnUp.addClass('show') : btnUp.removeClass('show');

					(getMarginTop > 0)? getMarginTop += diff : getMarginTop = diff;
					
					lista.animate({marginTop: -  getMarginTop });

				});

			} else {
				btnSlider.removeClass('show');
			}

		}

	});

	// - - - - - - - - - - - - - - - - - - - - Botão endereço - - - - - - - - - - - - - - - - - - - -
	$('section#main-content .lista-end').on('click', '.btn-end', function(event) {
		event.preventDefault();

		if ( !$(this).parent().hasClass('active') ) {
			$(this).parent().addClass('active').siblings('.active').removeClass('active');
		}
		
		if ($(window).width() > 768) {
			var cameraLink = $(this).data("url");
			var cameraImage = $(this).data("id");
			var cameraTitle = $(this).html();
			$('.title-wrap h3').html(cameraTitle);
			var playerInstance = jwplayer("current-cam");
			playerInstance.setup({
				file: cameraLink,
			    image: cameraImage,
			    autostart: true,
			    width: 620,
			    height: 280
			});
		} else {
			var cameraLink = $(this).data("url");
			var cameraImage = $(this).data("id");
			var cameraTitle = $(this).html();
			$('.title-wrap h3').html(cameraTitle);
			var playerInstance = jwplayer("current-cam");
			playerInstance.setup({
				file: cameraLink,
			    image: cameraImage,
			    width: 620,
			    height: 280
			});
		}

	});
	
})();