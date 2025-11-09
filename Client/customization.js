// customization.js
const colorInput = document.createElement('input');
colorInput.type = 'color';
document.body.appendChild(colorInput);

colorInput.addEventListener('change', () => {
    document.body.style.backgroundColor = colorInput.value;
});

