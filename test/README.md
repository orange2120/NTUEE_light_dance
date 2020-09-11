# Testing Everything

## image_test

Testing program for test LED strips from converted RGB JSON file.

Usage:

```
$ sudo ./testImg <strip ID> <JSON file path>
```

## WS2812_SPI_R2Atest

Test program for SPI protocol to WS2812 LED strip from RPi to Ardunio.

Usage:

```
$ sudo ./test <strip ID> <LED number>
```

## PCA9685_test

Test program for PCA9685 PWM module.

Compile:

```
$ make ADDR=[I2C address]
```

**Note:**the address of upper backpack is `0x40`, lower is `0x60`

Usage:

```
$ sudo ./PCAtest
>> <ID> <duty cycle>
```

**Note:**assign `ID=-1` to set all channels at the same time.

## Arduino/rgbColorTester

Testing LED strip color by adjusting 3 potentiometer.

## Arduino/STM32_WS2812_test

Testing LED on STM32F103 platform
