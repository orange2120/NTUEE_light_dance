# client Application

## Usage
```
$ sudo ./clientApp <dancer ID> <Input file path>
```
**Note:** must be run with `sudo` permission.  

Catch system `signal` to do following actions:
- `2/SIGINT` (ctrl + c): Exit the process. Turn off all the ELs, LEDs.
- `19/SIGSTOP`: Pause the process, waiting for `SIGCONT` to continue.

For testing:  
```bash
$ kill -s SIGINT <pid>
$ ps -C clientApp -o pid=|xargs kill -2
```

## Data.h

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

## Dependencies
- [bcm2835](https://www.airspayce.com/mikem/bcm2835/)
- [rpidmx512](https://github.com/vanvught/rpidmx512)
- [JSON for Modern C++](https://github.com/nlohmann/json)