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
    const books = []
    let hasNextPage = true;

    while(hasNextPage) {
        // Get data from the current page
        const bookOnPage = await page.evaluate(() => {
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
        // Add the books from this page to the overall list
        books.push(...bookOnPage)

        // Check if the "Next" button exists and click on it if it does
        const nextButton = await page.$(".pager > .next > a")
        if (nextButton) {
            await Promise.all([
                page.click(".pager > .next > a"),
                page.waitForNavigation({
                    waitUntil: "domcontentloaded"
                }),
            ])
        } else {
            hasNextPage = false;
        }
    }

    console.log(books)

    // await browser.close()
}

getBooks();