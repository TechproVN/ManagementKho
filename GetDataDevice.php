<?php
	$link = mysqli_connect("192.168.1.25", "vuhoang", "06111987", "warehouse");
	/* check connection */
	if (mysqli_connect_errno()) 
	{
		printf("Connect failed: %s\n", mysqli_connect_error());
		exit();
	}
	$query = "CALL proc_GetDataDevice()";
	mysqli_set_charset($link,"utf8"); 
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