# Client

<img src="https://img.shields.io/badge/platform-linux-lightgrey.svg">

## TODOs

Integrate the system with web interface.

## clientApp

client application is running on Raspberry Pi.

## Arduino/SPI2WS2812

Receive RGB data via SPI protocol from RPi, convert to WS2812 signal.

## turnOffLED

Turn off all the LED strips.

Compile:
```
$ make ADDR=[I2C address]
```

Usage:
```
$ sudo ./PCAtest
>> <ID> <duty cycle>
```
**Note:**assign ID=-1 to set add channels at the same time.


## Hardware architecture

```
 Wi-Fi \|/  ┌─────────┐    I2C
        └───│         │────────────── PCA9685 ───> ELs
            │   RPi   │    SPI     ┌─────────┐
            │         │────────────│ Arduino │───> LED strips
            └─────────┘            └─────────┘
```

## RPi to Arduino SPI data transfer protocol for WS2812

Data frame:  
Assume there are n LEDs.

| Data        | Length (bytes) |
| ----------- | -------------- |
| Start       | 1              |
| ID          | 1              |
| Data length | 2              |
| RGB pixel   | 3 \* n         |
| Stop        | 2              |

Data length = 3 \* n  
Total **3n+6** bytes.

For example, transfer data to LED matrix that has 88 LEDs at address `ID = 0x1`.

```
| Start | Strip ID |  Data length  |    (DATA) Red-Green-Blue ... Red-Green-Blue     |   Stop    |
--------+----------+---------------+------------------+------------------+-----------+------------
| 0xFF  |   0x1    |     0x0058    |   R1 - G1 - B1   |   R2 - G2 - B2   |  .......  | 0x55 0xFF |
```

## Dependencies

[Adafruit_NeoPixel](https://github.com/adafruit/Adafruit_NeoPixel)  
[bcm2835 library](https://www.airspayce.com/mikem/bcm2835/index.html)

## References

### RPi SPI communication

[Raspberry Pi SPI and I2C Tutorial](https://learn.sparkfun.com/tutorials/raspberry-pi-spi-and-i2c-tutorial/all)

### Arduino SPI communication

[Introduction to SPI](https://arduino.stackexchange.com/questions/16348/how-do-you-use-spi-on-an-arduino)  
[How to use SPI in Arduino: Communication between two Arduino Boards](https://circuitdigest.com/microcontroller-projects/arduino-spi-communication-tutorial)

### PCA9685 16 Channel 12 Bit PWM Servo Driver

[Adafruit PCA9685 16-Channel Servo Driver](https://cdn-learn.adafruit.com/downloads/pdf/16-channel-pwm-servo-driver.pdf)  
[PCA9685 16 Channel 12 Bit PWM Servo Driver « osoyoo.com](https://osoyoo.com/2017/07/18/pca9685-16-channel-12-bit-pwm-servo-driver/)  
[PCA9685 16-Channel 12 Bit I2C Bus PWM Driver - Wiki](http://wiki.sunfounder.cc/index.php?title=PCA9685_16-Channel_12_Bit_I2C_Bus_PWM_Driver#Cascading_multiple_driver_modules)  
**Note:** The default I<sup>2</sup>C address is `0x40`.

### WS2812 LED strip

**Note:** Color order of WS2812 is `G-R-B`.  
Each LED requires 3 byte (24 bit) to transfer RGB pixel data.  
[WS2812 datasheet](https://cdn-shop.adafruit.com/datasheets/WS2812.pdf)  
[WS2812B datasheet](https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf)
