//Backup 1.3
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
    Highcharts.charts.forEach(e => {
        if (e) {
            const scores = e.xAxis[0].series[0].data[0].options
            const shortcut = e.container.parentElement.parentElement.parentElement.parentElement
            if (!shortcut.firstChild.innerText) {
                Subjects.push([shortcut.parentElement.parentElement.parentElement.parentElement.firstChild.innerText, {
                    TestName: 'Overall',
                    Score: e.xAxis[0].series[1].options.data[0],
                    LetterGrade: e.container.parentElement.parentElement.parentElement.firstChild.lastChild.innerText,
                    Minimum: scores.low,
                    Q1: scores.q1,
                    Median: scores.median,
                    Q3: scores.q3,
                    Maximum: scores.high
                }])
            }
            else {
                const subjectName = shortcut.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstChild.firstChild.innerText
                for (let i = 0; i < Subjects.length; i++) {
                    if (Subjects[i][0] == subjectName) {
                        if (shortcut.firstChild.children[2]) { var testName = shortcut.firstChild.children[2].innerText + ' (' + shortcut.firstChild.children[1].innerText + ')' }
                        else { var testName = shortcut.firstChild.children[1].innerText }
                        Subjects[i].push({
                            TestName: testName,
                            Score: e.xAxis[0].series[1].options.data[0],
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
    a.download = 'Backup.json'
    a.click()
    console.log(Subjects)
}
scrape();