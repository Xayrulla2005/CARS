(async function(){
  await API.requireAuth();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const metaEl = document.getElementById("meta");
  const galEl = document.getElementById("gallery");
  try{
    const res = await API.api(`/cars/${id}`);
    const car = res.data;
    document.getElementById("title").textContent = (car.brand||"")+" "+car.name;
    const crumbCat = document.getElementById("crumbCat");
    if (car.category) crumbCat.href = `/category.html?id=${car.category._id}&name=${encodeURIComponent(car.category.name)}`;

    metaEl.innerHTML = `
      <h3>${(car.brand||'').toUpperCase()} ${car.name.toUpperCase()}</h3>
      <div class="price">${API.fmtPrice(car.price)} so'm dan</div>
      <div><span class="badge">Marka:</span> ${car.brand||'-'}</div>
      <div><span class="badge">Yaratdi:</span> ${(car.createdBy && (car.createdBy.username||car.createdBy.email))||'-'}</div>
      <div><span class="badge">Yaratilgan:</span> ${(new Date(car.createdAt)).toLocaleDateString('uz-UZ')}</div>
    `;

    const imgs = (car.images||[]);
    galEl.innerHTML = imgs.length ? imgs.map(f=>`<img src="/uploads/${f}" alt="${car.name}">`).join("") : `<div class="notice">Rasm mavjud emas</div>`;
  }catch(e){
    metaEl.innerHTML = `<div class="notice">${e.message}</div>`;
  }
})();
