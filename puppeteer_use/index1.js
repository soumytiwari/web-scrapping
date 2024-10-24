import puppeteer from "puppeteer";

const getBooks = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    })

    const page = await browser.newPage()

    // await page.goto("https://www.amazon.com/", {
    // you gotta keep the captcha solver just after trying to open, and enter
    await page.goto("https://books.toscrape.com/", {
        waitUntil: "domcontentloaded",
    })

    // Get data
    const books = await page.evaluate(() => {
        const book_pod = document.querySelector(".product_pod");
        
        const name = book_pod.querySelector("h3").innerText;
        const price = book_pod.querySelector(".price_color").innerText;
        const availability = book_pod.querySelector(".availability").innerText;
        const image_src = book_pod.querySelector(".thumbnail");
        const image = image_src.src;
        const rating_info = book_pod.querySelector(".star-rating")
        const rating_array = rating_info.className.split(' ');
        const rating = rating_array[1];
        

        return { name, price, availability, image, rating }
    })

    console.log(books)

    await browser.close()
}

getBooks();