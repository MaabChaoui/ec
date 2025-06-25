// app/dashboard/page.tsx
"use client";
import React from "react";
import type { FeatureCollection, Point, Polygon, Feature } from "geojson";
import MapsGeoJSON from "./MapGeoJson";

// Updated interface to match your actual data structure
export interface PlantProperties {
  id: string;
  scientific_name: string;
  common_names?: {
    en: string;
    fr: string;
    ar: string;
  };
  family?: string;
  collection_type?: "individual" | "group";
  planted_year?: string;
  height_range?: string;
  _tempLayerId?: number;

  fill?: string;
  fill_opacity?: number;
  stroke?: string;
  stroke_width?: 1;
}

// Type for features that can be either Point or Polygon
export type PlantFeature = Feature<Point | Polygon, PlantProperties>;
export type PlantFeatureCollection = FeatureCollection<
  Point | Polygon,
  PlantProperties
>;

const Map: React.FC = () => {
  const yourGeoJsonData: PlantFeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          id: "1",
          scientific_name: "bamboo",
          _tempLayerId: 1750741786401.3628,
          fill: "#66c2a5",
          fill_opacity: 0.5,
          stroke: "#00441b",
          stroke_width: 1,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [3.0737149715423584, 36.74775220772238],
              [3.0762577056884766, 36.74666040983124],
              [3.076322078704834, 36.746763572501244],
              [3.0737793445587163, 36.747846772163044],
              [3.0737149715423584, 36.74775220772238],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "2",
          scientific_name: "ficus",
          _tempLayerId: 1750742290508.087,
          fill: "#a6d854",
          fill_opacity: 0.5,
          stroke: "#3f5000",
          stroke_width: 1,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [3.0756568908691406, 36.74586519292844],
              [3.0757695436477666, 36.74580931251186],
              [3.078376650810242, 36.74961338642508],
              [3.0782532691955566, 36.74966066751312],
              [3.0756568908691406, 36.74586519292844],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "3",
          scientific_name: "dracaena",
          _tempLayerId: 1750742290508.087,
          fill: "#8da0cb",
          fill_opacity: 0.5,
          stroke: "#2f3060",
          stroke_width: 1,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [3.074530363082886, 36.74632083172951],
              [3.0746698379516606, 36.74625635470501],
              [3.07718575000763, 36.75009909076022],
              [3.0770623683929443, 36.75015496805289],
              [3.074530363082886, 36.74632083172951],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "4",
          scientific_name: "platanes",
          _tempLayerId: 1750742697582.096,
          fill: "#fc8d62",
          fill_opacity: 0.5,
          stroke: "#7f3100",
          stroke_width: 1,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [3.0736935138702393, 36.74718481863108],
              [3.073559403419495, 36.74724929487547],
              [3.075828552246094, 36.750649265408256],
              [3.075957298278809, 36.75059338847558],
              [3.0736935138702393, 36.74718481863108],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "5",
          scientific_name: "lauriers",
          _tempLayerId: 1750743418066.101,
          fill: "#ffd92f",
          fill_opacity: 0.5,
          stroke: "#7f6f00",
          stroke_width: 1,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [3.0780869722366337, 36.74801870721117],
              [3.0781459808349614, 36.748105964113826],
              [3.0783122777938847, 36.748027303953464],
              [3.0786341428756714, 36.74801870721117],
              [3.078623414039612, 36.74791124785125],
              [3.078258633613587, 36.74793273973526],
              [3.0780869722366337, 36.74801870721117],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "6",
          scientific_name: "washingtonias",
          _tempLayerId: 1750743620503.4185,
          fill: "#e78ac3",
          fill_opacity: 0.5,
          stroke: "#772555",
          stroke_width: 1,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [3.0731517076492314, 36.7474986025107],
              [3.0732965469360356, 36.74743412647579],
              [3.0754691362380986, 36.75079970310175],
              [3.0752867460250854, 36.750872772732166],
              [3.0731517076492314, 36.7474986025107],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "7",
          scientific_name: "lataniers",
          _tempLayerId: 1750743892720.4133,
          fill: "#a6cee3",
          fill_opacity: 0.5,
          stroke: "#1f3f5e",
          stroke_width: 1,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [3.0756407976150517, 36.745899580856864],
              [3.0755978822708134, 36.74581361100691],
              [3.0731463432312016, 36.74683234753753],
              [3.0731946229934697, 36.74690971937969],
              [3.0756407976150517, 36.745899580856864],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "8",
          scientific_name: "nolinas",
          _tempLayerId: 1750744024415.38,
          fill: "#b15928",
          fill_opacity: 0.5,
          stroke: "#3f1f00",
          stroke_width: 1,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [3.0739027261734013, 36.74920934684794],
              [3.0739563703536987, 36.749303909492866],
              [3.0732053518295293, 36.749643474393565],
              [3.073140978813172, 36.74955321045267],
              [3.0739027261734013, 36.74920934684794],
            ],
          ],
        },
      },
    ],
  };

  return (
    <div>
      <MapsGeoJSON geoJsonData={yourGeoJsonData} />{" "}
      <div className="h-[200px]"></div>
    </div>
  );
};

export default Map;
