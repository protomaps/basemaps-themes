import { For, createSignal, createEffect, onMount, Component } from "solid-js";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import maplibregl from "maplibre-gl";
import { StyleSpecification } from "maplibre-gl";
import { Theme, layersWithCustomTheme } from "protomaps-themes-base";

const THEMES = ["contrast", "bright", "calm", "black_and_white", "pink"];

const themeToLayers = new Map<string, Theme>();

import contrast from "../themes/contrast.ts";
themeToLayers.set("contrast", contrast);

import bright from "../themes/bright.ts";
themeToLayers.set("bright", bright);

import calm from "../themes/calm.ts";
themeToLayers.set("calm", calm);

import black_and_white from "../themes/black_and_white.ts";
themeToLayers.set("black_and_white", black_and_white);

import pink from "../themes/pink.ts";
themeToLayers.set("pink", pink);

const getStyle = (index: number):StyleSpecification => {
  let themeName = THEMES[index];
  let layers = layersWithCustomTheme(
    "protomaps",
    themeToLayers.get(themeName)!,
    "en",
  );
  return {
    version: 8,
    glyphs:
      "https://bdon.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
    sources: {
      protomaps: {
        type: "vector",
        url: "https://api.protomaps.com/tiles/v4.json?key=1003762824b9687f",
      },
    },
    layers: layers,
  };
};

const ThemeRow: Component<{name: string, theme: Theme}> = (props) => {
  return (
    <div class="themeRow" style={{"background-color":props.theme.background,"color":props.theme.city_label}}>
      {props.name}
    </div>
  )
}

function App() {
  let map: maplibregl.Map;

  const [selectedIndex, setSelectedIndex] = createSignal(0);
  onMount(async () => {
    maplibregl.setRTLTextPlugin(
      "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js",
      true,
    );

    map = new maplibregl.Map({
      container: "map",
      style: getStyle(selectedIndex()),
    });
  });

  createEffect(() => {
    map.setStyle(getStyle(selectedIndex()));
  });

  const selectTheme = (i: number) => {
    setSelectedIndex(i);
  }

  return (
    <div id="container">
      <div class="sidebar">
        <For each={THEMES}>{(themeName,i) => <div onClick={() => selectTheme(i())}><ThemeRow name={themeName} theme={themeToLayers.get(themeName)!}/></div>}</For>
      </div>
      <div id="map"></div>
    </div>
  );
}

export default App;
