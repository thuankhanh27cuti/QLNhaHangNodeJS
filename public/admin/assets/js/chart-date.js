let doanhThu = await fetch("/api/v1/chart/date").then((response) => response.json());

let labels = [];
for (let i = 0; i < 24; i++) {
    labels.push(i.toString().padStart(2, "0"));
}

let data = labels.map(hour => {
    let data = doanhThu.find(value => {
        return parseInt(value.hour) === parseInt(hour);
    });
    return data ? {hour: `${data.hour}:00`, revenue: parseInt(data.revenue)} : {hour: `${hour}:00`, revenue: 0};
});

console.log(data);

let chartElement = document.querySelector("#chartToanBo").getContext("2d");
new Chart(chartElement, {
    data: {
        labels: data.map(({hour}) => hour),
        datasets: [{
            type: 'bar',
            label: 'Doanh thu',
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