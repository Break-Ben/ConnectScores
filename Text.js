//Text (old)
const Tests = []

// Scrape
Highcharts.charts.forEach(e => {
    const scores = e.xAxis[0].series[0].data[0].options
    const test = {
        score: e.xAxis[0].series[1].options.data[0].toFixed(1),
        min: scores.low.toFixed(1),
        q1: scores.q1.toFixed(1),
        med: scores.median.toFixed(1),
        q3: scores.q3.toFixed(1),
        max: scores.high.toFixed(1)
    }
    Tests.push(test)
})

// Sort
Tests.sort((a,b) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0))

// Log
console.log("%cScore: Min   →   Q1  →  Med  →   Q3  →   Max", "font-weight: bold")
Tests.forEach(test => console.log(test.score + "%:", test.min + "% →",  test.q1 + "% →", test.med + "% →", test.q3 + "% →", test.max + "%"))
console.log("%cScore: Min   →   Q1  →  Med  →   Q3  →   Max", "font-weight: bold")
