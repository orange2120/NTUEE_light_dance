import numpy as np
from PIL import Image
import json
import sys
import os

WS_LEN = [88]
N_WS = 1


# convert file to rgb array
def png2rgb(dimension=1):
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
                if dimension==1:
                    json.dump(imgArr.flatten().tolist(), outfile) # 1d array
                elif dimension ==2:
                    json.dump(np.reshape(imgArr.flatten(), (-1, 3)).tolist(), outfile) # 2d array
                elif dimension ==3:
                    json.dump(imgArr.tolist(), outfile) #3d array
        
            print("Save Json file(" + str(dimension) + "d):" + output_path)



if __name__ == '__main__':
    # check if output directory exists
    if not os.path.exists('outputRGB') :
        os.makedirs('outputRGB')
        print('create directory : outputRGB')
    if len(sys.argv)>1:
        png2rgb(int(sys.argv[1]))
    else:
        png2rgb()