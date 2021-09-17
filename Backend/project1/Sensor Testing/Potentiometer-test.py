import time
from RPi import GPIO
import spidev

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


def lees_potentio():
    print("Reading volume")
    old_volume = 0
    while True:
        new_volume = int(MCP().read_channel(0))
        if new_volume is not old_volume:
            print(f"new volume: {new_volume}")
            old_volume = new_volume
        elif new_volume == old_volume:
            print("volume ongewijzigd")
            time.sleep(2)


lees_potentio()