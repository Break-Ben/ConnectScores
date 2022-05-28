//Scraper
const Subjects = []
Highcharts.charts.forEach(e => {
    if (e) {
        const scores = e.xAxis[0].series[0].data[0].options
        //If overall score
        if (!e.container.parentNode.parentElement.parentElement.parentElement.firstChild.innerText) {
            //Add subject name
            Subjects.push([[e.container.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstChild.innerText], {
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
            const subjectName = e.container.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstChild.firstChild.innerText

            //If subject name exists
            for (let i = 0; i < Subjects.length; i++) {
                if (Subjects[i][0] == subjectName) {
                    //Push test name + scores
                    Subjects[i].push({
                        testName: e.container.parentNode.parentElement.parentElement.parentElement.firstChild.innerText,
                        score: e.xAxis[0].series[1].options.data[0],
                        min: scores.low,
                        q1: scores.q1,
                        med: scores.median,
                        q3: scores.q3,
                        max: scores.high
                    })
                    console.log(subjectName);
                }
            }
        }
    }
})
console.log(Subjects);