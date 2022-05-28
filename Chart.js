//Chart 1.0
const createCharts = async () => {
    // Open all triggers and wait 7s
    var triggers = document.getElementsByClassName("v-button-eds-c-accordion__trigger")
    for (let i = 0; i < triggers.length; i++) { triggers[i].click() }
    await new Promise(res => setTimeout(res, 7000));

    //For each chart
    const Subjects = []
    for (let i = 0; i < Highcharts.charts.length; i++) {
        const e = Highcharts.charts[i]
        if (e) {
            const scores = e.xAxis[0].series[0].data[0].options
            const shortcut = e.container.parentElement.parentElement.parentElement.parentElement //To save a bunch of .parentElements
            //If overall score
            if (!shortcut.firstChild.innerText) {
                //Add subject name
                shortcut.parentElement.parentElement.parentElement.parentElement.id = 'overallChart' + i
                //shortcut
                Subjects.push([shortcut.parentElement.parentElement.parentElement.parentElement.firstChild.innerText, {
                    testName: "Overall",
                    score: e.xAxis[0].series[1].options.data[0],
                    min: scores.low,
                    q1: scores.q1,
                    med: scores.median,
                    q3: scores.q3,
                    max: scores.high
                }])
            }
            else {
                const subjectName = shortcut.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstChild.firstChild.innerText
                //If subject name exists
                for (let i2 = 0; i2 < Subjects.length; i2++) {
                    if (Subjects[i2][0] == subjectName) {
                        //Push test name + scores
                        Subjects[i2].push({
                            testName: shortcut.firstChild.innerText,
                            score: e.xAxis[0].series[1].options.data[0],
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

    //For each subject
    for (let subjectIndex = 0; subjectIndex < Subjects.length; subjectIndex++) {
        // Variables
        subject = Subjects[subjectIndex]
        testNames = []
        graphPoints = []
        yourPoints = []
        //For each test
        for (let testIndex = 1; testIndex < subject.length; testIndex++) {
            test = subject[testIndex]
            testNames.push(test.testName)
            graphPoints.push([test.min, test.q1, test.med, test.q3, test.max])
            yourPoints.push([testIndex - 1, test.score])
        }
        overall = yourPoints[0][1]
        median = graphPoints[0][2]

        // Create chart
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
            legend: {
                enabled: false
            },
            xAxis: {
                categories: testNames,
                title: {
                    text: 'Tests'
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
                tooltip: {
                    headerFormat: '<em>Test {point.key-1}</em><br/>'
                }
            }, {
                name: 'Scores',
                color: '#3090F0',
                type: 'scatter',
                data: yourPoints,
                marker: {
                    fillColor: 'white',
                    lineWidth: 1,
                    lineColor: '#3090F0'
                },
                tooltip: {
                    pointFormat: 'Your score: {point.y}'
                }
            }]
        });
    }
    //Close triggers
    triggers = document.getElementsByClassName("v-button-eds-c-accordion__trigger")
    for (let i = 0; i < triggers.length; i++) { triggers[i].click() }
};
createCharts()