import numpy as np
from PIL import Image
import json
import sys
import os

WS_LEN = [88]
N_WS = 1
# check if output directory exists
if not os.path.exists('outputRGB') :
    os.makedirs('outputRGB')
    print('create directory : outputRGB')

# convert file to rgb array
with open('asset.json') as json_file:
    data = json.load(json_file)
    for imgPath in data['path']:
        img = Image.open('inputLEDPNG/' + imgPath).convert('RGB')
        print("Read file:" + imgPath)
        w, h = img.size
        imgArr = np.array(img).reshape(h, w, 3)
        imgArr[1::2, :] = imgArr[1::2, ::-1] #invert odd row
        output_path = 'outputRGB/' + imgPath + '.json'
        
        with open(output_path, 'w') as outfile:
            # json.dump(imgArr.tolist(), outfile) #3d array
            json.dump(imgArr.flatten().tolist(), outfile) # 1d array
            # json.dump(np.reshape(imgArr.flatten(), (-1, 3)).tolist(), outfile) # 2d array
      
        print("Save Json file:" + output_path)



