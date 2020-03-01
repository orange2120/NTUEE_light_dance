const math = require('mathjs')


const axios = require('axios').default
const getPixels = require("get-pixels")


class MyUtilities{


    async generate(rotate,callback){
          getPixels("asset/LED/LED_CHEST/chest1.png", function(err, pixels) {
            if(err) {
              console.log("Bad image path")
              return
            }
            let pixels_raw = Array.from(pixels.data)
            
            let img_arr=[]
            let width = pixels.shape[0]
            let height = pixels.shape[1]
            // console.log("got pixels", pixels.shape.slice())
            // console.log(pixels_raw)
            img_arr = math.reshape(pixels_raw,[height,width,4])
            img_arr.map((r,i)=>{
              if(i%2 === 1){
                r.reverse()
              }
              return r
            })
            img_arr.map((r)=> r.map((p)=> {
              p.pop()
              return p
            }))
            let ret_arr = Array(width).fill().map(() => Array(height).fill().map(()=>Array(3)));

            for (let i = 0; i < img_arr.length; i++) {
              for (let j = 0; j < img_arr[i].length; i++) {
                ret_arr[width-j][height-i] = img_arr[i][j]
              }
            } 
            // math.transpose(img_arr)
            
            
            callback(ret_arr.flat(3))
            
          })
        
    }
    
}

 

export default MyUtilities