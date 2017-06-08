var userLang = navigator.language || navigator.userLanguage;
if(!texts[userLang]){
	userLang = 'en-US';
}

// changes = {uri2013: 1 if changed}
var changes_2013 = process_changes ("2013");
// changes = {uri2013: 1 if changed} uri2013 because we don't have the 2016 maps uri. but the way of querying is different
var changes_2016 = process_changes ("2016");
var discontinued_2016 = process_discontinued_2016 ("2016", this.changes_2016);

//we only to need the new information for 2016, as we don't have the nuts map codes from 2016, so we use the ones from 2013
//replaced = {uri2013: {code: 2016code, label: 2016label, newuri: 2016uri} }
var replaced_2016 = process_replaces_2016 ("2013");
//merged (mergedInto) = {uri2013: {code: 2016code, label: 2016label, newuri: 2016uri} }
var merged_2016 = process_merged_2016 ("2013");
//split (splitInto) = {uri2013: {code: [NUTS2016_code1, NUTS2016_code2], label: [2016label1, 2016label2], newuri: [2016uri1, 2016uri2]} }
var split_2016 = process_split_2016 ("2013");

//changes_2013 = {uri2013: {prop_change: [val1, val2]..., prop_change: [val1, val2]...} } prop_change = dct:replaces, nuts:mergedFrom, nuts:splitFrom
var list_changes_2013 = process_list_changes("2013");
//changes_2016 = {uri2016: {prop_change: [val1, val2]..., prop_change: [val1, val2]...} } prop_change = dct:replaces, nuts:mergedFrom, nuts:splitFrom
var list_changes_2016 = process_list_changes("2016");

//props_year = {uriyear: {prop: [val1, val2]..., prop2: [val1, val2]...} }
var props_2010 = process_props_year("2010");
var props_2013 = process_props_year("2013");
var props_2016 = process_props_year("2016");

drawMap(nuts0_2013_data, "2016");

function selectNuts(option) {
	var year = get_slide_value();
	var data_year = get_selected_NUTS (year);
	//drawMap(window[option.value], year);
	drawMap(data_year, year);
}

function get_selected_NUTS (year) {
	var select = document.getElementById("NUTSLevel");
	
	if (year == "2010") {
		switch (select.options[select.selectedIndex].value) {
			case "nuts0_data": return nuts0_2010_data;
			case "nuts1_data": return nuts1_2010_data;
			case "nuts2_data": return nuts2_2010_data;
			case "nuts3_data": return nuts3_2010_data;
			default : return nuts0_2010_data;
		}
	}
	if (year == "2013") {
		switch (select.options[select.selectedIndex].value) {
			case "nuts0_data": return nuts0_2013_data;
			case "nuts1_data": return nuts1_2013_data;
			case "nuts2_data": return nuts2_2013_data;
			case "nuts3_data": return nuts3_2013_data;
			default : return nuts0_2013_data;
		}
	}
	if (year == "2016") {
		switch (select.options[select.selectedIndex].value) {
			case "nuts0_data": return nuts0_2016_data;
			case "nuts1_data": return nuts1_2016_data;
			case "nuts2_data": return nuts2_2016_data;
			case "nuts3_data": return nuts3_2016_data;
			default : return nuts0_2016_data;
		}
	}
}

function check_changed (NUTS_ID, year) {
	var uri = "http://data.europa.eu/nuts/code/" + NUTS_ID;
	var c = false;
	
	switch (year) {
		case "2013": c = this.changes_2013[uri]; break;
		case "2016": c = this.changes_2016[uri]; break;
	}
	
	return c;
}

