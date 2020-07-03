const playwright = require("playwright");
jest.setTimeout(30000);

(async () => {
  for (const browserType of BROWSER) {
    let page, browser, context;
    describe("Playwright Mismatched Layers Test in " + browserType, () => {
      beforeEach(async () => {
        browser = await playwright[browserType].launch({
          headless: ISHEADLESS,
        });
        context = await browser.newContext();
        page = await context.newPage();
        if (browserType === "firefox") {
          await page.waitForNavigation();
        }
        await page.goto(PATH);
      });

      afterAll(async function () {
        //await page.screenshot({ path: `${this.currentTest.title.replace(/\s+/g, '_')}.png` })
        await browser.close();
      });

      test("[" + browserType + "] " + "CBMTILE Map with OSMTILE layer", async () => {
        const { document } = new JSDOM(`
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width,initial-scale=1">
              <title>index-map.html</title>
              <script type="module" src="dist/web-map.js"></script>
              <style>
              html {height: 100%} body,map {height: inherit} * {margin: 0;padding: 0;}
              </style>
            </head>
            <body>
              <map is="web-map" projection="CBMTILE" zoom="2" lat="45" lon="-90" controls>
                <layer- label='CBMT' src='https://geogratis.gc.ca/mapml/en/cbmtile/cbmt/' checked></layer->
                <layer- id="checkMe" label="OpenStreetMap" src="https://geogratis.gc.ca/mapml/en/osmtile/osm/" checked></layer->
              </map>
            </body>
            </html>
        `).window;
        const { update } = await domToPlaywright(page, document);

        await update(document);
        let el = await document.getElementById("checkMe");
        expect(el.getAttribute("disabled")).not.toBe(null);
      });

      test("[" + browserType + "] " + "OSMTILE Map with CBMTILE layer", async () => {
        const { document } = new JSDOM(`
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width,initial-scale=1">
              <title>index-map.html</title>
              <script type="module" src="dist/web-map.js"></script>
              <style>
              html {height: 100%} body,map {height: inherit} * {margin: 0;padding: 0;}
              </style>
            </head>
            <body>
              <map is="web-map" projection="OSMTILE" zoom="2" lat="45" lon="-90" controls>
                <layer- id="checkMe" label='CBMT' src='https://geogratis.gc.ca/mapml/en/cbmtile/cbmt/' checked></layer->
                <layer- label="OpenStreetMap" src="https://geogratis.gc.ca/mapml/en/osmtile/osm/" checked></layer->
              </map>
            </body>
            </html>
        `).window;
        const { update } = await domToPlaywright(page, document);

        await update(document);
        let el = await document.getElementById("checkMe");
        expect(el.getAttribute("disabled")).not.toBe(null);
      });
    });
  }
})();
