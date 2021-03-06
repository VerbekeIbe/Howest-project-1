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

def lees_pulse():
    print("Reading Pulse")
    # init variables
    rate = [0] * 10         # array to hold last 7 IBI values
    sampleCounter = 0       # used to determine pulse timing
    lastBeatTime = 0        # used to find IBI
    P = 512                 # used to find peak in pulse wave, seeded
    T = 512                 # used to find trough in pulse wave, seeded
    thresh = 750        # used to find instant moment of heart beat, seeded
    amp = 100               # used to hold amplitude of pulse waveform, seeded
    firstBeat = True        # used to seed rate array so we startup with reasonable BPM
    secondBeat = False      # used to seed rate array so we startup with reasonable BPM
    old_BPM = 60
    BPM = 60
    global search_BPM
    search_BPM = 75

    IBI = 600               # int that holds the time interval between beats! Must be seeded!
    # "True" when User's live heartbeat is detected. "False" when not a "live beat".
    Pulse = False
    lastTime = int(time.time()*1000)

    while True:

        Signal = int(MCP().read_channel(2))
        currentTime = int(time.time()*1000)

        sampleCounter += currentTime - lastTime
        lastTime = currentTime

        N = sampleCounter - lastBeatTime

        # find the peak and trough of the pulse wave
        # avoid dichrotic noise by waiting 3/5 of last IBI
        if Signal < thresh and N > (IBI/5.0)*3:
            if Signal < T:                          # T is the trough
                T = Signal                          # keep track of lowest point in pulse wave

        if Signal > thresh and Signal > P:
            P = Signal

        # signal surges up in value every time there is a pulse
        if N > 250:                                 # avoid high frequency noise
            if Signal > thresh and Pulse == False and N > (IBI/5.0)*3:
                Pulse = True                        # set the Pulse flag when we think there is a pulse
                IBI = sampleCounter - lastBeatTime  # measure time between beats in mS
                lastBeatTime = sampleCounter        # keep track of time for next pulse

                if secondBeat:                      # if this is the second beat, if secondBeat == TRUE
                    secondBeat = False             # clear secondBeat flag
                    # seed the running total to get a realisitic BPM at startup
                    for i in range(len(rate)):
                        rate[i] = IBI

                if firstBeat:                       # if it's the first time we found a beat, if firstBeat == TRUE
                    firstBeat = False              # clear firstBeat flag
                    secondBeat = True              # set the second beat flag
                    continue

                # keep a running total of the last 10 IBI values
                # shift data in the rate array
                rate[:-1] = rate[1:]
                # add the latest IBI to the rate array
                rate[-1] = IBI
                runningTotal = sum(rate)            # add upp oldest IBI values

                runningTotal /= len(rate)         # average the IBI values
                # how many beats can fit into a minute? that's BPM!
                BPM = int(60000/runningTotal)
                print(f"current BPM : {BPM}")

        if Signal < thresh and Pulse == True:       # when the values are going down, the beat is over
            Pulse = False                           # reset the Pulse flag so we can do it again
            amp = P - T                             # get amplitude of the pulse wave
            thresh = amp/2 + T                      # set thresh at 50% of the amplitude
            P = thresh                              # reset these for next time
            T = thresh

        if N > 2500:                                # if 2.5 seconds go by without a beat
            thresh = 750                    # set thresh default
            P = 512                                 # set P default
            T = 512                                 # set T default
            lastBeatTime = sampleCounter            # bring the lastBeatTime up to date
            firstBeat = True                        # set these to avoid noise
            secondBeat = False                      # when we get the heartbeat back
            new_BPM = BPM
            if new_BPM is not old_BPM:
                print(f"BPM is now set to: {new_BPM}")
                search_BPM = BPM
                old_BPM = new_BPM
                # time.sleep(4)
            elif new_BPM == old_BPM:
                print("BPM unchanged")
                time.sleep(0.5)

        time.sleep(0.005)

lees_pulse()