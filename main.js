$(document).ready(function($) {

				var rail = {
					color: "cl",
					type: "picket",
					cap: "flat",
					mount: "core",
					getFileName : function() {
        		return "all/" + this.color + "_" + this.type + "_" + this.cap + "_" + this.mount + ".png";
					}
				};
        
        // Select the main list and add the class "hasSubmenu" in each LI that contains an UL
				$('#multiselect ul').each(function(){
					$this = $(this);
					$this.find("li").has("ul").addClass("hasSubmenu");
				});
				// Find the last li in each level
				$('li:last-child').each(function(){
					$this = $(this);
					// Check if LI has children
					if ($this.children('#multiselect ul').length === 0){
						// Add border-left in every UL where the last LI has not children
						$this.closest('#multiselect ul').css("border-left", "1px solid gray");
					} else {
						// Add border in child LI, except in the last one
						$this.closest('#multiselect ul').children("li").not(":last").css("border-left","1px solid gray");
						// Add the class "addBorderBefore" to create the pseudo-element :defore in the last li
						$this.closest('#multiselect ul').children("li").last().children("a").addClass("addBorderBefore");
						// Add margin in the first level of the list
						$this.closest('#multiselect ul').css("margin-top","20px");
						// Add margin in other levels of the list
						$this.closest('#multiselect ul').find("li").children("ul").css("margin-top","20px");
					};
				});
	
	
	var estimateForm = $('form#estimate-form');

				estimateForm.submit(function(event){
					event.preventDefault();

					var basePrice = 520;
					var unitPrice = 220;

					var replyTo = document.getElementById('quote-email').value;
					var linealLength = document.getElementById('lineal').value === '' ? 0 : document.getElementById('lineal').value;
					var stairLength = document.getElementById('stairs').value === '' ? 0 : document.getElementById('stairs').value;
					var isInstall = $('#installselect-checkbox').prop('checked');
					var amount = 0;
					var glassMultiplier = rail.type === "glass" ? 1.02 : 1;
					var mountMultiplier = rail.mount !== "core" ? 1.15 : 1;
					var colorMultiplierNoInstall = rail.color !== "cl" ? 1.08 : 1;
					var colorMultiplierWithInstall = rail.color !== "cl" ? 1.04 : 1;
					var totalLength = Number(linealLength) + Number(stairLength);

					if (isInstall) {
						var multiplierStraights = Number(linealLength);
						var multiplierStairs = Number(stairLength) * 1.1;
						var tlf = (multiplierStraights + multiplierStairs);

						if (totalLength == 1) {
							amount = basePrice * mountMultiplier;
						} else if(totalLength < 100) {
							amount = (basePrice - (tlf * 3)) * tlf * mountMultiplier;
						} else {
							amount = tlf * unitPrice * mountMultiplier;
						}

						isInstall = "supply and install";
						amount =  amount * colorMultiplierWithInstall * glassMultiplier;
					} else {
						isInstall = "supply";
						var a = 116 * Number(linealLength);
						var b = 138 * Number(stairLength);
						amount = (a + b) * mountMultiplier * colorMultiplierNoInstall * glassMultiplier;
					}

					var emailParams = {
						linealLength: linealLength,
						stairLength: stairLength,
						installation: isInstall,
						color: rail.color,
						type: rail.type,
						cap: rail.cap,
						mount: rail.mount,
						amount: Math.round(amount),
						replyTo: replyTo,
						sum: totalLength
					};

					sendEmail(emailParams);
				});

				function sendEmail(emailParams) {
					var niceColor;

					switch (emailParams.color) {
					    case "cl":
					        niceColor = "clear";
					        break;
					    case "db":
					        niceColor = "dark bronze";
					        break;
					    case "mb":
					        niceColor = "medium bronze";
					        break;
					}

					var templateParams = {
							replyTo: emailParams.replyTo,
							linealLength: emailParams.linealLength,
							stairLength: emailParams.stairLength,
							installation: emailParams.installation,
							color: niceColor,
							type: emailParams.type,
							cap: emailParams.cap,
							mount: emailParams.mount === "bracket" ? "side" : emailParams.mount,
							amount: emailParams.amount,
							sum: emailParams.sum
					};

					var service_id = "default_service";
					var template_id = "template_U35BOQBl";

					$('#get-quote-button').addClass('active');

					emailjs.send(service_id, template_id, templateParams)
						.then(function(){
							$('#get-estimate-row').slideUp();
							$('#submit-quote-container').css({'opacity':1}).animate({'opacity':0});
							$('#success-email').show().fadeIn();
							$('#get-quote-button').toggleClass('active');
							document.getElementById('estimate-form').reset();
						}, 
							$('#get-quote-button').toggleClass('active');
						});

					return false;
				}

				var context = $(this);

				$('#multiselect ul li ul li ul li a').on("click", function( event ) {
					event.preventDefault();
					$this = $(this);
					var key = $this.parent().parent().data("key");
					var value = $this.parent().data("value")
					rail[key] = value;
					context.find("#rail-img").attr("src", rail.getFileName());
				});

				$('#multiselect ul li.hasSubmenu').not(":first").each(function(){
					$this = $(this);
					$this.find("li").first().find("a").addClass('selected');
				});

				$('#multiselect #type li a').click(function(e){
					$('#type li a').removeClass('selected');
					$(this).addClass('selected');
				});

				$('#multiselect #color li a').click(function(e){
					$('#color li a').removeClass('selected');
					$(this).addClass('selected');
				});

				$('#multiselect #mount li a').click(function(e){
					$('#mount li a').removeClass('selected');
					$(this).addClass('selected');
				});

				$('#multiselect #cap li a').click(function(e){
					$('#cap li a').removeClass('selected');
					$(this).addClass('selected');
				});


				// $('#collapseOne').on('show.bs.collapse', function () {
				//   $('span.chevron').removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
				// });
				//
				// $('#collapseOne').on('hide.bs.collapse', function () {
				// 	$('span.chevron').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
				// });

				// Add button to expand and condense - Using FontAwesome
				$('#multiselect ul li.hasSubmenu').each(function(){
					$this = $(this);
					$this.prepend("<a href='#'><i class='fa fa-minus-circle'></i><i style='display:none;' class='fa fa-plus-circle'></i></a>");
					$this.children("a").not(":last").removeClass().addClass("toogle");
				});

				// Actions to expand and condense
				$('#multiselect ul li.hasSubmenu a.toogle').click(function(){
					$this = $(this);
					$this.closest("li").children("ul").toggle("slow");
					$this.children("i").toggle();
					return false;
				});
});
