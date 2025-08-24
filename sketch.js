let video;
let cameraFrame;
let cameraIcon;
let captureButton;
let snapshotPanel;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Set the desktop background to a retro Windows XP wallpaper (replace with your own if you want)
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.backgroundSize = "cover";
  document.body.style.fontFamily = "'MS Sans Serif', sans-serif";

  // Retro camera icon
  cameraIcon = createImg("icons/camera-icon.png", "Retro Camera Icon");
  cameraIcon.position(50, 50);
  cameraIcon.size(83, 64);
  cameraIcon.mousePressed(openCameraPanel);

  // Label under the camera icon
  let cameraLabel = createDiv("EnnuDigiCam");
  cameraLabel.style("position", "absolute");
  cameraLabel.style("top", "120px");
  cameraLabel.style("left", 50 + 83 / 2 + "px");
  cameraLabel.style("transform", "translateX(-50%)");
  cameraLabel.style("font-family", "'MS Sans Serif', sans-serif");
  cameraLabel.style("font-size", "14px");
  cameraLabel.style("color", "black");

  // Hotkey info (bottom center)
  let hotkeyInfo = createDiv("Press [ SPACE ] to take a photo");
  hotkeyInfo.style("position", "absolute");
  hotkeyInfo.style("bottom", "5px");
  hotkeyInfo.style("left", "50%");
  hotkeyInfo.style("transform", "translateX(-50%)");
  hotkeyInfo.style("font-family", "'MS Sans Serif', sans-serif");
  hotkeyInfo.style("font-size", "14px");
  hotkeyInfo.style("color", "black");

  // Create the camera panel
  cameraFrame = createDiv();
  cameraFrame.id("camera-frame");
  cameraFrame.style("display", "none");
  cameraFrame.style("width", "700px");
  cameraFrame.style("height", "550px");
  cameraFrame.style("background", "#d4d0c8"); // Win95 gray
  cameraFrame.style("border", "3px solid black");
  cameraFrame.style("padding", "10px");
  cameraFrame.style("position", "absolute");
  cameraFrame.style("boxShadow", "3px 3px 0px #808080");

  cameraFrame.html(`
    <div id="title-bar" 
         style="display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 5px; 
                background: #000080; 
                color: white; 
                font-family: 'MS Sans Serif', sans-serif; 
                font-size: 14px;">
      <span>📷 Digital Camera - Windows XP</span>
      <button onclick="closeCameraPanel()" 
              style="background: #c0c0c0; 
                     color: black; 
                     border: 1px solid black; 
                     padding: 2px 5px; 
                     cursor: pointer; 
                     font-family: 'MS Sans Serif', sans-serif;">
        ❌
      </button>
    </div>
    <div id="video-container" 
         style="display: flex; 
                align-items: center; 
                justify-content: center; 
                height: 480px;">
    </div>
    <div id="capture-btn-container" 
         style="position: absolute; 
                bottom: 10px; 
                left: 50%; 
                transform: translateX(-50%); 
                width: 90%;">
      <button id="capture-btn" 
              style="width: 100%; 
                     padding: 8px; 
                     background: #c0c0c0; 
                     color: black; 
                     border: 2px solid black; 
                     cursor: pointer; 
                     font-family: 'MS Sans Serif', sans-serif;">
        📸 Take Photo
      </button>
    </div>
  `);

  document.body.appendChild(cameraFrame.elt);

  // Create the snapshot preview panel (Initially hidden)
  snapshotPanel = createDiv();
  snapshotPanel.id("snapshot-panel");
  snapshotPanel.style("display", "none");
  snapshotPanel.style("width", "400px");
  snapshotPanel.style("height", "500px");
  snapshotPanel.style("background", "#d4d0c8"); // Win95 gray
  snapshotPanel.style("border", "3px solid black");
  snapshotPanel.style("padding", "10px");
  snapshotPanel.style("position", "absolute");
  snapshotPanel.style("boxShadow", "3px 3px 0px #808080");

  snapshotPanel.html(`
    <div id="snapshot-title-bar" 
         style="display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 5px; 
                background: #000080; 
                color: white; 
                font-family: 'MS Sans Serif', sans-serif; 
                font-size: 14px;">
      <span>📸 Photo Preview</span>
      <button onclick="closeSnapshotPanel()" 
              style="background: #c0c0c0; 
                     color: black; 
                     border: 1px solid black; 
                     padding: 2px 5px; 
                     cursor: pointer; 
                     font-family: 'MS Sans Serif', sans-serif;">
        ❌
      </button>
    </div>
    <div id="snapshot-container" 
         style="display: flex; 
                align-items: center; 
                justify-content: center; 
                height: 380px; 
                background: #a0a0a0;">
    </div>
    <a id="download-btn" 
       style="display: block; 
              text-align: center; 
              margin-top: 10px; 
              padding: 5px 10px; 
              background: #c0c0c0; 
              color: black; 
              border: 2px solid black; 
              text-decoration: none; 
              font-family: 'MS Sans Serif', sans-serif;">
      💾 Save as JPG
    </a>
  `);

  document.body.appendChild(snapshotPanel.elt);

  // Reference the "Take Photo" button
  captureButton = select("#capture-btn");
  captureButton.mousePressed(takeSnapshot);

  // Make camera and snapshot panels draggable
  setupDraggablePanels();
}

