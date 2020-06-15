/* global assert, M */
describe("MapMLStaticTileLayer Tests", function () {
  var map, container;
  beforeEach(() => {
    map = L.map(document.createElement("map"));
    container = document.createElement("div");
  });

  test("Setting Tile Layer options", function () {
    let tileContainer = document.createElement("div");
    tileContainer.innerHTML = '<tiles zoom="min=0,max=24"><tile zoom="3" row="18" col="17" src="data/cbmt/2/c11_r12.png"></tile><tile zoom="2" row="10" col="11" src="data/cbmt/2/c11_r10.png"></tile><tile zoom="2" row="10" col="9" src="data/cbmt/2/c9_r10.png"></tile><tile zoom="2" row="11" col="9" src="data/cbmt/2/c9_r11.png"></tile><tile zoom="0" row="3" col="2" src="data/cbmt/2/c10_r11.png"></tile><tile zoom="0" row="3" col="3" src="data/cbmt/2/c11_r11.png"></tile></tiles>'
    const layer = M.mapMLStaticTileLayer({
      pane: container,
      className: "tempGridML",
      tileContainer: tileContainer,
      maxZoomBound: 24,
    })
    map.addLayer(layer);
    expect(layer.options.pane).toEqual(container) && expect(layer.options.className).toEqual("tempGridML") &&
      expect(layer.options.maxNativeZoom).toEqual(3) && expect(layer.options.minNativeZoom).toEqual(0) &&
      expect(layer.options.maxZoom).toEqual(24) && expect(layer.options.minZoom).toEqual(0);
  });

  test("Creating tile group map", function () {
    let tileContainer = document.createElement("div");
    tileContainer.innerHTML = '<tiles zoom="min=0,max=24"><tile zoom="3" row="18" col="17" src="data/cbmt/2/c11_r12.png"></tile><tile zoom="2" row="10" col="11" src="data/cbmt/2/c11_r10.png"></tile><tile zoom="2" row="10" col="9" src="data/cbmt/2/c9_r10.png"></tile><tile zoom="2" row="11" col="9" src="data/cbmt/2/c9_r11.png"></tile><tile zoom="0" row="3" col="2" src="data/cbmt/2/c10_r11.png"></tile><tile zoom="0" row="3" col="3" src="data/cbmt/2/c11_r11.png"></tile></tiles>'
    const layer = M.mapMLStaticTileLayer({
      pane: container,
      className: "tempGridML",
      tileContainer: tileContainer,
      maxZoomBound: 26,
    })

    const result = layer._groupTiles(tileContainer.getElementsByTagName('tile'));
    expect(Object.keys(result).length).toEqual(6) && expect(result["17:18:3"]).toBeTruthy() &&
      expect(result["11:10:2"]).toBeTruthy() && expect(result["9:10:2"]).toBeTruthy() &&
      expect(result["9:11:2"]).toBeTruthy() && expect(result["2:3:0"]).toBeTruthy() &&
      expect(result["3:3:0"]).toBeTruthy();
  });

  test("Creating tile group map with multiple img in one tile in document order", function () {
    let tileContainer = document.createElement("div");
    tileContainer.innerHTML = '<tiles zoom="min=0,max=24"><tile zoom="3" row="18" col="17" src="data/cbmt/2/c11_r12.png"></tile><tile zoom="3" row="18" col="17" src="data/cbmt/2/c11_r10.png"></tile><tile zoom="2" row="10" col="9" src="data/cbmt/2/c9_r10.png"></tile><tile zoom="2" row="11" col="9" src="data/cbmt/2/c9_r11.png"></tile><tile zoom="0" row="3" col="2" src="data/cbmt/2/c10_r11.png"></tile><tile zoom="0" row="3" col="3" src="data/cbmt/2/c11_r11.png"></tile></tiles>'
    const layer = M.mapMLStaticTileLayer({
      pane: container,
      className: "tempGridML",
      tileContainer: tileContainer,
      maxZoomBound: 26,
    })
    const result = layer._groupTiles(tileContainer.getElementsByTagName('tile'));
    expect(Object.keys(result).length).toEqual(5) && expect(result["17:18:3"].length).toEqual(2) && expect(result["17:18:3"][0].src).toEqual("data/cbmt/2/c11_r12.png") &&
      expect(result["17:18:3"].length).toEqual(2) && expect(result["17:18:3"][1].src).toEqual("data/cbmt/2/c11_r10.png");
  });

  describe("Deriving zoom bounds with MapMLStaticTileLayer._getZoomBounds()", function () {
    test("max=null,min=null,nativeMax=3,nativeMin=2", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '\
        <tiles>\
          <tile zoom="3" row="18" col="17" src="data/cbmt/2/c11_r12.png"></tile>\
          <tile zoom="2" row="10" col="11" src="data/cbmt/2/c11_r10.png"></tile>\
          <tile zoom="2" row="11" col="9" src="data/cbmt/2/c9_r11.png"></tile>\
          <tile zoom="2" row="11" col="9" src="data/cbmt/2/c10_r11.png"></tile>\
          <tile zoom="2" row="11" col="9" src="data/cbmt/2/c11_r11.png"></tile>\
        </tiles>';
      const layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 26,
      })
      let zoomBounds = layer._getZoomBounds(tileContainer, 26);
      expect(zoomBounds.nMax).toEqual(3) && expect(zoomBounds.nMin).toEqual(2) &&
        expect(zoomBounds.max).toEqual(26) && expect(zoomBounds.min).toEqual(0);
    });
    test("max=18,min=null,nativeMax=3,nativeMin=2", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '\
        <tiles zoom="max=18">\
          <tile zoom="3" row="18" col="17" src="data/cbmt/2/c11_r12.png"></tile>\
          <tile zoom="2" row="10" col="11" src="data/cbmt/2/c11_r10.png"></tile>\
          <tile zoom="2" row="11" col="9" src="data/cbmt/2/c9_r11.png"></tile>\
          <tile zoom="2" row="11" col="9" src="data/cbmt/2/c10_r11.png"></tile>\
          <tile zoom="2" row="11" col="9" src="data/cbmt/2/c11_r11.png"></tile>\
        </tiles>'
      const layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 26,
      })
      let zoomBounds = layer._getZoomBounds(tileContainer, 26)
      expect(zoomBounds.nMax).toEqual(3) && expect(zoomBounds.nMin).toEqual(2) &&
        expect(zoomBounds.max).toEqual(18) && expect(zoomBounds.min).toEqual(0);
    });
    test("max=null,min=3,nativeMax=20,nativeMin=4", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '\
        <tiles zoom="min=3">\
          <tile zoom="4" row="18" col="17" src="data/cbmt/2/c11_r12.png"></tile>\
          <tile zoom="5" row="10" col="11" src="data/cbmt/2/c11_r10.png"></tile>\
          <tile zoom="20" row="11" col="9" src="data/cbmt/2/c9_r11.png"></tile>\
          <tile zoom="18" row="11" col="9" src="data/cbmt/2/c10_r11.png"></tile>\
          <tile zoom="18" row="11" col="9" src="data/cbmt/2/c11_r11.png"></tile>\
        </tiles>'
      const layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 26,
      })
      let zoomBounds = layer._getZoomBounds(tileContainer, 26)
      expect(zoomBounds.nMax).toEqual(20) && expect(zoomBounds.nMin).toEqual(4) &&
        expect(zoomBounds.max).toEqual(26) && expect(zoomBounds.min).toBe(3);
    });
    test("max=0,min=0,nativeMax=0,nativeMin=0", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '\
        <tiles zoom="min=0,max=0">\
          <tile zoom="0" row="18" col="17" src="data/cbmt/2/c11_r12.png"></tile>\
          <tile zoom="0" row="10" col="11" src="data/cbmt/2/c11_r10.png"></tile>\
          <tile zoom="0" row="11" col="9" src="data/cbmt/2/c9_r11.png"></tile>\
          <tile zoom="0" row="11" col="9" src="data/cbmt/2/c10_r11.png"></tile>\
          <tile zoom="0" row="11" col="9" src="data/cbmt/2/c11_r11.png"></tile>\
        </tiles>'
      const layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 26,
      })
      let zoomBounds = layer._getZoomBounds(tileContainer, 26)
      expect(zoomBounds.nMax).toEqual(0) && expect(zoomBounds.nMin).toEqual(0) &&
        expect(zoomBounds.max).toEqual(0) && expect(zoomBounds.min).toEqual(0);
    });
    test("max=5,min=18,nativeMax=3,nativeMin=2", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '\
        <tiles zoom="min=5,max=18">\
          <tile zoom="3" row="18" col="17" src="data/cbmt/2/c11_r12.png"></tile>\
          <tile zoom="2" row="10" col="11" src="data/cbmt/2/c11_r10.png"></tile>\
          <tile zoom="2" row="11" col="9" src="data/cbmt/2/c9_r11.png"></tile>\
          <tile zoom="2" row="11" col="9" src="data/cbmt/2/c10_r11.png"></tile>\
          <tile zoom="2" row="11" col="9" src="data/cbmt/2/c11_r11.png"></tile>\
        </tiles>'
      const layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 26,
      })
      let zoomBounds = layer._getZoomBounds(tileContainer, 26)
      expect(zoomBounds.nMax).toEqual(3) && expect(zoomBounds.nMin).toEqual(2) &&
        expect(zoomBounds.max).toEqual(18) && expect(zoomBounds.min).toEqual(5);
    });
    test("max=string,min=string,nativeMax=19,nativeMin=2", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '\
        <tiles zoom="min=test,max=test">\
          <tile zoom="19" row="18" col="17" src="data/cbmt/2/c11_r12.png"></tile>\
          <tile zoom="19" row="10" col="11" src="data/cbmt/2/c11_r10.png"></tile>\
          <tile zoom="15" row="11" col="9" src="data/cbmt/2/c9_r11.png"></tile>\
          <tile zoom="12" row="11" col="9" src="data/cbmt/2/c10_r11.png"></tile>\
          <tile zoom="5" row="11" col="9" src="data/cbmt/2/c11_r11.png"></tile>\
        </tiles>'
      const layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 25,
      })
      let zoomBounds = layer._getZoomBounds(tileContainer, 25);
      expect(zoomBounds.nMax).toEqual(19) && expect(zoomBounds.nMin).toEqual(5) &&
        expect(zoomBounds.max).toBeFalsy() && expect(zoomBounds.min).toBeFalsy();
    });
  });
  describe("Creating tiles with MapMLStaticTileLayer.createTile()", function () {
    test("One image element in tile", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '<tiles zoom="min=0,max=24"><tile zoom="3" row="18" col="17" src="data/cbmt/2/c11_r12.png"></tile><tile zoom="2" row="10" col="11" src="data/cbmt/2/c11_r10.png"></tile><tile zoom="2" row="10" col="9" src="data/cbmt/2/c9_r10.png"></tile><tile zoom="2" row="11" col="9" src="data/cbmt/2/c9_r11.png"></tile><tile zoom="0" row="3" col="2" src="data/cbmt/2/c10_r11.png"></tile><tile zoom="0" row="3" col="3" src="data/cbmt/2/c11_r11.png"></tile></tiles>'
      let layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 24,
      })
      let point = {
        x: 17,
        y: 18,
        z: 3,
      }
      const result = layer.createTile(point);
      expect(result.getElementsByTagName("img").length).toEqual(1);
    });

    test("Multiple image element in tile", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '<tiles zoom="min=0,max=24"><tile zoom="3" row="18" col="17" src="data/cbmt/2/c11_r12.png"></tile><tile zoom="3" row="18" col="17" src="data/cbmt/2/c11_r10.png"></tile><tile zoom="2" row="10" col="9" src="data/cbmt/2/c9_r10.png"></tile><tile zoom="2" row="11" col="9" src="data/cbmt/2/c9_r11.png"></tile><tile zoom="0" row="3" col="2" src="data/cbmt/2/c10_r11.png"></tile><tile zoom="0" row="3" col="3" src="data/cbmt/2/c11_r11.png"></tile></tiles>'
      let layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 24,
      })
      let point = {
        x: 17,
        y: 18,
        z: 3,
      }
      const result = layer.createTile(point);
      expect(result.getElementsByTagName("img").length).toEqual(2);
    });

    test("Multiple image element in tile in order", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '<tiles zoom="min=0,max=24"><tile zoom="3" row="18" col="17" src="data/cbmt/2/c11_r12.png"></tile><tile zoom="3" row="18" col="17" src="data/cbmt/2/c11_r10.png"></tile><tile zoom="2" row="10" col="9" src="data/cbmt/2/c9_r10.png"></tile><tile zoom="2" row="11" col="9" src="data/cbmt/2/c9_r11.png"></tile><tile zoom="0" row="3" col="2" src="data/cbmt/2/c10_r11.png"></tile><tile zoom="0" row="3" col="3" src="data/cbmt/2/c11_r11.png"></tile></tiles>'
      let layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 24,
      })
      let point = {
        x: 17,
        y: 18,
        z: 3,
      }
      const result = layer.createTile(point);
      expect(result.getElementsByTagName("img")[0].src).toEqual("http://localhost/data/cbmt/2/c11_r12.png") &&
        expect(result.getElementsByTagName("img")[1].src).toEqual("http://localhost/data/cbmt/2/c11_r10.png");
    });
  });

  //Testing _getLayerBounds method
  //returns the appropriate bounds of each zoom level of tiles
  describe("Deriving layer bounds with MapMLStaticTileLayer._getLayerBounds()", function () {
    test("Reasonable tiles", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '<tiles zoom="min=0,max=24"><tile zoom="3" row="18" col="17" src="data/cbmt/2/c11_r12.png"></tile><tile zoom="3" row="18" col="17" src="data/cbmt/2/c11_r10.png"></tile><tile zoom="2" row="10" col="9" src="data/cbmt/2/c9_r10.png"></tile><tile zoom="2" row="11" col="9" src="data/cbmt/2/c9_r11.png"></tile><tile zoom="0" row="3" col="2" src="data/cbmt/2/c10_r11.png"></tile><tile zoom="0" row="3" col="3" src="data/cbmt/2/c11_r11.png"></tile></tiles>'
      let layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 24,
      })
      let result = layer._bounds;
      expect(result["0"]).toEqual(L.bounds(L.point(2, 3), L.point(4, 4))) &&
        expect(result["2"]).toEqual(L.bounds(L.point(9, 10), L.point(10, 12))) &&
        expect(result["3"]).toEqual(L.bounds(L.point(17, 18), L.point(18, 19))) &&
        expect(result["1"]).toBeFalsy();
    });
    test("Different set of reasonable tiles", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '<tiles zoom="min=0,max=24"><tile zoom="3" row="20" col="12" src="data/cbmt/2/c11_r12.png"></tile><tile zoom="3" row="19" col="13" src="data/cbmt/2/c11_r10.png"></tile><tile zoom="2" row="8" col="11" src="data/cbmt/2/c9_r10.png"></tile><tile zoom="2" row="8" col="13" src="data/cbmt/2/c9_r11.png"></tile><tile zoom="0" row="1" col="1" src="data/cbmt/2/c10_r11.png"></tile><tile zoom="0" row="0" col="0" src="data/cbmt/2/c11_r11.png"></tile></tiles>'
      let layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 24,
      })
      let result = layer._bounds;
      expect(result["0"]).toEqual(L.bounds(L.point(0, 0), L.point(2, 2))) &&
        expect(result["2"]).toEqual(L.bounds(L.point(11, 8), L.point(14, 9))) &&
        expect(result["3"]).toEqual(L.bounds(L.point(12, 19), L.point(14, 21))) &&
        expect(result["1"]).toBeFalsy();
    });
    test("Single tile", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '<tiles zoom="min=0,max=24"><tile zoom="0" row="0" col="0" src="data/cbmt/2/c11_r11.png"></tile></tiles>'
      let layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 24,
      })
      let result = layer._bounds;
      expect(result["0"]).toEqual(L.bounds(L.point(0, 0), L.point(1, 1))) &&
        expect(result["1"]).toBeFalsy();
    });
    test("Empty tiles container", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '<tiles zoom="min=0,max=24"></tiles>'
      let layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 24,
      })
      let result = layer._bounds;
      expect(result).toEqual({});
    });
  });

  //Checking the _withinBound method of mapMLStaticTileLayer
  //return true when overlapping, if overlapped at exactly the border, return false
  describe("Checking layer overlap with map using MapMLStaticTileLayer._withinBounds()", function () {
    test("Within map bounds completely", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '<tiles zoom="min=0,max=24"></tiles>'
      let layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 24,
      })
      let mapBound = L.bounds(L.point(0, 0,), L.point((11 * 256), (11 * 256))), layerBound = L.bounds(L.point(1, 1), L.point(10, 10));
      expect(layer._withinBounds(mapBound, layerBound)).toEqual(true);
    });
    test("Layer bound above map bounds completely", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '<tiles zoom="min=0,max=24"></tiles>'
      let layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 24,
      })
      let mapBound = L.bounds(L.point(0, 0,), L.point((11 * 256), (11 * 256))), layerBound = L.bounds(L.point(1, -5), L.point(10, -1));
      expect(layer._withinBounds(mapBound, layerBound)).toEqual(false);
    });
    test("Layer bound below map bounds completely", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '<tiles zoom="min=0,max=24"></tiles>'
      let layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 24,
      })
      let mapBound = L.bounds(L.point(0, 0,), L.point((11 * 256), (11 * 256))), layerBound = L.bounds(L.point(1, 12), L.point(10, 15));
      expect(layer._withinBounds(mapBound, layerBound)).toEqual(false);
    });
    test("Layer bound to the left of map bounds completely", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '<tiles zoom="min=0,max=24"></tiles>'
      let layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 24,
      })
      let mapBound = L.bounds(L.point(0, 0,), L.point((11 * 256), (11 * 256))), layerBound = L.bounds(L.point(-10, 1), L.point(-1, 10));
      expect(layer._withinBounds(mapBound, layerBound)).toEqual(false);
    });
    test("Layer bound to the right of map bounds completely", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '<tiles zoom="min=0,max=24"></tiles>'
      let layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 24,
      })
      let mapBound = L.bounds(L.point(0, 0,), L.point((11 * 256), (11 * 256))), layerBound = L.bounds(L.point(12, 1), L.point(14, 10));
      expect(layer._withinBounds(mapBound, layerBound)).toEqual(false);
    });
    test("Layer bounds overlaps at border of bounds", function () {
      let tileContainer = document.createElement("div");
      tileContainer.innerHTML = '<tiles zoom="min=0,max=24"></tiles>'
      let layer = M.mapMLStaticTileLayer({
        pane: container,
        className: "tempGridML",
        tileContainer: tileContainer,
        maxZoomBound: 24,
      })
      let mapBound = L.bounds(L.point(0, 0,), L.point((11 * 256), (11 * 256))), layerBound = L.bounds(L.point(11, 1), L.point(14, 10));
      expect(layer._withinBounds(mapBound, layerBound)).toEqual(false);
    });
  });
});
