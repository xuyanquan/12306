

let station_namess = station_names.split('@');
if(station_namess[0] == '') station_namess.shift();

let stations = [];
station_namess.forEach((station)=>{
	stations.push(station.split('|'));
});

function getA (key, $e) {
	let filters = [];
	stations.forEach((station)=>{
		if(station[0].indexOf(key) > -1 || station[3].indexOf(key) > -1) {
			filters.push(station);
		}
	});
	$e.html('');
	filters.forEach((filter)=>{
		$e.append('<a data-key="' + filter[2] + '">' + filter[1] + '</a>');
	});
}

$('#start').keyup((e)=>{
	getA($.trim($('#start').val()), $('#find'));
});

$('#end').keyup((e)=>{
	getA($.trim($('#end').val()), $('#find1'));
});

$('#find').delegate('a','click', function() {
	$('#start').data('key',$(this).data('key'));
	$('#start').val($(this).html());
	$('#find').html('');
});

$('#find1').delegate('a','click', function() {
	$('#end').data('key',$(this).data('key'));
	$('#end').val($(this).html());
	$('#find1').html('');
});

// http://api.12306.com/v1/train/trainInfos?arrStationCode=HZH&deptDate=2017-10-03&deptStationCode=XTQ&findGD=false

$('#search').click(function(){
	$.get('http://api.12306.com/v1/train/trainInfos',{
		deptStationCode: $('#start').data('key'),
		arrStationCode: $('#end').data('key'),
		deptDate: $('#date').val(),
		findGD: false
	}, function(data){
		if(data && data.data && data.data.trainInfos){
			let trainInfos = data.data.trainInfos;
			$('#table').html('');
			trainInfos.forEach(function(train) {
				let seats = train.seatList.map(function(seat) {
					return `<div><span>${seat.seatName}</span>| <span>余票：${seat.seatNum}</span> | 价格：${seat.seatPrice}元</div>`;
				});
				seats = seats.join('');
				$('#table').append(
					`<tr>
						<td>${train.trainCode}</td>
						<td>${train.arrTime}</td>
						<td>${train.runTime}</td>
						<td>${train.deptTime}</td>
						<td>${seats}</td>
						<td><button>查看</button></td>
					</tr>`
				);
			});
		}
	})
});


$('#table').delegate('button', 'click', function(){
	// http://api.12306.com/v1/train/queryStations?deptDate=2017-09-16&trainCode=K106
	let code = $(this).parents('tr').children('td').first().html();
	$.get("http://api.12306.com/v1/train/queryStations",{
		deptDate: $('#date').val(),
		trainCode: code
	}, function(data) {
		if(data && data.data) {
			$('#tujing').html('');
			data.data.forEach(function(tujing){
				$('#tujing').append(`<tr><td>${tujing.stationName}</td><td>${tujing.arrTime}</td><td>${tujing.deptTime}</td><td>${tujing.stayTime}</td></tr>`);
			});
			$(document.body, 'html').scrollTop(999999);
		}
	});
});


















