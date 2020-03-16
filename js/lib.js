// 8th Apiko Intensive. Test 20
// Marchuk Andrew

// DOM

export const makeElement = (elementContent, elementClass, elementTag = "div") => {
    let element = document.createElement(elementTag);
    if (elementClass) {
        element.className = elementClass;
    }
    if (typeof elementContent == "string") {
        let text = document.createTextNode(elementContent);
        element.appendChild(text);
    } else {
        // array of sub elements
        for (let index = 0; index < elementContent.length; index++) {
            element.appendChild(elementContent[index]);
        }
    }
    return element;
};

export const makeImage = (imageSource, elementClass) => {
    let element = document.createElement("img");
    if (elementClass) {
        element.className = elementClass;
    }
    element.setAttribute("src", imageSource);
    return element;
};

export const makeLink = (elementContent, url, elementClass) => {
    let element = document.createElement("a");
    if (elementClass) {
        element.className = elementClass;
    }
    element.setAttribute("href", url);
    // array of sub elements
    for (let index = 0; index < elementContent.length; index++) {
        element.appendChild(elementContent[index]);
    }
    return element;
};

const clearNode = node => {
    while (node.lastElementChild) {
        node.removeChild(node.lastElementChild);
    }
};

export const renderToID = (ID, element) => {
    let node = document.getElementById(ID);
    clearNode(node);
    node.appendChild(element);
};

// AJAX

export const apiKey = "01b1d9a4a7c1b9b9ad2b8f77fbd36794";
export const apiUrl = "https://api.themoviedb.org/3/";
export const apiTrending = apiUrl + "trending/movie/week?api_key=" + apiKey;
export const apiSearch = apiUrl + "search/movie?api_key=" + apiKey;
export const apiImageUrl = "https://image.tmdb.org/t/p/w500";

export const getData = (url, callback) => {
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data));
};

//export
