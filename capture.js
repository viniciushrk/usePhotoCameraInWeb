let videoCameras =  null;

async function getConnectedDevices(type) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(device => device.kind === type)
} 
let selectedDeviceId;
const codeReader = new ZXing.BrowserMultiFormatReader();
codeReader.listVideoInputDevices()
  .then(async (videoInputDevices) => {
    const sourceSelect = document.getElementById('sourceSelect')
    if (videoInputDevices.length >= 1) {
      videoInputDevices.forEach((element) => {
          const sourceOption = document.createElement('option')
          sourceOption.text = element.label
          sourceOption.value = element.deviceId
          sourceSelect.appendChild(sourceOption)
      })

      sourceSelect.onchange = () => {
          selectedDeviceId = sourceSelect.value;
      };

      const sourceSelectPanel = document.getElementById('sourceSelectPanel')
      sourceSelectPanel.style.display = 'block'
      // enviar(selectedDeviceId)
    }

    selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId
    console.log("videos",videoInputDevices)

    document.getElementById("texto").textContent = videoInputDevices.map(vl => vl.label)
    console.log("config",{video: {exact:{deviceId: selectedDeviceId} }, audio: false})

    // await camera({video: {exact:{deviceId: selectedDeviceId }}, audio: false});

    codeReader.decodeFromVideoDevice(selectedDeviceId, 'video',()=>{})
    camera({video: {exact:{deviceId: selectedDeviceId }}, audio: false})
  })
  .catch(err=>err);



async function camera(config) {
  
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 500;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  async function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    
    //saida da foto
    photo = document.getElementById('photo');
    
    startbutton = document.getElementById('startbutton');


  console.log("configCamera", config);
  
  //  navigator.mediaDevices.getUserMedia(config)
  //   .then(function(stream) {
  //     video.srcObject = stream;
  //     video.play();
  //   })
  //   .catch(function(err) {
  //     console.log("An error occurred: " + err);
  //   });

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);
    
    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    
    photo.setAttribute('src', data);
  }
  
  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.
  
  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/png');
      valor = canvas.toDataURL('image/png');
      
      console.log('tirou',data);
      
      photo.setAttribute('src', data);
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  startup();
  // window.addEventListener('load', startup, false);
}

function enviaImage(base64){
  
};