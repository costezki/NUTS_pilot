/* function consult_changed (year) {
	
 	$.ajax({
		type: "GET",
		url: "./scripts/callScript.php",
		async: false,
		data: { file: "change", year: year },
		success: function (response) {
			r = response;
		},
	});
	
	return r;
} */

function call_type (year, type) {
	
	$.ajax({
		type: "GET",
		url: "./scripts/callScript.php",
		async: false,
		data: { file: type, year: year },
		success: function (response) {
			r = response;
		},
	});
	
	return r;
}

function process_changes (year) {
	var array = [];
	var json, i, c=false, res = {}, aux, url;
	
	/* call_type (year, "change"); */
	
	url = './scripts/data_'+ year +'.txt';
	
	$.ajax({
        async: false,
        url: url,
        success: function (data) {
            json = JSON.parse(data);
        }
    });
	
	array = json.results.bindings;
	
	for (i=0; i<array.length; i++) {
		res[array[i].s.value] = 1;
	}
	
	return res;
}

function process_discontinued_2016 (year, changes) {
	var array = [];
	var json, i, c=false, res = {}, aux, url;
	
	/* call_type (year, "discontinued"); */
	
	url = './scripts/discontinued_2016.txt';
	
	$.ajax({
        async: false,
        url: url,
        success: function (data) {
            json = JSON.parse(data);
        }
    });
	
	array = json.results.bindings;
	
	for (i=0; i<array.length; i++) {
		res[array[i].s.value] = 1;
		changes[array[i].s.value] = 1
	}
	
	return res;
}

/* function get_list_changes (year) {
	
	$.ajax({
		type: "GET",
		url: "./scripts/callScript.php",
		async: false,
		data: { file: "list", year: year },
		success: function (response) {
			r = response;
		},
	});
	
	return r;
} */

/* function get_props_year (year) {
	
	$.ajax({
		type: "GET",
		url: "./scripts/callScript.php",
		async: false,
		data: { file: "props", year: year },
		success: function (response) {
			r = response;
		},
	});
	
	return r;
} */

function process_replaces_2016 (year) {
	var array = [];
	var json, i, res = {}, aux, url, c;
	
	/* call_type (year, "replaced"); */
	
	url = './scripts/changes_replaced_'+ year +'.txt';
	
	$.ajax({
        async: false,
        url: url,
        success: function (data) {
            json = JSON.parse(data);
        }
    });
	
	array = json.results.bindings;
	
	for (i=0; i<array.length; i++) {
		aux = {};
		aux["newuri"] = array[i].newuri.value;
		aux["code"] = array[i].code.value;
		aux["label"] = array[i].label.value;
		res[array[i].old.value] = aux;
	}
	
	return res;
}

function process_merged_2016 (year) {
	var array = [];
	var json, i, res = {}, aux, url, c;
	
	/* call_type (year, "merged"); */
	
	url = './scripts/changes_merged_'+ year +'.txt';
	
	$.ajax({
        async: false,
        url: url,
        success: function (data) {
            json = JSON.parse(data);
        }
    });
	
	array = json.results.bindings;
	
	for (i=0; i<array.length; i++) {
		aux = {};
		aux["newuri"] = array[i].newuri.value;
		aux["code"] = array[i].code.value;
		aux["label"] = array[i].label.value;
		res[array[i].old.value] = aux;
	}
	
	return res;
}


function process_split_2016 (year) {
	var array = [];
	var json, i, res = {}, aux, url;
	
	/* call_type (year, "split"); */
	
	url = './scripts/changes_split_'+ year +'.txt';
	
	$.ajax({
        async: false,
        url: url,
        success: function (data) {
            json = JSON.parse(data);
        }
    });
	
	array = json.results.bindings;
	
	for (i=0; i<array.length; i++) {
		var q = res[array[i].old.value];
		
		if (q != undefined) {			
			q["newuri"].push(array[i].newuri.value);
			q["code"].push(array[i].code.value);
			q["label"].push(array[i].label.value);
		}			
		else{
			aux = {};
			
			aux["newuri"] = [];
			aux["newuri"][0] = array[i].newuri.value;
			
			aux["code"] = [];
			aux["code"][0] = array[i].code.value;
			
			aux["label"] = [];
			aux["label"][0] = array[i].label.value;
			
			res[array[i].old.value] = aux;
		}	
	}
	
	return res;
}

function process_list_changes (year) {
	var array = [];
	var json, i, res = {}, aux, url;
	
	/* call_type (year, "list"); */
	url = './scripts/list_changes_'+ year +'.txt';
	
	$.ajax({
		async: false,
		url: url,
		success: function (data) {
			json = JSON.parse(data);
		}
	});
	
	array = json.results.bindings;
	
	for (i=0; i<array.length; i++) {
		aux = {};
		aux[array[i].prop.value] = array[i].val.value;
		
		var q = res[array[i].uri.value];
		if (q != undefined)
			res[array[i].uri.value].push(aux);
		else{
			res[array[i].uri.value] = [];
			res[array[i].uri.value][0] = aux;
		} 
	}
	
	return res;
}

function process_props_year (year) {
	var array = [];
	var json, i, res = {}, aux, url;
	
	/* call_type (year, "props"); */
	url = './scripts/props_'+ year +'.txt';
	
	$.ajax({
        async: false,
        url: url,
        success: function (data) {
            json = JSON.parse(data);
        }
    });
	
	array = json.results.bindings;
	
	for (i=0; i<array.length; i++) {
		aux = {};
		aux[array[i].prop.value] = array[i].val.value;
		
		var q = res[array[i].uri.value];
		if (q != undefined)
			res[array[i].uri.value].push(aux);
		else{
			res[array[i].uri.value] = [];
			res[array[i].uri.value][0] = aux;
		} 
	}
	
	return res;
}
