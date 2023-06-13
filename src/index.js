import './style.css'
import 'bootstrap';

import video from '../src/assets/welcome.mp4';

import db from './utils/firebaseConnection.js'
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore"
import { times } from 'lodash';

let status = true
const boxOpen = () => {
    const boxes = document.querySelectorAll('.box')

    boxes.forEach(box => {
        box.addEventListener('click', () => {
            box.children[1].classList = status ? 'show' : 'unshow'
            status = !status
        })
    })
};

let toggle = false;
/* Call this function to add events, first parameter: text, second parameter: 
event name, third parameted: year */
const toggleBox = (text, eventName, eventYear) => {
    const html = `
    <div class="timeline-item ">
            <div class="content box ${toggle ? "right" : ""}">
                <h2>${eventName}</h2>
                <p>${text}</p>
            </div>
            <div class="timeline-icon">${eventYear}</div>
        </div>
    `


    const timeline = document.querySelector(".timeline");
    const element = document.createElement("div");
    element.innerHTML = html;
    timeline.appendChild(element);
    toggle = !toggle
}

/* is called when the site is load, and should be responsabel
to get all events from databse */
const getBoxes = async () => {
    try {
        const q = query(collection(db, 'posts'), orderBy('eventYear', 'asc'));
        onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const { text, eventName, eventYear } = doc.data();
                toggleBox(text, eventName, eventYear);
            });
            boxOpen()
        });
    } catch (err) {
        console.log(err);
    }
};

const handleVideo = () => {
    const button = document.querySelector('.js-animated-button');

    button.addEventListener('click', () => {
        const modalContainer = document.getElementById('modalContainer');

        const html = `
        <div id="modalContainer" class="d-flex align-items-center justify-content-center">
        <div class="video-container">
            <video id="myVideo" src="${video}" controls></video>
            <button class="close-button btn btn-light">Close</button>
        </div>
        </div>   
        `;

        modalContainer.innerHTML = html;
        modalContainer.classList.add('show');

        const closeButton = modalContainer.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            modalContainer.classList.remove('show');
        });
    });
}

const buttonListennier = () => {
    document.addEventListener('DOMContentLoaded', function () {
        const scrollToTopBtn = document.querySelector('.scroll-to-top');

        // Exibir ou ocultar o botão de rolagem ao rolar a página
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 100) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        // Rolar para o topo ao clicar no botão
        scrollToTopBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const scrollDuration = 800;
            const scrollStep = -window.scrollY / (scrollDuration / 15);

            const scrollInterval = setInterval(function () {
                if (window.scrollY !== 0) {
                    window.scrollBy(0, scrollStep);
                } else {
                    clearInterval(scrollInterval);
                }
            }, 15);
        });
    });
}

buttonListennier()
handleVideo()
getBoxes()