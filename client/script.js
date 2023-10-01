
const form=document.querySelector('.mic_class');

const chatcontainer=document.querySelector('#chat_container');
let loadinterval;
function loader(element){ 
  element.innerHTML="."; 
  loadinterval=setInterval(()=>{
    element.innerHTML+="."
    console.log(element.innerHTML);
    if(element.innerHTML==="...."){
      element.innerHTML=".";
    }
  },300)
}
function typetext(element,text){
  let index=0;
  element.innerHTML="";
  let interval=setInterval(()=>{
  if(index<text.length)
  {
    element.innerHTML+=text.charAt(index);
    index++;
  } 
  else{
    clearInterval(interval);
    handleSubmit();
  }
 },70)
}
function generateUniqueId(){
  const timestamp=Date.now();
  const random=Math.random();
  const hexa=random.toString(16);
  return `id-${timestamp}-${hexa}`;
  
}
function chatStripe(isai,value,uniqueId){
  return (
    `
    <div class="wrapper ${isai && 'ai'}">
    <div class="chat">
      <div class="profile">
        
        </div>
        <div class="message" id=${uniqueId}>${value}
        </div>
      </div>
    </div>
    `
  )
}
const handleSubmit=async()=>{
 
  window.SpeechRecognition = window.webkitSpeechRecognition;

 const recognition = new SpeechRecognition();
 recognition.interimResults = true;
 var transcript="";
 recognition.addEventListener('result', e => {
      transcript = Array.from(e.results)
         .map(result => result[0])
         .map(result => result.transcript)
         .join('')

     console.log(transcript);
 });
 recognition.start();
 const keyword = "hello Alex";
 recognition.addEventListener('end', async e => {
  window.focus()
  if(transcript!="" && transcript.includes(keyword)){
    let textAfterKeyword
    let key="hello Alexa"
    if(transcript.includes(key)){
      const index = transcript.indexOf(key);
      
     textAfterKeyword = transcript.slice(index + key.length);
    chatcontainer.innerHTML+=chatStripe(false,textAfterKeyword);
 
    }else{
    const index = transcript.indexOf(keyword);

     textAfterKeyword = transcript.slice(index + keyword.length);
    chatcontainer.innerHTML+=chatStripe(false,textAfterKeyword);
    }
    const uniqueId=generateUniqueId();
    chatcontainer.innerHTML+=chatStripe(true,"",uniqueId);
    chatcontainer.scrollTop=chatcontainer.scrollHeight;
   const messageDiv=document.getElementById(uniqueId);
   loader(messageDiv);
    if(textAfterKeyword!="" && textAfterKeyword!="a"){
 
  const response=await fetch('https://speech-enabled-chat-gpt.onrender.com',{
    method:'POST', 
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      prompt:textAfterKeyword
    })
  })
  let text=""
  if(response.ok){
    clearInterval(loadinterval);
    const data= await response.json();
    const parsedata=data.bot.trim();
    console.log(parsedata)
    if (/^[^A-Za-z0-9]/.test(parsedata.charAt(0))) {
      text = parsedata.substring(1);
    }
    else if(parsedata.charAt(0)==="-"){
     text = parsedata.substring(2);
    }
    else{
      text=parsedata
    }
    text = text.trimStart();
    let utter=new SpeechSynthesisUtterance(text);
    utter.volume = 1.0;
    window.speechSynthesis.speak(utter);
     await new Promise((resolve) => setTimeout(resolve, 750));
     typetext(messageDiv,text)
     console.log(text)
  }
  else{
    clearInterval(loadinterval);

    const err= await response.text();
    alert(err);
  }
}
else{
  clearInterval(loadinterval);
  let utter=new SpeechSynthesisUtterance("Hello,How can I help you");
    utter.volume = 1.0;
     speechSynthesis.speak(utter)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  typetext(messageDiv,"Hello,How can I help you");
  
}
}
else{
  handleSubmit();
}

 })
 
  
 
  
}


document.body.addEventListener('keyup',(e)=>{
  if (e.key === 'x' || e.key === 'X') {
    speechSynthesis.cancel();
  }
})
document.getElementById("myButton").addEventListener("click", function() {
  
  handleSubmit();
});


