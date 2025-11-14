// Background Animation
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    dx: (Math.random() - 0.5) * 0.6,
    dy: (Math.random() - 0.5) * 0.6,
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "#3fa9ff";
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(animate);
}
animate();

//------------------------------------------------------
// Search Function (You must replace SHEET_URL with Web-Published Sheet)
//------------------------------------------------------
async function loadCSV() {
  const url = "https://docs.google.com/spreadsheets/d/14gqgDFM0p60Ldteyr32zirIr_1AZuf3CXemQz4mPJ10/export?format=csv&id=14gqgDFM0p60Ldteyr32zirIr_1AZuf3CXemQz4mPJ10&gid=1401067179";

  const response = await fetch(url);
  const text = await response.text();

  // Convert CSV → array
  const rows = text.trim().split("\n").map(r => r.split(","));

  console.log(rows); // <<< cek apakah tampil
}


async function searchData() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const resultBox = document.getElementById("result");

  if (!keyword) {
    resultBox.innerHTML = "";
    return;
  }

  const data = await fetchCSV();

  const filtered = data.filter(
    (row) => row.Nama?.toLowerCase().includes(keyword) || row.NIM?.toLowerCase().includes(keyword)
  );

  if (filtered.length === 0) {
    resultBox.innerHTML = `<p style="text-align:center;margin-top:20px;">Tidak ada data ditemukan.</p>`;
    return;
  }

  let tableHTML = `<table>
    <tr>
      <th>Nama</th>
      <th>NIM</th>
      <th>Prodi</th>
      <th>Tanggal Lahir</th>
    </tr>`;

  filtered.forEach((row) => {
    tableHTML += `
      <tr>
        <td>${row.Nama}</td>
        <td>${row.NIM}</td>
        <td>${row.Prodi}</td>
        <td>${formatDate(row.Tanggal)}</td>
      </tr>`;
  });

  tableHTML += `</table>`;
  resultBox.innerHTML = tableHTML;
}

//------------------------------------------------------
// Format Tanggal
//------------------------------------------------------
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

//------------------------------------------------------
// Event
//------------------------------------------------------
document.getElementById("searchBtn").addEventListener("click", searchData);}


