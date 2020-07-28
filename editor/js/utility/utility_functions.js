const math = require("mathjs");

const axios = require("axios").default;
const getPixels = require("get-pixels");

function arr_transpose(a) {
  return Object.keys(a[0]).map(function (c) {
    return a.map(function (r) {
      return r[c];
    });
  });
}

// png2rgb_arr("<path>",rotate(times of 90 degree right),callback function)
export async function png2rgb_arr(path, rotate = 1, callback) {
  // path = "asset/LED/LED_CHEST/chest1.png"
  getPixels(path, function (err, pixels) {
    if (err) {
      console.log("Bad image path");
      return;
    }
    let pixels_raw = Array.from(pixels.data);

    let img_arr = [];
    let width = pixels.shape[0];
    let height = pixels.shape[1];
    // console.log("got pixels", pixels.shape.slice())
    // console.log(pixels_raw)
    img_arr = math.reshape(pixels_raw, [height, width, 4]);

    for (let i = 0; i < rotate; ++i) {
      // to rotate 90 degree -> reverse then transpose
      img_arr.reverse();
      img_arr = arr_transpose(img_arr);
    }

    width = img_arr[0].length;
    height = img_arr.length;

    // flip odd row
    img_arr.map((r, i) => {
      if (i % 2 === 1) {
        r.reverse();
      }
      return r;
    });
    // remove alpha data
    img_arr.map((r) =>
      r.map((p) => {
        p.pop();
        return p;
      })
    );

    callback(img_arr.flat(3));
  });
}
