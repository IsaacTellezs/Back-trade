import puppeteer from "puppeteer";

export const getMarketData = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true, // Cambia a false si quieres ver el navegador
    });
    const page = await browser.newPage();

    // Configura el user-agent para evitar detección de bots
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Navega al sitio web
    await page.goto("https://www.fxpro.investments/es", {
      waitUntil: "domcontentloaded",
    });

    // Espera a que los elementos estén presentes, aumentando el tiempo de espera
    await page.waitForSelector(".market-instrument", { timeout: 60000 }); // Ajusta el selector aquí

    // Extrae los datos
    const marketData = await page.evaluate(() => {
      const sections = document.querySelectorAll(".market-instrument"); // Usa el selector correcto
      const data = [];
      sections.forEach((section) => {
        const name = section.querySelector(".market-instrument__text-name")?.innerText; // Asegúrate que este selector sea correcto
        const price = section.querySelector(".market-instrument-prices")?.innerText; // Asegúrate de que este selector sea correcto

        if ( name && price) {
          data.push({name, price });
        }
      });
      return data;
    });

    await browser.close();

    // Retorna los datos extraídos
    res.json({
      success: true,
      data: marketData,
    });
  } catch (error) {
    console.error("Error scraping market data:", error);
    res.status(500).json({
      success: false,
      message: "Error al extraer datos del mercado",
    });
  }
};
