let urlSearchParams = new URLSearchParams(window.location.search);
let sortElement = document.querySelector("#sort");
let maLoai = urlSearchParams.get("maLoai");
let paginationElements = document.querySelectorAll(".pagination > div");

const createUrl = (loaisp, page, sort) => {
    let href = "/danh-sach-mon-an";
    let array = [];
    if (loaisp) {
        array.push(`maLoai=${maLoai}`);
    }
    if (page) {
        array.push(`page=${page}`);
    }
    if (sort) {
        array.push(`sort=${sort}`);
    }
    return array.length === 0 ? href : href + "?" + array.join("&");
}

sortElement.onchange = () => {
    let sort = sortElement.value;
    window.location.href = createUrl(maLoai, 0, sort);
};

paginationElements.forEach((element) => {
    element.onclick = () => {
        let p = element.querySelector("p");
        let innerHTML = p.innerHTML;

        let page = parseInt(innerHTML);
        let sort = sortElement.value;

        window.location.href = createUrl(maLoai, page, sort);
    };
});