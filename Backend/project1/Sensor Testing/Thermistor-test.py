import time
from RPi import GPIO
import spidev
import math

class MCP:
    def __init__(self, bus=0, device=0):
        # spidev object initialiseren
        self.spi = spidev.SpiDev()
        # open bus 0, device 0
        self.spi.open(bus, device)
        # stel klokfrequentie in op 100kHz
        self.spi.max_speed_hz = 10 ** 5

    def read_channel(self, ch):
        # commandobyte samenstellen
        channel = ch << 4 | 128
        # list met de 3 te versturen bytes
        bytes_out = [0b00000001, channel, 0b00000000]
        # versturen en 3 bytes terugkrijgen
        bytes_in = self.spi.xfer2(bytes_out)
        # meetwaarde uithalen
        byte1 = bytes_in[1]
        byte2 = bytes_in[2]
        result = byte1 << 8 | byte2
        # meetwaarde afdrukken
        if ch == 0:
            result = 100 - (result / 1023 * 100)
            return result
        if ch == 1:
            return result
        if ch == 2:
            return result

def lees_thermistor():
    print("Reading Temperature")
    old_temp = 24
    while True:
        new_temp = float(MCP().read_channel(1))
        rntc = 10000/((1023/new_temp)-1)
        tkelvin = 1/(1/298.15+1/60000*math.log(rntc/10000))
        tcelsiusraw = tkelvin - 273.15
        global tcelsius
        tcelsius = int(tcelsiusraw)
        print(f"temp:{tcelsius}")
        if tcelsius is not old_temp:
            print(f"Temperatuur changed to: {tcelsius}")
            old_temp = tcelsius
            time.sleep(3)
        elif tcelsius == old_temp:
            print("Temperature still consistent")
            time.sleep(3)


lees_thermistor()