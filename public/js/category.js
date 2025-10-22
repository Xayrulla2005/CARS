(async function(){
  await API.requireAuth();
  const params = new URLSearchParams(location.search);
  const categoryId = params.get("id");
  const categoryName = params.get("name") || "Modellar turlari";
  document.getElementById("title").textContent = categoryName + " turlari";
  const listEl = document.getElementById("cars");
  const searchEl = document.getElementById("search");

  async function load(){
    try{
      const q = new URLSearchParams();
      if (categoryId) q.set("category", categoryId);
      if (searchEl.value) q.set("search", searchEl.value);
      const res = await API.api(`/cars?${q.toString()}`);
      const items = (res.data||[]);
      listEl.innerHTML = items.map(it=>`
        <a class="item" href="/car.html?id=${it._id}">
          <img src="${(it.images && it.images[0])?(`/uploads/${it.images[0]}`):''}" alt="${it.name}">
          <h4>${(it.brand||'').toUpperCase()} ${it.name.toUpperCase()}</h4>
          <div class="price">Narxi: ${API.fmtPrice(it.price)} so'm</div>
        </a>
      `).join("");
    }catch(e){
      listEl.innerHTML = `<div class="notice">${e.message}</div>`;
    }
  }

  searchEl.addEventListener("input", ()=>{ clearTimeout(window.__t); window.__t=setTimeout(load,300); });
  load();
})();
