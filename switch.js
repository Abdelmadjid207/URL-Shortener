const container = document.getElementById('container');
const register = document.getElementById('register');
const login = document.getElementById('login');
const face = document.getElementById('face');


register.addEventListener('click', () => {
    container.classList.add("active");
    face.classList.add("turn");
    face.classList.remove("turn-back");
});

login.addEventListener('click', () => {
    container.classList.remove("active");
    face.classList.add("turn-back");
    face.classList.remove("turn");
    
});



