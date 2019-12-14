import numpy as np
from PIL import Image
import json
import sys
import os

WS_LEN = [88]
N_WS = 1

with open('asset.json') as json_file:
    data = json.load(json_file)
    for imgPath in data['path']:
        img = Image.open(imgPath).convert('RGB')
        print("Find: " + imgPath)
        w, h = img.size
        imgArr = np.array(img).reshape(h, w, 3)
        print(imgArr)


