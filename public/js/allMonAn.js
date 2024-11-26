let urlSearchParams = new URLSearchParams(window.location.search);
let sortElement = document.querySelector("#sort");
let loaisp = urlSearchParams.get("loaisp");
let paginationElements = document.querySelectorAll(".pagination > div");

const createUrl = (loaisp, page, sort) => {
    let href = "./danhmucmonan.php";
    let array = [];
    if (loaisp) {
        array.push(`loaisp=${loaisp}`);
    }
    if (page) {
        array.push(`page=${page}`);
    }
    if (sort) {
        array.push(`sort=${sort}`);
    }
    return array.length === 0 ? href : href + "?" + array.join("&");
}

if (loaisp !== null) {
    console.log(loaisp);
}
sortElement.onchange = () => {
    let sort = sortElement.value;
    window.location.href = createUrl(loaisp, 0, sort);
};

paginationElements.forEach((element) => {
    element.onclick = () => {
        let p = element.querySelector("p");
        let innerHTML = p.innerHTML;

        let page = parseInt(innerHTML);
        let sort = sortElement.value;

        window.location.href = createUrl(loaisp, page, sort);
    };
});