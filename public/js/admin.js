(async function(){
  try{ await API.requireAdmin(); }catch(_){ return; }
  const catTbody = document.querySelector('#catTable tbody');
  const carTbody = document.querySelector('#carTable tbody');
  const catMsg = document.getElementById('catMsg');
  const carMsg = document.getElementById('carMsg');
  const catSelect = document.getElementById('carCategory');

  async function loadCategories(){
    try{
      const res = await API.api('/categories');
      const list = res.data || [];
      // table
      const canDel = API.isAdmin();
      catTbody.innerHTML = list.map(c=>`
        <tr>
          <td>${c.image?`<img src="/uploads/${c.image}" alt="${c.name}" style="max-width:80px">`:''}</td>
          <td>${c.name}</td>
          <td>${canDel?`<button data-id="${c._id}" class="delCat">O‘chirish</button>`:''}</td>
        </tr>
      `).join('');
      // select
      catSelect.innerHTML = '<option value="">Kategoriya tanlang</option>' + list.map(c=>`<option value="${c._id}">${c.name}</option>`).join('');
    }catch(e){ catMsg.textContent = e.message; }
  }

  async function loadCars(){
    try{
      const res = await API.api('/cars?limit=100');
      const list = res.data || [];
      const canDel2 = API.isAdmin();
      carTbody.innerHTML = list.map(x=>`
        <tr>
          <td>${(x.brand||'').toUpperCase()} ${x.name}</td>
          <td>${API.fmtPrice(x.price)} so'm</td>
          <td>${x.category && x.category.name ? x.category.name : '-'}</td>
          <td>
            <a class="secondary" href="/car.html?id=${x._id}">Ko‘rish</a>
            ${canDel2?`<button data-id="${x._id}" class="delCar">O‘chirish</button>`:''}
          </td>
        </tr>
      `).join('');
    }catch(e){ carMsg.textContent = e.message; }
  }

  // Kategoriya qo‘shish (multipart)
  document.getElementById('catForm').addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const name = document.getElementById('catName').value.trim();
    const image = document.getElementById('catImage').files[0];
    catMsg.textContent = '';
    try{
      const fd = new FormData();
      fd.append('name', name);
      if (image) fd.append('image', image);
      await API.api('/categories',{ method:'POST', data: fd, isForm: true });
      document.getElementById('catName').value='';
      document.getElementById('catImage').value='';
      await loadCategories();
      catMsg.textContent = 'Qo‘shildi';
    }catch(e){ catMsg.textContent = e.message; }
  });
  document.getElementById('catRefresh').onclick = loadCategories;

  // Live preview for category image
  document.getElementById('catImage').addEventListener('change', (e)=>{
    const f = e.target.files[0];
    const img = document.getElementById('catPreview');
    if (f){ img.src = URL.createObjectURL(f); img.style.display='block'; }
    else { img.src=''; img.style.display='none'; }
  });

  // Kategoriya o‘chirish (delegation)
  catTbody.addEventListener('click', async (e)=>{
    const btn = e.target.closest('.delCat'); if(!btn) return;
    const id = btn.dataset.id;
    if(!confirm('O‘chirishga ishonchingiz komilmi?')) return;
    try{ await API.api(`/categories/${id}`, { method:'DELETE' }); await loadCategories(); }
    catch(err){ alert(err.message); }
  });

  // Mashina qo‘shish
  document.getElementById('carForm').addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    carMsg.textContent='';
    const name = document.getElementById('carName').value.trim();
    const brand = document.getElementById('carBrand').value.trim();
    const price = document.getElementById('carPrice').value;
    const category = document.getElementById('carCategory').value;
    const images = document.getElementById('carImages').files;

    const fd = new FormData();
    fd.append('name', name);
    fd.append('brand', brand);
    fd.append('price', price);
    fd.append('category', category);
    for(const f of images) fd.append('images', f);

    try{
      await API.api('/cars', { method:'POST', data: fd, isForm: true });
      document.getElementById('carForm').reset();
      await loadCars();
      carMsg.textContent = 'Qo‘shildi';
    }catch(e){ carMsg.textContent = e.message; }
  });
  document.getElementById('carRefresh').onclick = loadCars;

  // Mashina o‘chirish (delegation)
  carTbody.addEventListener('click', async (e)=>{
    const btn = e.target.closest('.delCar'); if(!btn) return;
    const id = btn.dataset.id;
    if(!confirm('O‘chirishga ishonchingiz komilmi?')) return;
    try{ await API.api(`/cars/${id}`, { method:'DELETE' }); await loadCars(); }
    catch(err){ alert(err.message); }
  });

  // Token tekshirish
  if(!API.getToken()) alert('Admin panel uchun kirish talab qilinadi. Avval login qiling.');

  // start
  loadCategories();
  loadCars();
})();
