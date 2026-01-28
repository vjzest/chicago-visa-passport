import ejs from "ejs";
import puppeteer from "puppeteer";
import path from "path";

export async function generatePDFFromHTML(html: string): Promise<Buffer> {
  const launchOptions = {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  //wait for one second to ensure the file is written
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    // Set content once
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });
    await page.evaluateHandle("document.fonts.ready");

    const pdfResponse = await page.pdf({
      format: "A4",
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm",
      },
      printBackground: true,
    });

    return Buffer.from(pdfResponse);
  } finally {
    await browser.close();
  }
}

export async function generateFedexDelayReportPDF(data: any): Promise<Buffer> {
  try {
    // Path to the EJS template
    const templatePath = path.join(
      __dirname,
      "../templates/fedex-delay-report.ejs"
    );

    // Render HTML from EJS template
    const html = (await ejs.renderFile(templatePath, data)) as string;
    const generatedPdf = await generatePDFFromHTML(html);
    return generatedPdf;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
