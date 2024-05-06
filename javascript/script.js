const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

// global variables with default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    // setting whole canvas background to white, so the downloaded img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
}

window.addEventListener("load", () => {
    // This ensures the canvas size matches its display size.
    resizeCanvas(); // Call the resize function which will set the correct dimensions.
    setCanvasBackground();
});

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

const drawRect = (pos) => {
    if (!fillColor.checked) {
        ctx.strokeRect(prevMouseX, prevMouseY, pos.x - prevMouseX, pos.y - prevMouseY);
    } else {
        ctx.fillRect(prevMouseX, prevMouseY, pos.x - prevMouseX, pos.y - prevMouseY);
    }
}

const drawCircle = (pos) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - pos.x), 2) + Math.pow((prevMouseY - pos.y), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (pos) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(pos.x, pos.y);
    ctx.lineTo(prevMouseX * 2 - pos.x, pos.y);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect();
    return {
      // Scaling mouse coordinates after they have been adjusted relative to the canvas size
      x: (evt.clientX - rect.left) * (canvas.width / rect.width),
      y: (evt.clientY - rect.top) * (canvas.height / rect.height)
    };
}

const startDraw = (e) => {
    const pos = getMousePos(canvas, e);
    isDrawing = true;
    prevMouseX = pos.x;
    prevMouseY = pos.y;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(canvas, e);
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        drawRect(pos);
    } else if (selectedTool === "circle") {
        drawCircle(pos);
    } else {
        drawTriangle(pos);
    }
}




toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

document.addEventListener('DOMContentLoaded', function()
{
    const images = [ 
        '../images/beardenHome.jpeg',
        '../images/beardenImage2.jpeg',
        '../images/beardenLogo.jpeg'
   ];
   let currentIndex = 0;
   const galleryImage = document.querySelector('.gallery-image');
   const nextButton = document.querySelector('.next-image');
   const prevButton = document.querySelector('.prev-image');
   nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    galleryImage.src = images[currentIndex];

   });
   prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    galleryImage.src = images[currentIndex];

   });



});




