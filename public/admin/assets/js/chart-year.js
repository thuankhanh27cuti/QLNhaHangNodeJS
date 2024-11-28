let urlSearchParams = new URLSearchParams(window.location.search);
let yearParam = urlSearchParams.get("year");

let selectYear = 0;

let url = "/api/v1/chart/year";
if (yearParam !== "" && yearParam !== null) {
    url = url + `?year=${yearParam}`;
    selectYear = parseInt(yearParam);
}

let revenueByYear = await fetch(url)
    .then(res => res.json());

const parseDate = (date) => {
    const padStart = (number) => {
        return number.toString().padStart(2, "0");
    };

    return `${date.getFullYear()}-${padStart((date.getMonth() + 1))}-${padStart(date.getDate())}`;
}

let labels = [];
let date = new Date();
let year = !isNaN(selectYear) ? selectYear : date.getFullYear();

let loop = new Date(year, 0, 1);
while (loop.getFullYear() === year) {
    labels.push(parseDate(new Date(loop)));
    loop.setMonth(loop.getMonth() + 1);
}

let data = [];
for (let i = 0; i < 12; i++) {
    let x = parseDate(new Date(year, i, 1));
    let find = revenueByYear.find(value => {
        return parseInt(value.date) === i + 1;
    });
    let y = find? parseInt(find.revenue) : 0;
    data.push({x: x, y: y});
}

let chartElement = document.querySelector("#chartToanBo").getContext("2d");
new Chart(chartElement, {
    data: {
        labels: data.map(({x}) => x),
        datasets: [{
            type: 'bar',
            label: "Doanh thu",
            data: data.map(({y}) => y),
            backgroundColor: "rgb(255,150,65)",
            borderColor: "#fd7e14",
            borderWidth: 1
        }, {
            type: 'line',
            label: "",
            data: data.map(({y}) => y),
            tension: 0.3,
            backgroundColor: "rgb(255,208,69)",
            borderColor: "#ffc107",
            borderWidth: 1,
            pointStyle: "circle",
            pointRadius: 5,
            pointHoverRadius: 8
        }]
    }
});