//Chart 1.5
const GraphPoints = []
const YourPoints = []
const TestNames = []
const ExtraData = []

let round = num => Math.round(num*100)/100

let toggleTriggers = () => {
    var triggers = document.getElementsByClassName("v-button-eds-c-accordion__trigger")
    for (let i = 0; i < triggers.length; i++) { triggers[i].click() }
}

function injectCSS() {
    var style = document.createElement('style');
    style.innerHTML = `
    .eds.cvr .eds-c-tile {
        border-radius: 20px;
    }
    .highcharts-container, .vaadin-chart {
        border-radius: 20px;
    }
    `;
    document.head.appendChild(style);
}

function createCharts() {
    for (let subjectIndex = 0; subjectIndex < ExtraData.length; subjectIndex++) {
        
        subjectName = ExtraData[subjectIndex][0]
        overall = YourPoints[subjectIndex][0]
        median = GraphPoints[subjectIndex][0][2]
        yourScores = YourPoints[subjectIndex];
        yourScores[0] = null;

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
                    if(this.series.index == 0) {
                        const points = this.point.options
                        return '<b>Highest Score:</b> '  + round(points.high)
                        +  '<br><b>Upper Quartile:</b> ' + round(points.q3) 
                        +  '<br><b>Median:</b> '         + round(points.median) 
                        +  '<br><b>Lower Quartile:</b> ' + round(points.q1) 
                        +  '<br><b>Lowest Score:</b> '   + round(points.low);
                    }
                    else {
                        tooltip = '<b>Your Score:</b> ' + this.y
                        weightedScoreIndex = this.series.yData.indexOf(this.y)
                        if(weightedScoreIndex != 0) {
                            tooltip += '<br><b>Weighted Score:</b> ' + ExtraData[subjectIndex][weightedScoreIndex+1]
                        }
                        else {
                            letterGrade = ExtraData[subjectIndex][1]
                            if(letterGrade != '') {
                                tooltip += '<br><b>Letter Grade:</b> ' + letterGrade
                            }
                        }
                        return tooltip
                    }
                },
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
                data: yourScores,
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
            }],
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
                        text: 'Median score: {median}',
                        align: 'center',
                        style: {
                            color: 'gray'
                        }
                    }
                }]
            }
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
                ExtraData.push([shortcut.parentElement.parentElement.parentElement.parentElement.firstChild.innerText, chart.container.parentElement.parentElement.parentElement.firstChild.lastChild.innerText])
                TestNames.push(['<b>Overall</b>'])
                GraphPoints.push([[scores.low, scores.q1, scores.median, scores.q3, scores.high]])
                YourPoints.push([chart.xAxis[0].series[1].options.data[0]])
            }
            else {
                const subjectName = shortcut.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstChild.firstChild.innerText

                for (let subjectIndex = 0; subjectIndex < ExtraData.length; subjectIndex++) {
                    if (ExtraData[subjectIndex][0] == subjectName) {
                        ExtraData[subjectIndex].push(shortcut.children[2].firstChild.children[1].firstChild.innerText.replace('\nOut of ', '/'))
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

injectCSS()
scrape()