import { onMount } from "solid-js";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import maplibregl from "maplibre-gl";
import { LayerSpecification } from "maplibre-gl";
import { layersWithCustomTheme } from "protomaps-themes-base";

const THEMES = ["contrast"];

function App() {
  onMount(async () => {
    maplibregl.setRTLTextPlugin(
      "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js",
      true,
    );

    let layers: LayerSpecification[] = [];

    for (let themeName of THEMES) {
      let theme = await import(`../../themes/${themeName}.ts`);
      layers = layersWithCustomTheme("protomaps", theme.default, "en");
    }

    new maplibregl.Map({
      container: "map",
      style: {
        version: 8,
        glyphs:
          "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
        sources: {
          protomaps: {
            type: "vector",
            url: "https://api.protomaps.com/tiles/v4.json?key=1003762824b9687f",
          },
        },
        layers: layers,
      },
    });
  });

  return (
    <div id="container">
      <div id="map"></div>
    </div>
  );
}

export default App;
