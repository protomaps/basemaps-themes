import { For, createSignal, createEffect, onMount, Component } from "solid-js";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import maplibregl from "maplibre-gl";
import { StyleSpecification } from "maplibre-gl";
import { Theme, layersWithCustomTheme, noLabelsWithCustomTheme } from "protomaps-themes-base";

const THEMES = ["bio", "dusk_rose", "iris_bloom","rainforest", "seafoam"];

const themeToLayers = new Map<string, Theme>();

import bio from "../themes/bio.ts";
themeToLayers.set("bio", bio);

import iris_bloom from "../themes/iris_bloom.ts";
themeToLayers.set("iris_bloom", iris_bloom);

import seafoam from "../themes/seafoam.ts";
themeToLayers.set("seafoam", seafoam);

// import sol from "../themes/sol.ts";
// themeToLayers.set("sol", sol);

import dusk_rose from "../themes/dusk_rose.ts";
themeToLayers.set("dusk_rose", dusk_rose);

import rainforest from "../themes/rainforest.ts";
themeToLayers.set("rainforest", rainforest);

const getStyle = (index: number, showLabels: boolean):StyleSpecification => {
  let themeName = THEMES[index];
  let layers;

  if (showLabels) {
    layers = layersWithCustomTheme(
      "protomaps",
      themeToLayers.get(themeName)!,
      "en",
    );
  } else {
    layers = noLabelsWithCustomTheme(
      "protomaps",
      themeToLayers.get(themeName)!,
    );
  }
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
  const [showLabels, setShowLabels] = createSignal(true);

  onMount(async () => {
    maplibregl.setRTLTextPlugin(
      "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js",
      true,
    );

    map = new maplibregl.Map({
      container: "map",
      style: getStyle(selectedIndex(),showLabels()),
    });
  });

  createEffect(() => {
    map.setStyle(getStyle(selectedIndex(),showLabels()));
  });

  const selectTheme = (i: number) => {
    setSelectedIndex(i);
  }

  const handleShowLabelsChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setShowLabels(target.checked);
  };

  return (
    <div id="container">
      <div class="sidebar">
        <For each={THEMES}>{(themeName,i) => <div onClick={() => selectTheme(i())}><ThemeRow name={themeName} theme={themeToLayers.get(themeName)!}/></div>}</For>
        <input
          id="showLabels"
          type="checkbox"
          checked={showLabels()}
          onChange={handleShowLabelsChange}
        />
        <label for="showLabels">Show labels</label>
      </div>
      <div id="map"></div>
    </div>
  );
}

export default App;
