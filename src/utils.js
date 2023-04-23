const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

export const getDataFromApi = (url, limit, offset, field) => {
    const timestamp = new Date().toISOString();
    const value = timestamp + PRIVATE_KEY + PUBLIC_KEY;
    const hash = md5(value);
    const completeUrl = url + '?orderBy=' + field + '&limit=' + limit + '&offset=' + offset 
                        + '&ts=' + timestamp + '&apikey=' + PUBLIC_KEY + '&hash=' + hash;
    return fetch(completeUrl)
            .then(response => response.json())
            .catch(error => console.log('No se ha podido recuperar los datos de la API ' + error ))
}

export const orderResultsAlphabeticallyAsc = (list, field) => {
    return list.sort((a, b) => {
        let item = a[`${field}`].toLowerCase();
        let itemAfter = b[`${field}`].toLowerCase();
    
        if (item < itemAfter) {
            return -1;
        }
        if (item > itemAfter) {
            return 1;
        }
        return 0;
    });
    
}

export const orderResultsAlphabeticallyDesc = (list, field) => {
    return list.sort((a, b) => {
        let item = a[`${field}`].toLowerCase();
        let itemAfter = b[`${field}`].toLowerCase();
    
        if (item > itemAfter) {
            return -1;
        }
        if (item < itemAfter) {
            return 1;
        }
        return 0;
    });
}

export const orderResultsDateNewer = (list) => {
    return list.sort((a,b) => {
        let item = a.start.split(' ')[0].split('-').join(''); 
        let itemAfter = b.start.split(' ')[0].split('-').join(''); 
        if (item > itemAfter) {
            return -1;
        }
        if (item < itemAfter) {
            return 1;
        }
        return 0;
    });
}

export const orderResultsDateOlder = (list) => {
    return list.sort((a,b) => {
        let item = a.start.split(' ')[0].split('-').join(''); 
        let itemAfter = b.start.split(' ')[0].split('-').join(''); 
        if (item < itemAfter) {
            return -1;
        }
        if (item > itemAfter) {
            return 1;
        }
        return 0;
    });
}

export const writeCopyrigth = (attributionHTML) => {
    const footer = document.querySelector('footer');
    const span = document.createElement('span');
    span.innerHTML = attributionHTML;
    footer.prepend(span);
}

export const convertDate = (date) => {
    if(date){
        return date.split(' ')[0].split('-').reverse().join('/'); 
    }
    return ' ';
}

export const deleteContainer = (classElement) => {
    const element = document.querySelector(`.${classElement}`);
    element.textContent = '';
}

export const showLoader = () => {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="spinner-border text-danger loader" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
}





