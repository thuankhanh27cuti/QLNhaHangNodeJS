let inputImageElement = document.querySelector("#file");
let previewImageElement = document.querySelector("#previewImage");

inputImageElement.onchange = function (event) {
    let target = event.target;
    if (target.files) {
        let files = target.files;
        if (files.length !== 0) {
            let file = files[0];

            let reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    previewImageElement.src = e.target.result;
                }
            }

            reader.readAsDataURL(file);
        }
    }
}