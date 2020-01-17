# client Application


## Dependencies
- [bcm2835](https://www.airspayce.com/mikem/bcm2835/)
- [rpidmx512](https://github.com/vanvught/rpidmx512)
- [JSON for Modern C++](https://github.com/nlohmann/json)

## Argument
- dancer id

# Data.h


- paths
    - path of LED arrays

- Person
    - time_line(vector of execute)
        - start_time
        - end_time
        - LEDs(vector of LED_part)
            - name // use index of vector 
            - path
            - alpha
        - parts(vector of EL_part)
            - name // use index of vector
            - brightness

### EL_part
- 0:
- 1:
- 2:


### LED_part
- 0:
- 1:
- 2:
