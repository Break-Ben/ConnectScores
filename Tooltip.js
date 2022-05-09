//Tooltip 1.2
let round = (num) => Math.round(num*100)/100
Highcharts.charts.forEach(e => {
    if(e) {
        options = e.options
        options.tooltip.enabled = true
        options.chart.style.overflow = 'visible'
        options.tooltip.formatter = function () {
            var tooltip = '<div class="Tooltip">'
            if(this.series.index == 0) {
                const points = this.point.options
                tooltip += '<b>Lowest Score:</b> ' + round(points.low) + '<br><b>Lower Quartile:</b> ' + round(points.q1) + '<br><b>Median:</b> ' + round(points.median) + '<br><b>Upper Quartile:</b> ' + round(points.q3) + '<br><b>Highest Score:</b> ' + round(points.high)
            }
            else {
                tooltip += '<b>Your Score:</b> ' + this.y
            }
            return tooltip + '</div>';
        }
        new Highcharts.chart(options)
    }
})