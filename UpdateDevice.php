<?php
	$sProductCode 		= "";
	$sSerialNumber    	= "";
	
	$json_str 		= file_get_contents('php://input');
	$arr 			= json_decode($json_str, true);
	// Access values from the associative array
	$sProductCode 		= $arr["sProductCode"];
	$sSerialNumber 		= $arr["sSerialNumber"];

	$link = mysqli_connect("192.168.1.25", "vuhoang", "06111987", "warehouse");
	/* check connection */
	if (mysqli_connect_errno()) 
	{
		printf("Connect failed: %s\n", mysqli_connect_error());
		exit();
	}
	$query = "CALL proc_ImportDevice('$sProductCode', '$sSerialNumber')";
	$rows = array();
	if ($result = mysqli_query($link, $query)) 
	{
		while ($row = mysqli_fetch_assoc($result)) 
		{
			$rows[] = $row;
		}
		/* free result set */
		mysqli_free_result($result);
	}
	/* close connection */
	mysqli_close($link);
	echo json_encode($rows);
?>