// Tooltip 1.1
Highcharts.charts.forEach(e => {
    if(e) {
        var options = e.options
        options.tooltip.enabled = true
        options.chart.style.height = 1000
        options.tooltip.formatter = function () {
            var tooltip = '<div class="Tooltip">'
            if(this.series.index == 0) {
                const points = this.point.options
                tooltip += '<b>Lowest Score:</b> ' + points.low + '<br><b>Lower Quartile:</b> ' + points.q1 + '<br><b>Median:</b> ' + points.median + '<br><b>Upper Quartile:</b> ' + points.q3 + '<br><b>Highest Score:</b> ' + points.high
            }
            else {
                tooltip += '<b>Your Score:</b> ' + this.y
            }
            return tooltip + '</div>';
        }
        new Highcharts.chart(options)
    }
})