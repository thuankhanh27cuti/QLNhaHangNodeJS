let urlSearchParams = new URLSearchParams(window.location.search);
let listNguyenLieuElement = document.querySelector("#listNguyenLieu");
let submitBtn = document.querySelector("#submit");
let pageId = parseInt(urlSearchParams.get("id"));
let listCongThucMon = await fetch(`/api/v1/cong-thuc-mon/${pageId}`).then(response => response.json());
let listNguyenLieu = await fetch("/api/v1/nguyen-lieu").then(response => response.json());

const deleteNguyenLieu = (id) => {
    listCongThucMon = listCongThucMon.filter(value => {
        return parseInt(value.MaNL) !== id;
    });
    let innerHTML = "";
    for (const congThucMon of listCongThucMon) {
        innerHTML += `<div class='row mb-2'>
            <div class='col'><p>${congThucMon.TenNL}</p></div>
            <div class='col'>
                <label class='d-none' for='quantity-${congThucMon.MaNL}'></label>
                <input class="form-control" onchange='changeQuantity(this)' id='quantity-${congThucMon.MaNL}' type='number' min='0' value='${congThucMon.SoLuongCanDung}'>
            </div>
            <div class='col'>
                <p type='button' onclick='deleteNguyenLieu(${congThucMon.MaNL})'>Xoá nguyên liệu</p>
            </div>
        </div>`;
    }
    listNguyenLieuElement.innerHTML = innerHTML;
    console.log(listCongThucMon);
}

const addNguyenLieu = (id) => {
    let find = listCongThucMon.find(value => {
        return parseInt(value.MaNL) === id;
    });
    if (find) {
        for (let i = 0; i < listCongThucMon.length; i++) {
            if (parseInt(listCongThucMon[i].MaNL) === id) {
                listCongThucMon[i].SoLuongCanDung = parseInt(listCongThucMon[i].SoLuongCanDung) + 1;
            }
        }
    }
    else {
        let nguyenLieu = listNguyenLieu.find((value) => {
            return parseInt(value.MaNL) === id;
        });
        delete nguyenLieu.SoLuongCon;
        nguyenLieu.SoLuongCanDung = 1;
        listCongThucMon.push(nguyenLieu);
    }
    let innerHTML = "";
    for (const congThucMon of listCongThucMon) {
        innerHTML += `
        <div class='row mb-2'>
            <div class='col'><p>${congThucMon.TenNL}</p></div>
            <div class='col'>
                <label class='d-none' for='quantity-${congThucMon.MaNL}'></label>
                <input class="form-control" onchange='changeQuantity(this)' id='quantity-${congThucMon.MaNL}' type='number' min='0' value='${congThucMon.SoLuongCanDung}'>
            </div>
            <div class='col'>
                <p type='button' onclick='deleteNguyenLieu(${congThucMon.MaNL})'>Xoá nguyên liệu</p>
            </div>
        </div>`;
    }
    listNguyenLieuElement.innerHTML = innerHTML;
    console.log(listCongThucMon);
}

const changeQuantity = (event) => {
    let id = parseInt(event.id.split("-")[1]);
    let value = parseInt(event.value);

    for (let i = 0; i < listCongThucMon.length; i++) {
        if (parseInt(listCongThucMon[i].MaNL) === id) {
            listCongThucMon[i].SoLuongCanDung = value;
        }
    }
    console.log(listCongThucMon);
}

submitBtn.onclick = function (event) {
    event.preventDefault();
    listCongThucMon = listCongThucMon.map((element) => {
        let object = {};
        object.id = element.MaNL;
        object.quantity = element.SoLuongCanDung;
        return object;
    });

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `/admin/update/cong-thuc-mon?id=${pageId}`;

    const input = document.createElement("input");
    input.name = "update";
    input.value = JSON.stringify(listCongThucMon);

    form.appendChild(input);
    document.body.appendChild(form);

    form.submit();
}

window.deleteNguyenLieu = deleteNguyenLieu;
window.addNguyenLieu = addNguyenLieu;
window.changeQuantity = changeQuantity;