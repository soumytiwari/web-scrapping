// import puppeteer from "puppeteer";

// const getBooks = async (): Promise<void> => {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     await page.goto("https://books.toscrape.com", { waitUntil: "domcontentloaded" });

//     // Scraping logic
//     const books = await page.evaluate(() => {
//         const bookPods = document.querySelectorAll(".product_pod");
//         return Array.from(bookPods).map((bookPod) => {
//             const name = bookPod.querySelector("h3")?.innerText || "No title";
//             const price = bookPod.querySelector(".price_color")?.innerText || "No price";
//             const availability = bookPod.querySelector(".availability")?.innerText || "No availability";
//             const image = (bookPod.querySelector(".thumbnail") as HTMLImageElement)?.src || "No image";
//             const rating = bookPod.querySelector(".star-rating")?.className.split(" ")[1] || "No rating";

//             return { name, price, availability, image, rating };
//         });
//     });

//     console.log(books);
//     // Uncomment the line below if you want to close the browser
//     // await browser.close();
// };

// getBooks();
