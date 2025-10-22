(function(){
  const tabs = document.querySelectorAll('.tab');
  const sections = ['login','register','verify','forget','reset','profile'];
  function showTab(name){
    sections.forEach(s=>{
      document.getElementById(s).style.display = (s===name)?'grid':'none';
    });
    tabs.forEach(t=>t.classList.toggle('active', t.dataset.tab===name));
  }
  tabs.forEach(t=>t.addEventListener('click',()=>showTab(t.dataset.tab)));

  // Login
  document.getElementById('loginBtn').onclick = async ()=>{
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPass').value;
    const msg = document.getElementById('loginMsg');
    msg.textContent = '';
    try{
      const res = await API.api('/auth/login',{method:'POST', data:{email,password}});
      localStorage.setItem('token', res.token);
      msg.textContent = 'Kirish muvaffaqiyatli';
      // Redirect to home after login
      window.location.href = '/';
    }catch(e){ msg.textContent = e.message; }
  };

  // Register
  document.getElementById('regBtn').onclick = async ()=>{
    const username = document.getElementById('regUser').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPass').value;
    const msg = document.getElementById('regMsg'); msg.textContent='';
    try{
      const res = await API.api('/auth/register',{method:'POST', data:{username,email,password}});
      msg.textContent = res.message || 'Yuborildi';
      showTab('verify');
      document.getElementById('verEmail').value = email;
    }catch(e){ msg.textContent = e.message; }
  };

  // Verify
  document.getElementById('verBtn').onclick = async ()=>{
    const email = document.getElementById('verEmail').value.trim();
    const code = document.getElementById('verCode').value.trim();
    const msg = document.getElementById('verMsg'); msg.textContent='';
    try{
      const res = await API.api('/auth/verify',{method:'POST', data:{email, code}});
      msg.textContent = res.message || 'Tasdiqlandi';
      // Switch to login for immediate sign-in
      showTab('login');
    }catch(e){ msg.textContent = e.message; }
  };

  // Forget
  document.getElementById('fogBtn').onclick = async ()=>{
    const email = document.getElementById('fogEmail').value.trim();
    const msg = document.getElementById('fogMsg'); msg.textContent='';
    try{
      const res = await API.api('/auth/forget-password',{method:'POST', data:{email}});
      msg.textContent = res.message || 'Yuborildi';
    }catch(e){ msg.textContent = e.message; }
  };

  // Reset
  document.getElementById('resBtn').onclick = async ()=>{
    const token = document.getElementById('resToken').value.trim();
    const newPassword = document.getElementById('resPass').value;
    const msg = document.getElementById('resMsg'); msg.textContent='';
    try{
      const res = await API.api(`/auth/reset-password/${encodeURIComponent(token)}`,{method:'POST', data:{newPassword}});
      msg.textContent = res.message || 'Parol tiklandi';
    }catch(e){ msg.textContent = e.message; }
  };

  // Profile
  async function loadProfile(){
    const me = document.getElementById('me');
    me.textContent = '';
    try{
      const res = await API.api('/auth/profile');
      const u = res.user;
      me.innerHTML = `<div><b>Username:</b> ${u.username}</div><div><b>Email:</b> ${u.email}</div><div><b>Role:</b> ${u.role}</div>`;
    }catch(e){ me.innerHTML = `<div class="notice">${e.message}</div>`; }
  }
  document.getElementById('logoutBtn').onclick = ()=>{ localStorage.removeItem('token'); alert('Chiqildi'); showTab('login'); };

  // Auto-tab based on token
  if (API.getToken()) { showTab('profile'); loadProfile(); } else { showTab('login'); }
})();
