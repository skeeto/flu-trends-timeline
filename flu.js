var DAY = 24 * 60 * 60 * 1000;

var timeline, slider;
function loadData(raw) {
    var csv = raw.replace(/(.|[\r\n])+Date/, 'Date'); // clear header
    timeline = $.csv.toObjects(csv);
    timeline.forEach(function(row) {
        row.Date = new Date(row.Date);
    });

    slider = $('#date-slider').slider({
        min: timeline[0].Date.valueOf(),
        max: Date.now(),
        step: DAY,
        value: Date.now(),
        change: sliderUpdate,
        slide: sliderUpdate
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

function sliderUpdate(event) {
    display(slider.slider('value'));
}

$(document).ready(function() {
    $.get('img/map.svg', insertMap, 'xml');
});
