function checkPassword(){const password=document.getElementById('passwordInput').value;if(password==='daniyal'){document.querySelector('.loading-screen').style.display='flex';document.querySelector('.password-container').style.display='none';const iframe=document.createElement('iframe');iframe.className='custom-iframe';iframe.src='https://ttt-n0vs.onrender.com/';iframe.title='Protected Content';iframe.scrolling='no';iframe.frameBorder='0';iframe.allowFullscreen=!0;iframe.addEventListener('load',function(){document.querySelector('.loading-screen').style.display='none';document.querySelector('.protected-content').style.display='block'});document.querySelector('.iframe-wrapper').appendChild(iframe)}else{alert('Wrong password! Check Discord server for correct password.');document.getElementById('passwordInput').value=''}}
document.getElementById('passwordInput').addEventListener('keypress',function(e){if(e.key==='Enter')checkPassword();});
