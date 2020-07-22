# Hardware
Hardware design

## Controller
For each dancer

### Raspberry Pi
Reciving commands from server. Control ELs and LED strips.
Model 3B+

### Arduino
Reciving RGB pixel sequence via SPI protocol from RPi, transforming to WS2812 protocol.

## Module

### PCA9685
PCA9685 16 Channel 12 Bit PWM Servo Driver, for EL control.

### WS2812 RGB LED strip
Display bitmap picture

### Electroluminescent wire (EL)

## PCB
[RPi-Arduino adapter](https://easyeda.com/orange21201/lightdanceconverter)
[EL_wire controller](https://easyeda.com/nawmrofed/el_controller_v3)

## References
