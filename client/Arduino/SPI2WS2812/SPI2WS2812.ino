#include ""

const uint8_t NUM_LEDS[] = {88,96,60,36,36};
const uint8_t LED_PIN[]  = {5, 6, 7, 8, 9};

volatile bool received;      // handle SPI received event
volatile byte receivedData;  // received SPI data


void setup()
{

    SPCR |= _BV(SPE);         // Turn on SPI in Slave Mode
    received = false;
    SPI.attachInterrupt();    // Interuupt ON is set for SPI commnucation

}

void loop()
{

}

ISR (SPI_STC_vect)   // Inerrrput vector for SPI
{
    
    Slavereceived = SPDR;  // Value received from master if store in variable slavereceived
    received = true;       // Data received
}