

var station_namess = station_names.split('@');
if (station_namess[0] == '') station_namess.shift();

var stations = [];
station_namess.forEach(function (station) {
	stations.push(station.split('|'));
});

function getA(key, $e) {
	var filters = [];
	stations.forEach(function (station) {
		if (station[0].indexOf(key) > -1 || station[3].indexOf(key) > -1) {
			filters.push(station);
		}
	});
	$e.html('');
	filters.forEach(function (filter) {
		$e.append('<a data-key="' + filter[2] + '">' + filter[1] + '</a>');
	});
}

$('#start').keyup(function (e) {
	getA($.trim($('#start').val()), $('#find'));
});

$('#end').keyup(function (e) {
	getA($.trim($('#end').val()), $('#find1'));
});

$('#find').delegate('a', 'click', function () {
	$('#start').data('key', $(this).data('key'));
	$('#start').val($(this).html());
	$('#find').html('');
});

$('#find1').delegate('a', 'click', function () {
	$('#end').data('key', $(this).data('key'));
	$('#end').val($(this).html());
	$('#find1').html('');
});

// http://api.12306.com/v1/train/trainInfos?arrStationCode=HZH&deptDate=2017-10-03&deptStationCode=XTQ&findGD=false

$('#search').click(function () {
	$.get('http://api.12306.com/v1/train/trainInfos', {
		deptStationCode: $('#start').data('key'),
		arrStationCode: $('#end').data('key'),
		deptDate: $('#date').val(),
		findGD: false
	}, function (data) {
		if (data && data.data && data.data.trainInfos) {
			var trainInfos = data.data.trainInfos;
			$('#table').html('');
			trainInfos.forEach(function (train) {
				var seats = train.seatList.map(function (seat) {
					return '<div><span>' + seat.seatName + '</span>| <span>\u4F59\u7968\uFF1A' + seat.seatNum + '</span> | \u4EF7\u683C\uFF1A' + seat.seatPrice + '\u5143</div>';
				});
				seats = seats.join('');
				$('#table').append('<tr>\n\t\t\t\t\t\t<td>' + train.trainCode + '</td>\n\t\t\t\t\t\t<td>' + train.arrTime + '</td>\n\t\t\t\t\t\t<td>' + train.runTime + '</td>\n\t\t\t\t\t\t<td>' + train.deptTime + '</td>\n\t\t\t\t\t\t<td>' + seats + '</td>\n\t\t\t\t\t\t<td><button>\u67E5\u770B</button></td>\n\t\t\t\t\t</tr>');
			});
		}
	});
});

$('#table').delegate('button', 'click', function () {
	// http://api.12306.com/v1/train/queryStations?deptDate=2017-09-16&trainCode=K106
	var code = $(this).parents('tr').children('td').first().html();
	$.get("http://api.12306.com/v1/train/queryStations", {
		deptDate: $('#date').val(),
		trainCode: code
	}, function (data) {
		if (data && data.data) {
			$('#tujing').html('');
			data.data.forEach(function (tujing) {
				$('#tujing').append('<tr><td>' + tujing.stationName + '</td><td>' + tujing.arrTime + '</td><td>' + tujing.deptTime + '</td><td>' + tujing.stayTime + '</td></tr>');
			});
			$(document.body, 'html').scrollTop(999999);
		}
	});
});