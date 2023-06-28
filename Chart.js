//Chart 1.8
const GraphPoints = []
const YourPoints = []
const TestNames = []
const ExtraData = []

let round = num => Math.round(num * 100) / 100

let mean = array => round(array.reduce((sum, value) => sum + value, 0) / array.length)

let toggleTriggers = () => {
    var triggers = document.getElementsByClassName('v-button-eds-c-accordion__trigger')
    for (let i = 0; i < triggers.length; i++) { triggers[i].click() }
}

function median(array) {
    array = array.sort((a, b) => a - b)
    var middle = Math.floor(array.length / 2)
    if (array.length % 2 !== 0) {
        return round(array[middle])
    }
    else {
        return round((array[middle - 1] + array[middle]) / 2)
    }
}

function injectCSS() {
    var style = document.createElement('style')
    style.innerHTML = `
    .eds.cvr .eds-c-tile {
        border-radius: 20px;
    }
    .highcharts-container, .vaadin-chart {
        border-radius: 20px;
    }
    `
    document.head.appendChild(style)
}

function createCharts() {
    for (let subjectIndex = 0; subjectIndex < ExtraData.length; subjectIndex++) {

        subjectName = ExtraData[subjectIndex][0]
        overall = YourPoints[subjectIndex][0]

        Highcharts.chart('overallChart' + subjectIndex, {
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
                sourceWidth: 1100,
                sourceHeight: 400,
            },
            legend: {
                enabled: false
            },
            tooltip: {
                followPointer: true,
                formatter: function () {
                    if (this.series.index == 0) {
                        const points = this.point.options
                        return '<b>Highest Score:</b> ' + round(points.high)
                            + '%<br><b>Upper Quartile:</b> ' + round(points.q3)
                            + '%<br><b>Median Score:</b> ' + round(points.median)
                            + '%<br><b>Lower Quartile:</b> ' + round(points.q1)
                            + '%<br><b>Lowest Score:</b> ' + round(points.low) + '%'
                    }
                    else {
                        weightedScoreIndex = this.series.yData.indexOf(this.y)
                        if (weightedScoreIndex != 0) {
                            tooltip = '<b>Your Score:</b> ' + this.y + '%'
                            tooltip += '<br><b>Weighted Score:</b> ' + ExtraData[subjectIndex][weightedScoreIndex + 2]
                        }
                        else {
                            var scores = YourPoints[subjectIndex].slice(1)
                            tooltip = '<b>Overall:</b> ' + this.y + '%'
                            tooltip += '<br><b>Mean:</b> ' + mean(scores) + '%'
                            tooltip += '<br><b>Median:</b> ' + median(scores) + '%'
                            letterGrade = ExtraData[subjectIndex][1]
                            if (letterGrade != '') {
                                tooltip += '<br><b>Letter Grade:</b> ' + letterGrade
                            }
                            progressGrade = ExtraData[subjectIndex][2]
                            tooltip += '<br><b>Progress:</b> ' + round(this.y * progressGrade / 100) + '/' + progressGrade
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
                    dashStyle: 'Dash',
                    width: 1,
                    zIndex: 4,
                }, {
                    value: GraphPoints[subjectIndex][0][2],
                    color: 'red',
                    dashStyle: 'Dash',
                    width: 1,
                    zIndex: 4,
                }]
            },
            series: [{
                name: 'Graph Points',
                type: 'boxplot',
                data: GraphPoints[subjectIndex],
                maxPointWidth: 30,
                fill: 'transparent'
            }, {
                name: 'Your Scores',
                color: '#3090F0',
                data: [null, ...YourPoints[subjectIndex].slice(1)],
                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: '#3090F0'
                }
            }, {
                name: 'Your Scores',
                color: '#3090F0',
                data: [overall],
                marker: {
                    symbol: 'circle',
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: '#3090F0'
                }
            }]
        })
    }
    toggleTriggers()
}

const scrape = async () => {
    toggleTriggers()
    var loadingPhase1 = true
    await new Promise((resolve) => {
        const observer = new MutationObserver(() => {
            const indicatorsLoaded = document.querySelectorAll('.v-loading-indicator').length > 2
            if (indicatorsLoaded && loadingPhase1) {
                loadingPhase1 = false
            }
            else if (!indicatorsLoaded && !loadingPhase1) {
                observer.disconnect()
                resolve()
            }
        })
        observer.observe(document.body, { childList: true, subtree: true })
    })
    for (let i = 0; i < Highcharts.charts.length; i++) {
        const chart = Highcharts.charts[i]
        if (chart) {
            const scores = chart.xAxis[0].series[0].data[0].options
            const shortcut = chart.container.parentElement.parentElement.parentElement.parentElement

            if (!shortcut.firstChild.innerText) {
                shortcut.parentElement.parentElement.parentElement.parentElement.id = 'overallChart' + i
                ExtraData.push([shortcut.parentElement.parentElement.parentElement.parentElement.firstChild.innerText, chart.container.parentElement.parentElement.parentElement.firstChild.lastChild.innerText])
                TestNames.push(['<b>Overall</b>'])
                GraphPoints.push([[scores.low, scores.q1, scores.median, scores.q3, scores.high]])
                YourPoints.push([chart.xAxis[0].series[1].options.data[0]])
            }
            else {
                const subjectName = shortcut.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstChild.firstChild.innerText

                for (let subjectIndex = 0; subjectIndex < ExtraData.length; subjectIndex++) {
                    if (ExtraData[subjectIndex][0] == subjectName) {
                        if (shortcut.firstChild.children[2]) {
                            var testName = '<b>' + shortcut.firstChild.children[2].innerText + '</b> (' + shortcut.firstChild.children[1].innerText + ')'
                        }
                        else {
                            var testName = '<b>' + shortcut.firstChild.children[1].innerText + '</b>'
                        }
                        var weightedScore = shortcut.children[2].firstChild.children[1].firstChild.innerText
                        if (ExtraData[subjectIndex][2] == null) { ExtraData[subjectIndex][2] = 0 }

                        TestNames[subjectIndex].push(testName)
                        ExtraData[subjectIndex][2] += parseFloat(weightedScore.split(' ')[2])
                        ExtraData[subjectIndex].push(weightedScore.replace('\nOut of ', '/'))
                        GraphPoints[subjectIndex].push([scores.low, scores.q1, scores.median, scores.q3, scores.high])
                        YourPoints[subjectIndex].push(chart.xAxis[0].series[1].options.data[0])
                    }
                }
            }
        }
    }
    createCharts()
}

injectCSS()
scrape()