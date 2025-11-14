// ======= CONFIG =========
const sheetID = "14gqgDFM0p60Ldteyr32zirIr_1AZuf3CXemQz4mPJ10";
const sheetName = "Form_Responses";

// Google Sheets GViz endpoint
const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}`;

document.addEventListener("DOMContentLoaded", () => {
    const tb = document.getElementById("resultTable").querySelector("tbody");

    async function searchData() {
        const key = document.getElementById("searchInput").value.toLowerCase().trim();
        tb.innerHTML = `<tr><td colspan="5">Memuat data...</td></tr>`;

        try {
            const res = await fetch(base);
            const text = await res.text();

            // Fix JSON GViz
            const json = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1));

            const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

            const filtered = rows.filter(r =>
                r.some(col => String(col).toLowerCase().includes(key))
            );

            if (filtered.length === 0) {
                tb.innerHTML = `<tr><td colspan="5">Data tidak ditemukan</td></tr>`;
                return;
            }

            // Render rows
            tb.innerHTML = filtered
                .map(
                    r => `
                <tr>
                    <td>${r[0] || "-"}</td>
                    <td>${r[1] || "-"}</td>
                    <td>${r[2] || "-"}</td>
                    <td>${r[3] || "-"}</td>
                    <td><a href="${r[4] || "#"}" target="_blank" class="link-btn">Lihat File</a></td>
                </tr>
            `
                )
                .join("");
        } catch (err) {
            tb.innerHTML = `<tr><td colspan="5">Gagal memuat data</td></tr>`;
            console.error(err);
        }
    }

    document.getElementById("searchBtn").addEventListener("click", searchData);
});
