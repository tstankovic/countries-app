window.addEventListener('load', () => {
    const output = document.getElementById('output');
    const count = document.getElementById('count');
    const sortParam = document.getElementById('sort-param');
    const sortOpt = document.getElementById('sort-opt');
    const cbs = document.querySelectorAll('.checkbox-inline input');
    const btnTop = document.getElementById('btn-top');
    let url;
    let fetchedData = [];
    let order = 1;

    document.getElementById('search').addEventListener('click', () => {
        sortParam.style.display = 'none';
        sortOpt.style.display = 'none';
        const searchText = document.getElementById('search-text').value.toLowerCase();
        const searchParam = document.getElementById('search-param').value || 'name';
        if (!searchText) {
            output.innerHTML = '';
            count.textContent = '';
            return;
        }
        if (searchParam === 'full-name') {
            url = `https://restcountries.eu/rest/v2/name/${searchText}?fullText=true`;
        } else {
            url = `https://restcountries.eu/rest/v2/${searchParam}/${searchText}`;
        }
        fetchData();
    });

    window.onscroll = () => {
        if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
            btnTop.style.display = "block";
        } else {
            btnTop.style.display = "none";
        }
    }

    btnTop.addEventListener('click', () => {
        document.documentElement.scrollTop = 0;
    });

    sortParam.addEventListener('change', () => {
        sortData();
    });

    cbs.forEach(cb => {
        cb.addEventListener('change', e => {
            cbs.forEach(checkbox => checkbox.checked = false);
            e.target.checked = true;
            order = Number(e.target.value);
            sortData();
        });
    });

    const fetchData = async () => {
        const res = await fetch(url);
        const data = await (res.json());
        fetchedData = data;
        count.textContent = `Filtered ${fetchedData.length || 0} countries total`;
        output.innerHTML = '';
        if (fetchedData.message !== "Not Found") {
            sortParam.style.display = 'block';
            sortParam.style.width = '60%';
            sortParam.className += ' mx-auto';
            sortOpt.style.display = 'block';
            populateOutput(fetchedData);
        }
    };

    const populateOutput = data => {
        data.forEach(element => {
            const el = document.createElement('div');
            el.className = "card mx-auto mt-4 bg-secondary";
            el.setAttribute("style", "width:50%;");
            el.innerHTML = `
                <img class="card-img-top" src="${element.flag}">
                <div class="card-body">
                    <h3 class="card-title">${element.name} / ${element.nativeName}</h5>
                    <hr>
                    <p><strong>Capital:</strong> ${element.capital}</p>
                    <p><strong>Population:</strong> ${element.population}</p>
                    <p><strong>Area:</strong> ${element.area} KM²</p>
                    <p><strong>Language:</strong> ${element.languages[0].name}</p>
                    <p><strong>Region:</strong> ${element.region}</p>
                    <p><strong>Subregion:</strong> ${element.subregion}</p>
                    <a target="_blank" 
                    href="https://www.google.com/maps/@${element.latlng[0]},${element.latlng[1]},6.05z" 
                    class="btn btn-primary">
                        Find on Google Maps
                    </a>
                </div>
            `;
            output.appendChild(el);
        });
    };

    const sortData = () => {
        const param = sortParam.value;
        if (param) {
            output.innerHTML = '';
            fetchedData.sort((a, b) => {
                if (a[param] < b[param])
                    return -1 * order;
                if (a[param] > b[param])
                    return 1 * order;
                return 0;
            });
            populateOutput(fetchedData);
        }
    };
});