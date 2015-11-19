/* global $ */

// Authentication
var apiPath = 'https://developers.bannerflow.com/api/v1';			// BannerFlow API end-point
var apiAccountSlug = 'bannerflow-enterprise'; 						// Your account slug - can be seen as your Account ID
var apiKey = '89d59bd33a8748d699cf3fb4f116d36d';					// Your BannerFlow API token
var apiSecret = 'a57b32eefeed49e9a633576a053e8181';					// Your BannerFlow API secret

// Global
var account;		// Stores the BannerFlow account details
var networks = [];	// Stores all available networks to export banner tags to
var brands = [];

var currentBrand = null;
var currentCampaigns = null;
var currentCampaign = null;
var currentBanners = null;
var currentBanner = null;

$(function() {
	// ON LOAD
	
	// Try to authenticate
	apiCallAsync('/accounts/' + apiAccountSlug, function(resp){
		// Successfull authentication
		initShowcase();
	}, function() {
		// Authentication failed - incorrect API key or account slug
		// Contact support@bannerflow.com for assistance
		alert('Could not authenticate to BannerFlow API');
	});
	
		
});

function initShowcase() {
	// INIT
	
	// Get available networks
	// -----------------------
	// The user is allowed to choose which network/affiliate platform to export the banner to
	apiCallAsync('/accounts/' + apiAccountSlug + '/networks', function(networkList) {
		// Success
		networks = networkList;
		
		// Add each network to the export drop-down-list
		for (var i=0; i<networks.length; i++) {
			addListItem($('#ddlNetworks'), networks[i]);
		}

	    // Pre-select the BannerFlow network/export option
		var predefinedNetwork = networks.filter(function (n) { return n.name.toString().toLowerCase().indexOf('bannerflow') == 0; })[0];
		$('#ddlNetworks').val(predefinedNetwork.name);

	}, function() {
		// Error
		alert('Error when reading networks');
	});
	
	// Get available brands
	// ---------------------
	// Retrieves list of all brands accessible via the API in the defined BannerFlow account
	apiCallAsync('/accounts/' + apiAccountSlug + '/brands', function(brandList) {
		
		// Success
		showBrands(brandList);
		
	}, function() {
		// Error
		alert('Error when reading brands');
	});
	
	// Interface
	// ---------------------
	// Listens to the Back buttons shown in the various sections of the page
	$('#campaigns .back').click(function() { showSection($('#brands')); });
	$('#campaign .back').click(function() { showCampaigns(currentBrand); });
	$('#banner .back').click(function() { showCampaign(currentCampaign); });
	
	// Listen to changes to the network export panel shown in the bottom of the banner section
	$('#banner .export .settings input, #banner .export .settings select').change(function() { updateExportBannerCodeSettings(currentBanner); });

}

// Shows the available brands for the specific account
function showBrands(brandList) {
	// Shows brand section
	showSection($('#brands'));
	
	// If this is the first time brands are listed, populate the brand list
	if (brands != null) {
		brands = brandList; // Stores the available brands for future use
		
		$('#brands .list li:not(.template)').remove();
		for (var i=0; i<brands.length; i++) {
			// Adds each brand to the page
			var brand = addListItem($('#brands .list'), brands[i]);
			
			// When clicking a brand, show the associated campaigns for that brand
			brand.click(function() {
				var brandId = $(this).attr('data-brandid');
				var brand = brands.filter(function(b) { return b.id == brandId; })[0];
				
				showCampaigns(brand);
			});
		}
	}
}

