const BASE_API_URL = 'localhost:8000/api/'
async function makeRequest(url, method='GET', data=undefined) {
    let opts = {method, headers: {}};

    if (!csrfSafeMethod(method))
        opts.headers['X-CSRFToken'] = getCookie('csrftoken');
        // opts.headers['sessionid'] = getCookie('sessionid');

    if (data) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(data);
    }

    let response = await fetch(url, opts);

    if (response.ok) {  // нормальный ответ
        return response;
    } else {            // ошибка
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


async function addQoute(event) {
    event.preventDefault();
    let response = await makeRequest('http://localhost:8000/api/quote/', 'POST', {
        text: document.getElementById('text_qoute').value,
        author: document.getElementById('author').value,
        email: document.getElementById('email').value
    });
    let data = await response.json();
    console.log(data);
    document.getElementById('text_qoute').value = ""
    document.getElementById('author').value = ""
    email: document.getElementById('email').value = ""
}

async function like_qoute(event) {
    event.preventDefault()
    console.log(event.target.id)
    let data = await makeRequest('http://localhost:8000/api/quote/'+event.target.id + '/like', 'GET').then(response => response.json())
    console.log(data)
}

async function dislike_qoute(event) {
    event.preventDefault()
    console.log(event.target)
    let data = await makeRequest('http://localhost:8000/api/quote/'+event.target.id + '/dislike', 'GET').then(response => response.json())
    console.log(data)
}

function show_form(event){
    event.preventDefault()
    form = document.getElementById('form')
    form.classList.remove("hidden");
    qoutes = document.getElementById('qoutes')
    qoutes.classList.add("hidden");

}

//localhost:8000/api/qoute/8/like
//localhost:8000/api/quote/2/like

async function get_qoute(event){
    event.preventDefault()
    let data = await makeRequest('http://localhost:8000/api/quote/', 'GET').then(response => response.json())
    for (qoute of data) {
        let div = document.createElement('div');
        div.className = 'qoute';
        let p = document.createElement('p')
        p.innerText = 'text' + ':' + qoute['text']
        div.appendChild(p)
        let p1 = document.createElement('p')
        p1.innerText = 'created' + ':' + qoute['created_at']
        div.appendChild(p1)
        let p2 = document.createElement('p')
        p2.innerText = 'Raiting' + ':' + qoute['rating']
        div.appendChild(p2)
        let like = document.createElement("a")
        like.innerText = 'like'
        like.href = ''
        like.id = qoute['id']
        like.classList.add('like')
        div.appendChild(like)
        like.addEventListener('click', like_qoute)

        let dislike = document.createElement("a")
        dislike.innerText = 'dislike'
        dislike.href = ''
        dislike.id = qoute['id']
        dislike.classList.add('like')
        div.appendChild(dislike)
        dislike.addEventListener('click', dislike_qoute)

        container = document.getElementById('qoutes')
        container.appendChild(div)
        container.classList.remove("hidden");
        form = document.getElementById('form')
        form.classList.add("hidden");

    }
}


window.addEventListener('load', function() {
    const send_button = document.getElementById('send');
    send_button.onclick = addQoute;
    const home_button = document.getElementById('home_menu')
    home_button.onclick = get_qoute;
    const new_qoute = document.getElementById('add_qoute')
    console.log(new_qoute)
    new_qoute.onclick = show_form;
});