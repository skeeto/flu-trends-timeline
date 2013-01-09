var timeline;
function loadData(raw) {
    var csv = raw.replace(/(.|[\r\n])+Date/, 'Date'); // clear header
    timeline = $.csv.toObjects(csv);
    timeline.forEach(function(row) {
        row.Date = new Date(row.Date);
    });
    display(Date.now());
}

function insertMap(map) {
    $('#map').append(map.documentElement);
    $.get('data.txt', loadData, 'text');
}

function findRow(date) {
    for (var i = timeline.length - 1; i >= 0; i--) {
        if (date >= timeline[i].Date) {
            return timeline[i];
        }
    }
    return timeline[0];
}

function display(date) {
    var row = findRow(date);
    for (var abbr in states) {
        var value = row[states[abbr]];
        var normalized = (Math.log(value) - 5) / 5;
        var color = value > 0 ? jet(normalized) : '#7f7f7f';
        $('#' + abbr).css('fill', color);
    }
    $('#maptime').text(row.Date.toDateString());
}

$(document).ready(function() {
    $.get('img/map.svg', insertMap, 'xml');
});
