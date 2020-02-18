export const DANCER_NUM = 8
export const DISPLAY_WIDTH = document.getElementById('simulator').offsetWidth
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
    "HAT1", "HAT2", "FACE1", "FACE2", "FACE3", "HAND", "PANTS1", "PANTS2",
    "INNER1", "INNER2", "COAT1", "COAT2", "COLLAR", "WRIST", "SHOES1", "SHOES2"
];

// Setting for Dancer 0
export const PARTARGS = {
    "BLHAT": {
        zIndex: -1,
        width: 121.563,
        height: 43.694,
        x: 69.065,
        y: 9.891
    },
    "BLFACE": {
        zIndex: -1,
        width: 75.58,
        height: 97.19,
        x: 91.607,
        y: 56.212
    },
    "BLCOAT": {
        zIndex: -1,
        width: 234.281,
        height: 188.708,
        x: 11.629,
        y: 152.287
    },
    "BLHAND": {
        zIndex: -1,
        width: 247.15,
        height: 32.513,
        x: 4.89,
        y: 340.995
    },
    "BLINNER": {
        zIndex: -1,
        width: 89.571,
        height: 198.667,
        x: 84.387,
        y: 148.131
    },
    "BLPANTS": {
        zIndex: -1,
        width: 137.755,
        height: 145.208,
        x: 60.295,
        y: 330.309
    },
    "BLSHOES": {
        zIndex: -1,
        width: 201.079,
        height: 35.974,
        x: 30.129,
        y: 481.508
    },
    "HAT1": {
        zIndex: 5,
        width: 121.563,
        height: 43.694,
        x: 69.065,
        y: 9.891
    },
    "HAT2": {
        zIndex: 5,
        width: 105.466,
        height: 35.588,
        x: 77.112,
        y: 13.944
    },
    "FACE1": {
        zIndex: 5,
        width: 64.559,
        height: 58.601,
        x: 97.118,
        y: 91.833
    },
    "FACE2": {
        zIndex: 5,
        width: 59.499,
        height: 59.478,
        x: 99.673,
        y: 88.245
    },
    "FACE3": {
        zIndex: 5,
        width: 42.189,
        height: 68.115,
        x: 108.303,
        y: 76.18 
    },
    "COAT1": {
        zIndex: 10,
        width: 233.878,
        height: 188.814,
        x: 12.032,
        y: 152.287
    },
    "COAT2": {
        zIndex: 10,
        width: 225.397,
        height: 180.906,
        x: 16.273,
        y: 159.029
    },
    "INNER1": {
        zIndex: 6,
        width: 80.481,
        height: 180.111,
        x: 89.157,
        y: 150.536
    },
    "INNER2": {
        zIndex: 5,
        width: 120.603,
        height: 177.72,
        x: 69.096,
        y: 156.887
    },
    "COLLAR": {
        zIndex: 15,
        width: 91.699,
        height: 94.214,
        x: 83.298,
        y: 161.083
    },
    "WRIST": {
        zIndex: 15,
        width: 222.207,
        height: 26.137,
        x: 17.735,
        y: 309.161
    },
    "HAND": {
        zIndex: 10,
        width: 247.15,
        height: 32.513,
        x: 4.89,
        y: 340.995
    },
    "PANTS1": {
        zIndex: 5,
        width: 137.755,
        height: 145.208,
        x: 60.295,
        y: 330.309
    },
    "PANTS2": {
        zIndex: 5,
        width: 130.173,
        height: 137.102,
        x: 64.086,
        y: 334.361
    },
    "SHOES1": {
        zIndex: 10,
        width: 201.079,
        height: 35.974,
        x: 30.129,
        y: 481.508
    },
    "SHOES2": {
        zIndex: 10,
        width: 193.438,
        height: 27.868,
        x: 33.945,
        y: 485.561
    }
}

