//Backup 1.4
const Subjects = [{
    StudentName: Liferay.ThemeDisplay.getUserName(),
    DateRecorded: Date()
}]
var triggers = document.getElementsByClassName('v-button-eds-c-accordion__trigger')
for (let i = 0; i < triggers.length; i++) { triggers[i].click() }
const scrape = async () => {
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
    Highcharts.charts.forEach(chart => {
        if (chart) {
            const scores = chart.xAxis[0].series[0].data[0].options
            const shortcut = chart.container.closest('.cvr-c-task')
            const children = shortcut.firstChild.children;
            const subjectName = shortcut.closest('.eds-c-tile').firstChild.firstChild.innerText
            if (!shortcut.firstChild.innerText) {
                Subjects.push([subjectName, {
                    TestName: 'Overall',
                    Score: chart.xAxis[0].series[1].options.data[0],
                    LetterGrade: chart.container.closest('.cvr-c-task__achievement').firstChild.lastChild.innerText,
                    Minimum: scores.low,
                    Q1: scores.q1,
                    Median: scores.median,
                    Q3: scores.q3,
                    Maximum: scores.high
                }])
            }
            else {
                for (let i = 0; i < Subjects.length; i++) {
                    if (Subjects[i][0] == subjectName) {
                        if (children[2]) { var testName = children[2].innerText + ' (' + children[1].innerText + ')' }
                        else { var testName = children[1].innerText }
                        Subjects[i].push({
                            TestName: testName,
                            Score: chart.xAxis[0].series[1].options.data[0],
                            Mark: shortcut.children[2].firstChild.firstChild.firstChild.innerText.replace('\nOut of ', '/'),
                            WeightedScore: shortcut.children[2].firstChild.children[1].firstChild.innerText.replace('\nOut of ', '/'),
                            Minimum: scores.low,
                            Q1: scores.q1,
                            Median: scores.median,
                            Q3: scores.q3,
                            Maximum: scores.high
                        })
                    }
                }
            }
        }
    })
    var a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(Subjects, null, 4)], { type: 'text/plain' }))
    a.download = `Backup (${(new Date()).toISOString().split('T')[0]}).json`
    a.click()
    console.log(Subjects)
}
scrape();