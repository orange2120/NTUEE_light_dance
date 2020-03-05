import numpy as np
from PIL import Image
import json
import sys
import os

path = ["1", "2", "3", "4"]

for num in path:
    name = './wave_' + num + '/fig' + num + '_0.png'
    img = Image.open(name).convert('RGB')
    print('Read file:', name)
    # Resize to 80 * 30
    newImg = img.resize((80, 30), resample = 1)
    newImg.save(name + '.out.png')
    # Croping
    for i in range(8):
        im = newImg.crop((i * 10, 0, (i + 1) * 10, 30)).rotate(90, expand = True)
        # im = im.rotate(90, resample = 0);
        # im = im.resize((30, 10), resample = 1)
        im.save('wave_' + str(i) + '_out.png');

