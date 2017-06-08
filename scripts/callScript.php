<?php

header('Access-Control-Allow-Origin: *');

$f = $_GET['file'];

switch ($f) {
	case 'change': 	$year = $_GET['year'];
					$cad = 'python code_changed.py' . " " . $year; break;
	case 'list': 	$year = $_GET['year'];
					$cad = 'python list_changes.py' . " " . $year; break;
	case 'props': 	$year = $_GET['year'];
					$cad = 'python list_props.py' . " " . $year; break;
	case 'replaced':$year = $_GET['year']; 
					$cad = 'python replaced.py' . " " . $year; break;
	case 'merged':$year = $_GET['year']; 
					$cad = 'python merged.py' . " " . $year; break;
	case 'split':$year = $_GET['year']; 
					$cad = 'python split.py' . " " . $year; break;
	case 'discontinued': $cad = 'python discontinued.py'; break;
	default: $cad = "File not found.";
}

system($cad);

?>