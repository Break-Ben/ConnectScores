//Chart 1.3
const GraphPoints = []
const YourPoints = []
const TestNames = []
const ExtraData = []

let round = num => Math.round(num*100)/100
let toggleTriggers = () => {
    var triggers = document.getElementsByClassName("v-button-eds-c-accordion__trigger")
    for (let i = 0; i < triggers.length; i++) { triggers[i].click() }
}
function createCharts() {
    for (let subjectIndex = 0; subjectIndex < ExtraData.length; subjectIndex++) {
        
        subjectName = ExtraData[subjectIndex][0]
        overall = YourPoints[subjectIndex][0]
        median = GraphPoints[subjectIndex][0][2]

        Highcharts.chart('overallChart' + subjectIndex, {
            chart: {
                type: 'boxplot'
            },
            title: {
                text: subjectName,
                style: {
                    color: 'black',
                    fontWeight: 'bold'
                }
            },
            plotOptions: {
                boxplot: {
                    color: 'black'
                }
            },
            exporting: {
                filename: subjectName,
            },
            legend: {
                enabled: false
            },
            tooltip: {
                formatter: function () {
                    if(this.series.index == 0) {
                        const points = this.point.options
                        return '<b>Lowest Score:</b> ' + round(points.low) 
                        + '<br><b>Lower Quartile:</b> ' + round(points.q1) 
                        + '<br><b>Median:</b> ' + round(points.median) 
                        + '<br><b>Upper Quartile:</b> ' + round(points.q3) 
                        + '<br><b>Highest Score:</b> ' + round(points.high);
                    }
                    else {
                        tooltip = '<b>Your Score:</b> ' + this.y
                        weightedScoreIndex = this.series.yData.indexOf(this.y)
                        if(weightedScoreIndex != 0) {
                            tooltip += '<br><b>Weighted Score:</b> ' + ExtraData[subjectIndex][weightedScoreIndex]
                        }
                        return tooltip
                    }
                },
            },
            xAxis: {
                categories: TestNames[subjectIndex],
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Scores (%)'
                },
                min: 0,
                max: 100,
                plotLines: [{
                    value: overall,
                    color: '#3090F0',
                    width: 1,
                    zIndex: 4,
                    label: {
                        text: 'Overall score: {overall}',
                        align: 'center',
                        style: {
                            color: 'gray'
                        }
                    }
                }, {
                    value: median,
                    color: 'red',
                    width: 1,
                    zIndex: 4,
                    label: {
                        text: 'Median score: {overall}',
                        align: 'center',
                        style: {
                            color: 'gray'
                        }
                    }
                }]
            },
            series: [{
                name: 'Scores',
                data: GraphPoints[subjectIndex],
                maxPointWidth: 30,
                fill: 'transparent'
            }, {
                name: 'Scores',
                color: '#3090F0',
                type: 'scatter',
                data: YourPoints[subjectIndex],
                marker: {
                    fillColor: 'white',
                    lineWidth: 1,
                    lineColor: '#3090F0'
                }
            }]
        });
    }
    toggleTriggers()
}
const scrape = async () => {
    toggleTriggers()
    await new Promise(res => setTimeout(res, 8000));
    for (let i = 0; i < Highcharts.charts.length; i++) {
        const chart = Highcharts.charts[i]
        if (chart) {
            const scores = chart.xAxis[0].series[0].data[0].options
            const shortcut = chart.container.parentElement.parentElement.parentElement.parentElement

            if (!shortcut.firstChild.innerText) {
                shortcut.parentElement.parentElement.parentElement.parentElement.id = 'overallChart' + i
                ExtraData.push([shortcut.parentElement.parentElement.parentElement.parentElement.firstChild.innerText])
                TestNames.push(['<b>Overall</b>'])
                GraphPoints.push([[scores.low, scores.q1, scores.median, scores.q3, scores.high]])
                YourPoints.push([chart.xAxis[0].series[1].options.data[0]])
            }
            else {
                const subjectName = shortcut.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstChild.firstChild.innerText

                for (let subjectIndex = 0; subjectIndex < ExtraData.length; subjectIndex++) {
                    if (ExtraData[subjectIndex][0] == subjectName) {
                        ExtraData[subjectIndex].push(shortcut.children[2].firstChild.children[1].firstChild.firstChild.innerText.replace('\nOut of ', '/'))
                        TestNames[subjectIndex].push('<b>'+shortcut.firstChild.children[2].innerText +'</b> ('+shortcut.firstChild.children[1].innerText+')')
                        GraphPoints[subjectIndex].push([scores.low, scores.q1, scores.median, scores.q3, scores.high])
                        YourPoints[subjectIndex].push(chart.xAxis[0].series[1].options.data[0])
                    }
                }
            }
        }
    }
    createCharts()
}

scrape()