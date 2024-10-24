import puppeteer from "puppeteer";

const getNunnu = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--window-size=0,0"]
  });

  try {
    const page = await browser.newPage();

    await page.goto("https://quicksellassignmentuk.netlify.app/", {
      // waitUntil: "domcontentloaded",
      waitUntil: "networkidle0",
    });

    // const html = await page.content();
    // console.log(html);

    // Get data
    await page.waitForSelector(".board");

    const cards = await page.evaluate(() => {
      const cardList = document.querySelectorAll(".column");
      return Array.from(cardList).map((card) => {
        const group = card.querySelector(
          ".column_header > .icon_group > .group_name"
        ).innerText;
        const group_card_count = card.querySelector(
          ".column_header > .icon_group > div:nth-child(3)"
        ).innerText;

        const ticket_Card = card.querySelectorAll(".ticket-card");
        const tickets = Array.from(ticket_Card).map((ticket) => {
          const cams = {
            id: ticket.querySelector(".ticket_user > .ticket_id").innerHTML,
            title: ticket.querySelector(".status > .ticket_title").innerHTML,
            priority: ticket.querySelector(".ticket-details > .priority > img")
              .alt,
          };

          return cams;
        });
        return { group, group_card_count, tickets };
      });
    });
    // Add the books from this page to the overall list

    console.log("Cards:", JSON.stringify(cards, null, 2));
  } finally {
    await browser.close();
  }
};

getNunnu();
