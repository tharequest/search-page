// --- ANIMASI PARTIKEL PIXEL ---
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// --- LOGIKA PENCARIAN GOOGLE SHEET ---
const sheetID = "14gqgDFM0p60Ldteyr32zirIr_1AZuf3CXemQz4mPJ10";
const sheetName = "Form_Responses";
const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}`;

document.getElementById("searchBtn").addEventListener("click", searchData);

async function searchData() {
  const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
  const res = await fetch(base);
  const text = await res.text();
  const json = JSON.parse(text.substr(47).slice(0, -2));

  let data = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));
  const headers = json.table.cols.map(c => c.label);

  const filtered = data.filter(row => 
    row.some(cell => cell.toString().toLowerCase().includes(keyword))
  );

  if (filtered.length === 0) {
    document.getElementById("result").innerHTML = "<p>Tidak ada hasil ditemukan.</p>";
    return;
  }
  // Ubah nilai Date(...) jadi format tanggal biasa
function formatCell(value) {
  if (typeof value === "string" && value.startsWith("Date(")) {
    const parts = value.match(/\d+/g);
    if (parts && parts.length >= 3) {
      const year = parts[0];
      const month = parseInt(parts[1]) + 1;
      const day = parts[2];
      return `${day}/${month}/${year}`;
    }
  }
  return value === "null" ? "" : value;
}


  tableHTML += "<tr>" + row.map(c => `<td>${formatCell(c)}</td>`).join("") + "</tr>";

  filtered.forEach(row => {
    tableHTML += "<tr>" + row.map(c => `<td>${c}</td>`).join('') + "</tr>";
  });
  tableHTML += "</table>";

  document.getElementById("result").innerHTML = tableHTML;
}