function get_change_html (change, type, new_title, new_code, year) {
	var c = "", i, nuts, change_uri, j, props;
	var title = "";
	var notation = "";
	
	switch (year) {
		case "2010": props = this.props_2010; break;
		case "2013": props = this.props_2013; break;
		case "2016": props = this.props_2016; break;
	}
	
	switch (type) {
			case "replace": c = "<p>"+new_title+" ("+new_code+") <b>replaces</b> "; break;
			case "merged": c = "<p>"+new_title+" ("+new_code+") <b>is a merge of</b> "; break;
			case "split": c = "<p>"+new_title+" ("+new_code+") <b>was split from</b> "; break;
	}
	
	for (i=0; i<change.length; i++) {
		change_uri = change[i];
		var aux = props[change_uri];
		var html_change, prop, prop_name;
		
		title = "";
		notation = "";
		if (aux != undefined) {
			for (j=0; j<aux.length; j++) {
				prop = aux[j];
				prop_name = Object.keys(prop)[0];
				
				switch (prop_name){
					case "http://www.w3.org/2004/02/skos/core#prefLabel": title=aux[j][prop_name]; break;
					case "http://www.w3.org/2004/02/skos/core#notation": notation=aux[j][prop_name]; break;
				}
				if (title != "" && notation != "") break;
			}
		}
		else {
			var prev_year = get_prev_year (year);
			switch (prev_year) {
				case "2010": aux = this.props_2010[change_uri];break;
				case "2013": aux = this.props_2010[change_uri];; break;
				case "2016": aux = this.props_2013[change_uri];; break;
			}
			
			if (aux != undefined) {
				var html_change, prop, prop_name;
		
				title = "";
				notation = "";
				for (j=0; j<aux.length; j++) {
					prop = aux[j];
					prop_name = Object.keys(prop)[0];
					
					switch (prop_name){
						case "http://www.w3.org/2004/02/skos/core#prefLabel": title=aux[j][prop_name]; break;
						case "http://www.w3.org/2004/02/skos/core#notation": notation=aux[j][prop_name]; break;
					}
					if (title != "" && notation != "") break;
				}
			}
		}
		
		html_change = title + " (" + notation + ")";
		
		if (change.length > 1 && i==change.length-1) c += " and " + html_change;
		else {
			if (i > 0) c += ", " + html_change;
			else c += html_change;
		}
	}
	c += ".</p>";
	
	return c;
}

function process_HTML_changes (uri, new_title, new_code, year) {
	var c ; //c = [ {prop_change: val} ][ {prop_change: val} ]
	
	switch (year) {
		case "2013": c = this.list_changes_2013[uri]; break;
		case "2016": c = this.list_changes_2016[uri]; break;
		default: return "<p>There were no changes with selected the code.</p>";
	}
	
	var html = "";
	
	if (c != undefined) { //The code didn't change
		var replaced = [], merged = [], split = [], aux = {}, i, prop;
		for (i=0; i<c.length; i++) {
			aux = c[i];
			prop = Object.keys(aux);
			switch (prop[0]){
				case "http://purl.org/dc/terms/replaces": replaced.push(aux[prop]); break;
				case "http://data.europa.eu/nuts/mergedFrom": merged.push(aux[prop]); break;
				case "http://data.europa.eu/nuts/splitFrom": split.push(aux[prop]); break;
			}
		}
		if (replaced.length > 0) html = get_change_html (replaced, "replace", new_title, new_code, year);
		if (merged.length > 0) html += get_change_html (merged, "merged", new_title, new_code, year);
		if (split.length > 0) html += get_change_html (split, "split", new_title, new_code, year);
		html += "</p>";
	}
	else{
		html = "<p>There were no changes with selected the code.</p>";
	}
	
	return html;
}