// Shows the available campaigns for a specific brand
function showCampaigns(brand) {
	// Shows campaign section
	showSection($('#campaigns'));
	
	// If this is the first time this are listed, populate the brand list
	if (currentBrand == null || currentBrand.id != brand.id) {
		currentBrand = brand;
		// Refresh title
		$('#campaigns h3').text(brand.name + ' - Campaigns');
		
		// Clear campaigns from page
		$('#campaigns .list li:not(.template)').remove();
		
		apiCallAsync('/accounts/' + apiAccountSlug + '/brands/' + brand.id + '/campaigns', function(campaigns) {
			// Success
			currentCampaigns = campaigns;
			
			// Populate campaign list
			for (var i=0; i<campaigns.length; i++) {
				// Add each campaign to page
				var campaign = addListItem($('#campaigns .list'), campaigns[i]);
				
				// When clicking a campaign, show the banners within the campaign
				campaign.click(function() {
					var campaignId = $(this).attr('data-campaignid');
					var campaign = campaigns.filter(function(c) { return c.id == campaignId; })[0];
					showCampaign(campaign);
				});
			}
			
		}, function() {
			// Error
			alert('Error when reading campaigns');
		});
	}
}

// Shows the banners within a specific campaign
function showCampaign(campaign) {
	// Shows campaign section
	showSection($('#campaign'));
	
	if (currentCampaign == null || currentCampaign.id != campaign.id) {
		currentCampaign = campaign;
		
		// Clears list of banners from page
		$('#campaign .list li:not(.template)').remove();
		
		// Refresh title
		$('#campaign h3').text(currentBrand.name + ', ' + currentCampaign.name + ' - Banners');
		
		// Retrieve banners from specific campaign
		apiCallAsync('/accounts/' + apiAccountSlug + '/brands/' + currentBrand.id + '/campaigns/' + currentCampaign.id + '/banners?politeLoading=false',
		function(bannerList) {
			// Success
			var banners = bannerList;
			
			// Retrieve texts/translation information
			// ---------------------------------------
			// As the banner list contain limited information about the banners' associated translations/texts
			// a second call is made to retrieve the texts within the specific campaign.
			// Text details being e.g. Text name, Language code, Country Code etc.
			
			apiCallAsync('/accounts/' + apiAccountSlug + '/brands/' + currentBrand.id + '/campaigns/' + currentCampaign.id + '/texts',
			
			function(respTexts) {
				// Success
				var texts = respTexts;
				
				for (var i=0; i<banners.length; i++) {
					// Iterate all found banners, and match the banners' textId to the texts' Id and append the text object to the banner
					var banner = banners[i];
					
					// Add text data to banner objects
					var foundText = texts.filter(function(t) { return t['id'] == banner.textId; });
					if (foundText.length > 0)
						banner.text = foundText[0];
						
				    // Fix to avoid browsers from using the file:// protocol when running this page locally and prepare for inline iframe preview
					banner.tag = banner.tag.replace('"//', '"https://').replace("'//", "'https://").replace(/"/gi, "'");
				}
				
				currentBanners = banners;
		
				// Insert found banners to page
				for (var i=0; i<banners.length; i++) {
					// Add banner to list
					var banner = addListItem($('#campaign .list'), banners[i]);
					
					// When banner is clicked, more details about the banner should show
					banner.click(function() {
						var bannerId = $(this).attr('data-bannerid');
						currentBanner = currentBanners.filter(function(b) { return b.id == bannerId; })[0];
						
						showBanner(currentBanner);
					});
				}
			},
			function() {
				// Error
				alert('Error when reading texts/translations');
			});
		},
		function() {
			// Error
			alert('Error when reading banners');
			
		});
	}
}

// Shows the single banner
function showBanner(banner) {
	// Shows the banner section
	showSection($('#banner'));
	
	// Calculates the banner's file-size in kilobytes
	var bannerFileSize = (banner.htmlFileSize / 1024).toFixed(1);
	
	// Concatentes a user-friendly name of the banner
	var bannerName = banner.size.width + 'x' + banner.size.height + ' ' + banner.text.name;
	
	// Inserts the banner details to the page
	$('#banner h3').text(currentBrand.name + ', ' + currentCampaign.name + ' - ' + bannerName);
	$('#banner .details .name').text(bannerName);
	$('#banner .details .filesize').text(bannerFileSize + 'kB');
	$('#banner .details .flag').css('background-image', 'url(https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/0.8.4/flags/1x1/' + banner.text.culture.cultureCode + '.svg)');
	
	// Inserts banner preview
	var iframe = $("<iframe srcdoc=\"<style>body { margin: 0; padding:0;overflow: hidden;}</style>" + banner.tag.replace('"', '/"') + "\"></iframe>");
	$(iframe).css( { width: banner.size.width, height: banner.size.height });
	$('#banner .preview').css('width', banner.size.width);
	$('#banner-preview').html('');
	$('#banner-preview').append(iframe);
	
	// Refreshes the Export panel shown in the bottom of the banner page
	updateExportBannerCodeSettings(banner);
	
}

function updateExportBannerCodeSettings(banner) {
	$('#banner .export .code').text('Loading...');
	apiCallAsync('/accounts/' + apiAccountSlug + '/brands/' + currentBrand.id + '/campaigns/' + currentCampaign.id + '/banners' +
		'?displayTypeAnimated=' + $('#chkAnimated').is(':checked') + '&politeLoading=' + $('#chkPoliteLoading').is(':checked') + '&responsive=' + $('#chkResponsive').is(':checked') + '&network=' + $('#ddlNetworks').val(),
		function(respBanners) {
			// Success
			var exportTag = respBanners.filter(function(b) { return b.id == banner.id; })[0].tag;
			$('#banner .export .code').text(exportTag);
			
		},
		function() {
			// Error
			alert('Error when receiving banner tag');
			
		});

}

// Supporting method that toggles the various sections on the page (brands, campaigns, campaign, banner)
function showSection(section) {
	$('#contents .section').hide();
	$(section).show();
}



var concurrentCalls = 0;
// Supporting method that makes AJAX requests to the BannerFlow API
function apiCallAsync(relativePath, success, error) {
	// Shows the loading animation
	$('#loading').fadeIn(100);
	
	// Counts the number of ongoing API calls to determine when loading animation should stop
	concurrentCalls ++;
	$.ajax({
		url: apiPath + relativePath,
		cache: false,
		async: true,
		type: 'GET',
		dataType: 'json',
		beforeSend: function (request) {
			var authKey = btoa(apiKey + ":" + apiSecret);
			request.setRequestHeader("Authorization", "Basic " + authKey);
		},
		success: success,
		error: error,
		complete: function() {
			// API call is completed, subtract from the counter
			concurrentCalls--;
			
			// When an API call is completed, if the number of concurrent calls are 0, we hide the loading animation.
			if (concurrentCalls == 0)
				$('#loading').fadeOut(200);
		}
	});

}


// Supporting method that handles HTML templates
// Custom method that makes it easier to bind JavaScript objects to the page's DOM
var listTemplates = [];
function addListItem(listElement, obj) {
	
	// Stores and finds specified HTML template
	var foundTemplate = listTemplates.filter(function (i) { return $(i.element).is($(listElement)); });
	var templateHtml;
	if (foundTemplate.length > 0)
		templateHtml = foundTemplate[0].html;
	else {
		var templateElement = $(listElement).find('.template');
		$(templateElement).removeClass('template');
		templateHtml = $(templateElement)[0].outerHTML;
		listTemplates.push({
			element: $(listElement),
			html: templateHtml
		});
		$(templateElement).remove();
	}
	
	// Inserts object's values in HTML template
	var vars = templateHtml.match(/{([\s\S]*?)}/g);
	for (var i=0; i<vars.length; i++) {
		var variable = vars[i].replace(/[\{\}]/gi, '');
		var variablePath = variable.split('.');
		var path = obj;
		for (var n=0; n < variablePath.length; n++)
			try {
				path = path[variablePath[n]];
			} catch(e) {
				path = ''; break; // Catching incorrect property paths
			}
		templateHtml = templateHtml.replace(vars[i], ( path != undefined ? path : ''));
		
	}
	
	// Inserts HTML to list element
	var newElement = $(templateHtml);
	$(listElement).append(newElement);
	$(newElement).hide().delay($(newElement).index() * 100).fadeIn(100);
	
	return newElement;
}