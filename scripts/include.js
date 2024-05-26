function loadHTML(elementId, url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        });
}

window.addEventListener('DOMContentLoaded', (event) => {
    loadHTML('header-placeholder', '../pages/header.html');
    loadHTML('footer-placeholder', '../pages/footer.html');
});
