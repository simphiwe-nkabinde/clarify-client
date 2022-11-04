const searchInputEle = document.getElementById('searchInput');
const spinner = document.getElementById('spinner');
const infoContainer = document.getElementById('infoContainer');
const imgEle = document.getElementById('image');
const imgCont = document.getElementById('image-cont');

const handleClick = () => {
    const blocks = document.querySelectorAll('.block');

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        block.remove();
    }

    const imageUrl = searchInputEle.value
    imgEle.setAttribute('src', imageUrl);
    const category = document.querySelector('input[name="category"]:checked').value;

    if (!imageUrl) return;
    if (!category) return;
    spinner.classList.remove('d-none')


    fetch('http://localhost:3000/clarifai', {
        method: "POST",
        body: JSON.stringify({ imageUrl, category }),
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(res => res.json())
        .then(
            res => {
                console.log(res);
                spinner.classList.add('d-none');

                let content = '';
                if (category === 'food') {
                    for (const c of res) {
                        console.log(c.name + ": " + c.value);
                        content += `<div class="border shadow-sm m-3 rounded text-center p-2" style="width: 10rem;">
                                <h5 class="text-capitalize">${c.name}</h5>
                                <p class="display-4 fs-4">${(c.value * 100).toFixed(2)}%</p>
                            </div>`
                        infoContainer.innerHTML = content
                    }
                } else if (category === 'apparel') {
                    for (const c of res) {
                        content += `<div class="border shadow-sm m-3 rounded text-center p-2" style="width: 10rem;">
                                <h5 class="text-capitalize">${c.data.concepts[0].name}</h5>
                            </div>`
                        infoContainer.innerHTML = `<div>${content}</div>`
                        // <p class="display-4 fs-4">${(c.data.concepts[0].value * 100).toFixed(2)}%</p>

                        let block = document.createElement('div');
                        block.innerText = c.data.concepts[0].name
                        block. className = 'block'
                        block.style.width = '50px';
                        block.style.height = '50px';
                        block.style.left = `${(c.region_info.bounding_box.left_col*450).toFixed(2)}px`
                        block.style.top = `${(c.region_info.bounding_box.top_row*600).toFixed(2)}px`

                        imgCont.append(block);
                    }
                }
            }
        )
}