let searchInputElement = document.querySelector("#search-input");
let searchContainerElement = document.querySelector("#search-container");

searchInputElement.onclick = () => {
    searchContainerElement.classList.toggle("d-none");
    searchContainerElement.classList.toggle("d-block");
}

searchInputElement.oninput = async () => {
    let value = searchInputElement.value;
    console.log(value);
    searchContainerElement.innerHTML = "";
    if (value === "") {
        searchContainerElement.innerHTML += `
            <div class="h-100 w-100">
                <p class="d-block w-100 py-2 text-center">
                    Nhập tên món cần tìm
                </p>
            </div>`;

    }
    else {
        let data = await fetch(`../views/api/search.php?name=${value}`).then(res => res.json());
        if (data.length > 0) {
            data.forEach(({maSP, tenSP, giaBan, anh}) => {
                searchContainerElement.innerHTML += `
            <a href="../views/chitietmonan.php?MaSP=${maSP}" class="d-block w-100 d-flex py-2 align-items-center text-decoration-none" style="color: #000000">
                <div>
                    <img style="width: 60px; height: 60px; object-fit: cover" src="../views/img/${anh}" alt="">
                </div>
                <div class="px-2">
                    <p class="mb-0 fw-bold fs-5">${tenSP}</p>
                    <p class="mb-0">${giaBan} đồng</p>
                </div>
            </a>`;
            });
        }
        else {
            searchContainerElement.innerHTML += `
                <div class="h-100 w-100">
                    <p class="d-block w-100 py-2 text-center">
                        Không tìm thấy món ăn
                    </p>
                </div>`;
        }
    }
}