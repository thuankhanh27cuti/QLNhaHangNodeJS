let revenueByWeek = await fetch("/api/v1/chart/month").then((response) => response.json());
console.log(revenueByWeek);

const parseDate = (date) => {
    const padStart = (number) => {
        return number.toString().padStart(2, "0");
    };

    return `${date.getFullYear()}-${padStart((date.getMonth() + 1))}-${padStart(date.getDate())}`;
}

let labels = [];
let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();
let loop = new Date(year, month, 1);
while (loop.getMonth() === month) {
    labels.push(parseDate(new Date(loop)));
    loop.setDate(loop.getDate() + 1);
}

let data = labels.map(date => {
    let data = revenueByWeek.find(value => {
        return value.date === date;
    });
    return data ? {date: data.date, revenue: data.revenue} : {date: date, revenue: 0};
});

let chartElement = document.querySelector("#chartToanBo").getContext("2d");
new Chart(chartElement, {
    data: {
        labels: data.map(({date}) => date.slice(5)),
        datasets: [{
            type: 'bar',
            label: "Doanh thu",
            data: data.map(({revenue}) => revenue),
            backgroundColor: "rgb(255,150,65)",
            borderColor: "#fd7e14",
            borderWidth: 1
        }, {
            type: 'line',
            label: "",
            data: data.map(({revenue}) => revenue),
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