import {
    getDataFromApi, showLoader, writeCopyrigth, deleteContainer, convertDate,
    orderResultsAlphabeticallyAsc, orderResultsAlphabeticallyDesc,
} from "./utils";


let listCharacters = [];
let filteredCharacters = [];


const extractDataCharacters = async (comic) => {
    listCharacters = [];
    let limit = 100;
    let offset = 0;
    let total = comic.characters.available;
    let url = comic.characters.collectionURI;
    while (offset < total) {
        const result = await getDataFromApi(url, limit, offset, 'name');
        listCharacters = listCharacters.concat(result.data.results);
        offset += limit;
    }
}

const drawCharacterSection = (characters) => {
    const typeImg = '/standard_xlarge.';
    if (characters.length > 0) {
        const container = document.querySelector('main');
        const section = document.createElement('section');
        section.classList.add('characters-container');
        section.innerHTML = `
            <div class="mt-4 mb-4 h-5">
                <h2 class="h2 text-center">Characters</h2>
            </div>
            <div class="row-characters d-flex justify-content-around flex-wrap"></div>
        `;
        container.append(section);
        characters.forEach((character, index) => {
            const pathImg = character.thumbnail.path + typeImg + character.thumbnail.extension;
            const containerCard = document.createElement('div');
            containerCard.classList.add('character-container', 'd-flex', 'flex-column', 'justify-content-between', 'm-2');
            containerCard.innerHTML = `
                <img src="${pathImg}" alt="${character.name}" class="img-thumbnail p-2"/>
                <div class="character-info d-flex flex-column justify-content-between">
                    <h5 class="text-center mb-2">${character.name}</h5>
                    ${!character.description ? '' : `
                        <div class="accordion mb-1" id="accordionExample">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingOne">
                                    <button class="accordion-button customize" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="true" aria-controls="collapseOne">
                                        History
                                    </button>
                                </h2>
                                <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                    ${character.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `}
                </div>
                <div class="d-flex justify-content-around mt-2">
                    ${drawExternalLinks(character.urls)}
                </div>
            `;
            document.querySelector('.row-characters').append(containerCard);
        });
    }
}

const drawDetailedCard = async (comic) => {
    await extractDataCharacters(comic);
    deleteContainer('container');
    drawInfoDetailedSection(comic);
    drawCharacterSection(listCharacters);
}

const drawExternalLinks = (urls) => {
    let html = [];
    urls.forEach(url => {
        html += `<a href="${url.url}" class="text-capitalize">${url.type}</a>`;
    });
    return html;
}

const drawInfoDetailedSection = (comic) => {
    const typeImg = '/detail.';
    const container = document.querySelector('main');
    const section = document.createElement('section');
    section.classList.add('details-container', 'card', 'mb-3');
    const pathImg = comic.thumbnail.path + typeImg + comic.thumbnail.extension;
    section.innerHTML = `
        <div class="row">
            <div class= "col-12 col-lg-5 d-flex justify-content-center">
                <img src="${pathImg}" class="img-fluid rounded-start" alt="${comic.title}"/>
            </div>
            <div class="col-12 col-lg-7">
                <div class="card-body">
                    <h2 class="text-center mb-1">${comic.title}</h2>
                    <hr class="hr"/>
                    <div class="d-flex justify-content-around">
                        <span>Start date: ${convertDate(comic.start)}</span>
                        <span class="mb-1">End date:  ${convertDate(comic.end)}</span>
                    </div>
                    <hr class="hr"/>
                    <p class="mt-2">${comic.description}</p>
                    <hr class="hr"/>
                    <div class="d-flex justify-content-around">
                        ${drawExternalLinks(comic.urls)}
                    </div>
                </div>
            </div>
        </div>
    `;
    container.prepend(section);
}

const addEventToSelect = () => {
    const select = document.querySelector('.order-by');
    select.addEventListener('change', event => {
        const container = document.querySelector('.characters-container');
        container.remove();
        //Hay comics que no tienen ficha de personajes
        if (listCharacters.length !== 0) {
            if (select.value === 'asc') {
                filteredCharacters.length !== 0
                    ? drawCharacterSection(orderResultsAlphabeticallyAsc(filteredCharacters, 'name'))
                    : drawCharacterSection(orderResultsAlphabeticallyAsc(listCharacters, 'name'));
            }
            if (select.value === 'desc') {
                filteredCharacters.length !== 0
                    ? drawCharacterSection(orderResultsAlphabeticallyDesc(filteredCharacters, 'name'))
                    : drawCharacterSection(orderResultsAlphabeticallyDesc(listCharacters, 'name'));
            }
        }
    });
}

const addEventToInputSearch = () => {
    const input = document.querySelector('[type=search]');
    const select = document.querySelector('.order-by');
    input.addEventListener('input', event => {
        let criteria = event.target.value.toLowerCase();
        filteredCharacters = listCharacters.filter(character => character.name.toLowerCase().includes(criteria));
        document.querySelector('.characters-container')?.remove();
        if (select.options.selectedIndex === 1) orderResultsAlphabeticallyDesc(filteredCharacters, 'name');
        drawCharacterSection(filteredCharacters);
    });
}



const initDetail = async () => {
    let limit = 100;
    let offset = 0;
    showLoader();
    let params = new URLSearchParams(document.location.search);
    let id = params.get('id');
    let url = `http://gateway.marvel.com/v1/public/events/${id}`;
    const comic = await getDataFromApi(url, limit, offset, 'name');
    writeCopyrigth(comic.attributionHTML);
    addEventToSelect();
    addEventToInputSearch();
    drawDetailedCard(comic.data.results[0]);
}

initDetail();