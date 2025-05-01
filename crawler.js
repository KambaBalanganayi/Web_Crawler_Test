
// install axios cheerio
const axios = require('axios');
const cheerio = require('cheerio');


// specify the URL of the site to crawl
const targetUrl = 'https://www.canadacomputers.com';
// define the desired crawl limit
const maxCrawlLength = 20;
// add the traget URL to an array of URLs to visit
let urlsToVisit = [targetUrl];
let visitedUrls = new Set();


// define a crawler function
const crawler = async () => {
    // track the number of crawled URLs
    let crawledCount = 0;

    for(; urlsToVisit.length > 0 && crawledCount <= maxCrawlLength;) {
        //get the next URL to visit
        const currentUrl = urlsToVisit.shift();

        // Skip already visited URLs
        if (visitedUrls.has(currentUrl)) continue;
        // increment the crawl count
        crawledCount++
        visitedUrls.add(currentUrl);

        try {
            // request the target website
            const response = await axios.get(currentUrl);
            // parse the website HTML
            const $ = cheerio.load(response.data);
            // find all the links in the page
            const linkElements = $('a[href]');
            linkElements.each((index, element) => {
                let url = $(element).attr('href');

                // check if URL is full link or relative path
                if (!url.startsWith('http')) {
                    // remove leading slash if present
                    url = targetUrl + url.replace(/^\//, '');
                }
                // follow links within the target website
                if (url.startsWith(targetUrl) && !visitedUrls.has(url) && !urlsToVisit.includes(url)) {
                    // update the URLs to visit
                    urlsToVisit.push(url);
                }
            })
        } catch (error) {
            console.error(`Error fetching ${currentUrl}: ${error.message}`);
        }
    }
    console.log([...visitedUrls]);

};

// execute the crawler function
crawler();
