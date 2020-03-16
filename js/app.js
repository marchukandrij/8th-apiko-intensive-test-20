// 8th Apiko Intensive. Test 20
// Marchuk Andrew

import {
    makeElement,
    makeImage,
    makeLink,
    renderToID,
    apiTrending,
    apiImageUrl,
    getData,
    apiSearch,
    apiUrl,
    apiKey
} from "./lib.js";

// ---------------------- Container

const ContainerTitle = () => {
    let span1 = makeElement("8th", false, "span");
    let span2 = makeElement("Apiko", "container__title--strong", "span");
    let span3 = makeElement("Intensive. Test 20", false, "span");
    return makeElement([span1, span2, span3], "container__title");
};

const ContainerSearch = () => {
    let inputLine = makeElement("", "input__text", "input");
    inputLine.setAttribute("type", "text");
    inputLine.setAttribute("placeholder", "Search...");
    inputLine.setAttribute("id", "searchText");
    inputLine.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            event.preventDefault();
            clickSearch();
        }
    });
    let button = makeElement("Search", "input__button");
    button.addEventListener("click", clickSearch);
    return makeElement([inputLine, button], "container__search");
};

const ContainerContent = () => {
    let content = Content();
    let contentContainer = makeElement([content], "container__content");
    contentContainer.setAttribute("id", "contentContainer");
    return contentContainer;
};

const Container = () => {
    return makeElement([ContainerTitle(), ContainerSearch(), ContainerContent()], "container");
};

// ---------------------- Content

const FrameLoading = () => {
    let loader = makeImage("images/preview.gif", "loading__image");
    return makeElement([loader], "loading");
};

const MovieSmall = (data, superSmall = false) => {
    let elements = [];
    if (data.poster_path) {
        elements.push(makeImage(apiImageUrl + data.poster_path, "movieSmall__image"));
    }
    let titleClass = "movieSmall__title";
    if (data.title.length < 30) {
        titleClass += " movieSmall__title--big";
    }
    elements.push(makeElement(data.title, titleClass));
    let className = "movieSmall";
    if (superSmall) {
        className += " movieSmall--superSmall";
    }
    let res = makeElement(elements, className);
    res.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        selectedMovie = data;
        showMovieBig();
    });
    return res;
};

const FrameTrends = () => {
    let list = trendingData.results;
    let elements = list.map(movie => {
        return MovieSmall(movie);
    });

    return makeElement(elements, "trends");
};

const FrameSearch = () => {
    let list = searchData.results;
    let elements = list.map(movie => {
        return MovieSmall(movie);
    });
    return makeElement(elements, "trends");
};

const Content = () => {
    if (contentState == "loading") {
        return FrameLoading();
    }
    if (contentState == "trends") {
        return FrameTrends();
    }
    if (contentState == "search") {
        return FrameSearch();
    }
    return makeElement(contentState);
};

const MovieBig = data => {
    let elements = [];
    if (data.poster_path) {
        elements.push(makeImage(apiImageUrl + data.poster_path, "movieBig__image"));
    }
    let title = makeElement(data.title, "movieBig__title");
    let overview = makeElement(data.overview, "movieBig__overview");
    let also = makeElement("We also recommend:", "movieBig__recommend");
    let recommendations = makeElement("Content:", "movieBig__recommendations");
    recommendations.setAttribute("id", "recommendations");
    let description = makeElement(
        [title, overview, also, recommendations],
        "movieBig__description"
    );
    elements.push(description);
    let res = makeElement(elements, "movieBig__inner");
    res.addEventListener("click", function() {
        hideMovieBig();
    });
    return res;
};

// ---------------------- state & events
let contentState = "loading";
let trendingData;
let searchData;
let selectedMovie;
let recomendedData;
function setContentState(state) {
    contentState = state;
    let content = Content();
    renderToID("contentContainer", content);
}
function clickSearch() {
    let searchText = document.getElementById("searchText").value;
    if (searchText.length == 0) {
        setContentState("trends");
        return;
    }
    if (searchText.length < 3) {
        return;
    }
    let url = apiSearch + "&query=" + encodeURI(searchText);
    getData(url, data => {
        searchData = data;
        setContentState("search");
    });
}
function showMovieBig() {
    let domElement = document.getElementById("movieBig");
    domElement.className = "movieBig movieBig--show";
    let element = MovieBig(selectedMovie);
    renderToID("movieBig", element);
    let url = apiUrl + "movie/" + selectedMovie.id + "/recommendations?api_key=" + apiKey;
    getData(url, data => {
        recomendedData = data;
        let list = recomendedData.results;
        let elements = list.map(movie => {
            return MovieSmall(movie, true);
        });
        let element = makeElement(elements, "movieBig__rec-list");
        renderToID("recommendations", element);
    });
}
function hideMovieBig() {
    let element = document.getElementById("movieBig");
    element.className = "movieBig";
}

// render root
renderToID("root", Container());

// load trends on start
getData(apiTrending, data => {
    trendingData = data;
    setContentState("trends");
});
