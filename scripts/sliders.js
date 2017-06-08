var quartersList = ["2010", "2013", "2016"];

function addTicksLabels(sliderID, quartersList) {
   $(sliderID + " > label").each(function(){
     $(this).remove();
   });
   var vals = $(sliderID).slider("option", "max") - $(sliderID).slider("option", "min");
   for (var i = 0; i <= vals; i++) {
     var el = $('<label>'+quartersList[i]+'</label>').css('left',(i/vals*100)+'%');
     $(sliderID).append(el);
   }
}

function get_slide_value() {
	return quartersList[$('#slider-deploy').slider("option", "value")];
}

function get_next_year (v) {
	var v_pos = 0, i;
	
	for (i=0; i<quartersList.length; i++) {
		if (quartersList[i] == v) {
			v_pos = i;
		}
	}
	
	if (v_pos == quartersList.length-1) return "2016";
	else return quartersList[v_pos+1];
}

function get_prev_year (v) {
	var v_pos = 0, i;
	
	for (i=0; i<quartersList.length; i++) {
		if (quartersList[i] == v) {
			v_pos = i;
		}
	}
	
	if (v_pos == 0) return "2010";
	else return quartersList[v_pos-1];
}

$("#slider-deploy").slider({
  range: "min",
  step: 1,
  ticks:true,
  min:0,
  max:quartersList.length-1,
  value:quartersList.length-1,
  change: function(event, ui) {
	var year = get_slide_value();
	var s = get_selected_NUTS(year);
	drawMap(s, year);
  }
});

addTicksLabels('#slider-deploy', quartersList);
