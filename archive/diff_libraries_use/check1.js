import { chromium, firefox, webkit } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({
    headless: true,  // Ensures headless mode
  });

  const page = await browser.newPage();
  await page.goto('https://quicksellassignmentuk.netlify.app');
  
  await page.waitForLoadState('networkidle')
  await page.waitForSelector(".board");
  
  // const html = await page.content();
  // console.log(html);

  await page.click('.display_button img[alt="down"]')
  await page.waitForSelector('select')
  await page.selectOption('select', { value: 'user' })
  await page.waitForSelector(".column")
  await page.waitForLoadState('networkidle')
  await page.waitForSelector(".board")

  // const html = await page.content();
  // console.log(html);

  
  const result = await page.evaluate(() => {
    const data = []
    const columns = document.querySelectorAll(".column")
    
    columns.forEach((column) => {
      const group_name = column.querySelector(".column_header > .icon_group > .group_name")?.innerHTML || 'Unknown Group'
      
      const tk_ids = Array.from(column.querySelectorAll('.ticket-card .ticket_id')).map(tk => tk.innerHTML)

      data.push({
        name: group_name,
        ids: tk_ids
      })
    })
    return data
  })

  console.log(JSON.stringify({ data: result }, null, 2))

  await browser.close();
})();
