import { groupD8 } from "pixi.js"

export const DANCER_NUM = 8
export const DISPLAY_WIDTH = 800
export const DISPLAY_HEIGHT = DISPLAY_WIDTH * 3 / 4
export const FPS = 30
// Set All Dancer position
export const DANCERPOS = [
    {
        x: 4.89,
        y: 9.891
    },
    {
        x: 363.548,
        y: 9.891
    },
    {
        x: 666.273,
        y: 9.891
    },
    {
        x: 972.775,
        y: 9.891
    },
    {
        x: 181.15,
        y: 281.435
    },
    {
        x: 504.745,
        y: 281.435
    },
    {
        x: 807.47,
        y: 281.435
    },
    {
        x: 1141.242,
        y: 281.435
    }
]
// All Parts
export const BLPARTS = ["BLHAT", "BLFACE", "BLCOAT", "BLHAND", "BLINNER", "BLPANTS", "BLSHOES"];
export const LIGHTPARTS = [
    "HAT1", "HAT2", "FACE1", "FACE2", "L_HAND", "R_HAND", "L_PANTS1", "L_PANTS2", "R_PANTS1",
    "R_PANTS2", "INNER1", "INNER2", "L_COAT1", "L_COAT2", "R_COAT1", "R_COAT2",
    "L_SHOES1", "L_SHOES2", "R_SHOES1", "R_SHOES2","L_ARM1", "L_ARM2", "R_ARM1", "R_ARM2"
];

// Setting for Dancer 0
export const PARTARGS = {
    "BLHAT": {
        zIndex: -1,
        width: 144.769,
        height: 53.565,
        x: 175.059,
        y: 58.763
    },
    "BLFACE": {
        zIndex: -1,
        width: 90.025,
        height: 119.19,
        x: 201.374,
        y: 115.57
    },
    "BLCOAT": {
        zIndex: -1,
        width: 295.531,
        height: 231.798,
        x: 99.691,
        y: 233.207
    },
    "BLHAND": {
        zIndex: -1,
        width: 294.385,
        height: 39.872,
        x: 98.618,
        y: 464.819
    },
    "BLINNER": {
        zIndex: -1,
        width: 126.169,
        height: 243.639,
        x: 183.917,
        y: 228.296
    },
    "BLPANTS": {
        zIndex: -1,
        width: 164.083,
        height: 178.079,
        x: 164.612,
        y: 451.713
    },
    "BLSHOES": {
        zIndex: -1,
        width: 239.509,
        height: 44.117,
        x: 128.681,
        y: 637.139
    },
    "HAT1": {
        zIndex: 5,
        width: 144.796,
        height: 53.565,
        x: 175.059,
        y: 58.763
    },
    "HAT2": {
        zIndex: 5,
        width: 125.623,
        height: 43.644,
        x: 184.643,
        y: 63.733
    },
    "FACE1": {
        zIndex: 5,
        width: 90.025,
        height: 119.19,
        x: 201.374,
        y: 115.57
    },
    "FACE2": {
        zIndex: 5,
        width: 67.836,
        height: 109.536,
        x: 212.331,
        y: 119.42
    },
    "L_COAT1": {
        zIndex: 10,
        width: 56.729,
        height: 231.426,
        x: 159.359,
        y: 233.579
    },
    "L_COAT2": {
        zIndex: 10,
        width: 44.446,
        height: 220.834,
        x: 166.346,
        y: 239.247
    },
    "R_COAT1": {
        zIndex: 10,
        width: 56.729,
        height: 231.426,
        x: 278.825,
        y: 233.207
    },
    "R_COAT2": {
        zIndex: 10,
        width: 44.446,
        height: 220.834,
        x: 284.121,
        y: 238.875
    },
    "L_ARM1": {
        zIndex: 10,
        width: 64.301,
        height: 207.701,
        x: 99.691,
        y: 257.304
    },
    "L_ARM2": {
        zIndex: 10,
        width: 54.241,
        height: 194.619,
        x: 104.962,
        y: 264.734
    },
    "R_ARM1": {
        zIndex: 10,
        width: 64.301,
        height: 207.701,
        x: 330.92,
        y: 256.932
    },
    "R_ARM2": {
        zIndex: 10,
        width: 54.241,
        height: 194.691,
        x: 335.71,
        y: 264.361
    },
    "INNER1": {
        zIndex: 6,
        width: 123.095,
        height: 224.089,
        x: 187.723,
        y: 231.245
    },
    "INNER2": {
        zIndex: 5,
        width: 125.794,
        height: 220.319,
        x: 183.917,
        y: 239.034
    },
    "L_HAND": {
        zIndex: 10,
        width: 37.956,
        height: 39.872,
        x: 98.618,
        y: 464.819
    },
    "R_HAND": {
        zIndex: 10,
        width: 37.956,
        height: 39.872,
        x: 355.048,
        y: 464.819
    },
    "L_PANTS1": {
        zIndex: 5,
        width: 82.052,
        height: 178.079,
        x: 164.425,
        y: 451.713
    },
    "L_PANTS2": {
        zIndex: 5,
        width: 77.536,
        height: 168.138,
        x: 168.941,
        y: 456.683
    },
    "R_PANTS1": {
        zIndex: 5,
        width: 82.031,
        height: 178.079,
        x: 246.316,
        y: 451.713
    },
    "R_PANTS2": {
        zIndex: 5,
        width: 77.526,
        height: 168.138,
        x: 246.306,
        y: 456.683
    },
    "L_SHOES1": {
        zIndex: 10,
        width: 78.989,
        height: 44.117,
        x: 128.681,
        y: 637.139
    },
    "L_SHOES2": {
        zIndex: 10,
        width: 69.916,
        height: 34.176,
        x: 133.226,
        y: 642.109
    },
    "R_SHOES1": {
        zIndex: 10,
        width: 78.989,
        height: 44.117,
        x: 289.201,
        y: 637.139
    },
    "R_SHOES2": {
        zIndex: 10,
        width: 69.905,
        height: 34.176,
        x: 293.729,
        y: 642.109
    }
}

