/* ---------------- Assets URLs ----------------- */
const bgMusicURL = "https://cdn.pixabay.com/audio/2022/03/28/audio_18ba153558.mp3";
const typeSoundURL = "https://cdn.pixabay.com/audio/2022/03/15/audio_4f4d9021e5.mp3";
const clickSoundURL = "https://cdn.pixabay.com/audio/2021/06/21/audio_6c8a5a96b0.mp3";
const alarmURL = "https://cdn.pixabay.com/audio/2021/08/04/audio_0653514e58.mp3";
const whisperURL = "https://cdn.pixabay.com/audio/2022/11/21/audio_1f85f9.mp3";
const mistImgURL = "https://i.ibb.co/3mCrwvN/smoke-texture.png";

/* ---------------- DOM Elements ----------------- */
const startOverlay = document.getElementById("startOverlay");
const mainContent = document.querySelector(".mainContent");
const firstText = document.getElementById("firstText");
const secondText = document.getElementById("secondText");
const redBtn = document.getElementById("redBtn");
const greenBtn = document.getElementById("greenBtn");
const buttonArea = document.querySelector(".button-area");
const emergencyFlash = document.getElementById("emergencyFlash");
const mistCanvas = document.getElementById("mistCanvas");
const finalReveal = document.getElementById("finalReveal");
const glowNote = document.getElementById("glowNote");
const qrImage = document.getElementById("qrImage");
const passwordText = document.getElementById("passwordText");
const copyPass = document.getElementById("copyPass");

/* ---------------- Audio Elements ----------------- */
const bgMusic = document.getElementById("bgMusic");
const typeSound = document.getElementById("typeSound");
const clickSound = document.getElementById("clickSound");
const alarmSound = document.getElementById("alarmSound");
const whisperSound = document.getElementById("whisperSound");

/* ---------------- Assign sources ----------------- */
bgMusic.src = bgMusicURL;
typeSound.src = typeSoundURL;
clickSound.src = clickSoundURL;
alarmSound.src = alarmURL;
whisperSound.src = whisperURL;

/* ---------------- QR + Password ----------------- */
qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=" + encodeURIComponent("https://github.com/rssourav/Surprise");
glowNote.textContent = "Open the QR code on a laptop or desktop. If you're using a phone, enable desktop mode from the three-dot menu before scanning — and of course, open it alone.";
passwordText.textContent = "20.11.2001";

/* ---------------- Utility: Typewriter ----------------- */
function typeWriter(element, text, speed=70, callback=null){
    element.style.opacity = 1;
    element.textContent = "";
    let i=0;
    const interval = setInterval(()=>{
        element.textContent += text.charAt(i);
        typeSound.currentTime = 0; typeSound.play().catch(()=>{});
        i++;
        if(i>=text.length){clearInterval(interval); if(callback) setTimeout(callback,500);}
    }, speed);
}

/* ---------------- Page Start ----------------- */
startOverlay.addEventListener("click", ()=>{
    startOverlay.style.display="none";
    mainContent.style.display="block";
    bgMusic.volume=0.5; 
    bgMusic.play().catch(()=>{});
    firstSequence();
});

/* ---------------- First Sequence ----------------- */
function firstSequence(){
    typeWriter(firstText,"Do you want to know what lies behind the darkness?",65,()=>{
        // Second note at bottom
        typeWriter(secondText,"If yes, press the red button. If not, press the green button.",60,()=>{
            // Buttons appear slow
            buttonArea.style.opacity=1;
        });
    });
}

/* ---------------- Green Button Escape ----------------- */
let greenClicks=0;
greenBtn.addEventListener("mouseenter", moveGreen);
greenBtn.addEventListener("click", ()=>{
    clickSound.currentTime=0; clickSound.play().catch(()=>{});
    moveGreen();
});

function moveGreen(){
    greenClicks++;
    const x = Math.random()*(window.innerWidth-120);
    const y = window.innerHeight-150; // near bottom
    greenBtn.style.position="fixed";
    greenBtn.style.left=x+"px";
    greenBtn.style.top=y+"px";
    redBtn.classList.add("glowRed");
    setTimeout(()=>redBtn.classList.remove("glowRed"),300);
    if(greenClicks===6){
        typeWriter(secondText,"Maybe the green button doesn’t want to let you click it… try the other button.",60);
    }
}

/* ---------------- Red Button ----------------- */
redBtn.addEventListener("click",()=>{
    clickSound.currentTime=0; clickSound.play().catch(()=>{});
    emergencyFlash.style.opacity=1;
    alarmSound.currentTime=0; alarmSound.play().catch(()=>{});
    setTimeout(()=>{
        emergencyFlash.style.opacity=0;
        fadeOutMain();
    },6000);
});

/* ---------------- Fade Out Main Content ----------------- */
function fadeOutMain(){
    firstText.style.opacity=0;
    secondText.style.opacity=0;
    buttonArea.style.opacity=0;
    setTimeout(startMist,1000);
}

/* ---------------- Mist Animation ----------------- */
function startMist(){
    mistCanvas.style.display="block";
    const ctx = mistCanvas.getContext("2d");
    mistCanvas.width = window.innerWidth;
    mistCanvas.height = window.innerHeight;
    const img = new Image(); img.src = mistImgURL;
    img.onload=()=>{
        ctx.drawImage(img,0,0,mistCanvas.width,mistCanvas.height);
        mistCanvas.classList.add("riseMist");
        whisperSound.play().catch(()=>{});
        enableScratch(ctx,img);
    }
}

/* ---------------- Scratch Effect ----------------- */
function enableScratch(ctx,img){
    mistCanvas.addEventListener("mousemove", scratch);
    mistCanvas.addEventListener("touchmove", scratch);
    function scratch(e){
        const rect = mistCanvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        ctx.globalCompositeOperation="destination-out";
        ctx.beginPath();
        ctx.arc(x,y,45,0,Math.PI*2);
        ctx.fill();
        finalReveal.style.display="block";
    }
}

/* ---------------- Copy Password ----------------- */
copyPass.addEventListener("click", ()=>{
    navigator.clipboard.writeText(passwordText.textContent);
    copyPass.textContent="Copied!";
    setTimeout(()=>copyPass.textContent="Copy",1500);
});
