import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto('https://quicksellassignmentuk.netlify.app');

  await page.waitForLoadState('networkidle');
  await page.waitForSelector(".board");

  const tickets = await page.evaluate(() => {
    const ticketList = document.querySelectorAll(".column");

    const priorityMap = {
      "Urgent": 4,
      "High": 3,
      "Medium": 2,
      "Low": 1,
      "No": 0,
    };

    const statusMap = {
      "Todo": "Todo",
      "In progress": "In progress",
      "Backlog": "Backlog",
    };

    const tickets = [];

    ticketList.forEach((card) => {
      const grpElement = card.querySelector(".column_header > .icon_group > .group_name");
      const grp = grpElement ? grpElement.innerHTML : 'Unknown';
      
      const ticketCards = card.querySelectorAll(".ticket-card");

      ticketCards.forEach((ticket) => {
        const idElement = ticket.querySelector(".ticket_user > .ticket_id");
        const titleElement = ticket.querySelector(".status > .ticket_title");
        const priorityElement = ticket.querySelector(".ticket-details > .priority > img");

        const id = idElement ? idElement.innerHTML : 'Unknown ID';
        const title = titleElement ? titleElement.innerHTML : 'Unknown Title';
        const priorityLabel = priorityElement ? priorityElement.alt : 'No';
        const priority = priorityMap[priorityLabel];

        tickets.push({
          id: id,
          title: title,
          tag: ["Feature Request"],
          userId: null,
          status: statusMap[grp] || 'Unknown Status',
          priority: priority,
        });
      });
    });

    return tickets;
  });

  // Select user option and wait for changes
  await page.click('.display_button img[alt="down"]');
  await page.waitForSelector('select');
  await page.selectOption('select', { value: 'user' });
  await page.waitForSelector(".column");
  await page.waitForLoadState('networkidle');

  const users = await page.$$eval('.column_header .group_name', groupNames => {
    return groupNames.map((groupName, index) => ({
      userId: `usr-${index + 1}`,
      userName: groupName.textContent.trim().toLowerCase() // Normalize user names
    }));
  });

  // Fetch group-to-ticket mappings
  const result = await page.evaluate(() => {
    const data = [];
    const columns = document.querySelectorAll(".column");
    
    columns.forEach((column) => {
      const group_name = column.querySelector(".column_header > .icon_group > .group_name")?.innerHTML || 'Unknown Group';
      const tk_ids = Array.from(column.querySelectorAll('.ticket-card .ticket_id')).map(tk => tk.innerHTML);

      data.push({
        name: group_name.trim().toLowerCase(),  // Normalize group names
        ids: tk_ids
      });
    });

    return data;
  });

  const userMapping = {};
  users.forEach(user => {
    userMapping[user.userName] = user.userId;
  })

  const mapTicketsToUsers = (tickets, data, userMap) => {
    data.forEach((user) => {
      const userId = userMap[user.name] || null;

      if (!userId) {
        console.log(`No userId found for group: ${user.name}`);
      }

      user.ids.forEach((ticketId) => {
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket) {
          ticket.userId = userId;
        }
      });
    });

    return tickets;
  };

  let updatedTickets = mapTicketsToUsers(tickets, result, userMapping);

  // Sort tickets based on the numerical part of the ID
  updatedTickets = updatedTickets.sort((a, b) => {
    const idA = parseInt(a.id.match(/\d+/)[0], 10)
    const idB = parseInt(b.id.match(/\d+/)[0], 10)

    return idA - idB
  })

  console.log(JSON.stringify({ tickets: updatedTickets }, null, 2));

  await browser.close();
})();
