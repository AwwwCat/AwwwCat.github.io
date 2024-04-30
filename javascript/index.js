function showImage() {
    for (var i = 1; i <= 6; i++) {
        const imgElement = document.getElementById("sex_image" + String(i));
        imgElement.src = "./images/jian.png";
    }
}