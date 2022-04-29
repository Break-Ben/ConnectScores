//Table 1.1
const Tests = []
Highcharts.charts.forEach(e => {
    if(e) {
        const scores = e.xAxis[0].series[0].data[0].options
        Tests.push({
            Score: e.xAxis[0].series[1].options.data[0]+"%",
            Min: scores.low+"%",
            Q1: scores.q1+"%",
            Median: scores.median+"%",
            Q3: scores.q3+"%",
            Max: scores.high+"%"
        })
    }
})
Tests.sort((a,b) => (a.Score > b.Score) ? 1 : ((b.Score > a.Score) ? -1 : 0))
console.table(Tests)