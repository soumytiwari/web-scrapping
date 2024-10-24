import puppeteer from "puppeteer";

const getNunnu = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto("https://quicksellassignmentuk.netlify.app/", {
    // waitUntil: "domcontentloaded",
    waitUntil: "networkidle0"
  });

  // const html = await page.content();
  // console.log(html);

  // Get data
  await page.waitForSelector(".board")
  
  const cards = await page.evaluate(() => {

      const ticket_Card = document.querySelectorAll(".board > .column > .ticket-card");
      const tickets = Array.from(ticket_Card).map((ticket) => {
        const cams = {
          id: ticket.querySelector(".ticket_user > .ticket_id").innerHTML,
          title: ticket.querySelector(".status > .ticket_title").innerHTML,
          priority: ticket.querySelector(
          ".ticket-details > .priority > img"
        ).alt
        };

        return cams;
      });
      return tickets
  });

  console.log("Cards:", cards);

  await browser.close();
};

getNunnu();
