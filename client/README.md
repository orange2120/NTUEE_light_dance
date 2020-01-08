# Client running on Raspberry Pi
<img src="https://img.shields.io/badge/platform-linux-lightgrey.svg">

## TODOs
Integrate system.

## RPi to Arduino SPI data transfer protocol for WS2812
Data frame:
Assume there are n LEDs.

| Data | Length (bytes) |
| ---- | ---- |
| Start | 1 |
| ID | 1 |
| Data length | 2 |
| GRB pixel | 3 * n |
| Stop | 2 |

Data length = 3 * n  
Total **3n+6** bytes.  

For example, transfer data to LED matrix that has 88 LEDs at address `ID = 0x1`.  
```
| Start | Strip ID |  Data length  |    (DATA) Green-Red-Blue ... Green-Red-Blue     |   Stop    |
--------+----------+---------------+------------------+------------------+-----------+------------
| 0xFF  |   0x1    |     0x0058    |   R1 - G1 - B1   |   R2 - G2 - B2   |  .......  | 0xFF 0xFF |
```

## References
### RPi SPI communication
[bcm2835 library](https://www.airspayce.com/mikem/bcm2835/index.html)
[Raspberry Pi SPI and I2C Tutorial](https://learn.sparkfun.com/tutorials/raspberry-pi-spi-and-i2c-tutorial/all)

### Arduino SPI communication
[Introduction to SPI](https://arduino.stackexchange.com/questions/16348/how-do-you-use-spi-on-an-arduino)
[How to use SPI in Arduino: Communication between two Arduino Boards](https://circuitdigest.com/microcontroller-projects/arduino-spi-communication-tutorial)

### PCA9685 16 Channel 12 Bit PWM Servo Driver
[PCA9685 16 Channel 12 Bit PWM Servo Driver « osoyoo.com](https://osoyoo.com/2017/07/18/pca9685-16-channel-12-bit-pwm-servo-driver/)

### WS2812 LED strip
**Note:** Color order is GRB.  
Each LED requires 3 byte (24 bit) to transfer GRB pixel data.  
[WS2812 datasheet](https://cdn-shop.adafruit.com/datasheets/WS2812.pdf)
[WS2812B datasheet](https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf)