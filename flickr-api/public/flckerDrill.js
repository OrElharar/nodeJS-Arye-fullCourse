const imagesArrContainer = document.getElementById("photosContainer");
const searchBar = document.getElementById("inputSearch");
const searchButton = document.getElementById("submitButton");
const header = document.getElementById("homePageHeader");
const imageSourceInput = document.getElementById("uploadImage");
const uploadButton = document.getElementById("uploadButton");
const showImagesButton = document.getElementById("showUploadedImagesButton");
const imageDescriptionLine = document.getElementById("imageDescription");
let isHistoryButtonClicked = false;
const defaultHeader = "My Flickr drill";
let searchLine = "";
const localHost = "http://localhost:2000";

uploadButton.addEventListener('click', () => {
    let url = localHost + "/image-upload/?src=" + imageSourceInput.value + "&alt=" + imageDescriptionLine.value;
    console.log(url)
    fetch(url, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((res) => {
            console.log("Succeeded!", res.json())
            imageDescriptionLine.value = "";
            imageSourceInput.value = "";

        }).catch((err) => {
            console.log("Error!", err)
        })
})

showImagesButton.addEventListener('click', () => {
    isHistoryButtonClicked = true;
    renderPage();
})
searchButton.addEventListener('click', () => {
    searchLine = searchBar.value;
    renderPage();
})
renderPage();
function renderHomePageHeader(title) {
    header.innerHTML = (title === "") ? defaultHeader : "Photos connected with " + title
}
function renderPage() {
    imagesArrContainer.innerHTML = "";
    let url = localHost;
    if (isHistoryButtonClicked) {
        url += "/images-history";
    }
    else {
        if (searchLine === "") {
            url += "/interestingness";
        }
        else
            url += `/search/${searchLine}`;
    }
    fetch(url)
        .then((res) => {
            console.log(res)
            if (res.status === 200) {
                renderHomePageHeader(searchLine);
                return res.json();
            }
            else
                throw new Error(res.status);
        }).then((imagesArr) => {
            const images = imagesArr.data;
            renderImagesContainer(images);
            renderImagesHistoryButton();
        }).catch((err) => {
            alert(err + " - there are 0 results matching.");
            searchLine = "";
            renderPage();
        })
}
function renderImagesHistoryButton() {
    if (isHistoryButtonClicked)
        isHistoryButtonClicked = false;
}
function renderImagesContainer(images) {
    let imageUrl;
    if (isHistoryButtonClicked) {
        for (let i = 0; i < images.length; i++) {
            imageUrl = images[i].src
            const imageContainer = document.createElement('div');
            imageContainer.style.backgroundImage = `url(${imageUrl})`;
            imageContainer.className = "imageBox"

            imagesArrContainer.appendChild(imageContainer);

        }
    }
    else
        for (let i = 0; i < images.length; i++) {
            imageUrl = images[i];
            const imageContainer = document.createElement('div');
            imageContainer.style.backgroundImage = `url(${imageUrl})`;
            imageContainer.className = "imageBox"

            imagesArrContainer.appendChild(imageContainer);

        }
}