const API = 'https://657ae39d394ca9e4af12f773.mockapi.io';

const addBtn = document.querySelector('#addBtn');
const heroTable = document.querySelector('#heroesTable tbody');
const deleteBtn = document.querySelector('#deleteBtn');
const heroFavourite = document.querySelector('[data-name="heroFavourite"]');

const METHOD = {
    GET: 'GET',
    POST: 'POST',
    DELETE: 'DELETE',
};

async function controller(action, method = METHOD.GET, body) {
    const headers = {
        'Content-type': 'application/json; charset=UTF-8',
    };

    const request = {
        method,
        headers,
    };

    if (body) request.body = JSON.stringify(body);

    const response = await fetch(`${API}/${action}`, request);
    const data = await response.json();

    return data;
}

async function getUniverses() {
    try {
        const universes = await controller('/universes', METHOD.GET);
        const comicsSelect = document.querySelector('[data-name="heroComics"]');

        universes.forEach((universe) => {
            const option = document.createElement('option');
            option.value = universe.name;         

            comicsSelect.appendChild(option);

            if (comicsValue === universe.name) {
                option.selected = true;
            }
        });
    } catch (error) {
        console.error(error);
    }
}

async function getHeroes() {
    return await controller('/heroes', METHOD.GET);
}

function validateForm() {
    const heroName = document.querySelector('[data-name="heroName"]').value;

    if (!heroName) {
        alert('Please enter a hero name');
        return false;
    }

    return true;
}

async function createHero() {

    const heroName = document.querySelector('[data-name="heroName"]').value;
    const comics = document.querySelector('[data-name="heroComics"]').value;
    const heroFavourite = document.querySelector('[data-name="heroFavourite"]').checked;

    if (!validateForm()) {
        return;
    }  
  
    try {       
        const heroData = {
            name: heroName,
            comics: comics,
            favourite: heroFavourite,
        };

        const newHero = await controller('/heroes', METHOD.POST, heroData);
        const heroTableRow = renderTable(newHero);
        heroTable.appendChild(heroTableRow);

    } catch (error) {
        console.error(error);
    }
}

function renderTable(heroData) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${heroData.name}</td>
        <td>${heroData.comics}</td>
        <td>${heroData.favourite ? '❤️' : ' 😩'}</td>
        <td><button class="btn_delete" data-id="${heroData.id}">Delete</button></td>
    `;
    row.dataset.id = heroData.id;
    row.querySelector('.btn_delete').addEventListener('click', () => deleteHero(heroData.id));    
    return row;
}

async function deleteHero(heroId) {
    try {
        await controller(`/heroes/${heroId}`, METHOD.DELETE);
        const rowToDelete = document.querySelector(`[data-id="${heroId}"]`);
        rowToDelete.remove();
    } catch (error) {
        console.error(error);
    }
}

addBtn.addEventListener('click', createHero);

getUniverses();

