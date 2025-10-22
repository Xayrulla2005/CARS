(async function(){
  await API.requireAuth();
  const wrap = document.getElementById("categories");
  try{
    const res = await API.api("/categories");
    const list = res.data || [];
    // fetch sample image for each category (limit=1)
    const withImages = await Promise.all(list.map(async (c)=>{
      try{
        // use category.image first
        let img = c.image ? `/uploads/${c.image}` : null;
        if (!img){
          const q = new URLSearchParams({ category: c._id, limit: '1' });
          const cars = await API.api(`/cars?${q.toString()}`);
          const first = (cars.data||[])[0];
          img = first && first.images && first.images[0] ? `/uploads/${first.images[0]}` : null;
        }
        return { ...c, _preview: img };
      }catch{ return { ...c, _preview: null }; }
    }));

    wrap.innerHTML = withImages.map(c=>`
      <a class="card" href="/category.html?id=${c._id}&name=${encodeURIComponent(c.name)}">
        ${c._preview ? `<img src="${c._preview}" alt="${c.name}">` : ''}
        <h3>${c.name}</h3>
      </a>
    `).join("");
  }catch(err){
    wrap.innerHTML = `<div class="notice">${err.message}</div>`;
  }
})();
