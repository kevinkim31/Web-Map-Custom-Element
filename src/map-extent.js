export class MapExtent extends HTMLElement {
  static get observedAttributes() {
    return ['units','checked','label','opacity'];
  }
  get units() {
   return this.getAttribute('units');
  }
  set units(val) {
    // built in support for OSMTILE, CBMTILE, WGS84 and APSTILE
    if (['OSMTILE','CBMTILE','WGS84','APSTILE'].includes(val)) {
      this.setAttribute('units',val);
    }
    // else need to check with the mapml-viewer element if the custom projection is defined
  }
  get checked() {
    return this.hasAttribute('checked');
  }
  
  set checked(val) {
    if (val) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }
  get label() {
    return this.hasAttribute('label')?this.getAttribute('label'):'';
  }
  set label(val) {
    if (val) {
      this.setAttribute('label',val);
    }
  }
  get opacity(){
    return this._opacity;
  }

  set opacity(val) {
    if(+val > 1 || +val < 0) return;
    this.setAttribute('opacity', val);
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case 'units':
        if (oldValue !== newValue) {
          // handle side effects
        }
        break;
      case 'label': 
        if (oldValue !== newValue) {
          // handle side effects
        }
        break;
      case 'checked': 
        if (oldValue !== newValue) {
          // handle side effects
        }
        break;
      case 'opacity':
        if (oldValue !== newValue) {
          // handle side effects
        }
        break;
    }
  }
  constructor() {
    // Always call super first in constructor
    super();    
  }
  connectedCallback() {
    if(this.querySelector('map-link[rel=query], map-link[rel=features]') && !this.shadowRoot) {
      this.attachShadow({mode: 'open'});
    }
    let parentLayer = this.parentNode.nodeName.toUpperCase() === "LAYER-" ? this.parentNode : this.parentNode.host;
    if (!parentLayer._layer) {
      // for custom projection cases, the MapMLLayer has not yet created and binded with the layer- at this point,
      // because the "createMap" event of mapml-viewer has not yet been dispatched, the map has not yet been created 
      // the event will be dispatched after defineCustomProjection > projection setter
      // should wait until MapMLLayer is built
      parentLayer.parentNode.addEventListener('createmap', (e) => {
        this._layer = parentLayer._layer;
      });
    } else {
      this._layer = parentLayer._layer;
    }
  }
  disconnectedCallback() {
    
  }
}