function keyPressed() {
  if (keyCode === 32) {
    // Space key
    takeSnapshot();
  }
}

function openCameraPanel() {
  if (!video) {
    video = createCapture(VIDEO);
    video.size(512, 384);
    video.parent("video-container");
    video.style("transform", "scaleX(-1)"); // Mirror effect
  }
  cameraFrame.style("display", "block");
  cameraFrame.position((windowWidth - 700) / 2, (windowHeight - 550) / 2);
}

function takeSnapshot() {
  if (video) {
    // Create an HTML canvas element to store the snapshot
    let snapshotCanvas = document.createElement("canvas");
    let ctx = snapshotCanvas.getContext("2d");

    // Set canvas size to match video
    snapshotCanvas.width = video.width;
    snapshotCanvas.height = video.height;

    // Flip the image horizontally (mirror effect)
    ctx.translate(video.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video.elt, 0, 0, video.width, video.height);

    // Convert the canvas to an image data URL
    let snapshotData = snapshotCanvas.toDataURL("image/jpeg");

    // Show the snapshot panel
    snapshotPanel.style("display", "block");
    snapshotPanel.position((windowWidth - 400) / 2, (windowHeight - 500) / 2);

    // Clear previous image
    let snapshotContainer = select("#snapshot-container");
    snapshotContainer.html("");

    // Create new image element and add it to the panel
    let newSnapshotImg = createImg(snapshotData, "Snapshot");
    newSnapshotImg.style("width", "100%");
    snapshotContainer.child(newSnapshotImg);

    // Update the download button
    let downloadButton = select("#download-btn");
    downloadButton.attribute("href", snapshotData);
    downloadButton.attribute("download", "snapshot.jpg");
  }
}

function closeCameraPanel() {
  cameraFrame.style("display", "none");
}

function closeSnapshotPanel() {
  snapshotPanel.style("display", "none");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Helper to make panels draggable
function setupDraggablePanels() {
  makeDraggable(cameraFrame);
  makeDraggable(snapshotPanel);
}

function makeDraggable(panel) {
  let isDragging = false;
  let offsetX, offsetY;

  // The first child (title bar) is the draggable area
  const titleBar = panel.elt.querySelector("div:first-child");
  titleBar.style.cursor = "move";

  titleBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.position().x;
    offsetY = e.clientY - panel.position().y;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      panel.position(e.clientX - offsetX, e.clientY - offsetY);
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}
