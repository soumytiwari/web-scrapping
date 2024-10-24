import puppeteer from "puppeteer";

const getBooks = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    })

    const page = await browser.newPage()

    await page.goto("https://books.toscrape.com/", {
        waitUntil: "domcontentloaded",
    })

    // Get data
    const books = await page.evaluate(() => {
        const book_podList = document.querySelectorAll(".product_pod");

        return Array.from(book_podList).map((book_pod) => {
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

    })

    console.log(books)
    // Click on the "Next page" button
    await page.click(".pager > .next > a");

    // const next_page = await page.evaluate(() => {
    //     const next = document.querySelector(".pager > .next > a");
    //     const next_page_link = next.href;
    //     return next_page_link
    // })
    // // const next_page = document.querySelector(".pager > .next > a");
    // // const next_page_link = next_page.href;
    // await page.goto(`https://books.toscrape.com/${next_page}`, {
    //     waitUntil: "domcontentloaded",
    // })
    // console.log(books)

    // await browser.close()
}

getBooks();