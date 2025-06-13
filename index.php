<?php include('upload.php'); ?>
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet"
href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css
/bootstrap.min.css" />
<script
src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bo
otstrap.min.js"></script>
</head>
<body>
<div class="container">
<div style="height: 20px;"></div>
<div class="row">
<div class="col-lg-2">
</div>
<div class="col-lg-8">

<table width="80%" class="table table-striped table-
bordered table-hover">

<thead>
<th>UserID</th>
<th>Firstname</th>

</thead>

<tbody>
<?php
while($crow = mysqli_fetch_array($nquery)){
?>
<tr>
<td><?php echo $crow['userid'];

?></td>

<td><?php echo $crow['firstname'];

?></td>


</tr>
<?php
}
?>
</tbody>
</table>
<div id="pagination_controls"><?php echo
$pagination_Ctrls; ?></div>
</div>
<div class="col-lg-2">
</div>
</div>
</div>
</body>
</html>