function drawMap(statesData, year){

	var myNode = document.getElementById("map_container");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
	$("#map_container").append("<div id='map'></div>");

	var map = L.map('map').setView([52, 15], 4);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		id: 'mapbox.light'
	}).addTo(map);
	var layer = L.esri.basemapLayer('Gray').addTo(map);
	
	/* consult_changed (); */

	// control that shows state info on hover
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};
	
	//to update the info on the top right (hover)
	info.update = function (props) {
		if (props) {
			var year = get_slide_value ();
			if (year == "2016") {
				var uri = "http://data.europa.eu/nuts/code/" + props.NUTS_ID;
				var info = replaced_2016[uri];
				if (info != undefined) { //If the code was replaced by other, show new code and new label
					this._div.innerHTML = ('<b>' + info.code + '</b><br />' + info.label + '<br />');
				}
				else {
					info = merged_2016[uri];
					if (info != undefined) { //If the code was merged into other, show new code and new label
						this._div.innerHTML = ('<b>' + info.code + '</b><br />' + info.label + '<br />');
					}
					else {
						info = split_2016[uri];
						if (info != undefined) { //If the code was split into other, show new code and new label
							var code = info.code;
							var label = info.label;
							var cad_code = "", cad_label = "", i;
							
							for (i=0; i<code.length; i++) {
								if (i == 0) {
									cad_code = code[i];
									cad_label = label[i];
								}
								else{
									cad_code += " + " + code[i];
									cad_label += " + " + label[i];
								}
							}
							this._div.innerHTML = ('<b>' + cad_code + '</b><br />' + cad_label + '<br />');
						}
						else {							
							this._div.innerHTML = ('<b>' + props.NUTS_ID + '</b><br />' + props.NAME_HTML + '<br />');
						}
					}
				}
			}
			else this._div.innerHTML = ('<b>' + props.NUTS_ID + '</b><br />' + props.NAME_HTML + '<br />');
		}
		else {
			this._div.innerHTML = "Hover to get more information";
		}
	  };

	info.addTo(map);


	// get color depending on value
	function getColor(d) { //if it changed (d=1) colour is blue. if not, green
		if (d == 1) return '#145FAB';
		else return '#C5E9B0';
	}

	function style(feature) {
		return {
			weight: 1,
			opacity: 1,
			color: 'white',
			fillOpacity: 1,
	  /* fillColor: getColor(feature.properties.density)*/
		};
	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}

	function setColors(year) {
		geojson.eachLayer(function(layer) {
			var c = false;
			switch (year) {
				case "2013": c = check_changed(layer.feature.properties.NUTS_ID, year); break;
				case "2016": c = check_changed(layer.feature.properties.NUTS_ID, year); break;
				default: c = false;
			}			
			if(c != undefined) {
				layer.setStyle({
				fillColor: getColor(c)
				});
			}
			else{
				layer.setStyle({
					fillColor: getColor(0)
				});
			}
		});
	}

	var geojson;

	function resetHighlight(e) {
		var layer = e.target;

		layer.setStyle({
			fillOpacity: 1
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToBack();
		}

		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: updatePanel
		});
	}

	geojson = L.geoJson(statesData, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);


	function updatePanel(e){
		var myNode = document.getElementById("moreInfo");
		myNode.style.display = "block";
		
		var modal_content = document.getElementById("modal-content");
		while (modal_content.firstChild) {
			modal_content.removeChild(modal_content.firstChild);
		}
		$('#modal-content').append("<span class='close'>&times;</span>");
		
		var layer = e.target;
		var year = get_slide_value();
		var uri = "http://data.europa.eu/nuts/code/" + layer.feature.properties.NUTS_ID;
		if (year == "2016") { //if year = 2016, we have to take the new title and code form the replaced/merged or split list
			var new_uri, new_code, new_label;
			if (replaced_2016[uri] != undefined){
				new_uri = replaced_2016[uri].newuri;
				new_code = replaced_2016[uri].code;
				new_label = replaced_2016[uri].label;
			}
			else {
				if (merged_2016[uri] != undefined){
					new_uri = merged_2016[uri].newuri;
					new_code = merged_2016[uri].code;
					new_label = merged_2016[uri].label;
				}
			}
			
			if (new_uri != undefined) { 
				var html = process_HTML_changes (new_uri, new_label, new_code, year);
				$('#modal-content').append(html);
			}
			else {
				if (split_2016[uri] != undefined){
					var i, html;
					for (i=0; i<split_2016[uri].newuri.length; i++) {
						html = "";
						new_uri = split_2016[uri].newuri[i];
						new_code = split_2016[uri].code[i];
						new_label = split_2016[uri].label[i];
						html = process_HTML_changes (new_uri, new_label, new_code, year);
						$('#modal-content').append(html);
					}
				}
				else{
					if (discontinued_2016[uri] != undefined) $('#modal-content').append("<p>This code was discontinued.</p>");
					else $('#modal-content').append("<p>There were no changes with selected the code.</p>");
				} 
			}
		}
		else {
			if (year == "2013") {
				var html = process_HTML_changes (uri, layer.feature.properties.NAME_HTML, layer.feature.properties.NUTS_ID, year);
				$('#modal-content').append(html);
			}
			else {
				$('#modal-content').append("<p>There were no changes with selected the code.</p>");
			}
		}
		
		// When the user clicks anywhere outside of the modal, close it
		var span = document.getElementsByClassName("close")[0];

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
			myNode.style.display = "none";
		}

		window.onclick = function(event) {
			if (event.target == myNode) {
				myNode.style.display = "none";
			}
		}

	}

	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 1],
			labels = ["Not changed", "Changed"],
			cad = [];
			

		for (var i = 0; i < grades.length; i++) {
			cad.push('<i style="background:' + getColor(grades[i]) + '"></i> ' + labels[i]);
		}

		div.innerHTML = cad.join('<br>');
		return div;
	};

	legend.addTo(map);

	setColors(year);

}
			