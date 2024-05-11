//HTML elements
const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector(".clear-canvas");
const saveImg = document.querySelector(".save-img");
const nextButton = document.querySelector('.next-image');
const prevButton = document.querySelector('.prev-image');

//Canvas context and global variables
const ctx = canvas.getContext("2d");
let prevMouseX, prevMouseY, snapshot;
let isDrawing = false;
let selectedTool = "brush";
let brushWidth = 5;
let selectedColor = "#000";
let imageBrush = null; // Handles the image brush

//Set canvas background to white
const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
};

//Resize the canvas to match its parent container
const resizeCanvas = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    const scale = window.devicePixelRatio;
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(scale, scale);
};

//Debounce resize events for performance
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
});
window.addEventListener("load", resizeCanvas);

//Drawing functions for different shapes and image brush
const drawRect = (e) => {
    if (!fillColor.checked) {
        ctx.strokeRect(prevMouseX, prevMouseY, e.offsetX - prevMouseX, e.offsetY - prevMouseY);
    } else {
        ctx.fillRect(prevMouseX, prevMouseY, e.offsetX - prevMouseX, e.offsetY - prevMouseY);
    }
};

const drawCircle = (e) => {
    let radius = Math.sqrt((prevMouseX - e.offsetX) ** 2 + (prevMouseY - e.offsetY) ** 2);
    ctx.beginPath();
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(2 * prevMouseX - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
};
const drawImageBrush = (x, y) => {
    if (imageBrush) {
        const size = brushWidth * 10; // Multiply by a factor to make the image larger
        ctx.drawImage(imageBrush, x - size / 2, y - size / 2, size, size);
    }
};



//Event handling for drawing
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.beginPath();  // Start a new path to ensure lines are not connected
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
};

const drawing = (e) => {
    if (!isDrawing) return;
    if (['brush', 'eraser', 'rectangle', 'circle', 'triangle', 'imageBrush'].includes(selectedTool)) {
        ctx.putImageData(snapshot, 0, 0);
    }
    
    if (selectedTool === 'brush' || selectedTool === 'eraser') {
        ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === 'rectangle') {
        drawRect(e);
    } else if (selectedTool === 'circle') {
        drawCircle(e);
    } else if (selectedTool === 'triangle') {
        drawTriangle(e);
    } else if (selectedTool === 'imageBrush') {
        drawImageBrush(e.offsetX, e.offsetY);
    }
};

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

//Tool button selection and configuration
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active")?.classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id; 
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});
colorPicker.addEventListener("change", () => {
    selectedColor = colorPicker.value;
    colorPicker.parentElement.style.background = colorPicker.value;
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "canvas_image.jpg";
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.click();
});

//Image selection and scrolling
/*document.querySelectorAll('.image-options .option').forEach(item => {
    item.addEventListener('click', function() {
        const imageSrc = this.getAttribute('data-image');
        const img = new Image();
        img.onload = () => { imageBrush = img; };
        img.src = imageSrc;
        selectedTool = 'imageBrush';  //Switch to image brush tool when an image is selected
    });
});*/

const upBtn = document.querySelector('.up-btn');
const downBtn = document.querySelector('.down-btn');
const imageOptions = document.querySelector('.image-options');

upBtn.addEventListener('click', () => imageOptions.scrollBy(0, -30));
downBtn.addEventListener('click', () => imageOptions.scrollBy(0, 30));



//Switch between images in the gallery
const changeImage = (direction) => {
    const images = document.querySelectorAll('.gallery-image');
    const currentIndex = Array.from(images).findIndex(image => image.classList.contains('active'));
    const nextIndex = (currentIndex + direction + images.length) % images.length;

    images[currentIndex].classList.remove('active');
    images[nextIndex].classList.add('active');
};

document.querySelector('.prev-image').addEventListener('click', () => changeImage(-1));
document.querySelector('.next-image').addEventListener('click', () => changeImage(1));

//Images Tool bar switching 
upBtn.addEventListener('click', () => {
  imageOptions.scrollBy(0, -30); // Scrolls up
});

downBtn.addEventListener('click', () => {
  imageOptions.scrollBy(0, 30); // Scrolls down
});
document.querySelectorAll('.image-options .option').forEach(item => {
    item.addEventListener('click', function() {
        const imageSrc = this.getAttribute('data-image-src'); // Make sure the attribute is correctly named in your HTML
        imageBrush = new Image();
        imageBrush.onload = () => {
            selectedTool = 'imageBrush'; // Switch to image brush tool when an image is loaded
        };
        imageBrush.src = imageSrc;
    });
});

document.getElementById('info-btn').addEventListener('click', () => {
    document.getElementById('info-popup').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('info-popup').style.display = 'none';
});
