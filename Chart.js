//Chart 1.2
let round = num => Math.round(num*100)/100
const createCharts = async () => {

    var triggers = document.getElementsByClassName("v-button-eds-c-accordion__trigger")
    for (let i = 0; i < triggers.length; i++) { triggers[i].click() }
    await new Promise(res => setTimeout(res, 8000));

    const Subjects = []
    for (let i = 0; i < Highcharts.charts.length; i++) {
        const chart = Highcharts.charts[i]
        if (chart) {
            const scores = chart.xAxis[0].series[0].data[0].options
            const shortcut = chart.container.parentElement.parentElement.parentElement.parentElement
            if (!shortcut.firstChild.innerText) {
                shortcut.parentElement.parentElement.parentElement.parentElement.id = 'overallChart' + i
                Subjects.push([shortcut.parentElement.parentElement.parentElement.parentElement.firstChild.innerText, {
                    testName: "Overall",
                    score: chart.xAxis[0].series[1].options.data[0],
                    min: scores.low,
                    q1: scores.q1,
                    med: scores.median,
                    q3: scores.q3,
                    max: scores.high
                }])
            }
            else {
                const subjectName = shortcut.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstChild.firstChild.innerText
                for (let i2 = 0; i2 < Subjects.length; i2++) {
                    if (Subjects[i2][0] == subjectName) {
                        Subjects[i2].push({
                            testName: shortcut.firstChild.innerText,
                            score: chart.xAxis[0].series[1].options.data[0],
                            min: scores.low,
                            q1: scores.q1,
                            med: scores.median,
                            q3: scores.q3,
                            max: scores.high
                        })
                    }
                }
            }
        }
    }
    console.log(Subjects);

    for (let subjectIndex = 0; subjectIndex < Subjects.length; subjectIndex++) {

        subject = Subjects[subjectIndex]
        testNames = []
        graphPoints = []
        yourPoints = []
        for (let testIndex = 1; testIndex < subject.length; testIndex++) {
            test = subject[testIndex]
            testNames.push(test.testName)
            graphPoints.push([test.min, test.q1, test.med, test.q3, test.max])
            yourPoints.push([testIndex - 1, test.score])
        }
        overall = yourPoints[0][1]
        median = graphPoints[0][2]

        Highcharts.chart('overallChart' + subjectIndex, {
            chart: {
                type: 'boxplot'
            },
            title: {
                text: subject[0],
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
                filename: subject[0]
            },
            legend: {
                enabled: false
            },
            tooltip: {
                formatter: function () {
                    if(this.series.index == 0) {
                        const points = this.point.options
                        return '<b>Lowest Score:</b> ' + round(points.low) + '<br><b>Lower Quartile:</b> ' + round(points.q1) + '<br><b>Median:</b> ' + round(points.median) + '<br><b>Upper Quartile:</b> ' + round(points.q3) + '<br><b>Highest Score:</b> ' + round(points.high);
                    }
                    else {
                        return '<b>Your Score:</b> ' + this.y
                    }
                },
            },
            xAxis: {
                categories: testNames,
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
                data: graphPoints,
                maxPointWidth: 30,
                fill: 'transparent'
            }, {
                name: 'Scores',
                color: '#3090F0',
                type: 'scatter',
                data: yourPoints,
                marker: {
                    fillColor: 'white',
                    lineWidth: 1,
                    lineColor: '#3090F0'
                }
            }]
        });
    }
    triggers = document.getElementsByClassName("v-button-eds-c-accordion__trigger")
    for (let i = 0; i < triggers.length; i++) { triggers[i].click() }
};
createCharts()