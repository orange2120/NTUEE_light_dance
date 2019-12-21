# Client running on Raspberry Pi
<img src="https://img.shields.io/badge/platform-linux-lightgrey.svg">

## TODOs
Write Arduino SPI receiver.

## RPi to Arduino SPI data transfer protocol for WS2812
Data frame:
Assume there are n LEDs.

| Data | Length (bytes) |
| ---- | ---- |
| ID | 1 |
| Data length | 2 |
| GRB pixel | 3 * n |
| Stop | 2 |

Data length = 3 * n  
Total **3n+5** bytes.  

For example, transfer data to LED matrix that has 88 LEDs at address `ID = 0x1`.  
```
| Strip ID |  Data length  |    (DATA) Green-Red-Blue ... Green-Red-Blue     |   Stop    |
-----------+---------------+------------------+------------------+-----------+------------
|   0x1    |     0x0108    |   G1 - R1 - B1   |   G2 - R2 - B2   |  .......  | 0xFF 0xFF |
```

## References
### RPi SPI communication
[bcm2835 library](https://www.airspayce.com/mikem/bcm2835/index.html)
[Raspberry Pi SPI and I2C Tutorial](https://learn.sparkfun.com/tutorials/raspberry-pi-spi-and-i2c-tutorial/all)

### Arduino SPI communication
[Introduction to SPI](https://arduino.stackexchange.com/questions/16348/how-do-you-use-spi-on-an-arduino)
[How to use SPI in Arduino: Communication between two Arduino Boards](https://circuitdigest.com/microcontroller-projects/arduino-spi-communication-tutorial)

### WS2812 LED strip
**Note:** Color order is GRB.  
Each LED requires 3 byte (24 bit) to transfer GRB pixel data.  
[WS2812 datasheet](https://cdn-shop.adafruit.com/datasheets/WS2812.pdf)
[WS2812B datasheet](https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf)