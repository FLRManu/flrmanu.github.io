// Cambiar entre modo oscuro y claro
document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('header').classList.toggle('dark-mode');
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    this.textContent = isDarkMode ? '🌞 Cambiar a modo claro' : '🌙 Cambiar a modo oscuro';
});

// Cambiar color de texto al hacer clic
document.getElementById('colorChangeSection').addEventListener('click', function() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    this.style.color = randomColor;
});

// Contador de visitas con LocalStorage
if (localStorage.getItem('visits')) {
    localStorage.setItem('visits', parseInt(localStorage.getItem('visits')) + 1);
} else {
    localStorage.setItem('visits', 1);
}

const visitCount = localStorage.getItem('visits');
document.getElementById('visitCounter').innerHTML = `Número de visitas: ${visitCount}`;

// Efecto de carga
window.onload = function() {
    document.getElementById('loader').style.display = 'none';
};
