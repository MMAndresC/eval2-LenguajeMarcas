import { getDataFromApi, writeCopyrigth, showLoader, deleteContainer, convertDate,
        orderResultsDateNewer, orderResultsDateOlder, orderResultsAlphabeticallyAsc, 
        orderResultsAlphabeticallyDesc
    } from './utils';

let listComics = [];
let filteredComics = [];
const EVENT_URL = 'http://gateway.marvel.com/v1/public/events';
const COMIC_URL = 'http://gateway.marvel.com/v1/public/comics';



const filterNullResults = (list) => {
    return list.data.results.filter(result => {
        if(result.start) return result;
    });
}

const addEventToSelect = () => {
    const select = document.querySelector('.order-by');
    select.addEventListener('change', event => {
        deleteContainer('container');
        if (select.value === 'asc')
            filteredComics.length !== 0
                ? drawCards(orderResultsAlphabeticallyAsc(filteredComics, 'title'))
                : drawCards(orderResultsAlphabeticallyAsc(listComics, 'title'));
        if (select.value === 'desc')
            filteredComics.length !== 0
                ? drawCards(orderResultsAlphabeticallyDesc(filteredComics, 'title'))
                : drawCards(orderResultsAlphabeticallyDesc(listComics, 'title'));
        if (select.value === 'new')
            filteredComics.length !== 0
                ? drawCards(orderResultsDateNewer(filteredComics))
                : drawCards(orderResultsDateNewer(listComics));
        if (select.value === 'old')
            filteredComics.length !== 0
                ? drawCards(orderResultsDateOlder(filteredComics))
                : drawCards(orderResultsDateOlder(listComics));
    });
}

const addEventToInputSearch = () => {
    const input = document.querySelector('[type=search]');
    const select = document.querySelector('.order-by');
    input.addEventListener('input', event => {
        let criteria = event.target.value.toLowerCase();
        filteredComics = listComics.filter(comic => comic.title.toLowerCase().includes(criteria));
        deleteContainer('container');
        switch (select.options.selectedIndex) {
            case 1: {
                orderResultsAlphabeticallyDesc(filteredComics, 'title');
                break;
            }
            case 2: {
                orderResultsDateNewer(filteredComics);
                break;
            }
            case 3: {
                orderResultsDateOlder(filteredComics);
                break;
            }
        }
        drawCards(filteredComics);
    });
}

const drawCards = (comics) => {
    const main =  document.querySelector('main');
    const typeImg = '/portrait_fantastic.';
    comics.forEach(comic => {
        const containerCard = document.createElement('div');
        containerCard.classList.add('card-container', 'card', 'm-3');
        const pathImg = comic.thumbnail.path + typeImg + comic.thumbnail.extension;
        const endDate = convertDate(comic?.end);
        const startDate = convertDate(comic?.start); 
        containerCard.innerHTML = `
                <div class="card-container-img rounded">
                    <img class="card-image img-fluid rounded" src="${pathImg}"/>
                </div>
                <div class="card-body">
                    <h4 class="card-title text-center">${comic?.title}</h4>
                    <p class="card-dates card-text text-center p-1 pt-2">${startDate} - ${endDate}</p>
                    ${comic.description ? `<p class="card-text">${comic.description}</p>` : ''}</p>
                </div>
        `;
        containerCard.addEventListener('click', event => {
            window.location.assign(`details.html?id=${comic.id}`);
        });
        main.append(containerCard);
    });
}

const drawCarouselComics = async() => {
    const randomComics = await getRandomComics();
    document.getElementById('carouselShowComic').classList.remove('hidden');
    randomComics.forEach((comic, index) => {
        const containerImg = document.getElementById(`slide-img-${index}`);
        const containerTitle = document.getElementById(`slide-title-${index}`);
        containerImg.src = comic.img;
        containerTitle.textContent = comic.title;
    });
}

const getRandomComics = async() => {
    let comic = await getDataFromApi(COMIC_URL, 1, 0, 'title');
    const { total } = comic.data;
    const selected = [];
    let i = 1;
    do{
        let offset = Math.floor(Math.random() * total);
        comic = await getDataFromApi(COMIC_URL, 1, offset, 'title');
        const title = comic.data.results[0]?.title || '';
        const extension = comic.data.results[0].images[0]?.extension || '';
        const path = comic.data.results[0].images[0]?.path || '';
        if(title && extension && path){
            i++;
            const img = `${path}/landscape_amazing.${extension}`;
            selected.push({ title: title, img: img});
        }
        
    }while(i <= 3);
    return selected;
}



const init = async() => {
    let limit = 100;
    let offset = 0;
    showLoader();
    const completeResult = await getDataFromApi(EVENT_URL, limit, offset, 'name');
    writeCopyrigth(completeResult.attributionHTML);
    listComics = filterNullResults(completeResult);
    addEventToSelect();
    addEventToInputSearch();
    deleteContainer('container');
    drawCarouselComics();
    drawCards(listComics);
}


init();