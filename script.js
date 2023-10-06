let decades = [2020, 2010, 2000, 1990, 1980, 1970, 1960, 1950, 1940];
let misconceptions = await fetch('./misconceptions.json')
    .then((response) => response.json());

let tableApi = new DataTable('#misconception-table', {
    bPaginate: false,
    columns: [
        {
            // Start Decade
            title: 'From',
            visible: true,
        },
        {
            // End Decade
            title: 'To',
            visible: true,
        },
        {
            // Misconception Text
            orderable: false,
        },
        {
            // Sources
            render: (data, type, row, meta) => {
                let html = '';
                for (let source of data) {
                    let domain = (new URL(source)).hostname.replace(/^www\./,'');
                    html += `<a href='${source}' target="_blank">${domain}</a><br>`;
                }
                return html;
            },
            orderable: false,
        },
    ],
    data: misconceptions.map(misconception => [
        misconception.range[0],
        misconception.range[1],
        misconception.text,
        misconception.sources,
    ]),
});
$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
    let selectedDecade = parseInt(select.value.replace(/s$/, ''));
    let rowStartDecade = parseInt(data[0]);
    let rowEndDecade = parseInt(data[1]);
    return (selectedDecade >= rowStartDecade && selectedDecade <= rowEndDecade);
});

function selectDecade() {
    let misconceptions = document.getElementById("misconceptions");
    if (select.value === 'Choose a Decade') {
        misconceptions.style.display = "none";
    }
    else {
        misconceptions.style.display = "block";
        tableApi.draw();
    }
}

let select = document.getElementById("Year");
for (let decade of decades) {
    let optionElement = document.createElement("option");
    optionElement.textContent = `${decade}s`;
    optionElement.value = `${decade}`;
    select.appendChild(optionElement);
}
select.addEventListener("change", selectDecade);
