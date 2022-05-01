Highcharts.charts.forEach(e => {
    if(e) {
        var options = e.options
        options.tooltip.enabled = true
        options.tooltip.headerFormat = ''
        options.chart.style.height = 1000
        new Highcharts.chart(options)
    }
})