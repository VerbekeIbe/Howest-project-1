from Project1 git/project1/helpers/klasseknop.py import Button
from RPi import GPIO
import spidev

# button initialiseren
knop1 = Button(17)
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

def knop_pressed(pin):
    print("Button Pressed")