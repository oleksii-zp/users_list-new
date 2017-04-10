$(function() {

    $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        position: {
            my: "center",
            at: "center top",
            of: window
        },
        show: {
            effect: "fade",
            duration: 800
        },
        hide: {
            effect: "fade",
            duration: 800
        },
        width: 635
    });
    $("#opener").on("click", function() {
        var women = countFemale();
        var men = countMale();
        $("#dialog").dialog("open");

        google.charts.load('current', {'packages': ['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Sex');
            data.addColumn('number', 'Number');
            data.addRows([
                ['Male', men],
                ['Female', women]
            ]);

            var options = {
                'title': 'Gender of users',
                'width': 605,
                'height': 400,
                'fontSize': '20',
                'legend': {
                    position: 'labeled'
                },
                'pieSliceText': 'none',
                'chartArea': {
                    width: 500
                }
            };

            var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
            chart.draw(data, options);
        }
    });
});
